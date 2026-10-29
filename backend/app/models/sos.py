import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class SosStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    RESOLVED = "RESOLVED"
    CANCELLED = "CANCELLED"

class SosDeliveryChannel(str, enum.Enum):
    SMS = "SMS"
    PUSH = "PUSH"
    TELEPHONY = "TELEPHONY"
    AUDIT = "AUDIT"

class SosDeliveryStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    DELIVERED = "DELIVERED"
    FAILED = "FAILED"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    SANDBOX = "SANDBOX"

class SOSEvent(Base):
    __tablename__ = "sos_events"

    id = Column(Integer, primary_key=True, index=True)
    event_uuid = Column(String(100), unique=True, index=True, nullable=False)
    idempotency_key = Column(String(100), unique=True, index=True, nullable=False)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_badge = Column(String(50), nullable=False)
    status = Column(Enum(SosStatus), default=SosStatus.ACTIVE, nullable=False)
    is_sandbox = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String(100), nullable=True)

    location_updates = relationship("SOSLocationUpdate", back_populates="event", cascade="all, delete-orphan")
    delivery_logs = relationship("SOSDeliveryLog", back_populates="event", cascade="all, delete-orphan")

class SOSLocationUpdate(Base):
    __tablename__ = "sos_location_updates"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("sos_events.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("SOSEvent", back_populates="location_updates")

class SOSDeliveryLog(Base):
    __tablename__ = "sos_delivery_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("sos_events.id"), nullable=False)
    channel = Column(Enum(SosDeliveryChannel), nullable=False)
    status = Column(Enum(SosDeliveryStatusEnum), default=SosDeliveryStatusEnum.PENDING, nullable=False)
    recipient = Column(String(100), nullable=True)
    message_payload = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    dispatched_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("SOSEvent", back_populates="delivery_logs")

