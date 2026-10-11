from typing import List, Optional, Any
from pydantic import BaseModel, Field

# Auth & User
class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    batch: str
    trainee_id: str
    institution_id: Optional[str] = None

class RoleSwitchRequest(BaseModel):
    role: str
    user_name: Optional[str] = None

# Assignment
class AssignmentCreate(BaseModel):
    title: str
    module_id: str
    batch: str
    due_date: str
    time_limit_mins: int = 15
    pass_criteria: int = 85
    max_attempts: int = 3
    mandatory_steps: List[str] = []
    critical_safety_gate: bool = True
    description: Optional[str] = None

class AssignmentResponse(AssignmentCreate):
    id: str
    instructor_name: str
    assigned_date: str
    status: str

# Session & Telemetry
class TelemetryEvent(BaseModel):
    timestamp: str
    objectId: str
    action: str
    sequenceStep: Any
    outcome: str
    detail: Optional[str] = ""

class SessionCreate(BaseModel):
    learner_id: str
    module_id: str
    assignment_id: Optional[str] = None

class SessionFinish(BaseModel):
    score: int
    safety_score: int
    procedure_score: int
    hazard_score: int
    task_completion: int
    time_efficiency: int
    duration_secs: int
    mistakes: List[str] = []
    critical_gate_passed: bool = True
    telemetry_events: List[TelemetryEvent] = []

# Skill Passport
class CompetencySignRequest(BaseModel):
    code: str
    trainee_id: str
    certifier_name: str

class CompetencyItem(BaseModel):
    code: str
    title: str
    standard: str
    level: str
    status: str
    verified_date: Optional[str] = None
    certifier: Optional[str] = None
    evidence: Optional[str] = None

class PassportResponse(BaseModel):
    trainee_id: str
    full_name: str
    institution: str
    batch: str
    council: str
    issued_date: str
    verified_by: str
    verification_hash: str
    status: str
    competencies: List[CompetencyItem] = []

# AI Scenario
class AIScenarioGenerateRequest(BaseModel):
    prompt: str
    trade: Optional[str] = "industrial"

class AIScenarioApproveRequest(BaseModel):
    scenario_id: str
    is_approved: bool
    notes: Optional[str] = None
