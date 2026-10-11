"""
Google OAuth2 Authentication & JWT Session Management Service.
Verifies Google ID tokens, manages user registration, and issues platform JWTs.
"""

import datetime
import uuid
import jwt
import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import User

logger = logging.getLogger("skillsafe_auth")

# Google OAuth2 Client ID — replace with your actual client ID
GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID if hasattr(settings, 'GOOGLE_CLIENT_ID') else ""

ALGORITHM = "HS256"


def verify_google_token(token: str) -> dict:
    """
    Verify a Google ID token and return the decoded payload.
    Returns user info: { sub, email, name, picture, email_verified }
    """
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
        
        # Verify issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
        
        return {
            "sub": idinfo["sub"],
            "email": idinfo.get("email", ""),
            "name": idinfo.get("name", ""),
            "picture": idinfo.get("picture", ""),
            "email_verified": idinfo.get("email_verified", False)
        }
    except Exception as e:
        logger.error(f"Google token verification failed: {e}")
        raise ValueError(f"Invalid Google token: {e}")


def create_platform_jwt(user_id: str, email: str, role: str, name: str) -> str:
    """Create a platform JWT token for authenticated sessions."""
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "name": name,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_platform_jwt(token: str) -> dict:
    """Decode and verify a platform JWT. Returns payload or raises."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.InvalidTokenError as e:
        raise ValueError(f"Invalid token: {e}")


def get_or_create_user(db: Session, google_info: dict, requested_role: str = None) -> User:
    """
    Find existing user by Google sub ID or email, or create a new one.
    Admins must be pre-registered — new Google sign-ins default to 'learner'.
    """
    role_to_set = requested_role if requested_role in ("learner", "trainer", "admin") else None

    # Try to find by google_sub first
    user = db.query(User).filter(User.google_sub == google_info["sub"]).first()
    if user:
        if role_to_set:
            user.role = role_to_set
        # Update profile picture if changed
        if google_info.get("picture") and user.avatar_url != google_info["picture"]:
            user.avatar_url = google_info["picture"]
        db.commit()
        return user
    
    # Try to find by email (existing user who hasn't linked Google yet)
    user = db.query(User).filter(User.email == google_info["email"]).first()
    if user:
        user.google_sub = google_info["sub"]
        if role_to_set:
            user.role = role_to_set
        user.avatar_url = google_info.get("picture", "")
        db.commit()
        return user
    
    # New user — create with requested role (or learner by default)
    role = role_to_set or "learner"
    new_user = User(
        id=f"u_{uuid.uuid4().hex[:8]}",
        name=google_info["name"],
        email=google_info["email"],
        google_sub=google_info["sub"],
        avatar_url=google_info.get("picture", ""),
        role=role,
        batch="Industrial Electrical Batch A-24" if role == "learner" else ("Faculty - Power Systems" if role == "trainer" else "Administration"),
        trainee_id=f"NSDC-VR-{uuid.uuid4().hex[:5].upper()}",
        institution_id="inst_nsdc"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"New user registered via Google: {new_user.email} (role: {role})")
    return new_user


def verify_request_token(token: str, db: Session) -> User:
    """Verify a request's Bearer token and return the associated user."""
    payload = decode_platform_jwt(token)
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise ValueError("User not found")
    return user
