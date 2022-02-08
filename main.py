from fastapi import FastAPI
from db import models
from db.database import engine
from routers import user, post, comment
from fastapi.staticfiles import StaticFiles
from auth import authentication
app = FastAPI()


@app.get("/")
def root():
    return "Hello"


app.include_router(user.router)
app.include_router(post.router)
app.include_router(comment.router)
app.include_router(authentication.router)

app.mount("/images", StaticFiles(directory="images"), name="static")


models.Base.metadata.create_all(engine)
