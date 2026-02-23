from sqlalchemy import Column, Integer, String, Date, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20), default="staff")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
 
    assets = relationship("Asset", back_populates="category")


class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    
    assets = relationship("Asset", back_populates="location")


class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    location_id = Column(Integer, ForeignKey("locations.id"))
    status = Column(String(50), default="Healthy")
    purchase_date = Column(Date)

    
    category = relationship("Category", back_populates="assets")
    location = relationship("Location", back_populates="assets")
    
    logs = relationship("MaintenanceLog", back_populates="asset")


class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    service_date = Column(Date)
    technician_name = Column(String(100))
    description = Column(String(255))
    cost = Column(DECIMAL(10, 2))

    asset = relationship("Asset", back_populates="logs")