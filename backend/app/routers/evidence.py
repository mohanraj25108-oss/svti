from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..database import get_db
from ..models.sketch import SuspectComposite, CrimeSceneSketch
from ..models.video import CrimeVideoReconstruction
from ..models.case import Case
from ..models.user import User
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/evidence", tags=["Evidence Repository & Comparison"])

@router.get("/gallery")
def get_evidence_gallery(
    case_id: Optional[int] = None,
    asset_type: Optional[str] = None, # "composite", "scene", "video"
    is_approved: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = []

    # Suspect Composites
    if not asset_type or asset_type == "composite":
        comp_query = db.query(SuspectComposite)
        if case_id:
            comp_query = comp_query.filter(SuspectComposite.case_id == case_id)
        if is_approved is not None:
            comp_query = comp_query.filter(SuspectComposite.is_approved == is_approved)
        
        for c in comp_query.order_by(SuspectComposite.created_at.desc()).all():
            case = db.query(Case).filter(Case.id == c.case_id).first()
            results.append({
                "id": c.id,
                "type": "composite",
                "title": c.title,
                "version": c.version,
                "case_id": c.case_id,
                "case_number": case.case_number if case else "N/A",
                "preview_svg": c.pencil_sketch_data,
                "realistic_svg": c.realistic_image_data,
                "is_approved": c.is_approved,
                "created_at": c.created_at,
                "watermark": "COMPOSITE: INVESTIGATIVE LEAD ONLY, NOT EVIDENCE OF IDENTITY"
            })

    # Scene Diagrams
    if not asset_type or asset_type == "scene":
        scene_query = db.query(CrimeSceneSketch)
        if case_id:
            scene_query = scene_query.filter(CrimeSceneSketch.case_id == case_id)
        if is_approved is not None:
            scene_query = scene_query.filter(CrimeSceneSketch.is_approved == is_approved)
        
        for s in scene_query.order_by(CrimeSceneSketch.created_at.desc()).all():
            case = db.query(Case).filter(Case.id == s.case_id).first()
            results.append({
                "id": s.id,
                "type": "scene",
                "title": s.title,
                "case_id": s.case_id,
                "case_number": case.case_number if case else "N/A",
                "preview_svg": s.technical_plan_data,
                "realistic_svg": s.realistic_render_data,
                "is_approved": s.is_approved,
                "created_at": s.created_at,
                "watermark": "CRIME SCENE DIAGRAM: OFFICIAL POLICE RECORD"
            })

    # Video Reconstructions
    if not asset_type or asset_type == "video":
        video_query = db.query(CrimeVideoReconstruction)
        if case_id:
            video_query = video_query.filter(CrimeVideoReconstruction.case_id == case_id)
        
        for v in video_query.order_by(CrimeVideoReconstruction.created_at.desc()).all():
            case = db.query(Case).filter(Case.id == v.case_id).first()
            results.append({
                "id": v.id,
                "type": "video",
                "title": v.title,
                "case_id": v.case_id,
                "case_number": case.case_number if case else "N/A",
                "duration_seconds": v.duration_seconds,
                "status": v.status,
                "is_approved": v.is_approved,
                "created_at": v.created_at,
                "watermark": v.watermark_text
            })

    return results

@router.get("/compare")
def compare_evidence(
    composite_id_1: int,
    composite_id_2: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comp1 = db.query(SuspectComposite).filter(SuspectComposite.id == composite_id_1).first()
    comp2 = db.query(SuspectComposite).filter(SuspectComposite.id == composite_id_2).first()
    
    if not comp1 or not comp2:
        raise HTTPException(status_code=404, detail="One or both composites could not be retrieved")

    return {
        "asset_1": {
            "id": comp1.id,
            "version": comp1.version,
            "title": comp1.title,
            "pencil_svg": comp1.pencil_sketch_data,
            "realistic_svg": comp1.realistic_image_data,
            "attributes": comp1.attributes_json,
            "created_at": comp1.created_at
        },
        "asset_2": {
            "id": comp2.id,
            "version": comp2.version,
            "title": comp2.title,
            "pencil_svg": comp2.pencil_sketch_data,
            "realistic_svg": comp2.realistic_image_data,
            "attributes": comp2.attributes_json,
            "created_at": comp2.created_at
        }
    }

