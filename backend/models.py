from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, text
from database import Base
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, text
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100))

    email = Column(String(100), unique=True)

    password = Column(String(255))

    role = Column(
        Enum("user", "admin"),
        default="user"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
from sqlalchemy import ForeignKey, Text


class ScamAnalysis(Base):
    __tablename__ = "scam_analysis"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    message = Column(Text)

    scam_type = Column(String(100))

    risk_score = Column(Integer)

    confidence_score = Column(Integer)

    explanation = Column(Text)

    analyzed_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
class FraudChat(Base):
    __tablename__ = "fraud_chat"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    question = Column(Text)

    answer = Column(Text)

    language = Column(String(50))

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

from sqlalchemy import DECIMAL, TIMESTAMP, Date, text


class FraudReport(Base):
    __tablename__ = "fraud_reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    victim_name = Column(String(100))

    phone = Column(String(20))

    email = Column(String(100))

    fraud_type = Column(String(100))

    amount = Column(DECIMAL(12,2))

    incident_date = Column(Date)

    description = Column(Text)

    evidence = Column(String(255))

    city = Column(String(100))

    state = Column(String(100))

    latitude = Column(DECIMAL(10,8))

    longitude = Column(DECIMAL(11,8))

    status = Column(
        Enum(
            "Pending",
            "Investigating",
            "Resolved",
            "Rejected"
        ),
        default="Pending"
    )

    admin_remark = Column(Text)

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )


class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("fraud_reports.id"))
    entity_type = Column(String(50))  # phone, email, upi, bank_account, device, ip_address, city
    entity_value = Column(String(255))
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )
class CurrencyHistory(Base):
    __tablename__ = "currency_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    image_name = Column(String(255))

    prediction = Column(String(50))

    confidence = Column(String(20))

    explanation = Column(Text)

    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )