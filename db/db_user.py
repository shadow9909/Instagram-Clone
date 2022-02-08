from routers.schemas import UserBase
from sqlalchemy.orm import Session
from db.models import DbUser
from sqlalchemy.exc import IntegrityError
from .hashing import get_password_hash

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
