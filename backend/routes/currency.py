import os
import shutil

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException

from sqlalchemy.orm import Session

from database import get_db

from models import CurrencyHistory

from gemini_service import analyze_currency

router = APIRouter()

UPLOAD_FOLDER = "uploads/currency"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/detect")
async def detect_currency(
    user_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    try:

        filepath = os.path.join(
            UPLOAD_FOLDER,
            image.filename
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        result = analyze_currency(filepath)

        history = CurrencyHistory(
            user_id=user_id,
            image_name=image.filename,
            prediction=result["prediction"],
            confidence=result["confidence"],
            explanation=result["explanation"]
        )

        db.add(history)
        db.commit()

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/history/{user_id}")
def currency_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    history = (
        db.query(CurrencyHistory)
        .filter(CurrencyHistory.user_id == user_id)
        .order_by(CurrencyHistory.id.desc())
        .all()
    )

    return history