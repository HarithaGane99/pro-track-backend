import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schemas, database
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List

load_dotenv()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")


def hash_password(password: str):
    return pwd_context.hash(password)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Configuration
SECRET_KEY = "your_very_secret_key_here" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

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


@app.post("/login")
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)):
   
    user = db.query(models.User).filter(models.User.username == user_credentials.username).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    access_token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/assets", response_model=List[schemas.AssetOut])
def get_assets(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    
    assets = db.query(models.Asset).all()
    return assets

@app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
def create_asset(
    asset: schemas.AssetCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
       
        new_asset = models.Asset(**asset.model_dump()) 
        db.add(new_asset)
        db.commit()
        db.refresh(new_asset)
        return new_asset
    except Exception as e:
        db.rollback() 
        print(f"Error: {e}") 
        raise HTTPException(status_code=500, detail=str(e))
    

@app.put("/assets/{asset_id}/status", response_model=schemas.AssetOut)
def update_asset_status(
    asset_id: int, 
    status_update: schemas.AssetStatusUpdate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.status = status_update.status
    db.commit()
    db.refresh(asset)
    return asset    
    



@app.post("/maintenance", response_model=schemas.MaintenanceLogOut, status_code=status.HTTP_201_CREATED)
def create_maintenance_log(
    log: schemas.MaintenanceLogCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    
    asset = db.query(models.Asset).filter(models.Asset.id == log.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    new_log = models.MaintenanceLog(**log.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


