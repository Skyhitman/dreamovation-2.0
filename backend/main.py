import logging
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.models import Institution, User, TrainingModule, Assignment, AuditLog
from backend.routers import auth, modules, assignments, sessions, passports, ai, audit

logger = logging.getLogger("skillsafe_api")
logging.basicConfig(level=logging.INFO)

# Create database tables (PostgreSQL or SQLite fallback)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AR/VR Vocational Training, AI Scenario Generation, Safety Assessment & Skill Passport Backend API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(modules.router, prefix=settings.API_V1_STR)
app.include_router(assignments.router, prefix=settings.API_V1_STR)
app.include_router(sessions.router, prefix=settings.API_V1_STR)
app.include_router(passports.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_seed_data():
    """Seed initial records if database is empty."""
    db = SessionLocal()
    try:
        # Check institution
        inst = db.query(Institution).filter(Institution.id == "inst_nsdc").first()
        if not inst:
            inst = Institution(
                id="inst_nsdc",
                name="Rajalakshmi Engineering College (REC)",
                accreditation_body="Autonomous Institution · Affiliated to Anna University",
                accreditation_id="REC-AUT-2024",
                license_tier="Center for Applied Engineering & Vocational Excellence"
            )
            db.add(inst)
            db.commit()

        # Check default users
        user_count = db.query(User).count()
        if user_count == 0:
            users = [
                User(id="u_trainer_saurav", name="Saurav K", email="saurav.k.2024.ece@rajalakshmi.edu.in", role="trainer", batch="Electrical & Electronics Engineering", trainee_id="REC-TR-2024", institution_id="inst_nsdc"),
                User(id="u_admin_sami", name="Sami Sauravanu", email="samisauravanu@gmail.com", role="admin", batch="Institutional Governance", trainee_id="ADM-GLOBAL-01", institution_id="inst_nsdc")
            ]
            db.add_all(users)
            db.commit()

        # Check training modules
        if db.query(TrainingModule).count() == 0:
            mods = [
                TrainingModule(
                    id="elec",
                    title="Electrical Safety & Switchgear Maintenance",
                    trade="Electrical & Industrial Safety",
                    icon="⚡",
                    description="415V 3-phase switchgear isolation, zero-energy state verification, and arc-flash prevention protocols.",
                    required_ppe=["Safety Helmet", "Insulated Gloves (1000V)", "Safety Goggles"],
                    hazards=["Arc Flash", "Live High Voltage", "Thermal Burn"],
                    steps=["Hazard Recognition", "PPE Donning", "Breaker Isolation", "Zero-Voltage Probing", "Maintenance", "Inspection", "Restoration"],
                    is_approved=True,
                    version="1.0.0"
                ),
                TrainingModule(
                    id="weld",
                    title="Welding Safety & GMAW Hot-Work",
                    trade="Mechanical & Fabrication",
                    icon="🔥",
                    description="Hot-work perimeter clearance, mechanical fume ventilation, ground clamping, and WPS-compliant arc welding.",
                    required_ppe=["Welding Helmet (Shade 10+)", "Split-Leather Gloves", "Flame-Resistant Apron"],
                    hazards=["Optical Arc Radiation", "Toxic Metal Fumes", "Combustible Fire Ignition"],
                    steps=["Hot-Work Warning", "PPE Donning", "Perimeter Clear", "Fire Extinguisher Check", "Ventilation On", "Ground Clamp", "WPS Welding", "Cooling"],
                    is_approved=True,
                    version="1.0.0"
                )
            ]
            db.add_all(mods)
            db.commit()

        # Check default assignments
        asgn_count = db.query(Assignment).count()
        if asgn_count == 0:
            today = datetime.date.today().strftime("%Y-%m-%d")
            asgns = [
                Assignment(
                    id="asgn_01",
                    title="Lockout / Tagout (LOTO) & Multimeter Isolation Test",
                    module_id="elec",
                    batch="Industrial Electrical Batch A-24",
                    instructor_name="Saurav K",
                    assigned_date=today,
                    due_date="2026-10-25",
                    time_limit_mins=15,
                    pass_criteria=85,
                    max_attempts=3,
                    mandatory_steps=["Don PPE", "Open Switchgear", "Isolate Main Breaker", "Apply LOTO Padlock", "Test Zero Voltage"],
                    critical_safety_gate=True,
                    status="in_progress",
                    description="Perform standard high-voltage 415V switchgear isolation and apply OSHA compliant lockout/tagout."
                ),
                Assignment(
                    id="asgn_02",
                    title="GMAW 3G Vertical-Up Root Pass Compliance",
                    module_id="weld",
                    batch="Industrial Electrical Batch A-24",
                    instructor_name="Saurav K",
                    assigned_date=today,
                    due_date="2026-10-28",
                    time_limit_mins=20,
                    pass_criteria=80,
                    max_attempts=2,
                    mandatory_steps=["Check Gas Regulator", "Attach Ground Clamp", "Set Wire Speed", "Execute 3G Root Pass"],
                    critical_safety_gate=True,
                    status="in_progress",
                    description="Complete structural welding root pass meeting AWS D1.1 visual inspection tolerances."
                )
            ]
            db.add_all(asgns)
            db.commit()

        # Check initial audit log
        if db.query(AuditLog).count() == 0:
            audit = AuditLog(
                timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                user_name="System Initializer",
                action="PLATFORM_INITIALIZATION",
                category="SYSTEM",
                detail="SkillSafe VR Core Backend and PostgreSQL schemas initialized successfully."
            )
            db.add(audit)
            db.commit()
            
        logger.info("Database startup and seed verification complete.")
    except Exception as e:
        logger.error(f"Error during startup seeding: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "database": "PostgreSQL (with seamless SQLite fallback)",
        "status": "OPERATIONAL"
    }

@app.get("/health")
def health():
    return {"status": "HEALTHY", "timestamp": datetime.datetime.utcnow().isoformat()}
