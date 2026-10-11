import hashlib
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import SkillPassport, Competency, AuditLog, User
from backend.schemas import PassportResponse, CompetencySignRequest

router = APIRouter(prefix="/passports", tags=["Progress & Skill Passport"])

@router.get("/{trainee_id}")
def get_skill_passport(trainee_id: str, db: Session = Depends(get_db)):
    passport = db.query(SkillPassport).filter(SkillPassport.trainee_id == trainee_id).first()
    if not passport:
        # Look up real registered user
        user = db.query(User).filter(User.trainee_id == trainee_id).first()
        user_name = user.name if user else "Vocational Trainee"
        user_batch = user.batch if user else "Engineering Batch 2024-25"

        hash_seed = f"{trainee_id}-{user_name}-REC-{datetime.date.today().year}"
        v_hash = "0x" + hashlib.sha256(hash_seed.encode()).hexdigest()[:24].upper()
        
        passport = SkillPassport(
            id=f"pass_{trainee_id}",
            trainee_id=trainee_id,
            full_name=user_name,
            institution="Rajalakshmi Engineering College (REC)",
            batch=user_batch,
            council="Autonomous Institution · Affiliated to Anna University",
            issued_date="2026-03-15",
            verified_by="Saurav K (Trainer)",
            verification_hash=v_hash,
            status="VERIFIED"
        )
        db.add(passport)
        
        # Real curriculum competency entries (Initial state: pending completion & evaluation)
        default_competencies = [
            ("ELE-VR-01", "Live Voltage Isolation & LOTO Verification", "OSHA 1910.147 / IS 5216", "Level 4 (Autonomous Operator)", "IN_TRAINING", None, None, "Requires 3D Switchgear isolation run with zero arc flash infractions."),
            ("ELE-VR-02", "Arc Flash PPE Category IV Deployment", "NFPA 70E Standard 2024", "Level 4 (Autonomous Operator)", "IN_TRAINING", None, None, "Requires full 40 cal/cm² suit donning and face shield sequence in VR."),
            ("WLD-VR-01", "GMAW Multi-Pass Groove Weld in 3G Position", "AWS D1.1 Structural Welding Code", "Level 3 (Supervised Specialist)", "IN_TRAINING", None, None, "Requires 15 deg electrode angle and bead width compliance in welding bay."),
            ("WLD-VR-02", "Shielding Gas Pre-Flow & Cylinder Safety", "ISO 3834-2 / OSHA 1926.350", "Level 4 (Autonomous Operator)", "IN_TRAINING", None, None, "Requires pre-flow timer calibration and zero-leak cylinder valve verification."),
            ("EMR-VR-01", "Electrical Shock Emergency Response & CPR", "Red Cross Industrial First Aid 2025", "Level 3 (Practitioner)", "IN_TRAINING", None, None, "Requires emergency stop procedure & simulated shock response drill.")
        ]
        for c in default_competencies:
            comp = Competency(
                id=f"comp_{trainee_id}_{c[0]}",
                passport_id=passport.id,
                code=c[0],
                title=c[1],
                standard=c[2],
                level=c[3],
                status=c[4],
                verified_date=c[5],
                certifier=c[6],
                evidence=c[7]
            )
            db.add(comp)
        db.commit()
        db.refresh(passport)

    comps = db.query(Competency).filter(Competency.passport_id == passport.id).all()
    return {
        "trainee_id": passport.trainee_id,
        "full_name": passport.full_name,
        "institution": passport.institution,
        "batch": passport.batch,
        "council": passport.council,
        "issued_date": passport.issued_date,
        "verified_by": passport.verified_by,
        "verification_hash": passport.verification_hash,
        "status": passport.status,
        "competencies": [
            {
                "code": c.code,
                "title": c.title,
                "standard": c.standard,
                "level": c.level,
                "status": c.status,
                "verified_date": c.verified_date,
                "certifier": c.certifier,
                "evidence": c.evidence
            }
            for c in comps
        ]
    }

@router.get("/verify/{verification_hash}")
def verify_passport_by_hash(verification_hash: str, db: Session = Depends(get_db)):
    passport = db.query(SkillPassport).filter(SkillPassport.verification_hash == verification_hash).first()
    if not passport:
        return {
            "valid": False,
            "message": "Invalid or unverified skill passport hash."
        }
    comps = db.query(Competency).filter(Competency.passport_id == passport.id, Competency.status == "VERIFIED").all()
    return {
        "valid": True,
        "passport_id": passport.id,
        "trainee_id": passport.trainee_id,
        "full_name": passport.full_name,
        "institution": passport.institution,
        "council": passport.council,
        "verified_by": passport.verified_by,
        "verification_hash": passport.verification_hash,
        "verified_competencies_count": len(comps),
        "competency_list": [f"{c.code}: {c.title}" for c in comps]
    }

@router.post("/endorse")
def endorse_competency(req: CompetencySignRequest, db: Session = Depends(get_db)):
    passport = db.query(SkillPassport).filter(SkillPassport.trainee_id == req.trainee_id).first()
    if not passport:
        raise HTTPException(status_code=404, detail="Passport not found")
        
    comp = db.query(Competency).filter(Competency.passport_id == passport.id, Competency.code == req.code).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")
        
    today = datetime.date.today().strftime("%Y-%m-%d")
    comp.status = "VERIFIED"
    comp.verified_date = today
    comp.certifier = req.certifier_name
    comp.evidence = f"Endorsed via SkillSafe VR Assessment Audit by {req.certifier_name} on {today}."
    
    # Audit trail
    audit = AuditLog(
        timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        user_name=req.certifier_name,
        action="COMPETENCY_VERIFIED",
        category="GOVERNANCE",
        detail=f"Endorsed competency {req.code} for trainee {req.trainee_id}"
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "code": req.code, "verified_date": today, "certifier": req.certifier_name}
