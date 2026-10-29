import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models.case import Case
from ..models.sketch import CrimeSceneSketch
from ..models.user import User
from ..schemas.sketch import CrimeSceneSketchCreate, CrimeSceneSketchResponse, ApprovalRequest
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit
from ..services.scene_generator import (
    generate_scene_technical_plan_svg,
    generate_scene_realistic_render_svg
)

router = APIRouter(prefix="/api/scene-sketch", tags=["Module 2: Crime Scene Sketch"])

@router.post("/synthesize", response_model=CrimeSceneSketchResponse)
def synthesize_scene_sketch(
    data: CrimeSceneSketchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == data.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    technical_svg = generate_scene_technical_plan_svg(
        location_type=data.location_type or "Indoor - Commercial",
        room_layout=data.room_layout or "Open Plan Vault",
        markers=data.markers or [],
        measurements=data.measurements or []
    )
    realistic_svg = generate_scene_realistic_render_svg(
        location_type=data.location_type or "Indoor - Commercial",
        room_layout=data.room_layout or "Open Plan Vault"
    )

    scene_sketch = CrimeSceneSketch(
        case_id=data.case_id,
        creator_id=current_user.id,
        title=data.title or "Forensic Crime Scene Diagram",
        location_type=data.location_type or "Indoor - Commercial",
        room_layout=data.room_layout or "Open Plan Vault",
        lighting=data.lighting or "Dim Artificial",
        time_of_day=data.time_of_day or "Night 02:40 AM",
        narrative=data.narrative,
        markers_json=json.dumps(data.markers or []),
        measurements_json=json.dumps(data.measurements or []),
        layers_json=json.dumps({"grid": True, "markers": True, "measurements": True, "witness_cone": True}),
        technical_plan_data=technical_svg,
        realistic_render_data=realistic_svg,
        selected_mode="technical",
        is_approved=False
    )
    db.add(scene_sketch)
    db.commit()
    db.refresh(scene_sketch)

    log_audit(
        db,
        action="SYNTHESIZE_SCENE_SKETCH",
        target_resource_type="SCENE_SKETCH",
        target_resource_id=str(scene_sketch.id),
        details=f"Synthesized crime scene plan for Case {case.case_number}",
        user=current_user
    )
    return scene_sketch

@router.post("/{sketch_id}/approve", response_model=CrimeSceneSketchResponse)
def approve_scene_sketch(
    sketch_id: int,
    approval_data: ApprovalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sketch = db.query(CrimeSceneSketch).filter(CrimeSceneSketch.id == sketch_id).first()
    if not sketch:
        raise HTTPException(status_code=404, detail="Scene sketch not found")

    sketch.is_approved = approval_data.is_approved
    db.commit()
    db.refresh(sketch)

    log_audit(
        db,
        action="APPROVE_SCENE_SKETCH",
        target_resource_type="SCENE_SKETCH",
        target_resource_id=str(sketch.id),
        details=f"Officer {current_user.full_name} approved scene diagram #{sketch.id}",
        user=current_user
    )
    return sketch

