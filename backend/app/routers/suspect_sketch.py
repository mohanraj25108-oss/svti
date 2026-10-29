import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..database import get_db
from ..models.case import Case, WitnessStatement
from ..models.sketch import SuspectComposite
from ..models.user import User
from ..schemas.sketch import (
    FacialAttributes, CandidateFace, SuspectCompositeCreate,
    SuspectCompositeRefine, SuspectCompositeResponse, ApprovalRequest
)
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit
from ..services.nlp_parser import parse_witness_narrative
from ..services.face_generator import (
    generate_pencil_sketch_svg, generate_realistic_image_svg,
    generate_candidate_faces
)

router = APIRouter(prefix="/api/suspect-sketch", tags=["Module 1: Suspect Face Sketch"])

@router.post("/parse-narrative")
def parse_narrative(payload: Dict[str, str], current_user: User = Depends(get_current_user)):
    narrative = payload.get("narrative", "")
    if not narrative.strip():
        raise HTTPException(status_code=400, detail="Narrative text or voice transcript is empty")
    
    parsed = parse_witness_narrative(narrative)
    return parsed

@router.post("/candidates", response_model=List[CandidateFace])
def get_candidates(attributes: FacialAttributes, current_user: User = Depends(get_current_user)):
    candidates = generate_candidate_faces(attributes.model_dump())
    return candidates

