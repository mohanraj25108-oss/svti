from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from ..database import get_db
from ..models.user import User
from ..schemas.sos import (
    SOSTriggerRequest, SOSLocationUpdateRequest, 
    SOSResolveRequest, SOSEventResponse
)
from ..services.auth_service import get_current_user
from ..services.sos_service import SosEmergencyService

router = APIRouter(prefix="/api/sos", tags=["Emergency SOS System"])

@router.post("", response_model=SOSEventResponse)
def trigger_emergency_sos(
    payload: SOSTriggerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not payload.idempotencyKey or not payload.idempotencyKey.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="idempotencyKey is required for emergency SOS activation"
        )

    loc = payload.location
    lat = loc.latitude if loc else None
    lng = loc.longitude if loc else None
    acc = loc.accuracy if loc else None

    result = SosEmergencyService.trigger_sos(
        db=db,
        idempotency_key=payload.idempotencyKey,
        user=current_user,
        case_id_or_number=payload.caseId,
        latitude=lat,
        longitude=lng,
        accuracy=acc
    )
    return result

@router.post("/location")
def update_emergency_location(
    payload: SOSLocationUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = SosEmergencyService.update_location(
        db=db,
        event_uuid=payload.eventId,
        latitude=payload.latitude,
        longitude=payload.longitude,
        accuracy=payload.accuracy
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active emergency SOS event not found or already resolved."
        )
    return {"status": "UPDATED", "eventId": payload.eventId}

@router.post("/{event_id}/location")
def update_emergency_location_path(
    event_id: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lat = payload.get("latitude")
    lng = payload.get("longitude")
    acc = payload.get("accuracy")

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="latitude and longitude are required")

    success = SosEmergencyService.update_location(
        db=db,
        event_uuid=event_id,
        latitude=float(lat),
        longitude=float(lng),
        accuracy=float(acc) if acc is not None else None
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active emergency SOS event not found or already resolved."
        )
    return {"status": "UPDATED", "eventId": event_id}

@router.post("/resolve")
def resolve_emergency(
    payload: SOSResolveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = SosEmergencyService.resolve_sos(
        db=db,
        event_uuid=payload.eventId,
        user=current_user
    )
    if result.get("status") == "NOT_FOUND":
        raise HTTPException(status_code=404, detail="SOS event not found")
    return result

@router.post("/{event_id}/resolve")
def resolve_emergency_path(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = SosEmergencyService.resolve_sos(
        db=db,
        event_uuid=event_id,
        user=current_user
    )
    if result.get("status") == "NOT_FOUND":
        raise HTTPException(status_code=404, detail="SOS event not found")
    return result

@router.get("/active")
def get_active_emergency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    active = SosEmergencyService.get_active_sos(db, current_user)
    return active or {"status": "NONE"}

