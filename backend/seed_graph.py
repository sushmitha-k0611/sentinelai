import bcrypt
from database import SessionLocal
from models import User, FraudReport
from datetime import date

db = SessionLocal()

try:
    # Ensure a user exists to link reports to
    user = db.query(User).first()
    if not user:
        # Hash default password "admin123"
        password_bytes = b"admin123"
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode("utf-8")
        
        user = User(
            full_name="Admin Investigator",
            email="investigator@sentinelai.gov",
            password=hashed_password,
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("Mock user created.")

    # Check if there are already reports
    count = db.query(FraudReport).count()
    if count == 0:
        reports = [
            FraudReport(
                user_id=user.id,
                victim_name="Rohan Sharma",
                phone="9876543210",
                email="rohan@gmail.com",
                fraud_type="UPI Fraud",
                amount=15000.00,
                incident_date=date(2026, 7, 1),
                description="Got a call from 9876543210 claiming to be from SBI Bank. They asked me to scan a QR code and sent a request on UPI ID scammer@okaxis. I lost Rs 15,000.",
                city="New Delhi",
                state="Delhi",
                latitude=28.6139,
                longitude=77.2090,
                status="Investigating"
            ),
            FraudReport(
                user_id=user.id,
                victim_name="Priya Patel",
                phone="9876543210",
                email="priya@yahoo.com",
                fraud_type="Lottery Scam",
                amount=50000.00,
                incident_date=date(2026, 7, 2),
                description="Scammer called me from 9876543210 telling me I won a lottery. They asked me to pay processing fees to UPI ID scammer@okaxis. Used device iPhone 13.",
                city="Mumbai",
                state="Maharashtra",
                latitude=19.0760,
                longitude=72.8777,
                status="Investigating"
            ),
            FraudReport(
                user_id=user.id,
                victim_name="Amit Verma",
                phone="9998887776",
                email="amit@hotmail.com",
                fraud_type="Job Scam",
                amount=25000.00,
                incident_date=date(2026, 7, 3),
                description="Scammer offered a part-time job using device iPhone 13. They asked for registration fee to bank account 987654321012.",
                city="Mumbai",
                state="Maharashtra",
                latitude=19.0760,
                longitude=72.8777,
                status="Pending"
            )
        ]
        db.add_all(reports)
        db.commit()
        print("Database seeded successfully with 3 linked mock reports.")
    else:
        print("Database already contains reports. Skipping seeding.")

except Exception as e:
    db.rollback()
    print("Error seeding database:", e)
finally:
    db.close()
