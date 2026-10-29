from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TimelineStep(BaseModel):
    step: int
    timestamp: str # "00:00:15"
    title: str
    description: str
    camera_view: Optional[str] = "Overhead CCTV"
    characters_involved: Optional[List[str]] = ["Suspect #1", "Security Officer"]

class CrimeVideoCreate(BaseModel):
    case_id: int
    title: Optional[str] = "Tactical Scene Reconstruction"
    narrative_summary: Optional[str] = None
    timeline_steps: List[TimelineStep]
    duration_seconds: Optional[int] = 15
    style: Optional[str] = "SCHEMATIC_TACTICAL"

class CrimeVideoResponse(BaseModel):
    id: int
    case_id: int
    creator_id: Optional[int]
    title: str
    narrative_summary: Optional[str]
    timeline_steps_json: str
    duration_seconds: int
    style: str
    status: str
    animation_data_json: str
    watermark_text: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

