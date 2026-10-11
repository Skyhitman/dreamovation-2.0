"""
Authentication & Authorization Router
- POST /auth/google       — Verify Google ID token, register/login user, return platform JWT
- GET  /auth/me           — Get current authenticated user profile
- POST /auth/role         — Switch user role (admin only)
- GET  /auth/users        — List all users (admin only)
- GET  /auth/institutions — List institutions
- POST /auth/dev-login    — Development-only: login without Google (for local testing)
"""

import uuid
import datetime
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.database import get_db
from backend.models import User, Institution, AuditLog
from backend.schemas import UserProfile, RoleSwitchRequest
from backend.services.auth_service import (
    verify_google_token,
    create_platform_jwt,
    get_or_create_user
)
from backend.dependencies import get_current_user, require_role

router = APIRouter(prefix="/auth", tags=["Identity & Authentication"])


# ---------- Schemas ----------

class GoogleLoginRequest(BaseModel):
    credential: str  # Google ID token from GSI
    requested_role: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    role: Optional[str] = None  # Optional legacy fallback
    name: Optional[str] = None


class DevLoginRequest(BaseModel):
    email: str
    password: Optional[str] = None
    role: Optional[str] = "learner"
    name: Optional[str] = None


class AuthResponse(BaseModel):
    token: str
    user: dict


class RoleAssignRequest(BaseModel):
    user_id: str
    new_role: str  # learner, trainer, admin


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    batch: Optional[str] = "Industrial Electrical & Switchgear Isolation"
    role: Optional[str] = "learner"
    trainee_id: Optional[str] = None


# ---------- Endpoints ----------

@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    New user registration for vocational trainees and learners.
    Faculty and Admin roles require pre-authorization.
    """
    clean_email = req.email.strip().lower()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid institutional or personal email address is required."
        )
    if not req.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required."
        )

    if not req.password or len(req.password.strip()) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long."
        )

    requested_role = (req.role or "learner").strip().lower()
    if requested_role in ("trainer", "admin"):
        if requested_role == "trainer" and clean_email != "saurav.k.2024.ece@rajalakshmi.edu.in":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Trainer registration is restricted. Institutional authorization required."
            )
        if requested_role == "admin" and clean_email != "samisauravanu@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin registration is restricted. Institutional administrator clearance required."
            )
    else:
        requested_role = "learner"

    # Check if already registered
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email '{clean_email}' already exists. Please sign in with your password."
        )

    # Hash password
    pw_hash = hashlib.sha256(req.password.strip().encode("utf-8")).hexdigest()

    new_user = User(
        id=f"u_{uuid.uuid4().hex[:8]}",
        name=req.name.strip(),
        email=clean_email,
        password_hash=pw_hash,
        role=requested_role,
        batch=req.batch or "Vocational Engineering Batch 2024-25",
        trainee_id=req.trainee_id or f"REC-VR-{uuid.uuid4().hex[:5].upper()}",
        institution_id="inst_nsdc"
    )
    db.add(new_user)
    
    # Audit log
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user_name=new_user.name,
        action="USER_REGISTERED",
        category="Identity & Access",
        detail=f"New {requested_role.title()} user registered ({clean_email})"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)

    token = create_platform_jwt(new_user.id, new_user.email, new_user.role, new_user.name)
    return {
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "batch": new_user.batch,
            "trainee_id": new_user.trainee_id,
            "institution_id": new_user.institution_id,
            "avatar_url": ""
        }
    }


@router.post("/google", response_model=AuthResponse)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate via Google Sign-In with role validation and learner auto-enrollment.
    """
    try:
        google_info = verify_google_token(req.credential)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication failed: {e}"
        )
    
    user_email = google_info.get("email", "").strip().lower()
    user_sub = google_info.get("sub", "")

    # Look up registered user by Google Sub or Email
    user = db.query(User).filter(
        (User.google_sub == user_sub) | (User.email == user_email)
    ).first()

    if not user:
        # Check if attempting to enter Trainer or Admin
        req_role = (req.requested_role or "learner").strip().lower()
        if req_role == "trainer":
            if user_email == "saurav.k.2024.ece@rajalakshmi.edu.in":
                user = User(
                    id="u_trainer_saurav",
                    name=google_info.get("name", "Saurav K"),
                    email=user_email,
                    role="trainer",
                    batch="Electrical & Electronics Engineering",
                    trainee_id="REC-TR-2024",
                    institution_id="inst_nsdc",
                    google_sub=user_sub,
                    avatar_url=google_info.get("picture", "")
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access Denied: '{user_email}' is not authorized as Trainer. Designated trainer is saurav.k.2024.ece@rajalakshmi.edu.in."
                )
        elif req_role == "admin":
            if user_email == "samisauravanu@gmail.com":
                user = User(
                    id="u_admin_sami",
                    name=google_info.get("name", "Sami Sauravanu"),
                    email=user_email,
                    role="admin",
                    batch="Institutional Governance",
                    trainee_id="ADM-GLOBAL-01",
                    institution_id="inst_nsdc",
                    google_sub=user_sub,
                    avatar_url=google_info.get("picture", "")
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access Denied: '{user_email}' is not authorized as Admin. Designated admin is samisauravanu@gmail.com."
                )
        else:
            # Auto-register new Google user as Learner
            user = User(
                id=f"u_{uuid.uuid4().hex[:8]}",
                name=google_info.get("name", user_email.split("@")[0].title()),
                email=user_email,
                role="learner",
                batch="Vocational Engineering Batch 2024-25",
                trainee_id=f"REC-VR-{uuid.uuid4().hex[:5].upper()}",
                institution_id="inst_nsdc",
                google_sub=user_sub,
                avatar_url=google_info.get("picture", "")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    
    # Update linked Google profile attributes
    if not user.google_sub:
        user.google_sub = user_sub
    if google_info.get("picture") and getattr(user, 'avatar_url', None) != google_info["picture"]:
        user.avatar_url = google_info["picture"]
    db.commit()
    db.refresh(user)

    # Strict role boundary check: user can only access their authorized portal
    if req.requested_role:
        req_role = req.requested_role.strip().lower()
        if user.role == "learner" and req_role != "learner":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Account '{user.email}' is registered as a Learner. You are not authorized to access the {req_role.title()} portal."
            )
        if user.role == "trainer" and req_role != "trainer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Account '{user.email}' is registered as a Trainer. You are not authorized to access the {req_role.title()} portal."
            )
        if user.role == "admin" and req_role not in ("admin", "trainer", "learner"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Invalid portal requested."
            )

    token = create_platform_jwt(user.id, user.email, user.role, user.name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "batch": user.batch,
            "trainee_id": user.trainee_id,
            "institution_id": user.institution_id,
            "avatar_url": getattr(user, 'avatar_url', '') or ""
        }
    }


