from routers.schemas import UserBase
from sqlalchemy.orm import Session
from db.models import DbUser
from sqlalchemy.exc import IntegrityError
from .hashing import get_password_hash, verify_password
from fastapi import HTTPException, status


def create_user(db: Session, request: UserBase):
    user = DbUser(username=request.username, email=request.email,
                  hashed_password=get_password_hash(request.password))
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        return None


def get_user_by_username(db: Session, username: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"user with {username} not found")
    return user


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"user with {username} not found")

    if not (verify_password(password, user.hashed_password)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"password incorrect")

    return user
