from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

class ChatRequest(BaseModel):
    message: str
    language: str = "English"


@router.post("/chat")
def chat(data: ChatRequest):

    prompt = f"""
You are SentinelAI Fraud Shield.

You help Indian citizens avoid scams.

Rules:

Explain in simple language.

Never generate code.

Never answer unrelated questions.

If user reports fraud,
tell them:
- Call 1930
- Visit cybercrime.gov.in
- Contact bank immediately

Reply in {data.language}.

Question:

{data.message}
"""

    response = model.generate_content(prompt)

    return {
        "reply": response.text
    }