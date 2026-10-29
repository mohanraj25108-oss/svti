from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False) # e.g. SF-2026-0492
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    incident_type = Column(String, nullable=False) # e.g. Armed Robbery, Burglary, Assault
    incident_date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    priority = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, default="ACTIVE") # ACTIVE, INVESTIGATION_PENDING, LEAD_IDENTIFIED, CLOSED
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assigned_officer = relationship("User", foreign_keys=[assigned_officer_id])
    timeline_events = relationship("CaseTimelineEvent", back_populates="case", cascade="all, delete-orphan")
    witness_statements = relationship("WitnessStatement", back_populates="case", cascade="all, delete-orphan")
    composites = relationship("SuspectComposite", back_populates="case", cascade="all, delete-orphan")
    scene_sketches = relationship("CrimeSceneSketch", back_populates="case", cascade="all, delete-orphan")
    video_reconstructions = relationship("CrimeVideoReconstruction", back_populates="case", cascade="all, delete-orphan")

class CaseTimelineEvent(Base):
    __tablename__ = "case_timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    source = Column(String, default="CCTV / Witness")
    severity = Column(String, default="INFO") # CRITICAL, WARNING, INFO

    case = relationship("Case", back_populates="timeline_events")

class WitnessStatement(Base):
    __tablename__ = "witness_statements"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    witness_name = Column(String, nullable=False)
    witness_type = Column(String, default="Eyewitness") # Eyewitness, Victim, Responding Officer
    raw_narrative = Column(Text, nullable=False)
    extracted_attributes_json = Column(Text, default="{}")
    credibility_score = Column(Float, default=0.85)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="witness_statements")

