from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TimelineEventCreate(BaseModel):
    timestamp: datetime
    title: str
    description: Optional[str] = None
    source: Optional[str] = "CCTV / Witness"
    severity: Optional[str] = "INFO"

class TimelineEventResponse(TimelineEventCreate):
    id: int
    case_id: int

    class Config:
        from_attributes = True

class WitnessStatementCreate(BaseModel):
    witness_name: str
    witness_type: Optional[str] = "Eyewitness"
    raw_narrative: str
    extracted_attributes_json: Optional[str] = "{}"
    credibility_score: Optional[float] = 0.85

class WitnessStatementResponse(WitnessStatementCreate):
    id: int
    case_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    incident_type: str
    incident_date: datetime
    location: str
    priority: Optional[str] = "HIGH"
    status: Optional[str] = "ACTIVE"
    assigned_officer_id: Optional[int] = None

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_officer_id: Optional[int] = None

class CaseResponse(CaseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    timeline_events: List[TimelineEventResponse] = []
    witness_statements: List[WitnessStatementResponse] = []

    class Config:
        from_attributes = True

