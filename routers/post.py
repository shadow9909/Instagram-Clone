from http.client import HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from fastapi import APIRouter, Depends, status, UploadFile, File
from routers.schemas import PostBase, PostDisplay, UserAuth
from db import db_post
import random
import string
from typing import List
import shutil
from auth.oauth2 import get_current_user

router = APIRouter(
    prefix='/post',
    tags=['post']
)

image_url_types = ['relative', 'absolute']


@router.post('', response_model=PostDisplay)
def create(request: PostBase, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    if not request.image_url_type in image_url_types:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="Parameter image_url_type value not defined")

    return db_post.create_post(db, request)


@router.get('/all', response_model=List[PostDisplay])
def get_posts(db: Session = Depends(get_db)):
    return db_post.get_all_post(db)


@router.post('/images')
def upload_image(image: UploadFile = File(...), current_user: UserAuth = Depends(get_current_user)):
    letters = string.ascii_letters
    rand_str = ''.join(random.choice(letters) for i in range(6))
    new = f"_{rand_str}."
    filename = new.join(image.filename.rsplit('.', 1))
    path = f'images/{filename}'

    with open(path, "w+b") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {'filename': path}


@router.delete('/delete/{id}')
def delete(id: int, user_id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_post.delete_post(id, user_id, db)
