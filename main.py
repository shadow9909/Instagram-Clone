from fastapi import FastAPI
from db import models
from db.database import engine
from routers import user

app = FastAPI()


@app.get("/")
def root():
    return "Hello"


app.include_router(user.router)

models.Base.metadata.create_all(engine)
