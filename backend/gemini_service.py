import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Gemini Model
model = genai.GenerativeModel("gemini-2.5-flash")


# ============================================================
# AI Scam Message Analysis
# ============================================================

def analyze_message(message: str):

    prompt = f"""
You are an AI Cyber Security Expert.

Analyze the following suspicious message.

Message:
{message}

Determine:

1. Risk Score (0-100)
2. Scam Type
3. Confidence Score (0-100)
4. Explanation

Possible Scam Types:

- Banking Phishing
- Digital Arrest Scam
- OTP Scam
- UPI Scam
- Lottery Scam
- Investment Scam
- Job Scam
- Loan Scam
- Fake Customer Care
- Courier Scam
- QR Code Scam
- Social Media Scam
- Safe Message

Return ONLY valid JSON.

Example:

{{
    "risk_score":95,
    "scam_type":"Banking Phishing",
    "confidence_score":97,
    "explanation":"This message creates urgency, impersonates a trusted bank and asks the user to click a suspicious link."
}}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown if Gemini returns ```json
    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    print("Gemini Scam Response:")
    print(text)

    return json.loads(text)


# ============================================================
# AI Currency Detection
# ============================================================

def analyze_currency(image_path: str):

    image = Image.open(image_path)

    prompt = """
You are an AI expert in Indian Currency Verification.

Analyze the uploaded currency note.

Return ONLY valid JSON.

{
  "prediction": "",
  "confidence": "",
  "security_features": [],
  "explanation": ""
}

Rules:

1. prediction:
   - Appears Genuine
   - Appears Suspicious
   - Unable to Determine

2. confidence:
   Example: "94%"

3. security_features:
   Return ONLY the top 5 most visible features.

4. explanation:
   Maximum 3 short sentences.

Do NOT return markdown.
Do NOT return extra text.
Return ONLY valid JSON.
"""

    response = model.generate_content([prompt, image])

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    print("Gemini Currency Response:")
    print(text)

    return json.loads(text)