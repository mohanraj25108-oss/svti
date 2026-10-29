from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class FaceStateSaveRequest(BaseModel):
    case_id: int
    title: Optional[str] = "Suspect Craniofacial Lead"
    face_state: Dict[str, Any]
    selected_mode: Optional[str] = "pencil"
    is_approved: Optional[bool] = False
    approval_notes: Optional[str] = None

class FaceStateRecordResponse(BaseModel):
    id: int
    case_id: int
    creator_id: int
    version: int
    title: str
    face_state: Dict[str, Any]
    seed: int
    selected_mode: str
    is_approved: bool
    approval_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