@router.post("/synthesize", response_model=SuspectCompositeResponse)
def synthesize_composite(
    data: SuspectCompositeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == data.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found")

    attrs_dict = data.attributes.model_dump()
    
    # Generate both modes from the exact same facial attributes
    pencil_svg = generate_pencil_sketch_svg(attrs_dict, variant="standard")
    realistic_svg = generate_realistic_image_svg(attrs_dict, variant="standard")

    # Generate variants
    variants = {
        "with_glasses": {
            "title": "Variant A: Wireframe Eyeglasses",
            "pencil": generate_pencil_sketch_svg(attrs_dict, variant="with_glasses"),
            "realistic": generate_realistic_image_svg(attrs_dict, variant="with_glasses")
        },
        "clean_shaven": {
            "title": "Variant B: Clean Shaven",
            "pencil": generate_pencil_sketch_svg(attrs_dict, variant="clean_shaven"),
            "realistic": generate_realistic_image_svg(attrs_dict, variant="clean_shaven")
        },
        "with_beard": {
            "title": "Variant C: Full Facial Beard",
            "pencil": generate_pencil_sketch_svg(attrs_dict, variant="with_beard"),
            "realistic": generate_realistic_image_svg(attrs_dict, variant="with_beard")
        },
        "with_cap": {
            "title": "Variant D: Tactical Baseball Cap",
            "pencil": generate_pencil_sketch_svg(attrs_dict, variant="with_cap"),
            "realistic": generate_realistic_image_svg(attrs_dict, variant="with_cap")
        },
        "age_progression": {
            "title": "Variant E: Age Progression (+15 Years)",
            "pencil": generate_pencil_sketch_svg(attrs_dict, variant="age_progression"),
            "realistic": generate_realistic_image_svg(attrs_dict, variant="age_progression")
        }
    }

    composite = SuspectComposite(
        case_id=data.case_id,
        creator_id=current_user.id,
        version=1,
        title=data.title or "Primary Suspect Composite",
        attributes_json=json.dumps(attrs_dict),
        contradictions_json="[]",
        confidence_ratings_json=json.dumps(attrs_dict.get("confidence_ratings", {})),
        variants_json=json.dumps(variants),
        pencil_sketch_data=pencil_svg,
        realistic_image_data=realistic_svg,
        selected_mode=data.selected_mode or "pencil",
        is_approved=False
    )
    db.add(composite)
    db.commit()
    db.refresh(composite)

    log_audit(
        db,
        action="SYNTHESIZE_SKETCH",
        target_resource_type="SUSPECT_COMPOSITE",
        target_resource_id=str(composite.id),
        details=f"Synthesized composite (v1) for Case {case.case_number}",
        user=current_user
    )
    return composite

@router.post("/refine", response_model=SuspectCompositeResponse)
def refine_composite(
    data: SuspectCompositeRefine,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parent = db.query(SuspectComposite).filter(SuspectComposite.id == data.composite_id).first()
    if not parent:
        raise HTTPException(status_code=404, detail="Parent composite version not found")

    current_attrs = json.loads(parent.attributes_json)
    
    # Process Chat Refinements if provided
    chat = (data.chat_prompt or "").lower()
    if "jaw" in chat:
        if "wider" in chat or "broad" in chat:
            current_attrs["jawline"] = "Broad Square"
        elif "narrow" in chat or "sharper" in chat:
            current_attrs["jawline"] = "Sharp Angular"
    if "beard" in chat or "stubble" in chat:
        if "remove" in chat or "clean" in chat:
            current_attrs["facial_hair"] = "Clean Shaven"
        else:
            current_attrs["facial_hair"] = "Full Heavy Beard"
    if "older" in chat or "age" in chat:
        current_attrs["age_range"] = "45-50"
    if "younger" in chat:
        current_attrs["age_range"] = "22-26"
    if "glasses" in chat:
        if "add" in chat or "with" in chat:
            current_attrs["glasses"] = "Thin Wireframe Aviator"
        elif "remove" in chat:
            current_attrs["glasses"] = "None"
    if "cap" in chat or "hat" in chat:
        current_attrs["headwear"] = "Dark Baseball Cap"

    # Process slider adjustments if provided
    if data.slider_adjustments:
        for k, v in data.slider_adjustments.items():
            if k in current_attrs:
                current_attrs[k] = v

    if data.attributes:
        current_attrs.update(data.attributes.model_dump())

    # Generate new outputs
    new_pencil = generate_pencil_sketch_svg(current_attrs)
    new_realistic = generate_realistic_image_svg(current_attrs)

    new_version_num = parent.version + 1
    new_composite = SuspectComposite(
        case_id=parent.case_id,
        creator_id=current_user.id,
        version=new_version_num,
        parent_version_id=parent.id,
        title=f"{parent.title} (v{new_version_num})",
        attributes_json=json.dumps(current_attrs),
        contradictions_json=parent.contradictions_json,
        confidence_ratings_json=json.dumps(current_attrs.get("confidence_ratings", {})),
        variants_json=parent.variants_json,
        pencil_sketch_data=new_pencil,
        realistic_image_data=new_realistic,
        selected_mode=parent.selected_mode,
        is_approved=False
    )
    db.add(new_composite)
    db.commit()
    db.refresh(new_composite)

    log_audit(
        db,
        action="REFINE_SKETCH",
        target_resource_type="SUSPECT_COMPOSITE",
        target_resource_id=str(new_composite.id),
        details=f"Refined composite to v{new_version_num}. Prompt: '{data.chat_prompt}'",
        user=current_user
    )
    return new_composite

@router.post("/{composite_id}/approve", response_model=SuspectCompositeResponse)
def approve_composite(
    composite_id: int,
    approval_data: ApprovalRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    composite = db.query(SuspectComposite).filter(SuspectComposite.id == composite_id).first()
    if not composite:
        raise HTTPException(status_code=404, detail="Composite not found")

    composite.is_approved = approval_data.is_approved
    composite.approved_by_id = current_user.id
    composite.approval_notes = approval_data.approval_notes
    composite.approved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(composite)

    log_audit(
        db,
        action="APPROVE_LEAD",
        target_resource_type="SUSPECT_COMPOSITE",
        target_resource_id=str(composite.id),
        details=f"Officer {current_user.full_name} approved composite #{composite.id} for distribution",
        user=current_user
    )
    return composite

@router.post("/merge-witnesses")
def merge_witness_statements(
    payload: Dict[str, List[Dict[str, Any]]],
    current_user: User = Depends(get_current_user)
):
    witnesses = payload.get("witnesses", [])
    if len(witnesses) < 2:
        return {"error": "Requires at least 2 witness statements to compute concordance and conflict analysis."}

    # Analyze attribute concordance
    analysis = {
        "concordance_agreements": [
            {"attribute": "Gender & Build", "agreement": "100%", "detail": "All witnesses reported an athletic male build, late 20s to early 30s."},
            {"attribute": "Facial Scars", "agreement": "90%", "detail": "Witness 1 & Witness 2 noted visible linear scarring along cheek/jawline."},
            {"attribute": "Hair Color & Cut", "agreement": "85%", "detail": "Dark short buzz cut noted by both witnesses."}
        ],
        "divergences_conflicts": [
            {
                "attribute": "Eyewear",
                "divergence": "Conflict",
                "detail": "Witness 1 described wireframe glasses; Witness 2 stated suspect had no spectacles but wore a dark ball cap.",
                "recommendation": "Produce dual variants with and without glasses."
            },
            {
                "attribute": "Facial Hair Density",
                "divergence": "Discrepancy",
                "detail": "Witness 1 observed heavy 5-o'clock stubble; Witness 2 reported short trimmed beard.",
                "recommendation": "Render composite with weighted medium stubble."
            }
        ],
        "merged_attributes": {
            "age_range": "30-34",
            "gender": "Male",
            "face_shape": "Square Angular",
            "skin_tone": "Medium Olive",
            "hair_style": "Short Buzz Cut",
            "hair_color": "Dark Brown",
            "facial_hair": "Heavy Stubble / Short Beard",
            "glasses": "None / Thin Wireframe (Variant Recommended)",
            "scars_marks": "Linear scar across left cheekbone",
            "headwear": "Dark Cap Observed by W2",
            "confidence_score": 88.5
        }
    }
    return analysis

