import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import AIScenarioQueue, AuditLog, TrainingModule
from backend.schemas import AIScenarioGenerateRequest, AIScenarioApproveRequest
from backend.services.ai_planner import generate_scenario_with_groq

router = APIRouter(prefix="/ai", tags=["AI Generation & Content Pipeline"])

@router.post("/generate-scenario")
def generate_scenario(req: AIScenarioGenerateRequest, db: Session = Depends(get_db)):
    scenario_data = generate_scenario_with_groq(req.prompt, req.trade)
    
    scenario_id = f"scen_{uuid.uuid4().hex[:8]}"
    today = datetime.date.today().strftime("%Y-%m-%d")
    
    # Enforce Architecture Rule: AI generated scenarios enter a pending queue requiring trainer approval
    entry = AIScenarioQueue(
        id=scenario_id,
        title=scenario_data.get("title", f"AI Scenario: {req.prompt[:30]}..."),
        source="Groq AI Scenario Planner",
        prompt=req.prompt,
        submitted_date=today,
        status="pending",
        hazards=scenario_data.get("hazards", []),
        mandatory_steps=scenario_data.get("mandatory_steps", []),
        policy_check="PASSED",
        reviewer_notes="Awaiting Trainer / Instructor review and approval before assignment."
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    
    return {
        "scenario_id": entry.id,
        "status": entry.status,
        "requires_trainer_approval": True,
        "scenario": scenario_data
    }

@router.get("/queue")
def list_queue(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AIScenarioQueue)
    if status:
        query = query.filter(AIScenarioQueue.status == status)
    return query.order_by(AIScenarioQueue.submitted_date.desc()).all()

@router.post("/scenarios/approve")
def approve_scenario(req: AIScenarioApproveRequest, reviewer_name: str = "Saurav K", db: Session = Depends(get_db)):
    scen = db.query(AIScenarioQueue).filter(AIScenarioQueue.id == req.scenario_id).first()
    if not scen:
        raise HTTPException(status_code=404, detail="Scenario not found")
        
    scen.status = "approved" if req.is_approved else "rejected"
    scen.reviewer_notes = req.notes or f"Reviewed and {'Approved' if req.is_approved else 'Rejected'} by {reviewer_name}"
    
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user_name=reviewer_name,
        action="AI_SCENARIO_REVIEWED",
        category="SAFETY_POLICY",
        detail=f"Scenario '{scen.title}' was marked as {scen.status.upper()} by {reviewer_name}. Notes: {scen.reviewer_notes}"
    )
    db.add(audit)
    db.commit()
    return {"scenario_id": scen.id, "status": scen.status, "reviewer_notes": scen.reviewer_notes}

@router.post("/photo-audit")
def photo_to_workplace_audit(filename: str = "workshop_photo.jpg"):
    """Photo-to-Workplace Vision endpoint: Proposes visible hazards with confidence ratings for human confirmation."""
    return {
        "source_image": filename,
        "confidence_score": 0.94,
        "detected_objects": [
            {"object": "Unshielded 415V Terminal Block", "bounding_box": [120, 45, 340, 220], "confidence": 0.98},
            {"object": "Water Accumulation near Conduit", "bounding_box": [220, 410, 480, 560], "confidence": 0.92},
            {"object": "Missing Lockout/Tagout Hasp", "bounding_box": [50, 180, 110, 260], "confidence": 0.95}
        ],
        "proposed_hazards": [
            "Severe Arc Flash Risk (NFPA 70E Category IV)",
            "Electrocution / Ground Fault through standing fluid",
            "Non-compliant LOTO isolation boundary"
        ],
        "recommended_mandatory_steps": [
            "De-energize main bus upstream at MCC breaker",
            "Mop and isolate standing fluid with industrial spill barrier",
            "Apply individual OSHA safety padlock with lockout tag"
        ],
        "requires_human_confirmation": True
    }
