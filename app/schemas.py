from pydantic import BaseModel
from typing import Optional
from datetime import date

# Category Schemas
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    class Config:
        from_attributes = True 

# Location Schemas
class LocationBase(BaseModel):
    name: str

class LocationCreate(LocationBase):
    pass

class LocationOut(LocationBase):
    id: int
    class Config:
        from_attributes = True

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
    category_id: int
    location_id: int
    status: str = "Healthy"
    purchase_date: date

class AssetCreate(AssetBase):
    pass

class AssetOut(AssetBase):
    id: int
    category: CategoryOut 
    location: LocationOut 
    class Config:
        from_attributes = True
        
class MaintenanceLogBase(BaseModel):
    asset_id: int
    service_date: date
    technician_name: str
    description: str
    cost: float

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogOut(MaintenanceLogBase):
    id: int
    class Config:
        from_attributes = True


class AssetStatusUpdate(BaseModel):
    status: str 


