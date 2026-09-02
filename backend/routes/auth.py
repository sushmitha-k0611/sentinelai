from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt

from database import get_db
from models import User

router = APIRouter( tags=["Authentication"])


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        existing = db.query(User).filter(User.email == data.email).first()

        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

        # Hash password using direct bcrypt
        password_bytes = data.password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt).decode("utf-8")

        new_user = User(
            full_name=data.full_name,
            email=data.email,
            password=hashed_password,
            role="user"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "status": "success",
            "message": "Registration Successful"
        }

    except Exception as e:
        db.rollback()
        print("REGISTER ERROR:", repr(e))
        raise


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    # Verify password using direct bcrypt
    password_bytes = data.password.encode("utf-8")
    user_hash_bytes = user.password.encode("utf-8")
    if not bcrypt.checkpw(password_bytes, user_hash_bytes):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    return {
        "status": "success",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }