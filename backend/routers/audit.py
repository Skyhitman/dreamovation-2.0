from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import AuditLog

router = APIRouter(prefix="/audit", tags=["Governance & Audit"])

@router.get("/logs")
def get_audit_logs(
    category: Optional[str] = Query(None),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if category:
        query = query.filter(AuditLog.category == category)
    return query.order_by(AuditLog.id.desc()).limit(limit).all()
