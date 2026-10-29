from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class CrimeVideoReconstruction(Base):
    __tablename__ = "crime_video_reconstructions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, default="Tactical Scene Reconstruction")
    narrative_summary = Column(Text, nullable=True)
    timeline_steps_json = Column(Text, default="[]") # [{step: 1, time: "00:00:15", title: "Entry", description: "Suspect kicks open rear door"}]
    duration_seconds = Column(Integer, default=12)
    style = Column(String, default="SCHEMATIC_TACTICAL")
    status = Column(String, default="READY") # QUEUED, PROCESSING, READY, FAILED
    
    # Schematic animation payload / preview data
    animation_data_json = Column(Text, default="{}") # Keyframes, camera viewpoints, tactical paths
    watermark_text = Column(String, default="AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE")
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="video_reconstructions")
    creator = relationship("User", foreign_keys=[creator_id])

