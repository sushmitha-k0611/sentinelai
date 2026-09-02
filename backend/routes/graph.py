import re
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FraudReport, ExtractedEntity

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter()

def clean_phone(phone_str: str) -> str:
    """Helper to clean and normalize phone numbers to last 10 digits."""
    if not phone_str:
        return ""
    digits = re.sub(r'\D', '', phone_str)
    if len(digits) >= 10:
        return digits[-10:]
    return digits

def call_gemini_extraction(description: str, victim_name: str) -> dict:
    """Call Gemini to extract UPI, Bank Account, Device, and IP details from description."""
    if not API_KEY:
        return {}
    try:
        prompt = f"""
Analyze the cyber fraud incident description below and extract specific key entities. 
Identify the following types:
- phone (scammer's phone numbers)
- upi (UPI IDs or VPAs, e.g. scammer@okaxis, scammer@ybl)
- email (scammer's email addresses)
- bank_account (scammer's bank account numbers)
- device (device names or models used by the scammer)
- ip_address (IP addresses mentioned)
- city (cities mentioned as the origin of scam or related locations)
- victim (victim name, only if it's a person other than {victim_name})

Return the result STRICTLY as a JSON object of lists.
Do not include any code block indicators (such as ```json) or explanation.
Example Output:
{{
  "phone": ["9876543210"],
  "upi": ["scam@okaxis"],
  "email": ["scammer@gmail.com"],
  "bank_account": ["123456789012"],
  "device": ["Redmi Note 12"],
  "ip_address": ["192.168.1.1"],
  "city": ["Jamtara"],
  "victim": []
}}

Description:
{description}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Strip potential markdown formatting
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        return json.loads(text)
    except Exception as e:
        print("⚠️ Gemini Extraction Error:", e)
        return {}

def extract_and_cache_entities(report: FraudReport, db: Session) -> list[ExtractedEntity]:
    """Extract entities using Regex + Gemini, cache to database, and return them."""
    # Check if already cached
    cached = db.query(ExtractedEntity).filter(ExtractedEntity.report_id == report.id).all()
    if cached:
        return cached

    entities = []

    # 1. Base entities from report columns
    if report.phone:
        entities.append({"type": "phone", "value": clean_phone(report.phone)})
    if report.email:
        entities.append({"type": "email", "value": report.email.lower().strip()})
    if report.city:
        entities.append({"type": "city", "value": report.city.strip()})
    if report.victim_name:
        entities.append({"type": "victim", "value": report.victim_name.strip()})

    # 2. Regex-based extraction from description
    desc = report.description or ""
    
    # Phone regex
    phones = re.findall(r'\b(?:\+?91[\s-]?)?[6-9]\d{9}\b', desc)
    for p in phones:
        entities.append({"type": "phone", "value": clean_phone(p)})

    # Email regex
    emails = re.findall(r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b', desc)
    for e in emails:
        entities.append({"type": "email", "value": e.lower().strip()})

    # UPI ID regex
    upis = re.findall(r'\b[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,15}\b', desc)
    for u in upis:
        entities.append({"type": "upi", "value": u.lower().strip()})

    # Bank Account regex (sequences of 9 to 18 digits)
    accounts = re.findall(r'\b\d{9,18}\b', desc)
    for a in accounts:
        # Exclude if it's already a phone number
        cleaned_a = a.strip()
        if not any(cleaned_a == clean_phone(p) for p in phones):
            entities.append({"type": "bank_account", "value": cleaned_a})

    # IP address regex
    ips = re.findall(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', desc)
    for ip in ips:
        entities.append({"type": "ip_address", "value": ip.strip()})

    # Device heuristics
    device_keywords = ['iphone', 'samsung', 'oneplus', 'oppo', 'vivo', 'realme', 'redmi', 'xiaomi', 'pixel', 'motorola', 'nokia', 'android', 'macbook', 'windows', 'desktop', 'laptop']
    desc_lower = desc.lower()
    for kw in device_keywords:
        if kw in desc_lower:
            entities.append({"type": "device", "value": kw.title()})

    # 3. Enhance with Gemini
    ai_extracted = call_gemini_extraction(desc, report.victim_name)
    for key, vals in ai_extracted.items():
        if key not in ["phone", "email", "upi", "bank_account", "device", "ip_address", "city", "victim"]:
            continue
        for v in vals:
            if not v:
                continue
            val_str = str(v).strip()
            if key == "phone":
                val_str = clean_phone(val_str)
            elif key == "email" or key == "upi":
                val_str = val_str.lower()
            
            entities.append({"type": key, "value": val_str})

    # Deduplicate before saving
    seen = set()
    unique_entities = []
    for ent in entities:
        # Don't add empty or trivial values
        if not ent["value"] or len(ent["value"]) < 2:
            continue
        ent_key = (ent["type"], ent["value"])
        if ent_key not in seen:
            seen.add(ent_key)
            unique_entities.append(ent)

    # Save to database
    db_entities = []
    for ent in unique_entities:
        db_ent = ExtractedEntity(
            report_id=report.id,
            entity_type=ent["type"],
            entity_value=ent["value"]
        )
        db.add(db_ent)
        db_entities.append(db_ent)
    
    try:
        db.commit()
        for dbe in db_entities:
            db.refresh(dbe)
    except Exception as e:
        db.rollback()
        print("⚠️ Error saving cached entities:", e)

    return db_entities

# Node type styling settings
COLOR_MAP = {
    "victim": "#FF2D55",       # Vibrant Crimson Pink
    "phone": "#00E5FF",        # Neon Cyan
    "upi": "#FFD600",          # Bright Amber Yellow
    "bank_account": "#00C853", # Emerald Green
    "email": "#FF9100",        # Cyber Orange
    "device": "#AA00FF",       # Violet Purple
    "ip_address": "#2979FF",   # Electric Blue
    "city": "#8D6E63",         # Bronze Brown
}

@router.get("/network")
def get_network(db: Session = Depends(get_db)):
    """Fetch all reports, compile nodes, edges, detect rings, and return graph data."""
    reports = db.query(FraudReport).all()
    
    nodes_dict = {}
    edges_list = []
    
    # Adjacency list for graph traversal (fraud ring detection)
    adj = {}
    
    def add_node(node_id, label, n_type):
        if node_id not in nodes_dict:
            nodes_dict[node_id] = {
                "id": node_id,
                "label": label,
                "type": n_type,
                "color": COLOR_MAP.get(n_type, "#90A4AE"),
                "reports": set()
            }
        return node_id

    def add_edge(from_id, to_id, label=""):
        # Undirected edge key check to avoid duplicates
        edge_key = tuple(sorted([from_id, to_id]))
        # Save edge
        edges_list.append({
            "from": from_id,
            "to": to_id,
            "label": label
        })
        # Build adjacency list
        if from_id not in adj: adj[from_id] = set()
        if to_id not in adj: adj[to_id] = set()
        adj[from_id].add(to_id)
        adj[to_id].add(from_id)

    # Process all reports
    for report in reports:
        report_entities = extract_and_cache_entities(report, db)
        
        # Group entities by type
        ent_by_type = {}
        for ent in report_entities:
            t = ent.entity_type
            v = ent.entity_value
            if t not in ent_by_type:
                ent_by_type[t] = []
            ent_by_type[t].append(v)

        # 1. Victim node (must exist)
        vic_name = report.victim_name or f"Victim #{report.id}"
        vic_node_id = f"victim_{vic_name.lower().replace(' ', '_')}"
        add_node(vic_node_id, vic_name, "victim")
        nodes_dict[vic_node_id]["reports"].add(report.id)
        
        # 2. Add other entities as nodes and link them
        created_nodes = []
        
        # Standard entities logic
        for ent in report_entities:
            # Skip repeating victim (we already created the main victim node)
            if ent.entity_type == "victim" and ent.entity_value.lower() == vic_name.lower():
                continue
                
            node_id = f"{ent.entity_type}_{ent.entity_value.lower().replace(' ', '_')}"
            label = ent.entity_value
            
            # Format labels nicely
            if ent.entity_type == "bank_account":
                label = f"A/C: {label}"
            elif ent.entity_type == "upi":
                label = f"UPI: {label}"
            
            add_node(node_id, label, ent.entity_type)
            nodes_dict[node_id]["reports"].add(report.id)
            created_nodes.append((node_id, ent.entity_type))

        # 3. Create connections (edges)
        # Direct connection from victim to all entities in the report
        for node_id, n_type in created_nodes:
            add_edge(vic_node_id, node_id, "Reported")
            
        # Linear SCAM FLOW chain to illustrate scammer sequence:
        # Victim -> Phone -> UPI -> Bank Account -> Device -> IP Address -> City -> Email
        chain_order = ["victim", "phone", "upi", "bank_account", "device", "ip_address", "city", "email"]
        
        # Create a sorted list of nodes based on chain order
        chain_nodes = []
        # Add victim first
        chain_nodes.append(vic_node_id)
        # Add others by type
        for t in chain_order[1:]:
            for node_id, n_type in created_nodes:
                if n_type == t:
                    chain_nodes.append(node_id)
        
        # Connect sequential elements
        for i in range(len(chain_nodes) - 1):
            add_edge(chain_nodes[i], chain_nodes[i+1], "Linked to")

    # --- FRAUD RING ANALYSIS (Connected Components) ---
    # We find connected components in the graph.
    # A component is a "suspected ring" if it links 2 or more victims together.
    # Note: We exclude high-degree common nodes like "city" from linking components,
    # as everyone in Jamtara or Delhi sharing a city node doesn't mean they are in the same ring.
    
    # Filtered adjacency list for DFS (excluding city nodes)
    filtered_adj = {}
    for u in adj:
        if u.startswith("city_"):
            continue
        filtered_adj[u] = set()
        for v in adj[u]:
            if not v.startswith("city_"):
                filtered_adj[u].add(v)

    visited = set()
    components = []
    
    for node in filtered_adj:
        if node not in visited:
            comp = []
            queue = [node]
            visited.add(node)
            while queue:
                curr = queue.pop(0)
                comp.append(curr)
                for neighbor in filtered_adj.get(curr, []):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            components.append(comp)

    # Analyze components to find rings
    suspected_rings = []
    for comp in components:
        comp_victims = [n for n in comp if n.startswith("victim_")]
        if len(comp_victims) >= 2:
            # Suspected fraud ring!
            ring_nodes = []
            for node_id in comp:
                node = nodes_dict[node_id]
                ring_nodes.append({
                    "id": node_id,
                    "label": node["label"],
                    "type": node["type"]
                })
            suspected_rings.append({
                "id": f"ring_{len(suspected_rings) + 1}",
                "victim_count": len(comp_victims),
                "victims": [nodes_dict[v]["label"] for v in comp_victims],
                "nodes": ring_nodes
            })

    # Prepare response nodes list (convert reports set to list)
    final_nodes = []
    for nid, node in nodes_dict.items():
        node["reports"] = list(node["reports"])
        final_nodes.append(node)

    # Deduplicate edges (convert to set-like list)
    seen_edges = set()
    final_edges = []
    for edge in edges_list:
        edge_key = (edge["from"], edge["to"])
        if edge_key not in seen_edges:
            seen_edges.add(edge_key)
            final_edges.append(edge)

    # Stats summary
    total_victims = sum(1 for n in final_nodes if n["type"] == "victim")
    avg_conn = len(final_edges) / max(total_victims, 1)

    return {
        "nodes": final_nodes,
        "edges": final_edges,
        "rings": suspected_rings,
        "stats": {
            "total_nodes": len(final_nodes),
            "total_edges": len(final_edges),
            "suspected_rings": len(suspected_rings),
            "average_connections": round(avg_conn, 2)
        }
    }

@router.get("/user/{id}")
def get_user_subgraph(id: int, db: Session = Depends(get_db)):
    """Fetch report-specific localized network graph for detailed investigation."""
    report = db.query(FraudReport).filter(FraudReport.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    report_entities = extract_and_cache_entities(report, db)
    
    nodes = []
    edges = []
    
    # 1. Victim node
    vic_name = report.victim_name or f"Victim #{report.id}"
    vic_node_id = f"victim_{vic_name.lower().replace(' ', '_')}"
    nodes.append({
        "id": vic_node_id,
        "label": vic_name,
        "type": "victim",
        "color": COLOR_MAP["victim"],
        "reports": [report.id]
    })
    
    created_nodes = []
    # 2. Add other entities
    for ent in report_entities:
        if ent.entity_type == "victim" and ent.entity_value.lower() == vic_name.lower():
            continue
        node_id = f"{ent.entity_type}_{ent.entity_value.lower().replace(' ', '_')}"
        label = ent.entity_value
        if ent.entity_type == "bank_account":
            label = f"A/C: {label}"
        elif ent.entity_type == "upi":
            label = f"UPI: {label}"
            
        nodes.append({
            "id": node_id,
            "label": label,
            "type": ent.entity_type,
            "color": COLOR_MAP.get(ent.entity_type, "#90A4AE"),
            "reports": [report.id]
        })
        created_nodes.append((node_id, ent.entity_type))
        
    # 3. Add edges
    for node_id, n_type in created_nodes:
        edges.append({
            "from": vic_node_id,
            "to": node_id,
            "label": "Reported"
        })
        
    # Linear flow edges
    chain_order = ["victim", "phone", "upi", "bank_account", "device", "ip_address", "city", "email"]
    chain_nodes = [vic_node_id]
    for t in chain_order[1:]:
        for node_id, n_type in created_nodes:
            if n_type == t:
                chain_nodes.append(node_id)
                
    for i in range(len(chain_nodes) - 1):
        edges.append({
            "from": chain_nodes[i],
            "to": chain_nodes[i+1],
            "label": "Linked to"
        })
        
    return {
        "nodes": nodes,
        "edges": edges
    }
