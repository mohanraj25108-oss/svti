import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from ..database import Base

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    INVESTIGATOR = "Investigator"
    FORENSIC_ARTIST = "Forensic Artist"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    badge_number = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, default="Metro Police - Forensic Division")
    role = Column(String, default=UserRole.INVESTIGATOR.value, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

