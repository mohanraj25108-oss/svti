from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from ..database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, default="System")
    user_role = Column(String, default="Viewer")
    action = Column(String, nullable=False) # e.g. "AUTH_LOGIN", "SYNTHESIZE_SKETCH", "APPROVE_LEAD"
    target_resource_type = Column(String, nullable=False) # e.g. "SUSPECT_COMPOSITE", "CASE"
    target_resource_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String, default="127.0.0.1")

