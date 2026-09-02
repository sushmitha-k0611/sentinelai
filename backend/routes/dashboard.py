from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import FraudReport

router = APIRouter()


# ======================================
# Dashboard Statistics
# ======================================

@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    total = db.query(FraudReport).count()

    pending = db.query(FraudReport).filter(
        FraudReport.status == "Pending"
    ).count()

    investigating = db.query(FraudReport).filter(
        FraudReport.status == "Investigating"
    ).count()

    resolved = db.query(FraudReport).filter(
        FraudReport.status == "Resolved"
    ).count()

    high_risk = db.query(FraudReport).filter(
        FraudReport.amount >= 50000
    ).count()

    return {

        "total_reports": total,

        "pending": pending,

        "investigating": investigating,

        "resolved": resolved,

        "high_risk": high_risk

    }


# ======================================
# Fraud Type Analytics
# ======================================

@router.get("/fraud-types")
def fraud_types(db: Session = Depends(get_db)):

    data = (

        db.query(

            FraudReport.fraud_type,

            func.count(FraudReport.id)

        )

        .group_by(FraudReport.fraud_type)

        .all()

    )

    return [

        {

            "name": row[0],

            "value": row[1]

        }

        for row in data

    ]


# ======================================
# State Wise Analytics
# ======================================

@router.get("/state-analytics")
def state_wise(db: Session = Depends(get_db)):

    data = (

        db.query(

            FraudReport.state,

            func.count(FraudReport.id)

        )

        .group_by(FraudReport.state)

        .all()

    )

    return [

        {

            "state": row[0],

            "reports": row[1]

        }

        for row in data

    ]


# ======================================
# Recent Reports
# ======================================

@router.get("/recent")
def recent_reports(db: Session = Depends(get_db)):

    reports = (

        db.query(FraudReport)

        .order_by(FraudReport.id.desc())

        .limit(10)

        .all()

    )

    return reports