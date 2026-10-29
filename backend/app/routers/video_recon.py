import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models.case import Case
from ..models.video import CrimeVideoReconstruction
from ..models.user import User
from ..schemas.video import CrimeVideoCreate, CrimeVideoResponse
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit
from ..services.video_generator import generate_video_reconstruction_data

router = APIRouter(prefix="/api/video-recon", tags=["Module 3: Crime Video Reconstruction"])

@router.post("/synthesize", response_model=CrimeVideoResponse)
def synthesize_video_reconstruction(
    data: CrimeVideoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == data.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    steps_dicts = [step.model_dump() for step in data.timeline_steps]
    recon_data = generate_video_reconstruction_data(
        title=data.title,
        timeline_steps=steps_dicts,
        duration_seconds=data.duration_seconds or 15
    )

    recon = CrimeVideoReconstruction(
        case_id=data.case_id,
        creator_id=current_user.id,
        title=data.title or "Tactical Scene Reconstruction",
        narrative_summary=data.narrative_summary,
        timeline_steps_json=json.dumps(steps_dicts),
        duration_seconds=data.duration_seconds or 15,
        style=data.style or "SCHEMATIC_TACTICAL",
        status="READY",
        animation_data_json=json.dumps(recon_data),
        watermark_text="AI RECONSTRUCTION: ILLUSTRATIVE ONLY, NOT ACTUAL FOOTAGE",
        is_approved=False
    )
    db.add(recon)
    db.commit()
    db.refresh(recon)

    log_audit(
        db,
        action="SYNTHESIZE_VIDEO_RECON",
        target_resource_type="VIDEO_RECONSTRUCTION",
        target_resource_id=str(recon.id),
        details=f"Synthesized schematic video reconstruction for Case {case.case_number}",
        user=current_user
    )
    return recon

@router.get("/{video_id}", response_model=CrimeVideoResponse)
def get_video_reconstruction(video_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recon = db.query(CrimeVideoReconstruction).filter(CrimeVideoReconstruction.id == video_id).first()
    if not recon:
        raise HTTPException(status_code=404, detail="Reconstruction record not found")
    return recon

