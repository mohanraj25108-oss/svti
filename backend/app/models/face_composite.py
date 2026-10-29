from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class FaceStateRecord(Base):
    __tablename__ = "face_state_records"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    version = Column(Integer, default=1)
    title = Column(String(255), default="Suspect Craniofacial Lead")
    face_state_json = Column(Text, nullable=False)
    seed = Column(Integer, default=4921)
    selected_mode = Column(String(50), default="pencil")
    is_approved = Column(Boolean, default=False)
    approval_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    case = relationship("Case", backref="face_state_records")
    creator = relationship("User", backref="face_state_records")

