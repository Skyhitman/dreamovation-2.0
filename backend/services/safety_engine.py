import logging
from typing import List, Optional, Dict, Any

logger = logging.getLogger("safety_engine")

CRITICAL_SAFETY_VIOLATIONS = {"iso", "ppe", "arc_touch", "voltage_live_contact", "missing_loto"}

def evaluate_safety_gate(module_id: Optional[str] = None, mistakes: Optional[List[str]] = None, events: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """
    Core Deterministic Safety Gate:
    "The LLM may propose or explain; it never decides whether a learner passes:
    Deterministic rules enforce mandatory procedures and critical safety gates."
    Critical failures cannot be averaged away.
    """
    if mistakes is None:
        mistakes = []
        
    # Check mistakes list for critical violations
    has_critical_failure = any(m.lower() in CRITICAL_SAFETY_VIOLATIONS for m in mistakes)
    critical_detected = [m for m in mistakes if m.lower() in CRITICAL_SAFETY_VIOLATIONS]
    
    # Also scan telemetry events for unsafe actions
    if events:
        for ev in events:
            act = str(ev.get("action", "")).lower()
            outcome = str(ev.get("outcome", "")).lower()
            if "hazard" in outcome or "shock" in outcome or "arc_flash" in outcome:
                has_critical_failure = True
                if act not in critical_detected:
                    critical_detected.append(act)
    
    # Violation point deductions
    deductions = {
        "ppe": 15,
        "iso": 20,
        "zone": 12,
        "tool": 8,
        "seq": 8,
        "fire": 15,
        "vent": 10,
        "arc_touch": 30,
        "voltage_live_contact": 35,
        "missing_loto": 25
    }
    
    total_deduction = sum(deductions.get(m.lower(), 8) for m in mistakes)
    safety_score = max(0, 100 - total_deduction)
    
    feedback = []
    if has_critical_failure:
        feedback.append("CRITICAL SAFETY GATE BREACH: Immediate stop triggered. High hazard potential detected.")
    else:
        feedback.append("Safety procedure adherence within allowable compliance boundary.")
        
    return {
        "gate_passed": not has_critical_failure,
        "critical_gate_passed": not has_critical_failure,
        "safety_score": safety_score,
        "critical_violations": critical_detected,
        "mandatory_remediation_required": has_critical_failure or safety_score < 80,
        "feedback": feedback
    }

evaluate_deterministic_safety_gate = evaluate_safety_gate
