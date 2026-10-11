import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Assignment, AuditLog
from backend.schemas import AssignmentCreate, AssignmentResponse

router = APIRouter(prefix="/assignments", tags=["Assignment Builder"])

@router.get("", response_model=List[AssignmentResponse])
def list_assignments(
    batch: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)
    if batch:
        query = query.filter(Assignment.batch == batch)
    if status:
        query = query.filter(Assignment.status == status)
    return query.all()

@router.post("", response_model=AssignmentResponse)
def create_assignment(
    req: AssignmentCreate,
    instructor_name: str = "Saurav K",
    db: Session = Depends(get_db)
):
    assignment_id = f"asgn_{uuid.uuid4().hex[:8]}"
    today = datetime.date.today().strftime("%Y-%m-%d")
    new_asgn = Assignment(
        id=assignment_id,
        title=req.title,
        module_id=req.module_id,
        batch=req.batch,
        instructor_name=instructor_name,
        assigned_date=today,
        due_date=req.due_date,
        time_limit_mins=req.time_limit_mins,
        pass_criteria=req.pass_criteria,
        max_attempts=req.max_attempts,
        mandatory_steps=req.mandatory_steps,
        critical_safety_gate=req.critical_safety_gate,
        status="in_progress",
        description=req.description or f"Official Vocational Assignment: {req.title}"
    )
    db.add(new_asgn)
    
    # Audit log
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user_name=instructor_name,
        action="ASSIGNMENT_CREATED",
        category="CURRICULUM",
        detail=f"Created assignment '{req.title}' for batch '{req.batch}' with pass criteria {req.pass_criteria}%"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_asgn)
    return new_asgn

@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str, db: Session = Depends(get_db)):
    asgn = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not asgn:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return asgn

@router.put("/{assignment_id}/status")
def update_status(assignment_id: str, status: str, db: Session = Depends(get_db)):
    asgn = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not asgn:
        raise HTTPException(status_code=404, detail="Assignment not found")
    asgn.status = status
    db.commit()
    return {"id": asgn.id, "status": asgn.status}
