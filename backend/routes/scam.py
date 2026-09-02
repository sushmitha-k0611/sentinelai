from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import ScamAnalysis

from gemini_service import analyze_message

router = APIRouter()


class ScamRequest(BaseModel):
    message: str
    user_id: int


@router.post("/analyze")
def analyze_scam(
    data: ScamRequest,
    db: Session = Depends(get_db)
):

    try:

        ai_result = analyze_message(data.message)

        risk = ai_result["risk_score"]
        scam_type = ai_result["scam_type"]
        confidence = ai_result["confidence_score"]
        explanation = ai_result["explanation"]

        analysis = ScamAnalysis(
            user_id=data.user_id,
            message=data.message,
            scam_type=scam_type,
            risk_score=risk,
            confidence_score=confidence,
            explanation=explanation
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return {
            "risk_score": risk,
            "scam_type": scam_type,
            "confidence_score": confidence,
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/history/{user_id}")
def history(
    user_id: int,
    db: Session = Depends(get_db)
):

    records = (
        db.query(ScamAnalysis)
        .filter(ScamAnalysis.user_id == user_id)
        .order_by(ScamAnalysis.id.desc())
        .all()
    )

    return records