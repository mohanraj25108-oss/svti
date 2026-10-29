from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class SuspectComposite(Base):
    __tablename__ = "suspect_composites"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    version = Column(Integer, default=1)
    parent_version_id = Column(Integer, nullable=True)
    title = Column(String, default="Primary Suspect Composite")
    
    # Facial attributes & metadata (JSON formatted strings)
    attributes_json = Column(Text, default="{}")
    contradictions_json = Column(Text, default="[]")
    confidence_ratings_json = Column(Text, default="{}")
    variants_json = Column(Text, default="{}") # e.g. with glasses, with cap, beard variations
    
    # Visual Output representations
    pencil_sketch_data = Column(Text, nullable=False)  # SVG or high-res base64
    realistic_image_data = Column(Text, nullable=False) # SVG/Photo base64
    selected_mode = Column(String, default="pencil")    # "pencil" or "realistic"
    
    # Responsible AI & Approval
    is_approved = Column(Boolean, default=False)
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    approval_notes = Column(Text, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="composites")
    creator = relationship("User", foreign_keys=[creator_id])
    approver = relationship("User", foreign_keys=[approved_by_id])

class CrimeSceneSketch(Base):
    __tablename__ = "crime_scene_sketches"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, default="Scene Diagram")
    location_type = Column(String, default="Indoor - Commercial")
    room_layout = Column(String, default="Open Plan")
    lighting = Column(String, default="Dim Artificial")
    time_of_day = Column(String, default="Night 02:40 AM")
    narrative = Column(Text, nullable=True)
    
    # Markers, measurements, layers stored in JSON
    markers_json = Column(Text, default="[]") # [{id: 1, label: "Shell Casing 9mm", x: 120, y: 240, type: "ballistics"}]
    measurements_json = Column(Text, default="[]") # [{from: "Entry Door", to: "Counter", distance: "4.8m"}]
    layers_json = Column(Text, default="{}") # layer visibility flags
    
    # Graphic Representations
    technical_plan_data = Column(Text, nullable=False) # Technical top-down SVG
    realistic_render_data = Column(Text, nullable=False) # Perspective realistic SVG
    selected_mode = Column(String, default="technical")
    
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="scene_sketches")
    creator = relationship("User", foreign_keys=[creator_id])

