from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class SOSLocationInput(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    accuracy: Optional[float] = None
    timestamp: Optional[int] = None

class SOSTriggerRequest(BaseModel):
    idempotencyKey: str = Field(..., description="Unique idempotency token generated at activation")
    caseId: Optional[str] = Field(None, description="Current investigation case ID or number")
    userId: Optional[str] = None
    userBadge: Optional[str] = None
    timestamp: Optional[str] = None
    location: Optional[SOSLocationInput] = None

class SOSLocationUpdateRequest(BaseModel):
    eventId: str
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    timestamp: Optional[int] = None

class SOSResolveRequest(BaseModel):
    eventId: str
    resolvedBy: Optional[str] = None
    timestamp: Optional[str] = None

class SOSDeliveryStatusResponse(BaseModel):
    sms: str
    push: str
    audit: str
    errorMessage: Optional[str] = None
    sandboxNotice: Optional[str] = None

class SOSOfficerContactResponse(BaseModel):
    name: str
    badgeNumber: str
    department: str
    phoneNumber: Optional[str] = None
    callSupported: bool = True

class SOSEventResponse(BaseModel):
    eventId: str
    status: str
    delivery: SOSDeliveryStatusResponse
    officer: SOSOfficerContactResponse
    caseId: str
    createdAt: str
    isSandbox: bool

