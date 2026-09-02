from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import FraudReport

router = APIRouter()


@router.get("/reports")
def get_reports(db: Session = Depends(get_db)):

    reports = db.query(FraudReport).all()

    result = []

    for report in reports:
        result.append({
            "id": report.id,
            "victim_name": report.victim_name,
            "fraud_type": report.fraud_type,
            "city": report.city,
            "state": report.state,
            "latitude": float(report.latitude) if report.latitude else None,
            "longitude": float(report.longitude) if report.longitude else None,
            "incident_date": str(report.incident_date),
            "amount": float(report.amount) if report.amount else 0
        })

    return result