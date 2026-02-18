from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "staff"

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class AssetBase(BaseModel):
    name: str
    category: str
    purchase_date: Optional[date] = None
    status: str = "Healthy"
    location: str

class AssetCreate(AssetBase):
    pass

class AssetOut(AssetBase):
    id: int
    class Config:
        from_attributes = True
        