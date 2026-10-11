from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import TrainingModule

router = APIRouter(prefix="/modules", tags=["Module & Content Catalogue"])

@router.get("")
def list_modules(db: Session = Depends(get_db)):
    modules = db.query(TrainingModule).all()
    if not modules:
        # Seed default modules
        defaults = [
            TrainingModule(
                id="elec",
                title="Industrial Electrical Switchgear & LOTO",
                trade="Electrical Engineering",
                icon="⚡",
                description="High-voltage switchgear isolation, lockout/tagout, test-before-touch with multimeter, and busbar inspection.",
                required_ppe=["Arc Flash Suit 40 cal/cm²", "Class 4 Insulated Gloves", "Dielectric Face Shield"],
                hazards=["415V Arc Flash", "Residual Capacitance", "Unverified Breaker Trip"],
                steps=["Don PPE", "Isolate Main Breaker", "Apply LOTO Padlock", "Verify Zero Energy with Multimeter", "Rack Out Breaker"]
            ),
            TrainingModule(
                id="weld",
                title="GMAW Robotic & Manual Welding Safety",
                trade="Manufacturing & Fabrication",
                icon="🔥",
                description="Gas metal arc welding operation, shielding gas regulation, flash protection, and thermal heat management.",
                required_ppe=["Auto-Darkening Helmet DIN 11", "Leather Welding Jacket", "Split-Cowhide Gauntlets"],
                hazards=["Ultraviolet Radiation", "Argon/CO2 Gas Asphyxiation", "Combustible Slag Spatter"],
                steps=["Inspect Cylinder Pressure", "Set Flow Meter to 15 CFH", "Attach Ground Clamp", "Purge Torch Nozzle", "Perform Test Bead"]
            ),
            TrainingModule(
                id="con",
                title="Heavy Scaffold & Fall Protection",
                trade="Construction & Infrastructure",
                icon="🏗️",
                description="Scaffold pre-inspection, 100% tie-off compliance, dual-lanyard shock absorber connection, and drop-zone perimeter.",
                required_ppe=["Full Body Safety Harness", "Hard Hat with 4-Point Chin Strap", "Steel-Toe Boots with Metatarsal Guard"],
                hazards=["Fall from Height", "Unsecured Toe-Boards", "Overhead Crane Suspended Load"],
                steps=["Inspect Webbing & D-Rings", "Verify Scaffold Green Tag", "Connect Lanyard Anchor", "Maintain 3-Point Contact"]
            ),
            TrainingModule(
                id="aut",
                title="Electric Vehicle HV Battery Pack Service",
                trade="Automotive Technology",
                icon="🚗",
                description="800V DC electric vehicle traction battery safety disconnect, service plug removal, insulation resistance testing.",
                required_ppe=["1000V Insulated Gloves", "Safety Goggles", "Dielectric Mat"],
                hazards=["800V DC Shock", "Thermal Runaway", "HF Electrolyte Off-Gassing"],
                steps=["Remove 12V Aux Battery", "Extract Manual Service Disconnect", "Wait 10-Minute Capacitor Bleed", "Measure Zero Volts"]
            ),
            TrainingModule(
                id="mac",
                title="5-Axis CNC Milling Center & E-Stop",
                trade="Precision Machining",
                icon="⚙️",
                description="Spindle interlock bypass prevention, toolholder clamping verification, chip conveyor safety, and emergency cycle interruption.",
                required_ppe=["Safety Glasses with Side Shields", "Hearing Protection", "Close-Fitting Lab Coat"],
                hazards=["High-Speed Flying Swarf", "Entanglement with Rotating Tool", "Hydraulic Chuck Clamp Loss"],
                steps=["Clear Enclosure Perimeter", "Verify Interlock Safety Switch", "Zero Coordinate Calibration", "Engage E-Stop Test"]
            ),
            TrainingModule(
                id="emr",
                title="Workplace Shock & Chemical Spill Emergency",
                trade="Emergency Response",
                icon="🚨",
                description="Electrical shock victim extraction using rescue hook, AED deployment, SDS protocol lookup, and chemical neutralizing barrier.",
                required_ppe=["Non-Conductive Rescue Hook", "Chemical Resistant Nitrile Apron", "Full Face Respirator"],
                hazards=["Live Electrified Casualty", "Toxic Vapor Inhalation", "Secondary Chemical Splash"],
                steps=["Isolate Main Power Supply", "Deploy Insulated Rescue Hook", "Call 112 Emergency Dispatch", "Attach AED Pads"]
            )
        ]
        db.add_all(defaults)
        db.commit()
        modules = db.query(TrainingModule).all()
    return modules