@router.post("/login", response_model=AuthResponse)
@router.post("/dev-login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Standard enterprise user authentication via email & password.
    Automatically retrieves the user's registered role from the database.
    """
    clean_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Account '{clean_email}' not found. Please register or check your email."
        )

    # Password validation
    if user.password_hash:
        if not req.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password is required to sign in."
            )
        hashed_input = hashlib.sha256(req.password.strip().encode("utf-8")).hexdigest()
        if user.password_hash != hashed_input:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password. Please verify and try again."
            )

    # Portal role validation
    if req.role:
        req_role = req.role.strip().lower()
        if user.role != req_role and user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Account '{clean_email}' is registered as {user.role.title()}. You cannot log in through the {req_role.title()} portal."
            )

    token = create_platform_jwt(user.id, user.email, user.role, user.name)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "batch": user.batch,
            "trainee_id": user.trainee_id,
            "institution_id": user.institution_id,
            "avatar_url": getattr(user, 'avatar_url', '') or ""
        }
    }


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "batch": user.batch,
        "trainee_id": user.trainee_id,
        "institution_id": user.institution_id,
        "avatar_url": getattr(user, 'avatar_url', '') or ""
    }


@router.post("/assign-role")
def assign_role(
    req: RoleAssignRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin"))
):
    """Admin-only: assign a role to any user."""
    target = db.query(User).filter(User.id == req.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    
    if req.new_role not in ("learner", "trainer", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    
    target.role = req.new_role
    db.commit()
    return {"status": "success", "user_id": target.id, "new_role": target.role}


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """List all platform users (admin/trainer only)."""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "batch": u.batch,
            "trainee_id": u.trainee_id,
            "institution_id": u.institution_id,
            "avatar_url": getattr(u, 'avatar_url', '') or ""
        }
        for u in users
    ]


@router.get("/institutions")
def get_institutions(db: Session = Depends(get_db)):
    """List registered institutions."""
    institutions = db.query(Institution).all()
    return institutions


# Legacy role switch (kept for backward compatibility with frontend)
@router.post("/role")
def switch_role(req: RoleSwitchRequest, db: Session = Depends(get_db)):
    """
    Legacy role switch endpoint. In production, roles are assigned by admin.
    For dev/demo mode, this still works for quick role switching.
    """
    user = db.query(User).filter(User.role == req.role).first()
    if not user:
        id_map = {
            "learner": ("u_learner_rec", "Vocational Trainee", "trainee@rajalakshmi.edu.in", "REC-VR-001"),
            "trainer": ("u_trainer_saurav", "Saurav K", "saurav.k.2024.ece@rajalakshmi.edu.in", "REC-TR-2024"),
            "admin": ("u_admin_sami", "Sami Sauravanu", "samisauravanu@gmail.com", "ADM-GLOBAL-01")
        }
        uid, default_name, email, tid = id_map.get(
            req.role,
            ("u_" + req.role, req.role.title(), f"{req.role}@skillsafe.edu", "GEN-01")
        )
        user = User(
            id=uid,
            name=req.user_name or default_name,
            email=email,
            role=req.role,
            batch="Industrial Electrical Batch A-24",
            trainee_id=tid,
            institution_id="inst_nsdc"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate a JWT for the switched role
    token = create_platform_jwt(user.id, user.email, user.role, user.name)
    
    return {
        "status": "success",
        "token": token,
        "current_user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "batch": user.batch,
            "trainee_id": user.trainee_id,
            "institution_id": user.institution_id
        }
    }
