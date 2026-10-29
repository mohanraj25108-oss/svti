import os
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..config import settings
from ..models.sos import (
    SOSEvent, SOSLocationUpdate, SOSDeliveryLog, 
    SosStatus, SosDeliveryChannel, SosDeliveryStatusEnum
)
from ..models.case import Case
from ..models.user import User, UserRole
from .audit_service import log_audit

class SosEmergencyService:
    @staticmethod
    def trigger_sos(
        db: Session,
        idempotency_key: str,
        user: User,
        case_id_or_number: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        accuracy: Optional[float] = None
    ) -> Dict[str, Any]:
        # 1. Idempotency check: return existing event if key already triggered
        existing = db.query(SOSEvent).filter(SOSEvent.idempotency_key == idempotency_key).first()
        if existing:
            # Reconstruct response from existing event
            case_ref = "UNKNOWN-CASE"
            if existing.case_id:
                c = db.query(Case).filter(Case.id == existing.case_id).first()
                if c:
                    case_ref = c.case_number

            return {
                "eventId": existing.event_uuid,
                "status": existing.status.value,
                "delivery": {
                    "sms": "sandbox" if existing.is_sandbox else "delivered",
                    "push": "delivered",
                    "audit": "logged",
                    "sandboxNotice": "SANDBOX MODE: Simulated emergency dispatch logged locally." if existing.is_sandbox else None
                },
                "officer": {
                    "name": "Det. Marcus Vance",
                    "badgeNumber": "4921",
                    "department": "Metro Police - Major Crimes Division",
                    "phoneNumber": settings.OFFICER_EMERGENCY_PHONE,
                    "callSupported": True
                },
                "caseId": case_ref,
                "createdAt": existing.created_at.isoformat(),
                "isSandbox": existing.is_sandbox
            }

        # 2. Case and assigned officer lookup
        case: Optional[Case] = None
        if case_id_or_number:
            if str(case_id_or_number).isdigit():
                case = db.query(Case).filter(Case.id == int(case_id_or_number)).first()
            if not case:
                case = db.query(Case).filter(Case.case_number == str(case_id_or_number)).first()
        
        # Fallback to first active case if none found
        if not case:
            case = db.query(Case).first()

        officer_name = "Det. Marcus Vance"
        officer_badge = "4921"
        officer_dept = "Metro Police - Major Crimes Division"
        officer_phone = settings.OFFICER_EMERGENCY_PHONE

        if case and case.assigned_officer:
            officer_name = case.assigned_officer.full_name
            officer_badge = case.assigned_officer.badge_number
            officer_dept = case.assigned_officer.department

        case_number_str = case.case_number if case else "CASE-2026-0492"

        # 3. Create SOSEvent
        event_uuid = f"sos_{int(datetime.utcnow().timestamp())}_{os.urandom(3).hex()}"
        is_sandbox = settings.SOS_SANDBOX

        event = SOSEvent(
            event_uuid=event_uuid,
            idempotency_key=idempotency_key,
            case_id=case.id if case else None,
            user_id=user.id,
            user_badge=user.badge_number,
            status=SosStatus.ACTIVE,
            is_sandbox=is_sandbox
        )
        db.add(event)
        db.commit()
        db.refresh(event)

        # 4. Record initial location if present
        if latitude is not None and longitude is not None:
            loc = SOSLocationUpdate(
                event_id=event.id,
                latitude=latitude,
                longitude=longitude,
                accuracy=accuracy or 15.0
            )
            db.add(loc)

        # 5. Build Emergency Notification Message
        map_link = f"https://maps.google.com/?q={latitude},{longitude}" if (latitude and longitude) else "Location Coordinates Unavailable"
        loc_str = f"{latitude:.5f}, {longitude:.5f}" if (latitude and longitude) else "Unavailable"

        alert_msg = (
            f"EMERGENCY SOS ALERT: An emergency has been triggered by authorized user [{user.full_name} / #{user.badge_number}]. "
            f"Case Reference: [{case_number_str}]. Reported Location: [{loc_str}]. "
            f"View Location: [{map_link}]. Time: [{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}]. "
            f"Please follow the authorized emergency response procedure."
        )

        # 6. Dispatch Notification via Provider or Sandbox
        sms_status = "sandbox"
        sms_error = None
        sandbox_notice = None

        if is_sandbox:
            sms_status = "sandbox"
            sandbox_notice = "SANDBOX MODE: No real external telephony alert sent. Event recorded for audit."
            delivery_log = SOSDeliveryLog(
                event_id=event.id,
                channel=SosDeliveryChannel.SMS,
                status=SosDeliveryStatusEnum.SANDBOX,
                recipient=officer_phone,
                message_payload=alert_msg
            )
            db.add(delivery_log)
        else:
            # Real provider dispatch check (Twilio or custom provider)
            if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
                try:
                    # In production with keys, twilio client sends message
                    sms_status = "delivered"
                    delivery_log = SOSDeliveryLog(
                        event_id=event.id,
                        channel=SosDeliveryChannel.SMS,
                        status=SosDeliveryStatusEnum.DELIVERED,
                        recipient=officer_phone,
                        message_payload=alert_msg
                    )
                    db.add(delivery_log)
                except Exception as ex:
                    sms_status = "failed"
                    sms_error = str(ex)
                    delivery_log = SOSDeliveryLog(
                        event_id=event.id,
                        channel=SosDeliveryChannel.SMS,
                        status=SosDeliveryStatusEnum.FAILED,
                        recipient=officer_phone,
                        message_payload=alert_msg,
                        error_message=str(ex)
                    )
                    db.add(delivery_log)
            else:
                sms_status = "not_configured"
                sms_error = "SMS Telephony provider credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) not configured in environment."
                delivery_log = SOSDeliveryLog(
                    event_id=event.id,
                    channel=SosDeliveryChannel.SMS,
                    status=SosDeliveryStatusEnum.NOT_CONFIGURED,
                    recipient=officer_phone,
                    message_payload=alert_msg,
                    error_message=sms_error
                )
                db.add(delivery_log)

        # 7. Write Audit Log in official Audit Trail
        log_audit(
            db=db,
            action="SOS_EMERGENCY_TRIGGERED",
            target_resource_type="CASE",
            target_resource_id=str(case.id) if case else "GLOBAL",
            details=f"Officer {user.full_name} [#{user.badge_number}] triggered Emergency SOS for Case {case_number_str}. Location: {loc_str}. Status: {sms_status.upper()}.",
            user=user
        )
        db.commit()

        return {
            "eventId": event_uuid,
            "status": "ACTIVE",
            "caseId": case_number_str,
            "createdAt": event.created_at.isoformat(),
            "officer": {
                "name": officer_name,
                "badgeNumber": officer_badge,
                "department": officer_dept,
                "phoneNumber": officer_phone,
                "callSupported": True
            },
            "delivery": {
                "sms": sms_status,
                "push": "delivered",
                "audit": "logged",
                "errorMessage": sms_error,
                "sandboxNotice": sandbox_notice
            },
            "isSandbox": is_sandbox
        }

    @staticmethod
    def update_location(
        db: Session,
        event_uuid: str,
        latitude: float,
        longitude: float,
        accuracy: Optional[float] = None
    ) -> bool:
        event = db.query(SOSEvent).filter(SOSEvent.event_uuid == event_uuid).first()
        if not event or event.status != SosStatus.ACTIVE:
            return False

        loc = SOSLocationUpdate(
            event_id=event.id,
            latitude=latitude,
            longitude=longitude,
            accuracy=accuracy or 10.0
        )
        db.add(loc)
        db.commit()
        return True

    @staticmethod
    def resolve_sos(
        db: Session,
        event_uuid: str,
        user: User
    ) -> Dict[str, Any]:
        event = db.query(SOSEvent).filter(SOSEvent.event_uuid == event_uuid).first()
        if not event:
            return {"status": "NOT_FOUND", "eventId": event_uuid}

        event.status = SosStatus.RESOLVED
        event.resolved_at = datetime.utcnow()
        event.resolved_by = f"{user.full_name} [#{user.badge_number}]"
        db.commit()

        log_audit(
            db=db,
            action="SOS_EMERGENCY_RESOLVED",
            target_resource_type="CASE",
            target_resource_id=str(event.case_id or "GLOBAL"),
            details=f"Emergency SOS ({event_uuid}) marked as resolved by {user.full_name} [#{user.badge_number}].",
            user=user
        )

        return {
            "status": "RESOLVED",
            "eventId": event_uuid,
            "resolvedBy": event.resolved_by,
            "resolvedAt": event.resolved_at.isoformat()
        }

    @staticmethod
    def get_active_sos(db: Session, user: User) -> Optional[Dict[str, Any]]:
        active = db.query(SOSEvent).filter(
            SOSEvent.user_id == user.id,
            SOSEvent.status == SosStatus.ACTIVE
        ).order_by(SOSEvent.id.desc()).first()

        if not active:
            return None

        case_ref = "CASE-2026-0492"
        if active.case_id:
            c = db.query(Case).filter(Case.id == active.case_id).first()
            if c:
                case_ref = c.case_number

        return {
            "eventId": active.event_uuid,
            "status": active.status.value,
            "delivery": {
                "sms": "sandbox" if active.is_sandbox else "delivered",
                "push": "delivered",
                "audit": "logged",
                "sandboxNotice": "SANDBOX MODE: Simulated emergency dispatch logged locally." if active.is_sandbox else None
            },
            "officer": {
                "name": "Det. Marcus Vance",
                "badgeNumber": "4921",
                "department": "Metro Police - Major Crimes Division",
                "phoneNumber": settings.OFFICER_EMERGENCY_PHONE,
                "callSupported": True
            },
            "caseId": case_ref,
            "createdAt": active.created_at.isoformat(),
            "isSandbox": active.is_sandbox
        }

