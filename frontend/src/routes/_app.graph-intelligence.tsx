import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Network } from "vis-network";
import {
  getNetworkGraph,
  GraphNode,
  GraphEdge,
  SuspectedRing,
  GraphStats,
} from "@/services/graph";
import {
  Search,
  Filter,
  Layers,
  AlertTriangle,
  Network as NetIcon,
  Phone,
  Mail,
  User,
  MapPin,
  Laptop,
  Globe,
  CreditCard,
  RefreshCw,
  X,
  Compass,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

const COLOR_MAP: Record<string, string> = {
  victim: "#FF2D55",       // Vibrant Crimson Pink
  phone: "#00E5FF",        // Neon Cyan
  upi: "#FFD600",          // Bright Amber Yellow
  bank_account: "#00C853", // Emerald Green
  email: "#FF9100",        // Cyber Orange
  device: "#AA00FF",       // Violet Purple
  ip_address: "#2979FF",   // Electric Blue
  city: "#8D6E63",         // Bronze Brown
};

export const Route = createFileRoute("/_app/graph-intelligence")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Graph Intelligence · SentinelAI" }],
  }),
  component: GraphIntelligence,
});

function GraphIntelligence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  // Data States
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [rings, setRings] = useState<SuspectedRing[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRingId, setSelectedRingId] = useState<string | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  // Pathfinding States
  const [sourceNodeId, setSourceNodeId] = useState<string>("");
  const [targetNodeId, setTargetNodeId] = useState<string>("");
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // Filter States
  const [filters, setFilters] = useState({
    victim: true,
    phone: true,
    upi: true,
    bank_account: true,
    email: true,
    device: true,
    ip_address: true,
    city: true,
  });

  // Fetch data
  const loadGraphData = async () => {
    setLoading(true);
    try {
      const data = await getNetworkGraph();
      setNodes(data.nodes);
      setEdges(data.edges);
      setRings(data.rings);
      setStats(data.stats);
      setSelectedNode(null);
      setHighlightedPath([]);
      setSourceNodeId("");
      setTargetNodeId("");
      setSelectedRingId(null);
    } catch (error) {
      console.error("Failed to load network graph:", error);
      toast.error("Error loading fraud network graph data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  // Filter logic
  const filteredNodes = nodes.filter((node) => filters[node.type as keyof typeof filters]);
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter(
    (edge) => filteredNodeIds.has(edge.from) && filteredNodeIds.has(edge.to)
  );

  // Graph render and update loop
  useEffect(() => {
    if (loading || !containerRef.current) return;

    // Node rendering attributes
    const visNodes = filteredNodes.map((node) => {
      const isHighlighted = highlightedPath.includes(node.id);
      const isSelectedRing =
        selectedRingId &&
        rings.find((r) => r.id === selectedRingId)?.nodes.some((rn) => rn.id === node.id);

      let borderCol = "#ffffff";
      let borderW = 2;
      let scale = 1;

      if (isHighlighted) {
        borderCol = "#4ADE80"; // Bright green for path
        borderW = 4;
        scale = 1.3;
      } else if (isSelectedRing) {
        borderCol = "#F43F5E"; // Bright pink for active fraud ring
        borderW = 4;
        scale = 1.25;
      }

      return {
        id: node.id,
        label: node.label,
        color: {
          background: node.color,
          border: borderCol,
          highlight: {
            background: "#00E5FF",
            border: "#ffffff",
          },
        },
        shape: "dot",
        size: (node.type === "victim" ? 22 : 15) * scale,
        borderWidth: borderW,
        shadow: true,
        font: {
          color: "#e2e8f0",
          size: 11,
          face: "Inter",
        },
      };
    });

    const visEdges = filteredEdges.map((edge) => {
      // Highlight edges in the path
      let isPathEdge = false;
      if (highlightedPath.length > 1) {
        for (let i = 0; i < highlightedPath.length - 1; i++) {
          const u = highlightedPath[i];
          const v = highlightedPath[i + 1];
          if ((edge.from === u && edge.to === v) || (edge.from === v && edge.to === u)) {
            isPathEdge = true;
            break;
          }
        }
      }

      return {
        from: edge.from,
        to: edge.to,
        label: edge.label || "",
        font: {
          color: "#94a3b8",
          size: 8,
          align: "top",
          face: "Inter",
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
        color: {
          color: isPathEdge ? "#4ADE80" : "#334155",
          highlight: "#00E5FF",
          hover: "#38bdf8",
        },
        width: isPathEdge ? 4 : 1.5,
        smooth: {
          enabled: true,
          type: "cubicBezier",
          roundness: 0.4,
        },
      };
    });

    const options = {
      physics: {
        enabled: physicsEnabled,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -70,
          centralGravity: 0.015,
          springLength: 120,
          springConstant: 0.08,
          damping: 0.4,
        },
        stabilization: {
          iterations: 100,
          updateInterval: 25,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        navigationButtons: true,
        keyboard: true,
      },
    };

    const network = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      options
    );
    networkRef.current = network;

    // Listeners
    network.on("selectNode", (params) => {
      const nodeId = params.nodes[0];
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
      }
    });

    network.on("deselectNode", () => {
      setSelectedNode(null);
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [filteredNodes.length, filteredEdges.length, highlightedPath, selectedRingId, physicsEnabled]);

  // Search logic
  const handleSearch = () => {
    if (!searchQuery.trim() || !networkRef.current) return;
    const match = nodes.find((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      networkRef.current.selectNodes([match.id]);
      networkRef.current.focus(match.id, {
        scale: 1.5,
        animation: { duration: 1000, easingFunction: "easeInOutQuad" },
      });
      setSelectedNode(match);
    } else {
      toast.error("No matching node found");
    }
  };

  // Ring visual highlight & zoom
  const handleRingSelect = (ringId: string) => {
    setSelectedRingId(ringId === selectedRingId ? null : ringId);
    if (!networkRef.current) return;

    if (ringId === selectedRingId) {
      // Fit all
      networkRef.current.fit({
        animation: {
          duration: 800,
          easingFunction: "easeInOutQuad",
        },
      });
      return;
    }

    const ring = rings.find((r) => r.id === ringId);
    if (ring && ring.nodes.length > 0) {
      const ringNodeIds = ring.nodes.map((rn) => rn.id);
      networkRef.current.selectNodes(ringNodeIds);
      networkRef.current.fit({
        nodes: ringNodeIds,
        animation: { duration: 1000, easingFunction: "easeInOutQuad" },
      });
      toast.info(`Highlighting fraud ring linking ${ring.victim_count} victims`);
    }
  };

  // Shortest Scam Path Finder (BFS)
  const handleFindPath = () => {
    if (!sourceNodeId || !targetNodeId) {
      toast.error("Please specify both Source and Target nodes");
      return;
    }

    // Graph Adjacency representation
    const adj: Record<string, string[]> = {};
    edges.forEach((edge) => {
      if (!adj[edge.from]) adj[edge.from] = [];
      if (!adj[edge.to]) adj[edge.to] = [];
      adj[edge.from].push(edge.to);
      adj[edge.to].push(edge.from); // Undirected path trace
    });

    // BFS Queue: stores arrays representing the paths
    const queue: string[][] = [[sourceNodeId]];
    const visited = new Set<string>([sourceNodeId]);
    let pathFound: string[] | null = null;

    while (queue.length > 0) {
      const currentPath = queue.shift()!;
      const lastNode = currentPath[currentPath.length - 1];

      if (lastNode === targetNodeId) {
        pathFound = currentPath;
        break;
      }

      const neighbors = adj[lastNode] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    if (pathFound) {
      setHighlightedPath(pathFound);
      toast.success(`Scam connection path resolved! (${pathFound.length - 1} connections)`);
      if (networkRef.current) {
        networkRef.current.fit({
          nodes: pathFound,
          animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad",
          },
        });
      }
    } else {
      toast.error("No Scam Path exists between these two entities");
      setHighlightedPath([]);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "victim":
        return <User className="h-4 w-4 text-[#FF2D55]" />;
      case "phone":
        return <Phone className="h-4 w-4 text-[#00E5FF]" />;
      case "upi":
        return <CreditCard className="h-4 w-4 text-[#FFD600]" />;
      case "bank_account":
        return <LinkIcon className="h-4 w-4 text-[#00C853]" />;
      case "email":
        return <Mail className="h-4 w-4 text-[#FF9100]" />;
      case "device":
        return <Laptop className="h-4 w-4 text-[#AA00FF]" />;
      case "ip_address":
        return <Globe className="h-4 w-4 text-[#2979FF]" />;
      case "city":
        return <MapPin className="h-4 w-4 text-[#8D6E63]" />;
      default:
        return <NetIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      <Topbar
        title="Graph Intelligence"
        subtitle="Visualizing cyber fraud networks, linked indicators, and suspected rings"
      />

      <main className="space-y-6 p-4 md:p-8">
        {/* Network Metrics Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-muted-foreground">Linked Entities (Nodes)</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-400">
              {loading ? "-" : stats?.total_nodes ?? 0}
            </h2>
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-muted-foreground">Relational Vectors (Edges)</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {loading ? "-" : stats?.total_edges ?? 0}
            </h2>
          </div>

          <div className="glass rounded-2xl p-5 border border-red-500/20 bg-red-950/5">
            <p className="text-xs text-muted-foreground">Suspected Fraud Rings</p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {loading ? "-" : stats?.suspected_rings ?? 0}
            </h2>
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="text-xs text-muted-foreground">Avg Links per Victim</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {loading ? "-" : stats?.average_connections ?? 0}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Controls, Filters & Fraud Rings list (left panel) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Search & Physics toggle */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" />
                Network Navigation
              </h3>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search Node Label..."
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 w-full">
                <Button onClick={handleSearch} className="flex-1 text-xs" size="sm">
                  Locate
                </Button>
                <Button
                  onClick={loadGraphData}
                  variant="outline"
                  size="sm"
                  title="Reload Graph"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-xs text-muted-foreground">Interactive Layout Physics</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={physicsEnabled}
                    onChange={(e) => setPhysicsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Filter className="h-4 w-4 text-yellow-400" />
                Layer Filters
              </h3>
              <div className="space-y-2 pt-2">
                {Object.keys(filters).map((key) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs capitalize flex items-center gap-2">
                      {getEntityIcon(key)}
                      {key.replace("_", " ")}
                    </span>
                    <input
                      type="checkbox"
                      checked={filters[key as keyof typeof filters]}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.checked })
                      }
                      className="rounded border-border bg-transparent text-cyan-400 focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Detected Fraud Rings List */}
            <div className="glass rounded-2xl p-5 space-y-3 max-h-[300px] overflow-y-auto">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Suspected Rings ({rings.length})
              </h3>
              {rings.length === 0 ? (
                <p className="text-xs text-muted-foreground pt-2">
                  No overlapping multi-victim coordinates detected yet.
                </p>
              ) : (
                <div className="space-y-2 pt-1">
                  {rings.map((ring) => (
                    <button
                      key={ring.id}
                      onClick={() => handleRingSelect(ring.id)}
                      className={`w-full text-left p-3 rounded-xl border transition text-xs flex flex-col gap-1 ${
                        selectedRingId === ring.id
                          ? "bg-red-500/10 border-red-500 text-red-200"
                          : "bg-secondary/40 border-border hover:bg-secondary/70 text-foreground"
                      }`}
                    >
                      <div className="flex justify-between font-semibold items-center">
                        <span>Ring Cluster #{ring.id.split("_")[1]}</span>
                        <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 text-[10px] font-bold">
                          {ring.victim_count} Victims Linked
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        Linked: {ring.victims.join(" ↔ ")}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Graph Canvas (middle panel) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-4 flex flex-col h-[650px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <NetIcon className="h-5 w-5 text-cyan-400" />
                  Live Scam Connection Canvas
                </h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] text-muted-foreground">Interactive WebGL Grid</span>
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
                  <p className="text-sm text-muted-foreground">Compiling intelligence graph...</p>
                </div>
              ) : (
                <div ref={containerRef} className="flex-1 w-full h-full rounded-xl bg-slate-950/80 relative" />
              )}

              {/* Quick Legend at bottom */}
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/30 justify-center">
                {Object.entries(COLOR_MAP).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5 text-[10px] capitalize">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color as string }}></span>
                    <span className="text-muted-foreground">{type.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Inspector & Shortest Scam Path (right panel) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Shortest Scam Path Finder */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#00C853]" />
                Path Tracer / Connection Finder
              </h3>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground">Source Node</label>
                  <select
                    value={sourceNodeId}
                    onChange={(e) => setSourceNodeId(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select source...</option>
                    {nodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        [{node.type.toUpperCase()}] {node.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-muted-foreground">Target Node</label>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select target...</option>
                    {nodes.map((node) => (
                      <option key={node.id} value={node.id}>
                        [{node.type.toUpperCase()}] {node.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFindPath} className="flex-1 text-xs" size="sm" variant="secondary">
                  Find Scam Path
                </Button>
                {highlightedPath.length > 0 && (
                  <Button
                    onClick={() => setHighlightedPath([])}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {highlightedPath.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-green-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                    Link Chain Resolved
                  </div>
                  <div className="text-[10px] text-muted-foreground break-all space-y-1">
                    {highlightedPath.map((nodeId, idx) => {
                      const n = nodes.find((no) => no.id === nodeId);
                      return (
                        <div key={nodeId} className="flex items-center gap-1">
                          <span className="text-muted-foreground/40">{idx + 1}.</span>
                          <span>{n?.label || nodeId}</span>
                          <span className="text-[8px] bg-secondary/80 px-1 rounded uppercase">
                            {n?.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Node Details (Inspector) */}
            <div className="glass rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" />
                    Entity Inspector
                  </h3>
                  {selectedNode && (
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {!selectedNode ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-10 gap-2">
                    <NetIcon className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
                    <p className="text-xs">Click any node on the canvas to inspect its linked crime reports and scam vectors.</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-secondary">
                        {getEntityIcon(selectedNode.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm break-all">{selectedNode.label}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-secondary/80 border border-border/40 text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
                          {selectedNode.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border/40 pt-4">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">System Node ID</span>
                        <span className="font-mono text-[10px] break-all">{selectedNode.id}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Total Crime Affiliations</span>
                        <span className="font-bold text-cyan-400">{selectedNode.reports.length} Reports</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                        Affiliated Reports
                      </span>
                      <div className="space-y-1.5 max-h-[150px] overflow-y-auto pt-1">
                        {selectedNode.reports.map((reportId) => (
                          <div
                            key={reportId}
                            className="bg-secondary/40 border border-border/40 rounded-lg p-2 flex justify-between items-center"
                          >
                            <span>Crime Incident Report #{reportId}</span>
                            <a
                              href={`/report-fraud`}
                              className="text-cyan-400 hover:underline hover:text-cyan-300 font-bold"
                            >
                              Inspect
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedNode && (
                <div className="pt-4 border-t border-border/40 flex gap-2">
                  <Button
                    onClick={() => {
                      setSourceNodeId(selectedNode.id);
                      toast.info(`Set ${selectedNode.label} as Source Node`);
                    }}
                    className="flex-1 text-[10px] h-7"
                    size="sm"
                    variant="outline"
                  >
                    Set Source
                  </Button>
                  <Button
                    onClick={() => {
                      setTargetNodeId(selectedNode.id);
                      toast.info(`Set ${selectedNode.label} as Target Node`);
                    }}
                    className="flex-1 text-[10px] h-7"
                    size="sm"
                    variant="outline"
                  >
                    Set Target
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
