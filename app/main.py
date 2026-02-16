from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schemas, database

app = FastAPI()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")


def hash_password(password: str):
    return pwd_context.hash(password)


@app.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
   
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    
    hashed_pwd = hash_password(user.password)
    new_user = models.User(username=user.username, password_hash=hashed_pwd, role=user.role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user