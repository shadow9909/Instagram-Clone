from routers.schemas import PostBase
from sqlalchemy.orm import Session
from db.models import DbPost
import datetime


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
