from sqlalchemy import Column, Integer, String, Date, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(20), default="staff")

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    category = Column(String(50))
    purchase_date = Column(Date)
    status = Column(String(20), default="Healthy")
    location = Column(String(100))
    

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