from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models.user import User, UserRole
from ..schemas.auth import UserCreate, UserLogin, UserResponse, Token
from ..services.auth_service import verify_password, get_password_hash, create_access_token, get_current_user
from ..services.audit_service import log_audit

router = APIRouter(prefix="/api/auth", tags=["Authentication & Access Control"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Officer email already registered in system")
    
    badge_existing = db.query(User).filter(User.badge_number == user_data.badge_number).first()
    if badge_existing:
        raise HTTPException(status_code=400, detail="Badge number already in service")

    hashed_pw = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        hashed_password=hashed_pw,
        full_name=user_data.full_name,
        badge_number=user_data.badge_number,
        department=user_data.department or "Metro Police - Forensic Division",
        role=user_data.role or UserRole.INVESTIGATOR.value
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    log_audit(db, action="USER_REGISTERED", target_resource_type="USER", target_resource_id=str(user.id), details=f"New user registered: {user.full_name} ({user.role})", user=user)
    return user

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid official credentials or unauthorized terminal attempt"
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Officer account suspended or inactive")

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "name": user.full_name}
    )
    log_audit(db, action="USER_LOGIN", target_resource_type="USER", target_resource_id=str(user.id), details=f"Officer {user.full_name} authenticated", user=user)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

