import os

import google.generativeai as genai

from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from pydantic import BaseModel

from database import get_db

from models import FraudChat


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: int
    question: str
    language: str


@router.post("/chat")
def fraud_chat(data: ChatRequest, db: Session = Depends(get_db)):
    prompt = f"""
You are SentinelAI Fraud Shield.

You are India's cybersecurity assistant.

Reply only in {data.language}.

For fraud-related questions such as:
- OTP Fraud
- Banking Fraud
- UPI Fraud
- QR Code Scam
- WhatsApp Scam
- Investment Scam
- Loan Scam
- KYC Scam
- Lottery Scam
- Police Scam
- CBI Scam
- Digital Arrest Scam
- Parcel Scam
- Email Scam
- Job Scam
- Fake Website

Always answer using this format:

1. Risk Level
2. Why it is dangerous
3. What the user should do immediately
4. Prevention Tips
5. Mention Cyber Helpline 1930 whenever appropriate

If the question is unrelated to cybersecurity or online fraud,
politely say you can only answer cyber safety questions.

Question:
{data.question}
"""

    try:
        response = model.generate_content(prompt)

        answer = response.text

        chat = FraudChat(
            user_id=data.user_id,
            question=data.question,
            answer=answer,
            language=data.language
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return {
            "success": True,
            "answer": answer
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {str(e)}"
        )


@router.get("/history/{user_id}")
def history(user_id: int, db: Session = Depends(get_db)):
    chats = (
        db.query(FraudChat)
        .filter(FraudChat.user_id == user_id)
        .order_by(FraudChat.id.desc())
        .all()
    )

    return chats