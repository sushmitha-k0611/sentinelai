from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import FraudReport
from datetime import date

router = APIRouter()


class ReportRequest(BaseModel):

    user_id: int

    victim_name: str

    phone: str

    email: str

    fraud_type: str

    amount: float

    incident_date: date

    description: str

    evidence: str

    city: str

    state: str

    latitude: float

    longitude: float


@router.post("/create")
def create_report(
    data: ReportRequest,
    db: Session = Depends(get_db)
):

    report = FraudReport(

        user_id=data.user_id,

        victim_name=data.victim_name,

        phone=data.phone,

        email=data.email,

        fraud_type=data.fraud_type,

        amount=data.amount,

        incident_date=data.incident_date,

        description=data.description,

        evidence=data.evidence,

        city=data.city,

        state=data.state,

        latitude=data.latitude,

        longitude=data.longitude

    )

    db.add(report)

    db.commit()

    db.refresh(report)

    return {

        "status": "success",

        "message": "Fraud Report Submitted Successfully",

        "report_id": report.id

    }


@router.get("/history/{user_id}")
def get_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    reports = (

        db.query(FraudReport)

        .filter(FraudReport.user_id == user_id)

        .order_by(FraudReport.id.desc())

        .all()

    )

    return reports


@router.get("/{report_id}")
def get_single_report(
    report_id: int,
    db: Session = Depends(get_db)
):

    report = db.query(FraudReport).filter(
        FraudReport.id == report_id
    ).first()

    if not report:
        return {
            "status": "failed",
            "message": "Report Not Found"
        }

    return report


@router.put("/status/{report_id}")
def update_status(
    report_id: int,
    status: str,
    remark: str,
    db: Session = Depends(get_db)
):

    report = db.query(FraudReport).filter(
        FraudReport.id == report_id
    ).first()

    if not report:
        return {
            "status": "failed"
        }

    report.status = status

    report.admin_remark = remark

    db.commit()

    return {
        "status": "success"
    }