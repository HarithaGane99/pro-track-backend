from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from .database import get_db

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "ProTrack API is running!"}

@app.get("/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    try:

        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Database connected successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}