import json
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.case import Case
from ..models.sketch import SuspectComposite
from ..models.user import User
from ..services.auth_service import get_current_user
from ..services.audit_service import log_audit
from ..services.pdf_export import generate_case_dossier_pdf

router = APIRouter(prefix="/api/reports", tags=["Reports & Dossier Export"])

@router.get("/pdf/{case_id}")
def export_case_pdf(
    case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case file not found")

    composite = db.query(SuspectComposite).filter(SuspectComposite.case_id == case_id).order_by(SuspectComposite.version.desc()).first()

    case_dict = {
        "case_number": case.case_number,
        "title": case.title,
        "description": case.description,
        "incident_type": case.incident_type,
        "location": case.location,
        "priority": case.priority,
        "status": case.status,
        "assigned_officer_name": f"{current_user.full_name} [Badge #{current_user.badge_number}]"
    }

    comp_dict = None
    if composite:
        comp_dict = {
            "title": composite.title,
            "version": composite.version,
            "is_approved": composite.is_approved,
            "attributes": json.loads(composite.attributes_json) if composite.attributes_json else {}
        }

    pdf_bytes = generate_case_dossier_pdf(case_dict, comp_dict)

    log_audit(
        db,
        action="EXPORT_DOSSIER_PDF",
        target_resource_type="CASE_DOSSIER",
        target_resource_id=str(case.id),
        details=f"Officer {current_user.full_name} exported official dossier PDF for Case {case.case_number}",
        user=current_user
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=SKETCHFORCE_{case.case_number}_Dossier.pdf"
        }
    )

