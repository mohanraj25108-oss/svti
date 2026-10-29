from sqlalchemy.orm import Session
from ..models.audit import AuditLog
from ..models.user import User

def log_audit(
    db: Session,
    action: str,
    target_resource_type: str,
    target_resource_id: str = None,
    details: str = None,
    user: User = None,
    ip_address: str = "127.0.0.1"
):
    user_id = user.id if user else None
    user_name = user.full_name if user else "System Automated Agent"
    user_role = user.role if user else "Automated Process"
    
    audit_entry = AuditLog(
        user_id=user_id,
        user_name=user_name,
        user_role=user_role,
        action=action,
        target_resource_type=target_resource_type,
        target_resource_id=str(target_resource_id) if target_resource_id else None,
        details=details,
        ip_address=ip_address
    )
    db.add(audit_entry)
    db.commit()
    return audit_entry

