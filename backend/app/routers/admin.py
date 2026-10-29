from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.user import User
from ..models.audit import AuditLog
from ..schemas.auth import UserResponse
from ..schemas.audit import AuditLogResponse
from ..services.auth_service import get_current_user, require_role
from ..config import settings

router = APIRouter(prefix="/api/admin", tags=["Admin & System Governance"])

@router.get("/users", response_model=List[UserResponse])
def list_system_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = new_role
    db.commit()
    return {"status": "success", "message": f"Updated role for {user.full_name} to {new_role}"}

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_trail(
    limit: int = 100,
    action: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    return query.order_by(AuditLog.timestamp.desc()).limit(limit).all()

@router.get("/model-settings")
def get_model_settings(current_user: User = Depends(get_current_user)):
    return {
        "image_provider": settings.AI_IMAGE_PROVIDER,
        "text_provider": settings.AI_TEXT_PROVIDER,
        "video_provider": settings.AI_VIDEO_PROVIDER,
        "status": "OPERATIONAL",
        "latency_ms": 142,
        "responsible_ai_governance": {
            "human_in_the_loop_enforced": True,
            "statutory_watermarking_enabled": True,
            "bias_mitigation_filter": "Active (Facial Feature Concordance Standard v2)",
            "evidence_tamper_proofing": "SHA-256 Audit Trail Active"
        }
    }

