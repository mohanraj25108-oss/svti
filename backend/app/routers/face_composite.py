import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.case import Case
from ..models.user import User
from ..models.face_composite import FaceStateRecord
from ..schemas.face_composite import FaceStateSaveRequest, FaceStateRecordResponse
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit

router = APIRouter(prefix="/api/face-composite", tags=["Module 1: Craniofacial State Persistence"])

@router.post("/save", response_model=FaceStateRecordResponse)
def save_face_composite(
    payload: FaceStateSaveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == payload.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found")

    # Find highest existing version for this case
    latest = (
        db.query(FaceStateRecord)
        .filter(FaceStateRecord.case_id == payload.case_id)
        .order_by(FaceStateRecord.version.desc())
        .first()
    )
    new_version = (latest.version + 1) if latest else 1

    seed = payload.face_state.get("seed", 4921)
    record = FaceStateRecord(
        case_id=payload.case_id,
        creator_id=current_user.id,
        version=new_version,
        title=payload.title or f"Craniofacial Lead v{new_version}",
        face_state_json=json.dumps(payload.face_state),
        seed=seed,
        selected_mode=payload.selected_mode or "pencil",
        is_approved=payload.is_approved or False,
        approval_notes=payload.approval_notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    log_audit(
        db,
        action="SAVE_FACE_STATE",
        target_resource_type="FACE_STATE_RECORD",
        target_resource_id=str(record.id),
        details=f"Saved versioned FaceState (v{new_version}) for Case {case.case_number}",
        user=current_user
    )

    return FaceStateRecordResponse(
        id=record.id,
        case_id=record.case_id,
        creator_id=record.creator_id,
        version=record.version,
        title=record.title,
        face_state=json.loads(record.face_state_json),
        seed=record.seed,
        selected_mode=record.selected_mode,
        is_approved=record.is_approved,
        approval_notes=record.approval_notes,
        created_at=record.created_at,
        updated_at=record.updated_at
    )

@router.get("/{case_id}/latest", response_model=Optional[FaceStateRecordResponse])
def get_latest_face_composite(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = (
        db.query(FaceStateRecord)
        .filter(FaceStateRecord.case_id == case_id)
        .order_by(FaceStateRecord.version.desc())
        .first()
    )
    if not record:
        return None

    return FaceStateRecordResponse(
        id=record.id,
        case_id=record.case_id,
        creator_id=record.creator_id,
        version=record.version,
        title=record.title,
        face_state=json.loads(record.face_state_json),
        seed=record.seed,
        selected_mode=record.selected_mode,
        is_approved=record.is_approved,
        approval_notes=record.approval_notes,
        created_at=record.created_at,
        updated_at=record.updated_at
    )

@router.get("/{case_id}/versions", response_model=List[FaceStateRecordResponse])
def get_face_composite_versions(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = (
        db.query(FaceStateRecord)
        .filter(FaceStateRecord.case_id == case_id)
        .order_by(FaceStateRecord.version.desc())
        .all()
    )
    return [
        FaceStateRecordResponse(
            id=r.id,
            case_id=r.case_id,
            creator_id=r.creator_id,
            version=r.version,
            title=r.title,
            face_state=json.loads(r.face_state_json),
            seed=r.seed,
            selected_mode=r.selected_mode,
            is_approved=r.is_approved,
            approval_notes=r.approval_notes,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in records
    ]

