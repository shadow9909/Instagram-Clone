from routers.schemas import PostBase
from sqlalchemy.orm import Session
from db.models import DbPost
import datetime
from fastapi import HTTPException, status


def create_post(db: Session, request: PostBase):
    post = DbPost(image_url=request.image_url,
                  image_url_type=request.image_url_type,
                  caption=request.caption,
                  timestamp=datetime.datetime.now(),
                  user_id=request.creator_id)

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


def get_all_post(db: Session):
    posts = db.query(DbPost).all()
    return posts


def delete_post(id: int, user_id: int, db: Session):
    post = db.query(DbPost).filter(DbPost.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="POST NOT FOUND")

    if(post.user_id != user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="OWNER CAN ONLY DELETE")
    db.delete(post)
    db.commit()
    return post
