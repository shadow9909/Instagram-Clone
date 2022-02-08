from sqlalchemy.orm import Session
from db.database import get_db
from fastapi import APIRouter, Depends
from routers.schemas import UserBase, UserDisplay
from db import db_user

router = APIRouter(
    prefix='/user',
    tags=['user']
)


@router.post('', response_model=UserDisplay)
def create_user(request: UserBase, db: Session = Depends(get_db)):
    response = db_user.create_user(db, request)
    if response == None:
        return {"username": "User already present", "email": "Email already present"}
    return response
