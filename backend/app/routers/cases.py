import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.case import Case, CaseTimelineEvent, WitnessStatement
from ..models.user import User
from ..schemas.case import CaseCreate, CaseUpdate, CaseResponse, TimelineEventCreate, TimelineEventResponse, WitnessStatementCreate, WitnessStatementResponse
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit

router = APIRouter(prefix="/api/cases", tags=["Case Management"])

@router.get("", response_model=List[CaseResponse])
def list_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Case)
    if status:
        query = query.filter(Case.status == status)
    if priority:
        query = query.filter(Case.priority == priority)
    if search:
        query = query.filter(
            (Case.case_number.ilike(f"%{search}%")) |
            (Case.title.ilike(f"%{search}%")) |
            (Case.location.ilike(f"%{search}%"))
        )
    return query.order_by(Case.created_at.desc()).all()

@router.post("", response_model=CaseResponse)
def create_case(case_data: CaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Case).filter(Case.case_number == case_data.case_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Case file number already exists in registry")

    new_case = Case(
        case_number=case_data.case_number,
        title=case_data.title,
        description=case_data.description,
        incident_type=case_data.incident_type,
        incident_date=case_data.incident_date,
        location=case_data.location,
        priority=case_data.priority or "HIGH",
        status=case_data.status or "ACTIVE",
        assigned_officer_id=case_data.assigned_officer_id or current_user.id
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    # Automatically add initial case opening event to timeline
    initial_event = CaseTimelineEvent(
        case_id=new_case.id,
        timestamp=new_case.incident_date,
        title="Case File Opened & Registered",
        description=f"Incident registered by {current_user.full_name} [Badge #{current_user.badge_number}]",
        source="Department Registry",
        severity="INFO"
    )
    db.add(initial_event)
    db.commit()
    db.refresh(new_case)

    log_audit(db, action="CREATE_CASE", target_resource_type="CASE", target_resource_id=str(new_case.id), details=f"Opened case {new_case.case_number}: {new_case.title}", user=current_user)
    return new_case

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found in active repository")
    return case

@router.put("/{case_id}", response_model=CaseResponse)
def update_case(case_id: int, update_data: CaseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found")
    
    if update_data.title is not None:
        case.title = update_data.title
    if update_data.description is not None:
        case.description = update_data.description
    if update_data.status is not None:
        case.status = update_data.status
    if update_data.priority is not None:
        case.priority = update_data.priority
    if update_data.assigned_officer_id is not None:
        case.assigned_officer_id = update_data.assigned_officer_id

    db.commit()
    db.refresh(case)
    log_audit(db, action="UPDATE_CASE", target_resource_type="CASE", target_resource_id=str(case.id), details=f"Updated case {case.case_number}", user=current_user)
    return case

@router.post("/{case_id}/timeline", response_model=TimelineEventResponse)
def add_timeline_event(case_id: int, event_data: TimelineEventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    event = CaseTimelineEvent(
        case_id=case_id,
        timestamp=event_data.timestamp,
        title=event_data.title,
        description=event_data.description,
        source=event_data.source or "CCTV / Witness",
        severity=event_data.severity or "INFO"
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    log_audit(db, action="ADD_TIMELINE_EVENT", target_resource_type="CASE_TIMELINE", target_resource_id=str(event.id), details=f"Added timeline event: {event.title}", user=current_user)
    return event

@router.post("/{case_id}/witnesses", response_model=WitnessStatementResponse)
def add_witness_statement(case_id: int, statement_data: WitnessStatementCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    statement = WitnessStatement(
        case_id=case_id,
        witness_name=statement_data.witness_name,
        witness_type=statement_data.witness_type or "Eyewitness",
        raw_narrative=statement_data.raw_narrative,
        extracted_attributes_json=statement_data.extracted_attributes_json or "{}",
        credibility_score=statement_data.credibility_score or 0.85
    )
    db.add(statement)
    db.commit()
    db.refresh(statement)
    log_audit(db, action="ADD_WITNESS_STATEMENT", target_resource_type="WITNESS_STATEMENT", target_resource_id=str(statement.id), details=f"Added witness statement: {statement.witness_name}", user=current_user)
    return statement

