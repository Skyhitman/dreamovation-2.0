import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from backend.database import Base

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    accreditation_body = Column(String(255), default="National Skill Development Corporation (NSDC) / NCVET")
    accreditation_id = Column(String(100), default="NSDC-IND-COE-882")
    license_tier = Column(String(255), default="Enterprise Vocational")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="institution")

class User(Base):
    __tablename__ = "users"
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_sub = Column(String(100), unique=True, nullable=True, index=True)  # Google OAuth2 subject ID
    avatar_url = Column(String(500), nullable=True)  # Google profile picture URL
    password_hash = Column(String(255), nullable=True)  # Secure password hash
    role = Column(String(20), default="learner")  # learner, trainer, admin
    batch = Column(String(100), default="Industrial Electrical Batch A-24")
    trainee_id = Column(String(50), index=True, default="NSDC-VR-84920")
    institution_id = Column(String(50), ForeignKey("institutions.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    institution = relationship("Institution", back_populates="users")
    sessions = relationship("TrainingSession", back_populates="learner")

class TrainingModule(Base):
    __tablename__ = "training_modules"
    id = Column(String(50), primary_key=True, index=True)  # elec, weld, con, aut, mac, emr
    title = Column(String(150), nullable=False)
    trade = Column(String(100), default="Electrical & Industrial Safety")
    icon = Column(String(10), default="⚡")
    description = Column(Text)
    required_ppe = Column(JSON, default=list)
    hazards = Column(JSON, default=list)
    steps = Column(JSON, default=list)
    is_approved = Column(Boolean, default=True)
    version = Column(String(20), default="1.0.0")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    module_id = Column(String(50), ForeignKey("training_modules.id"))
    batch = Column(String(100), nullable=False)
    instructor_name = Column(String(150), default="Saurav K")
    assigned_date = Column(String(30))
    due_date = Column(String(30))
    time_limit_mins = Column(Integer, default=15)
    pass_criteria = Column(Integer, default=85)
    max_attempts = Column(Integer, default=3)
    mandatory_steps = Column(JSON, default=list)
    critical_safety_gate = Column(Boolean, default=True)
    status = Column(String(20), default="in_progress")
    description = Column(Text)

class TrainingSession(Base):
    __tablename__ = "training_sessions"
    id = Column(String(50), primary_key=True, index=True)
    learner_id = Column(String(50), ForeignKey("users.id"))
    module_id = Column(String(50))
    assignment_id = Column(String(50), nullable=True)
    date_str = Column(String(30))
    score = Column(Integer, default=0)
    safety_score = Column(Integer, default=0)
    procedure_score = Column(Integer, default=0)
    hazard_score = Column(Integer, default=0)
    task_completion = Column(Integer, default=0)
    time_efficiency = Column(Integer, default=0)
    duration_secs = Column(Integer, default=0)
    mistakes = Column(JSON, default=list)
    critical_gate_passed = Column(Boolean, default=True)
    telemetry_events = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    learner = relationship("User", back_populates="sessions")

class SkillPassport(Base):
    __tablename__ = "skill_passports"
    id = Column(String(50), primary_key=True, index=True)
    trainee_id = Column(String(50), index=True)
    full_name = Column(String(150))
    institution = Column(String(255))
    batch = Column(String(100))
    council = Column(String(255), default="National Skill Development Corporation (NSDC) & NCVET")
    issued_date = Column(String(30))
    verified_by = Column(String(150))
    verification_hash = Column(String(100))
    status = Column(String(20), default="VERIFIED")

    competencies = relationship("Competency", back_populates="passport")

class Competency(Base):
    __tablename__ = "competencies"
    id = Column(String(50), primary_key=True, index=True)
    passport_id = Column(String(50), ForeignKey("skill_passports.id"))
    code = Column(String(50), index=True)
    title = Column(String(200))
    standard = Column(String(200))
    level = Column(String(50))
    status = Column(String(20), default="VERIFIED")
    verified_date = Column(String(30), nullable=True)
    certifier = Column(String(150), nullable=True)
    evidence = Column(Text, nullable=True)

    passport = relationship("SkillPassport", back_populates="competencies")

class AIScenarioQueue(Base):
    __tablename__ = "ai_scenario_queue"
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255))
    source = Column(String(50), default="Groq AI Scenario Planner")
    prompt = Column(Text)
    submitted_date = Column(String(30))
    status = Column(String(20), default="pending")  # pending, approved, rejected
    hazards = Column(JSON, default=list)
    mandatory_steps = Column(JSON, default=list)
    policy_check = Column(String(255), default="PASSED")
    reviewer_notes = Column(Text, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String(30))
    user_name = Column(String(150))
    action = Column(String(100))
    category = Column(String(50))
    detail = Column(Text)
