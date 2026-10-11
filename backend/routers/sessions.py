import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import TrainingSession, User, AuditLog
from backend.schemas import SessionFinish, TelemetryEvent
from backend.services.safety_engine import evaluate_safety_gate

router = APIRouter(prefix="/sessions", tags=["Training Session Orchestrator & Safety Gate"])

@router.get("")
def list_sessions(
    learner_id: Optional[str] = Query(None),
    module_id: Optional[str] = Query(None),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(TrainingSession)
    if learner_id:
        query = query.filter(TrainingSession.learner_id == learner_id)
    if module_id:
        query = query.filter(TrainingSession.module_id == module_id)
    return query.order_by(TrainingSession.created_at.desc()).limit(limit).all()

@router.post("")
def record_session(
    learner_id: str,
    module_id: str,
    data: SessionFinish,
    assignment_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    date_str = datetime.date.today().strftime("%Y-%m-%d")
    
    # Run deterministic safety gate check
    safety_eval = evaluate_safety_gate(
        module_id=module_id,
        mistakes=data.mistakes,
        events=[e.dict() for e in data.telemetry_events]
    )
    
    final_score = data.score
    critical_passed = safety_eval["gate_passed"] and data.critical_gate_passed
    
    if not critical_passed:
        # HARD STOP: Critical safety violations cannot be averaged away
        final_score = min(final_score, 45)
    
    new_sess = TrainingSession(
        id=session_id,
        learner_id=learner_id,
        module_id=module_id,
        assignment_id=assignment_id,
        date_str=date_str,
        score=final_score,
        safety_score=safety_eval["safety_score"],
        procedure_score=data.procedure_score,
        hazard_score=data.hazard_score,
        task_completion=data.task_completion,
        time_efficiency=data.time_efficiency,
        duration_secs=data.duration_secs,
        mistakes=data.mistakes + safety_eval["critical_violations"],
        critical_gate_passed=critical_passed,
        telemetry_events=[e.dict() for e in data.telemetry_events],
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_sess)
    
    # Log to audit trail
    learner = db.query(User).filter(User.id == learner_id).first()
    learner_name = learner.name if learner else learner_id
    
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user_name=learner_name,
        action="SIMULATION_SESSION_COMPLETED",
        category="ASSESSMENT",
        detail=f"Completed {module_id} simulation. Score: {final_score}%. Critical Gate: {'PASSED' if critical_passed else 'FAILED HARD GATE'}. Duration: {data.duration_secs}s"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_sess)
    
    return {
        "session_id": new_sess.id,
        "score": new_sess.score,
        "critical_gate_passed": new_sess.critical_gate_passed,
        "safety_feedback": safety_eval["feedback"],
        "violations": new_sess.mistakes
    }

@router.get("/{session_id}")
def get_session_detail(session_id: str, db: Session = Depends(get_db)):
    sess = db.query(TrainingSession).filter(TrainingSession.id == session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess
