from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class FacialAttributes(BaseModel):
    age_range: Optional[str] = "30-35"
    gender: Optional[str] = "Male"
    face_shape: Optional[str] = "Oval" # Oval, Square, Round, Heart, Oblong
    skin_tone: Optional[str] = "Medium Olive"
    eye_shape: Optional[str] = "Almond"
    eye_color: Optional[str] = "Dark Brown"
    eyebrows: Optional[str] = "Thick Arched"
    nose_shape: Optional[str] = "Aquiline / Straight"
    lip_shape: Optional[str] = "Medium Thin"
    jawline: Optional[str] = "Defined Square"
    hair_style: Optional[str] = "Short Crop Buzz"
    hair_color: Optional[str] = "Black"
    facial_hair: Optional[str] = "Heavy Stubble"
    glasses: Optional[str] = "None"
    scars_marks: Optional[str] = "Scar across left cheek"
    headwear: Optional[str] = "None"
    clothing: Optional[str] = "Dark Hooded Jacket"
    confidence_ratings: Optional[Dict[str, int]] = {} # e.g. {"jawline": 95, "hair": 70}

class CandidateFace(BaseModel):
    id: str
    label: str
    pencil_sketch_data: str
    realistic_image_data: str
    similarity_score: float
    description: str
    image_url: Optional[str] = None

class SuspectCompositeCreate(BaseModel):
    case_id: int
    title: Optional[str] = "Primary Suspect Composite"
    narrative: Optional[str] = None
    attributes: FacialAttributes
    selected_mode: Optional[str] = "pencil"
    time_critical: Optional[bool] = False

class SuspectCompositeRefine(BaseModel):
    composite_id: int
    chat_prompt: Optional[str] = None # e.g. "make jaw wider, add 5 years"
    slider_adjustments: Optional[Dict[str, Any]] = None
    attributes: Optional[FacialAttributes] = None

class ApprovalRequest(BaseModel):
    approval_notes: Optional[str] = "Official forensic composite reviewed and approved for law enforcement distribution."
    is_approved: bool = True

class SuspectCompositeResponse(BaseModel):
    id: int
    case_id: int
    creator_id: Optional[int]
    version: int
    parent_version_id: Optional[int]
    title: str
    attributes_json: str
    contradictions_json: str
    confidence_ratings_json: str
    variants_json: str
    pencil_sketch_data: str
    realistic_image_data: str
    selected_mode: str
    is_approved: bool
    approved_by_id: Optional[int]
    approval_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CrimeSceneSketchCreate(BaseModel):
    case_id: int
    title: Optional[str] = "Scene Diagram"
    location_type: Optional[str] = "Indoor - Commercial"
    room_layout: Optional[str] = "Open Plan Vault"
    lighting: Optional[str] = "Dim Artificial"
    time_of_day: Optional[str] = "Night 02:40 AM"
    narrative: Optional[str] = None
    markers: Optional[List[Dict[str, Any]]] = []
    measurements: Optional[List[Dict[str, Any]]] = []

class CrimeSceneSketchResponse(BaseModel):
    id: int
    case_id: int
    creator_id: Optional[int]
    title: str
    location_type: str
    room_layout: str
    lighting: str
    time_of_day: str
    narrative: Optional[str]
    markers_json: str
    measurements_json: str
    technical_plan_data: str
    realistic_render_data: str
    selected_mode: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

