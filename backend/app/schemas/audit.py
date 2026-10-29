from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user_id: Optional[int]
    user_name: str
    user_role: str
    action: str
    target_resource_type: str
    target_resource_id: Optional[str]
    details: Optional[str]
    ip_address: str

    class Config:
        from_attributes = True

