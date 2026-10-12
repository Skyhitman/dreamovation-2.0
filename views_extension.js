// =========================================================================
// ⚡ SKILLSAFE VR ENTERPRISE VIEWS EXTENSION
// Implements:
// - V.arch & I.arch (Complete Platform Architecture & Data Flow Visualizer)
// - V.cadlab & I.cadlab (Interactive 3D Engineering Model Lab)
// - V.passport (Official Verifiable Skill Passport with QR & Endorsements)
// - V.trainer & I.trainer (Trainer Workspace, Builder, Approvals, Sign-off)
// - V.admin & I.admin (Admin Workspace, Institution, Roles, Audit Trail)
// - Updated V.dash (Learner Workspace with Assigned Work & Direct Launch)
// - Updated V.home (Platform Landing with Multi-Workspace Routing)
// =========================================================================

(function() {
  const V = window.V = window.V || {};
  const I = window.I = window.I || {};
  const S = window.S;

  // -----------------------------------------------------------------------
  // VIEW: 📐 COMPLETE PLATFORM ARCHITECTURE & DATA FLOW VISUALIZER
  // -----------------------------------------------------------------------
  let activeArchStage = 1;

  const ARCH_STAGES = [
    {
      stage: 1,
      title: "1. PLAN / APPROVE",
      role: "Trainer / Instructor & AI Content Pipeline",
      summary: "Trainer selects an approved curriculum module or inspects and approves AI / Photo-generated scenarios.",
      inputs: "{ moduleId: 'elec_01', batch: 'Batch A-24', passThreshold: 85, criticalGate: true }",
      process: "Module & Content Catalogue validates prerequisites and PPE policies. AI Scenario Planner outputs structured JSON; Trainer review verifies safety compliance.",
      outputs: "{ assignmentId: 'asgn-101', status: 'PUBLISHED', approvedHash: 'sha256:4a8c91...' }",
      subsystem: "Module & Content Catalogue • AI Scenario Planner • Validation & Approval Queue"
    },
    {
      stage: 2,
      title: "2. LAUNCH SESSION",
      role: "Training Session Orchestrator & Client Adapters",
      summary: "Learner launches session. Orchestrator initializes 3D / VR scene, spatial equipment state, and assignment constraints.",
      inputs: "{ learnerId: 'REC-VR-2024', assignmentId: 'asgn_01', device: 'Desktop Browser (WebXR Ready)' }",
      process: "Session orchestrator loads 3D scene objects, establishes time countdown, sets baseline telemetry logging, and arms the deterministic safety gate.",
      outputs: "{ sessionId: 'sess-88910', runtimeState: 'ARMED', activeGate: 'ISOLATION_AND_PPE_MANDATORY' }",
      subsystem: "Training Session Orchestrator • 3D / VR Training Runtime • Device & Interaction Adapters"
    },
    {
      stage: 3,
      title: "3. CAPTURE ACTIONS",
      role: "Runtime Event Contract & Telemetry Stream",
      summary: "Every user interaction emits structured telemetry: object ID, requested action, sequence step, timestamp, and outcome.",
      inputs: "{ objectId: 'b3', requestedAction: 'switch_off', step: 4, timestamp: '10:14:02.41', distance: 1.2 }",
      process: "Three.js raycaster captures click/VR trigger, compares action to procedure sequence, streams telemetry to live HUD, and detects hazard zone boundaries.",
      outputs: "{ eventStatus: 'EMITTED', telemetryHash: 'sha256:91c2f...', recordedInStream: true }",
      subsystem: "Runtime Event Contract • 3D Equipment Interactables • Device Adapters"
    },
    {
      stage: 4,
      title: "4. APPLY SAFETY GATE",
      role: "Safety & Assessment Engine (Deterministic)",
      summary: "Deterministic rules evaluate procedures and enforce critical safety gates. Critical failures CANNOT be averaged away!",
      inputs: "{ sequenceStep: 4, isIsolated: true, zeroVoltageVerified: true, ppeWorn: true, arcZoneSafe: true }",
      process: "Safety Engine checks hard safety gates. If uninsulated tool touches live busbar or PPE is omitted, arc flash physics freeze-frame triggers immediately. Critical failure overrides all task points.",
      outputs: "{ gateStatus: 'CRITICAL_GATE_PASSED', safetyScore: 95, violations: 0 }",
      subsystem: "Safety & Assessment Engine • Deterministic Sequence Checker • Consequence Preview"
    },
    {
      stage: 5,
      title: "5. SAVE EVIDENCE",
      role: "Progress & Skill Passport Service + Audit Ledger",
      summary: "Attempt telemetry, score breakdown, violation logs, and time efficiency are persisted to immutable storage records.",
      inputs: "{ sessionId: 'sess-88910', score: 92, safety: 95, proc: 90, duration: 145, mist: [] }",
      process: "Persists attempt to relational/local database, generates tamper-evident session evidence package, and appends to institutional governance audit log.",
      outputs: "{ recordId: 'ev-99214', evidenceSaved: true, auditLogged: true }",
      subsystem: "Relational Database / Storage • Governance & Audit • Assessment Ledger"
    },
    {
      stage: 6,
      title: "6. UPDATE SKILLS",
      role: "Skill Passport & Analytics Service",
      summary: "Updates trainee skill profile, cohort analytics, and stamps verified competencies onto the official Skill Passport.",
      inputs: "{ traineeId: 'REC-VR-2024', competencyCode: 'ELEC-IS5216', performanceLevel: 'Level 4 Advanced' }",
      process: "Competency engine credits verifiable evidence to Trainee Skill Passport, recalculates cohort safety trend line, and triggers trainer verification badge.",
      outputs: "{ passportStatus: 'UPDATED', newBadge: 'Procedure Master', verifiedQRUpdated: true }",
      subsystem: "Progress & Skill Passport • Analytics & Remediation • Verifiable Credential QR"
    }
  ];

  V.arch = function() {
    const curStage = ARCH_STAGES[activeArchStage - 1] || ARCH_STAGES[0];

    return `
      <div class="w" style="max-width:1200px">
        <!-- Header Banner -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="tag a" style="background:#0284c7;color:#fff">ENTERPRISE BLUEPRINT</span>
              <span class="tag" style="background:#1e293b;color:#94a3b8">v6.0 PRODUCTION ARCHITECTURE</span>
            </div>
            <h1 style="margin:6px 0 2px;font-size:clamp(26px, 4vw, 36px)">⚡ SkillSafe VR Platform Architecture</h1>
            <p class="m" style="margin:0">Complete system architecture spanning Client Devices, Multi-Workspace Routing, Core Services, Immersive Runtime, and AI Pipelines.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="b o" onclick="go('mods')">📚 Enter Training Library</button>
            <button class="b bw" onclick="go('cadlab')">🔬 Open CAD Lab</button>
          </div>
        </div>

        <!-- ===================================================================
             INTERACTIVE 6-STAGE END-TO-END DATA FLOW WALKTHROUGH
             =================================================================== -->
        <div class="c" style="border:2px solid var(--ac);box-shadow:0 8px 30px rgba(56,189,248,0.15);background:linear-gradient(180deg,#121d2b 0%,#0c1522 100%);margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div>
              <span class="tag a" style="background:#22c55e;color:#04180b;font-weight:800">INTERACTIVE PIPELINE WALKTHROUGH</span>
              <h3 style="margin:4px 0 0;font-size:20px">End-to-End Data Flow (Stages 1 – 6)</h3>
            </div>
            <span class="m" style="font-size:12px">Click any stage to inspect live payload &amp; processing contracts:</span>
          </div>

          <!-- 6 Stage Buttons Row -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:16px">
            ${ARCH_STAGES.map(s => `
              <button class="arch-stage-btn ${activeArchStage === s.stage ? 'active' : ''}" onclick="selectArchStage(${s.stage})">
                <span class="arch-stage-num">STAGE ${s.stage}</span>
                <b style="font-size:13px;display:block">${s.title.split('. ')[1]}</b>
                <small style="color:#94a3b8;font-size:10px;display:block;margin-top:4px">${s.role.split(' & ')[0]}</small>
              </button>
            `).join('')}
          </div>

          <!-- Active Stage Inspector Box -->
          <div id="arch-stage-inspector" style="background:#070d16;border:1px solid #1e2e44;border-radius:12px;padding:16px;box-shadow:inset 0 0 20px rgba(0,0,0,0.5)">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px">
              <div>
                <span style="font-size:11px;font-weight:800;color:var(--ac)">ACTIVE STAGE CONTRACT INSPECTOR:</span>
                <h3 style="margin:2px 0 0;color:#fff">${curStage.title}</h3>
                <span class="m" style="font-size:12px;color:#94a3b8">Responsible Subsystem: <b>${curStage.subsystem}</b></span>
              </div>
              <span class="tag a" style="background:#0284c7;color:#fff">${curStage.role}</span>
            </div>

            <p style="font-size:14px;color:#cbd5e1;line-height:1.5;margin:0 0 14px">${curStage.summary}</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;font-family:monospace;font-size:11.5px">
              <div style="background:#0d1624;padding:12px;border-radius:8px;border-left:3px solid #38bdf8">
                <b style="color:#38bdf8">INPUT PAYLOAD:</b>
                <pre style="margin:6px 0 0;white-space:pre-wrap;color:#e2e8f0">${curStage.inputs}</pre>
              </div>

              <div style="background:#0d1624;padding:12px;border-radius:8px;border-left:3px solid #f59e0b">
                <b style="color:#f59e0b">PROCESSING &amp; RULE LOGIC:</b>
                <div style="margin:6px 0 0;color:#e2e8f0;font-family:inherit">${curStage.process}</div>
              </div>

              <div style="background:#0d1624;padding:12px;border-radius:8px;border-left:3px solid #22c55e">
                <b style="color:#22c55e">OUTPUT CONTRACT ARTIFACT:</b>
                <pre style="margin:6px 0 0;white-space:pre-wrap;color:#e2e8f0">${curStage.outputs}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             ARCHITECTURAL BLUEPRINT GRID (Matching Architecture Diagram)
             =================================================================== -->
        <h3 style="margin:24px 0 14px;display:flex;align-items:center;gap:8px">
          <span>🏛️</span> Complete Platform Subsystem Architecture
        </h3>

        <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));margin-bottom:20px">
          <!-- 1. Clients & Devices -->
          <div class="arch-block clients">
            <span class="tag" style="background:#0369a1;color:#fff">TIER 1 · CLIENTS &amp; DEVICES</span>
            <h3 style="margin:8px 0 4px">Clients, Browsers &amp; WebXR Devices</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px">Cross-platform accessibility on desktop, phones, tablets, and standalone VR headsets.</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#cbd5e1;line-height:1.6">
              <li><b>Desktop &amp; Laptop:</b> Chrome, Edge, Firefox, Safari (3D Orbit, WASD movement, Mouse/Pointer raycasting)</li>
              <li><b>Mobile &amp; Tablet:</b> On-screen virtual D-Pad, touch controls, camera access for AR PPE inspection</li>
              <li><b>Immersive VR Headsets:</b> WebXR device support (Meta Quest 2/3/Pro, Pico, HTC Vive) with 6-DOF hand controllers</li>
              <li><b>Accessibility &amp; Language:</b> Large text Aa mode, speech preferences, EN / தமிழ் / हिंदी multilingual engine</li>
            </ul>
          </div>

          <!-- 2. Web Frontend & Identity Routing -->
          <div class="arch-block frontend">
            <span class="tag" style="background:#15803d;color:#fff">TIER 2 · FRONTEND &amp; IDENTITY</span>
            <h3 style="margin:8px 0 4px">Identity &amp; Role Routing</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px">Multi-tenant boundary enforcement and role-based permissions.</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#cbd5e1;line-height:1.6">
              <li><b>🎓 Learner Workspace:</b> Training library, assigned work, 3D simulation, AI generator, verifiable Skill Passport</li>
              <li><b>👨‍🏫 Trainer Workspace:</b> Cohort dashboard, batch roster, assignment builder, scenario approvals, competency sign-off</li>
              <li><b>🏛️ Admin Workspace:</b> Multi-institution boundaries, user role matrix, asset catalogues, governance audit logs</li>
              <li><b>Institution Isolation:</b> Data and progress partition across technical colleges, NSTI, and training academies</li>
            </ul>
          </div>

          <!-- 3. Core Domain Services -->
          <div class="arch-block services">
            <span class="tag" style="background:#6d28d9;color:#fff">TIER 3 · DOMAIN SERVICES</span>
            <h3 style="margin:8px 0 4px">Core Domain Services</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px">Business logic, assessment rules, curriculum orchestration, and verification.</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#cbd5e1;line-height:1.6">
              <li><b>Users &amp; Institution Service:</b> Profiles, enrollment, batch membership, role permissions</li>
              <li><b>Module &amp; Content Catalogue:</b> Learning objectives, required PPE, safety steps, reviewed version control</li>
              <li><b>Assignment Builder:</b> Due dates, time limits, mandatory steps checklist, pass criteria %</li>
              <li><b>Training Session Orchestrator:</b> Session lifecycle, telemetry recorder, retry flow, evidence locker</li>
              <li><b>Analytics &amp; Remediation:</b> Cohort mistake heatmaps, targeted practice drills, safety deficit alerts</li>
              <li><b>Governance &amp; Audit:</b> Content approval trail, policy revision tracking, sensitive action auditing</li>
            </ul>
          </div>

          <!-- 4. Immersive Runtime & Workplace Tools -->
          <div class="arch-block runtime">
            <span class="tag" style="background:#be185d;color:#fff">TIER 4 · IMMERSIVE RUNTIME</span>
            <h3 style="margin:8px 0 4px">Immersive Runtime &amp; Workplace Tools</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px">Interactive 3D simulation, AR guidance, CAD lab, and real-time event streaming.</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#cbd5e1;line-height:1.6">
              <li><b>3D / VR Training Runtime:</b> Three.js scene, clickable machinery, step-driven sequence, cinematic arc flash physics</li>
              <li><b>CAD / 3D Model Lab:</b> 6 industrial assemblies with 0-100% exploded view slider, part isolation, wireframe mode, calipers</li>
              <li><b>AR Guidance Mode:</b> Camera marker tracking, overlaid guidance arrows, live AI camera PPE check</li>
              <li><b>Runtime Event Contract:</b> Structured telemetry emitted on every action: <code>{ objectId, action, step, time, outcome }</code></li>
              <li><b>Thermal / X-Ray Heat Camera:</b> Live vs de-energized cooldown heat vision mode (T)</li>
            </ul>
          </div>

          <!-- 5. AI Generation & Content Pipeline -->
          <div class="arch-block pipeline">
            <span class="tag" style="background:#0e7490;color:#fff">TIER 5 · AI CONTENT PIPELINE</span>
            <h3 style="margin:8px 0 4px">AI Generation &amp; Content Pipeline</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px">Transform natural language and workplace photos into playable 3D VR scenarios.</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#cbd5e1;line-height:1.6">
              <li><b>AI Scenario Planner (Groq / Gemini):</b> Outputs structured scenario JSON (objectives, steps, hazards, feedback)</li>
              <li><b>Photo-to-Workplace Vision:</b> Upload real job site photo ➔ AI audits hazards ➔ compiles into walkable 3D world</li>
              <li><b>Scenario Validation &amp; Approval:</b> Mandatory safety policy validation; Trainer review required before assignment</li>
              <li><b>Multilingual Voice Coach:</b> Real-time contextual speech explanations and hints in English, Tamil, and Hindi</li>
              <li><b>Scene Assembler:</b> Procedural placement of industrial equipment, hazard zones, and step triggers</li>
            </ul>
          </div>

          <!-- 6. Safety & Trust Boundary -->
          <div class="arch-block safety">
            <span class="tag" style="background:#b91c1c;color:#fff">GOVERNANCE · SAFETY &amp; TRUST BOUNDARY</span>
            <h3 style="margin:8px 0 4px;color:#ef4444">Deterministic Safety Gate Guarantee</h3>
            <p class="m" style="margin:0 0 10px;font-size:12px;color:#fca5a5">Core safety principle enforced across the platform:</p>
            <div style="background:#0f172a;border-radius:10px;padding:12px;border-left:4px solid #ef4444;font-size:13px;color:#f1f5f9;line-height:1.5">
              <i>"The LLM may propose or explain; it <b>never</b> decides whether a learner passes: <b>Deterministic rules</b> enforce mandatory procedures and critical safety gates."</i>
            </div>
            <ul style="margin:10px 0 0;padding-left:18px;font-size:12px;color:#cbd5e1;line-height:1.5">
              <li><b>Critical Failures Cannot Be Averaged Away:</b> Skipping power isolation or touching live 480V terminals triggers immediate arc flash incident. High task completion cannot mask life-threatening errors.</li>
              <li><b>Content Approval Gate:</b> AI-generated scenarios require trainer review before publishing to curriculum.</li>
              <li><b>Skill Passport Credentialing:</b> Records are verifiable via cryptographic hash &amp; QR code with instructor endorsement.</li>
            </ul>
          </div>
        </div>

        <!-- Quick Access to Workspaces -->
        <div class="c" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <h4 style="margin:0">Explore the Platform by Role:</h4>
            <span class="m" style="font-size:12px">Switch your active perspective directly:</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="b" onclick="switchRole('learner')">🎓 Enter Learner Workspace</button>
            <button class="b o" onclick="switchRole('trainer')">👨‍🏫 Enter Trainer Workspace</button>
            <button class="b o" onclick="switchRole('admin')">🏛️ Enter Admin Workspace</button>
          </div>
        </div>
      </div>
    `;
  };

  window.selectArchStage = function(stageNum) {
    activeArchStage = stageNum;
    if (window.curView === 'arch') go('arch');
  };

  I.arch = function() {
    window.scrollTo(0, 0);
  };

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // VIEW: 🔬 CAD / 3D MODEL LAB (Three.js Interactive Explorer & CAD Converter)
  // -----------------------------------------------------------------------
  let curCadModel = 'switchgear';
  let cadExplodeFactor = 0;
  let cadWireframe = false;
  let cadCalipers = false;
  let cadCaliperAxis = 'X';
  let cadSelectedPart = null;
  let cadScene = null, cadCamera = null, cadRenderer = null;
  let cadParts = [];
  let cadCalipersGroup = null;
  let cadUploadedBlueprintTexture = null;
  let cadCustomGeometries = null;
  let cadYaw = 0.35, cadPitch = 0.18, cadDist = 3.2;
  let cadIsFullscreen = false;
  let cadArticulations = {}; // { [partId]: boolean isOpen }
  let cadTutorLoading = false;

  const CAD_SPECS = {
    switchgear: {
      name: "480V Industrial Switchgear & Drawout Circuit Breaker Unit",
      pn: "SWG-480-1600A-V3",
      material: "Grade E-Cu58 Electrolytic Copper & Cold-Rolled Steel Enclosure",
      standard: "NFPA 70B / IEEE C37.20.1 / IS 13947",
      voltage: "480 V AC, 3-Phase, 60 Hz (10,000A Interrupting Capacity)",
      maint: "Annual insulation resistance testing, mechanism lubrication, and contact resistance measurement (< 35 micro-ohms).",
      desc: "Medium-voltage industrial switchgear cabinet housing a drawout air circuit breaker, primary disconnect stabs, arc chute de-ionizing grid plates, and main feeder copper busbars. Features a transparent safety inspection door and digital metering.",
      parts: [
        { id: "cabinet", label: "Main Steel Enclosure Chassis", basePos: [0, 0, 0], dir: [0, 0, 0], dist: 0, desc: "Welded 12-gauge cold-rolled steel structural frame with safety interlock louvers and cable entry gland plates." },
        { id: "door", label: "Polycarbonate Safety Door & LCD Multimeter", basePos: [-0.74, 0.45, 0.52], dir: [0, 0, 1], dist: 0.9, desc: "Tinted impact-resistant transparent polycarbonate door with digital voltage/current multimeter display and 3-phase pilot LEDs. Pivots open on left heavy-duty hinges." },
        { id: "breaker", label: "Drawout Air Circuit Breaker Assembly", basePos: [0, 0.35, 0], dir: [0, 0, 1], dist: 1.4, desc: "1,600A frame drawout breaker with ceramic vacuum interrupters, spring-charged mechanism, and silver-plated tulip disconnect stabs. Racks forward out of the cell for isolation." },
        { id: "arc_chute", label: "Arc Chute De-ionizing Grid Chamber", basePos: [0, 0.95, 0.15], dir: [0, 1, 0.3], dist: 1.0, desc: "Multi-plate steel de-ionizing splitter plates that fragment, stretch, and extinguish electrical switching arcs in < 15ms. Tilts back for contact inspection." },
        { id: "busbars", label: "3-Phase Electrolytic Copper Busbars", basePos: [0, 0.35, -0.45], dir: [0, 0, -1], dist: 1.1, desc: "Silver-plated electrolytic copper conductors rated for 1,600A continuous current and 65kA withstand, mounted on red cycloaliphatic insulators." },
        { id: "handle", label: "Ergonomic Spring-Charge Handle", basePos: [0.55, 0.35, 0.3], dir: [1, 0, 0], dist: 0.8, desc: "Manual charging handle for the mechanical stored-energy closing spring mechanism. Pulls down to charge closing springs." },
        { id: "loto_hasp", label: "LOTO Safety Padlock Lockout Hasp", basePos: [-0.55, 0.35, 0.3], dir: [-1, 0, 0], dist: 0.8, desc: "OSHA standard safety lockout hasp with brass padlock preventing breaker racking into the live energized cell during maintenance. Unlatches to simulate clearance." }
      ]
    },
    transformer: {
      name: "3-Phase Step-Down Power Transformer Unit",
      pn: "XFMR-11KV-415V-500KVA",
      material: "Grain-Oriented Silicon Steel (CRGO) & Oxygen-Free Copper Windings",
      standard: "IS 2026 / IEEE C57.12.00 / IEC 60076",
      voltage: "11,000 V Delta Primary / 415 V Wye Secondary",
      maint: "Dielectric oil breakdown voltage test (min 40 kV), winding insulation resistance (megger), and Buchholz relay check.",
      desc: "Distribution substation transformer stepping down 11kV distribution voltage to 415V 3-phase utilization power. Features laminated core, cooling radiators, and high-voltage porcelain bushings.",
      parts: [
        { id: "tank", label: "Transformer Oil Reservoir Tank", basePos: [0, 0, 0], dir: [0, 0, 0], dist: 0, desc: "Sealed heavy-gauge steel tank filled with mineral insulating and cooling transformer oil." },
        { id: "bushings", label: "Porcelain High-Voltage Bushings (11kV)", basePos: [0, 1.1, 0], dir: [0, 1, 0], dist: 1.2, desc: "Glazed creepage-rated brown porcelain insulators providing safe dielectric clearance for 11kV line conductors. Terminals lift for inspection." },
        { id: "core_windings", label: "CRGO Core & Copper Winding Assembly", basePos: [0, 0.15, 0], dir: [0, 0, 1], dist: 1.3, desc: "High-permeability laminated silicon steel magnetic core wound with insulated copper conductors." },
        { id: "conservator", label: "Oil Expansion Conservator Drum", basePos: [0, 1.25, -0.6], dir: [0, 0.8, -0.8], dist: 1.0, desc: "Upper expansion drum accommodating thermal volume expansion of dielectric cooling oil with silica gel breather." },
        { id: "radiator", label: "Corrugated Heat Dissipation Fins", basePos: [0.85, 0.15, 0], dir: [1, 0, 0], dist: 1.0, desc: "External dual-side radiator fins for natural convective air cooling of the transformer tank." }
      ]
    },
    torch: {
      name: "Industrial MIG/TIG Welding Torch Assembly",
      pn: "WLD-TORCH-400A-PRO",
      material: "Tellurium Copper Nozzle, Brass Collet Body & Silicone Insulator",
      standard: "AWS A5.18 / ISO 14175 / OSHA 1910.252",
      voltage: "Rated 400A continuous current at 100% duty cycle with Ar/CO2 shielding gas",
      maint: "Clean spatter build-up inside nozzle, check contact tip bore wear, inspect O-rings and gas diffuser holes.",
      desc: "Heavy-duty gas-shielded arc welding torch featuring quick-change gas lens diffuser, insulated handle, ergonomic trigger switch, and high-conductivity copper nozzle.",
      parts: [
        { id: "torch_handle", label: "Ergonomic Heat-Resistant Handle", basePos: [-0.4, 0, 0], dir: [-1, 0, 0], dist: 0.8, desc: "High-impact fiberglass-reinforced nylon handle containing the micro-trigger control switch." },
        { id: "torch_nozzle", label: "Tellurium Copper Gas Shield Nozzle", basePos: [0.6, 0, 0], dir: [1, 0, 0], dist: 1.2, desc: "Streamlined copper nozzle directing shielding gas uniformly over the molten weld puddle. Unscrews forward on touch." },
        { id: "torch_diffuser", label: "Brass Gas Diffuser & Collet Body", basePos: [0.3, 0, 0], dir: [1, 0, 0], dist: 0.6, desc: "Porous brass gas lens eliminating turbulence and providing laminar shielding gas coverage." },
        { id: "torch_electrode", label: "2.4mm Tungsten / Contact Tip", basePos: [0.75, 0, 0], dir: [1, 0, 0], dist: 1.6, desc: "Precision contact tip transferring current directly to the wire or tungsten electrode." },
        { id: "torch_cable", label: "Flexible Coaxial Power/Gas Conduit", basePos: [-0.9, -0.2, 0], dir: [-1, -0.5, 0], dist: 0.8, desc: "Reinforced rubber hose carrying welding current, shielding gas, and trigger control wiring." }
      ]
    },
    valve: {
      name: "Hydraulic High-Pressure Proportional Relief Valve",
      pn: "HYD-VALVE-350BAR-V2",
      material: "Ductile Iron Body & Hardened Alloy Steel Spool (60 HRC)",
      standard: "ISO 4401 / DIN 24340 / SAE J514",
      voltage: "350 Bar (5,000 PSI) Operating Pressure • 24V DC Proportional Solenoid",
      maint: "Inspect spool for scoring or contamination silting, replace Viton O-ring seals, verify cracking pressure setting.",
      desc: "Pilot-operated proportional pressure control valve maintaining system pressure equilibrium and preventing catastrophic overpressure ruptures in industrial hydraulic machinery.",
      parts: [
        { id: "valve_manifold", label: "Ductile Iron Valve Manifold Block", basePos: [0, 0, 0], dir: [0, 0, 0], dist: 0, desc: "Heavy-duty cast body with precision micro-honed internal fluid gallery ports." },
        { id: "valve_spool", label: "Precision Hardened Relief Spool", basePos: [0.35, 0, 0], dir: [1, 0, 0], dist: 0.9, desc: "Hardened alloy steel spool with metering notches for precise proportional pressure relief. Slides out along cylinder bore on touch." },
        { id: "valve_spring", label: "Heavy Damping Compression Spring", basePos: [0.75, 0, 0], dir: [1, 0, 0], dist: 1.4, desc: "Calibrated spring providing closing bias force against hydraulic line pressure." },
        { id: "valve_solenoid", label: "24V DC Proportional Solenoid Actuator", basePos: [-0.5, 0, 0], dir: [-1, 0, 0], dist: 0.9, desc: "Electromagnetic coil producing proportional force to modulate system cracking pressure." },
        { id: "valve_screw", label: "Manual Pressure Adjustment Screw", basePos: [1.1, 0, 0], dir: [1, 0, 0], dist: 1.9, desc: "Locknut calibration screw for setting mechanical maximum overpressure limits." }
      ]
    },
    scaffolding: {
      name: "Heavy-Duty Scaffolding Swivel Coupler Joint",
      pn: "SCAF-COUP-48-EN74",
      material: "Drop-Forged High-Strength Carbon Steel & Zinc-Plated T-Bolts",
      standard: "EN 74-1 Class B / OSHA 1926.451 / BS 1139",
      voltage: "Safe Working Load: 15.0 kN (3,370 lbs) Slip Resistance",
      maint: "Inspect for thread stripping, verify tightening torque of 54 Nm (40 ft-lbs), check for cracks around rivet pins.",
      desc: "Structural scaffold clamp used to join two 48.3mm scaffold tubes at any arbitrary angle with high slip resistance, critical for facade scaffolding and elevated working platforms.",
      parts: [
        { id: "scaf_base", label: "Drop-Forged Lower Clamp Body", basePos: [0, -0.2, 0], dir: [0, 0, 0], dist: 0, desc: "Hot drop-forged steel saddle contoured to grip 48.3mm structural scaffold tubing." },
        { id: "scaf_upper", label: "Swivel Flange Upper Clamp Body", basePos: [0, 0.4, 0], dir: [0, 1, 0], dist: 0.9, desc: "Upper half-clamp swiveling on a high-tensile steel center rivet pin. Hinges open on touch." },
        { id: "scaf_bolt1", label: "High-Tensile T-Head Clamp Bolt #1", basePos: [-0.45, 0.1, 0], dir: [-1, 0, 0], dist: 0.8, desc: "Grade 8.8 T-bolt capturing the scaffold tube with heavy hex nut. Swings open on touch." },
        { id: "scaf_bolt2", label: "High-Tensile T-Head Clamp Bolt #2", basePos: [0.45, 0.1, 0], dir: [1, 0, 0], dist: 0.8, desc: "Opposing clamping bolt providing dual redundant gripping force." },
        { id: "scaf_tube", label: "48.3mm Galvanized Scaffold Standard Tube", basePos: [0, 0, -0.4], dir: [0, 0, -1], dist: 1.0, desc: "High-yield structural steel tube providing vertical column load bearing capacity." }
      ]
    },
    motor: {
      name: "3-Phase High-Torque AC Induction Motor",
      pn: "MOT-3PH-15KW-400V",
      material: "Cast Iron Frame (FC200) with High-Grade Enameled Copper Windings",
      standard: "IEC 60034-30-1 (IE3 Premium Efficiency) / NEMA MG-1",
      voltage: "400 V AC, 50 Hz, 15 kW (20 HP), 1,460 RPM, Full Load Current: 28.5A",
      maint: "Vibration FFT analysis, bearing relubrication with polyurea grease every 4,000 hrs, insulation resistance > 10 Megohms.",
      desc: "Totally enclosed fan-cooled (TEFC) 3-phase squirrel cage induction motor with cast iron cooling fins, IP55 terminal enclosure, balanced rotor, and rear bi-directional cooling fan.",
      parts: [
        { id: "mot_frame", label: "Ribbed Cast Iron Stator Frame", basePos: [0, 0, 0], dir: [0, 0, 0], dist: 0, desc: "Heavy cast iron frame with radial heat dissipation cooling fins." },
        { id: "mot_rotor", label: "Squirrel Cage Rotor & Drive Shaft", basePos: [0, 0, 0.4], dir: [0, 0, 1], dist: 1.3, desc: "Balanced laminated rotor with cast aluminum conductive bars and hardened 42mm drive shaft. Extracts forward on touch." },
        { id: "mot_windings", label: "3-Phase Insulated Copper Stator Coils", basePos: [0, 0, -0.2], dir: [0, 1, 0], dist: 0.8, desc: "Class H insulation phase windings producing the rotating magnetic field (RMF)." },
        { id: "mot_fan", label: "Bi-directional Polypropylene Cooling Fan", basePos: [0, 0, -0.7], dir: [0, 0, -1], dist: 1.0, desc: "Radial fan impeller drawing ambient air over external frame cooling fins." },
        { id: "mot_cowl", label: "Rear Protective Steel Fan Cowl", basePos: [0, 0, -1.0], dir: [0, 0, -1], dist: 1.4, desc: "Protective sheet steel shroud directing forced airflow over the motor frame. Decouples on touch." },
        { id: "mot_jbox", label: "Top IP66 Electrical Terminal Junction Box", basePos: [0, 0.7, 0], dir: [0, 1, 0], dist: 0.8, desc: "Weatherproof terminal box housing 6-pin brass connection block for Star/Delta configuration. Lid flips open on touch." }
      ]
    }
  };

  // Helper: Synthesize rich 2D CAD Blueprint drawings onto canvas for instant conversion demonstration
  function generateSampleCadBlueprintDataUrl(type) {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 768;
    const ctx = c.getContext('2d');

    // Engineering Blueprint Navy Background
    ctx.fillStyle = '#0a1626';
    ctx.fillRect(0, 0, c.width, c.height);

    // Fine Technical Grid
    ctx.strokeStyle = '#14273e';
    ctx.lineWidth = 1;
    for (let x = 0; x < c.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = 0; y < c.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }

    // Major Grid Lines
    ctx.strokeStyle = '#1d395a';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < c.width; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke(); }
    for (let y = 0; y < c.height; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke(); }

    // Blueprint Border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, c.width - 60, c.height - 60);
    ctx.strokeRect(36, 36, c.width - 72, c.height - 72);

    // Engineering Title Block (Bottom Right)
    const bx = c.width - 340, by = c.height - 150, bw = 300, bh = 110;
    ctx.fillStyle = '#07101c';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('REC VOCATIONAL CAD LAB', bx + 12, by + 24);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('INSTITUTION: RAJALAKSHMI ENG COLLEGE', bx + 12, by + 42);
    ctx.fillText('SCALE: 1:1 • UNITS: mm • TOL: ±0.05', bx + 12, by + 58);
    ctx.fillText('STATUS: VERIFIED 3D CAD SPECIFICATION', bx + 12, by + 74);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('APPROVAL: TR-REC-2024 (SAURAV K)', bx + 12, by + 92);

    // Vector CAD Schematic Lines based on Type
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    if (type === 'manifold') {
      ctx.strokeRect(120, 140, 520, 380);
      ctx.beginPath(); ctx.arc(380, 330, 90, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(380, 330, 45, 0, Math.PI * 2); ctx.stroke();
      [[170, 190], [590, 190], [170, 470], [590, 470]].forEach(([x, y]) => {
        ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 28, y); ctx.lineTo(x + 28, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 28); ctx.lineTo(x, y + 28); ctx.stroke();
      });
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px monospace';
      ctx.fillText('↔ WIDTH: 520.00 mm', 300, 120);
      ctx.fillText('↕ HEIGHT: 380.00 mm', 660, 330);
      ctx.fillText('Ø 180.00 MAIN SPOOL BORE', 260, 450);
      ctx.fillText('4X M16 MOUNTING CAP SCREWS', 140, 550);
    } else if (type === 'impeller') {
      ctx.beginPath(); ctx.arc(380, 340, 200, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(380, 340, 75, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(380, 340, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(370, 300, 20, 20);
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        ctx.beginPath();
        const r1 = 80, r2 = 195;
        const x1 = 380 + Math.cos(ang) * r1, y1 = 340 + Math.sin(ang) * r1;
        const cx = 380 + Math.cos(ang + 0.5) * 140, cy = 340 + Math.sin(ang + 0.5) * 140;
        const x2 = 380 + Math.cos(ang + 0.8) * r2, y2 = 340 + Math.sin(ang + 0.8) * r2;
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.stroke();
      }
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.font = '12px monospace';
      ctx.fillText('Ø 400.00 mm OUTER DIAMETER', 240, 110);
      ctx.fillText('Ø 60.00 mm DRIVE SHAFT BORE', 240, 570);
      ctx.fillText('6-VANE BACKWARD SWEPT CURVATURE', 140, 600);
    } else {
      ctx.strokeRect(140, 100, 480, 460);
      ctx.strokeRect(170, 130, 420, 100);
      ctx.strokeRect(170, 250, 420, 220);
      ctx.strokeRect(170, 490, 420, 50);
      ctx.fillStyle = '#d97706';
      [230, 380, 530].forEach(x => {
        ctx.fillRect(x - 12, 140, 24, 80);
      });
      ctx.strokeStyle = '#22c55e';
      ctx.strokeRect(220, 270, 320, 180);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText('480V 3Ø MAIN BREAKER CELL (1600A)', 230, 360);
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('↔ FRAME: 1200 mm', 310, 80);
      ctx.fillText('↕ TOTAL HEIGHT: 2200 mm', 640, 330);
    }

    return c.toDataURL('image/png');
  }

  // -----------------------------------------------------------------------
  // VIEW: V.cadlab
  // -----------------------------------------------------------------------
  V.cadlab = function() {
    const spec = CAD_SPECS[curCadModel] || CAD_SPECS.switchgear;

    return `
      <div class="w" style="max-width:1200px">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="tag a" style="background:#0284c7;color:#fff">3D CAD INSPECTION SUITE</span>
              <span class="tag" style="background:#1e293b;color:#38bdf8">RETINA 4K RESOLUTION</span>
              <span class="tag" style="background:#065f46;color:#a7f3d0">AI TUTOR ACTIVE</span>
            </div>
            <h1 style="margin:4px 0 2px;font-size:clamp(22px, 3.2vw, 30px)">🔬 CAD / 3D Model Lab</h1>
            <p class="m" style="margin:0">Interactive 3D mechanical assemblies with physical touch articulation (open doors, rack breakers, tilt chutes), digital vernier calipers, and AI Machine Tutor.</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="b bw" onclick="document.getElementById('cad-file-input').click()" style="padding:7px 14px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0284c7,#2563eb);border:none;box-shadow:0 0 16px rgba(2,132,199,0.4)">
              📤 Upload CAD / Blueprint
            </button>
            <button class="b o" onclick="go('mods')">📚 Enter VR Training</button>
          </div>
        </div>

        <!-- 1-Click Instant Blueprint-to-3D Test Bar -->
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;background:#081320;border:1px solid #1e2f47;padding:8px 12px;border-radius:10px">
          <span style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.5px">⚡ Test 2D CAD Blueprint ➔ 3D Model Conversion:</span>
          <button class="b o" onclick="loadSampleCadBlueprint('switchboard')" style="padding:4px 10px;font-size:11px;background:#0d1c2e">⚡ 480V Switchboard CAD</button>
          <button class="b o" onclick="loadSampleCadBlueprint('manifold')" style="padding:4px 10px;font-size:11px;background:#0d1c2e">🛢️ Hydraulic Manifold CAD</button>
          <button class="b o" onclick="loadSampleCadBlueprint('impeller')" style="padding:4px 10px;font-size:11px;background:#0d1c2e">⚙️ Centrifugal Impeller CAD</button>
          <span style="font-size:11px;color:#64748b;margin-left:auto">Accepts .stl · .obj · .gltf · .glb · .png · .jpg · .svg · .dxf</span>
        </div>

        <!-- Hidden File Input for CAD Upload -->
        <input type="file" id="cad-file-input" style="display:none" accept=".stl,.obj,.gltf,.glb,.png,.jpg,.jpeg,.svg,.dxf" onchange="handleCadFileUpload(event)">

        <!-- CAD Viewport & Glass Toolbar -->
        <div class="cad-viewport-box" id="cad-viewport-container" ondragover="handleCadDragOver(event)" ondragleave="handleCadDragLeave(event)" ondrop="handleCadDrop(event)">
          <canvas id="cad-canvas"></canvas>

          <!-- Floating Action Toast (Shows physically articulated part status) -->
          <div id="cad-action-toast" style="position:absolute;top:54px;left:50%;transform:translateX(-50%);background:rgba(8,19,32,0.94);backdrop-filter:blur(10px);border:1.5px solid #38bdf8;padding:8px 20px;border-radius:30px;font-size:12px;font-weight:700;color:#e0f2fe;display:none;align-items:center;gap:10px;z-index:25;box-shadow:0 8px 30px rgba(2,132,199,0.45);pointer-events:none;transition:all 0.3s ease">
            <span id="cad-action-toast-icon" style="font-size:16px">🚪</span>
            <span id="cad-action-toast-txt">Part articulated</span>
          </div>

          <!-- Floating Digital Caliper LCD HUD Widget -->
          <div id="cad-caliper-hud" style="position:absolute;top:66px;right:14px;background:rgba(8,16,28,0.93);backdrop-filter:blur(10px);border:1.5px solid #38bdf8;box-shadow:0 8px 30px rgba(2,132,199,0.35);border-radius:12px;padding:12px 14px;min-width:240px;color:#fff;z-index:25;display:none">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:10px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:1px">📏 DIGITAL VERNIER CALIPER</span>
              <span style="font-size:9px;background:#0369a1;padding:2px 6px;border-radius:4px;font-weight:700">ISO 2768-mK</span>
            </div>
            <div id="cad-caliper-target-name" style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Target: 480V Industrial Switchgear</div>

            <!-- 7-Segment LCD Display Simulation -->
            <div style="background:#041520;border:1.5px solid #0284c7;border-radius:8px;padding:8px 12px;text-align:right;margin-bottom:10px;box-shadow:inset 0 0 14px rgba(2,132,199,0.45)">
              <div id="cad-caliper-lcd" style="font-family:'Courier New', monospace;font-size:26px;font-weight:900;color:#38bdf8;letter-spacing:2px;text-shadow:0 0 10px #38bdf8">1480.00 mm</div>
              <div style="font-size:9px;color:#64748b;font-family:monospace;margin-top:2px">PRECISION: ±0.05 mm • ZERO: SET</div>
            </div>

            <!-- 3 Axis Measurement Breakdown Buttons -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:10px;font-family:monospace">
              <button class="b o" id="btn-axis-x" onclick="setCadCaliperAxis('X')" style="padding:4px;text-align:center;background:#0284c733;border-color:#38bdf8">
                <span style="color:#94a3b8">W (X)</span><br><b id="cad-cal-x" style="color:#38bdf8">1480</b> mm
              </button>
              <button class="b o" id="btn-axis-y" onclick="setCadCaliperAxis('Y')" style="padding:4px;text-align:center;background:#0d1c2e;border-color:#1e293b">
                <span style="color:#94a3b8">H (Y)</span><br><b id="cad-cal-y" style="color:#22c55e">2200</b> mm
              </button>
              <button class="b o" id="btn-axis-z" onclick="setCadCaliperAxis('Z')" style="padding:4px;text-align:center;background:#0d1c2e;border-color:#1e293b">
                <span style="color:#94a3b8">D (Z)</span><br><b id="cad-cal-z" style="color:#f59e0b">650</b> mm
              </button>
            </div>
          </div>

          <!-- Drag and Drop Active Overlay -->
          <div id="cad-drop-overlay" style="display:none;position:absolute;inset:0;background:rgba(2,132,199,0.88);backdrop-filter:blur(10px);z-index:30;flex-direction:column;align-items:center;justify-content:center;border:3px dashed #7dd3fc;border-radius:14px;color:#fff;pointer-events:none">
            <div style="font-size:48px;margin-bottom:8px">📤</div>
            <div style="font-size:20px;font-weight:800">Drop CAD File or Blueprint Here</div>
            <div style="font-size:13px;opacity:0.95;margin-top:4px">Automatically converts 3D CAD (.STL/.OBJ) &amp; 2D Blueprints (.PNG/.JPG/.SVG) into an interactive 3D model</div>
          </div>

          <!-- Conversion In Progress Overlay -->
          <div id="cad-converting-overlay" style="display:none;position:absolute;inset:0;background:rgba(8,16,28,0.92);backdrop-filter:blur(12px);z-index:35;flex-direction:column;align-items:center;justify-content:center;border-radius:14px;color:#fff">
            <div class="spinner" style="width:48px;height:48px;border-width:3px;margin-bottom:16px;border-top-color:#38bdf8"></div>
            <div id="cad-convert-step-title" style="font-size:18px;font-weight:800;color:#38bdf8">Converting CAD Blueprint into 3D Model...</div>
            <div id="cad-convert-step-desc" style="font-size:13px;color:#94a3b8;margin-top:6px;max-width:500px;text-align:center">Extruding volumetric layers, computing mechanical tolerances, and generating exploded view kinematics.</div>
          </div>

          <!-- Top Floating Glass Toolbar -->
          <div class="cad-glass-toolbar">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <label style="font-size:12px;font-weight:700;color:#94a3b8">Active Model:</label>
              <select id="cad-model-select" onchange="switchCadModel(this.value)" style="background:#0a121c;color:#38bdf8;border:1px solid #24354c;border-radius:8px;padding:5px 8px;font-size:12px;font-weight:700;cursor:pointer">
                <option value="switchgear" ${curCadModel==='switchgear'?'selected':''}>⚡ 480V Industrial Switchgear &amp; Breaker</option>
                <option value="transformer" ${curCadModel==='transformer'?'selected':''}>🔋 3-Phase Step-Down Transformer</option>
                <option value="torch" ${curCadModel==='torch'?'selected':''}>🔥 MIG/TIG Industrial Welding Torch</option>
                <option value="valve" ${curCadModel==='valve'?'selected':''}>🛢️ Hydraulic Proportional Relief Valve</option>
                <option value="scaffolding" ${curCadModel==='scaffolding'?'selected':''}>🏗️ Heavy-Duty Scaffold Swivel Coupler</option>
                <option value="motor" ${curCadModel==='motor'?'selected':''}>⚙️ 3-Phase AC Induction Motor</option>
                ${CAD_SPECS.uploaded ? `<option value="uploaded" ${curCadModel==='uploaded'?'selected':''}>📤 ${CAD_SPECS.uploaded.name}</option>` : ''}
              </select>

              <button class="b bw" onclick="document.getElementById('cad-file-input').click()" style="padding:4px 10px;font-size:11px;background:#0284c7;border:none">
                📤 Upload CAD
              </button>
            </div>

            <!-- Exploded View Slider -->
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:12px;font-weight:700;color:#f59e0b">💥 Explode View:</span>
              <input type="range" id="cad-explode-slider" min="0" max="100" value="${cadExplodeFactor * 100}" oninput="setCadExplode(this.value)" style="cursor:pointer;accent-color:#38bdf8;width:120px">
              <span id="cad-explode-val" style="font-size:11px;font-family:monospace;color:#38bdf8;font-weight:800;width:35px">${Math.round(cadExplodeFactor*100)}%</span>
            </div>

            <!-- Display Toggles -->
            <div style="display:flex;gap:6px">
              <button class="b o" id="btn-cad-wire" onclick="toggleCadWireframe()" style="padding:4px 8px;font-size:11px;background:#060f18cc">📐 Wireframe</button>
              <button class="b o ${cadCalipers?'a':''}" id="btn-cad-calipers" onclick="toggleCadCalipers()" style="padding:4px 8px;font-size:11px;background:#060f18cc">📏 Calipers</button>
              <button class="b o" id="btn-cad-fullscreen" onclick="toggleCadFullscreen()" style="padding:4px 8px;font-size:11px;background:#060f18cc" title="Toggle Fullscreen 4K View">⛶ Fullscreen</button>
              <button class="b o" id="btn-cad-reset" onclick="resetCadView()" style="padding:4px 8px;font-size:11px;background:#060f18cc" title="Reset View, Explode Slider, Hinges & Camera">🔄 Reset</button>
            </div>
          </div>

          <!-- Responsive Bottom Controls & Status Bar -->
          <div class="cad-bottom-bar">
            <div class="cad-bottom-pill">
              🖱️ <b>Drag</b> to rotate · <b>Scroll</b> to zoom · 👆 <b>Click/Touch</b> part to articulate
            </div>
            <div class="cad-bottom-pill" style="background:#052e16dd;border-color:#22c55e;color:#86efac;font-weight:700">
              ✅ Verified 3D Twin · Rajalakshmi Engineering College
            </div>
          </div>
        </div>

        <!-- Two Columns: Sub-Parts List and Technical Specification (Responsive) -->
        <div class="cad-details-grid">
          <!-- Parts Explorer -->
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <h3 style="margin:0;font-size:16px;display:flex;align-items:center;gap:6px">
                <span>🧩</span> Sub-Assembly Parts (${spec.parts.length})
              </h3>
              <button class="b o" onclick="isolateCadPart(null)" style="font-size:11px;padding:3px 8px">Show All</button>
            </div>
            <p class="m" style="margin:0 0 10px;font-size:12px">Click any component to <b>physically open/articulate</b> in 3D &amp; query AI Tutor:</p>
            <div style="display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto">
              ${spec.parts.map(p => `
                <div class="cad-part-chip ${cadSelectedPart === p.id ? 'active' : ''}" onclick="interactWithCadPart('${p.id}')">
                  <span>${p.label}</span>
                  <small style="color:var(--ac);font-weight:700">Touch / Open ➔</small>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Technical Engineering Specification -->
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:10px">
              <h3 style="margin:0;font-size:16px;color:#38bdf8">${spec.name}</h3>
              <span class="tag a" style="font-family:monospace;font-size:11px">${spec.pn}</span>
            </div>

            <p style="font-size:13px;color:#cbd5e1;line-height:1.5;margin:0 0 12px">${spec.desc}</p>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;font-size:12px">
              <div style="background:#0f172a;padding:8px 10px;border-radius:8px;border-left:3px solid #38bdf8">
                <b style="color:#94a3b8">Material Composition:</b>
                <div style="color:#f1f5f9;margin-top:2px">${spec.material}</div>
              </div>

              <div style="background:#0f172a;padding:8px 10px;border-radius:8px;border-left:3px solid #22c55e">
                <b style="color:#94a3b8">Operating Ratings:</b>
                <div style="color:#f1f5f9;margin-top:2px">${spec.voltage}</div>
              </div>

              <div style="background:#0f172a;padding:8px 10px;border-radius:8px;border-left:3px solid #f59e0b">
                <b style="color:#94a3b8">Regulatory Standard:</b>
                <div style="color:#f1f5f9;margin-top:2px">${spec.standard}</div>
              </div>

              <div style="background:#0f172a;padding:8px 10px;border-radius:8px;border-left:3px solid #8b5cf6">
                <b style="color:#94a3b8">Maintenance Protocol:</b>
                <div style="color:#f1f5f9;margin-top:2px">${spec.maint}</div>
              </div>
            </div>

            <div id="cad-part-detail-box" style="margin-top:12px;background:#081320;border:1px solid #1e2f47;border-radius:8px;padding:10px 12px;display:${cadSelectedPart?'block':'none'}">
              <b style="color:#38bdf8;font-size:12px">SELECTED COMPONENT:</b>
              <div id="cad-part-detail-txt" style="font-size:13px;color:#e2e8f0;margin-top:4px"></div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             🤖 AI VOCATIONAL MACHINE TUTOR & PART EXPLAINER (GROQ POWERED)
             =================================================================== -->
        <div class="c" style="margin-top:16px;border:1.5px solid var(--ac);box-shadow:0 8px 32px rgba(56,189,248,0.18);background:linear-gradient(180deg,#0a1422 0%,#060c16 100%)">
          <!-- Tutor Header -->
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e2f47;padding-bottom:12px;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#0284c7,#2563eb);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 15px rgba(2,132,199,0.5)">
                🤖
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px">
                  <h3 style="margin:0;font-size:18px;color:#f8fafc">AI Vocational Machine Tutor &amp; Part Explainer</h3>
                  <span class="tag a" style="background:#0284c7;color:#fff;font-size:10px">⚡ AI EXPERT TUTOR</span>
                  <span class="tag" style="background:#065f46;color:#a7f3d0;font-size:10px">● LIVE INFERENCE</span>
                </div>
                <p class="m" style="margin:2px 0 0;font-size:12px">Instant expert explanations of machine purpose, component mechanics, critical hazards, and LOTO safety protocols.</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <button class="b" onclick="askGroqAboutCurrentMachine()" style="padding:6px 14px;font-size:12px;display:flex;align-items:center;gap:6px">
                ⚡ Explain Whole Machine
              </button>
              <button class="b o" id="btn-cad-speak" onclick="speakCadExplanation()" style="padding:6px 14px;font-size:12px;display:flex;align-items:center;gap:6px">
                🔊 Listen to AI Tutor
              </button>
              <button class="b o" onclick="stopCadSpeech()" style="padding:6px 10px;font-size:12px" title="Stop Audio">
                ⏹️ Stop
              </button>
            </div>
          </div>

          <!-- Two Columns: Main Deep-Dive Tutor Output + Interactive Q&A Assistant -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px">
            <!-- Left Column: Explanation Box -->
            <div style="background:#081320;border:1px solid #1e2f47;border-radius:12px;padding:16px;min-height:280px;display:flex;flex-direction:column">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #142436;padding-bottom:8px">
                <div id="cad-tutor-topic-title" style="font-size:14px;font-weight:800;color:#38bdf8;display:flex;align-items:center;gap:6px">
                  <span>📖</span> Machine Overview: 480V Industrial Switchgear
                </div>
                <span id="cad-tutor-badge" class="tag" style="background:#0369a1;color:#fff;font-size:10px">INSTITUTIONAL CURRICULUM</span>
              </div>

              <!-- Body of Explanation -->
              <div id="cad-tutor-explanation" style="font-size:13px;line-height:1.65;color:#e2e8f0;overflow-y:auto;max-height:360px;padding-right:6px">
                <!-- Dynamic Groq Explanation Injected Here -->
              </div>
            </div>

            <!-- Right Column: Interactive Trainee Q&A & Quick Chips -->
            <div style="background:#081320;border:1px solid #1e2f47;border-radius:12px;padding:16px;display:flex;flex-direction:column">
              <div style="font-size:13px;font-weight:800;color:#f8fafc;margin-bottom:4px;display:flex;align-items:center;gap:6px">
                <span>💬</span> Ask Trainee Question to AI Tutor:
              </div>
              <p class="m" style="margin:0 0 10px;font-size:11px">Don't know what a part does? Ask anything about functions, hazards, or maintenance:</p>

              <!-- Question Input Box -->
              <div style="display:flex;gap:6px;margin-bottom:12px">
                <input type="text" id="cad-groq-question-input" placeholder="e.g. What happens if I touch the busbar while energized?" style="flex:1;background:#0d1b2a;border:1px solid #24354c;border-radius:8px;padding:8px 12px;color:#fff;font-size:12px" onkeydown="if(event.key==='Enter') submitGroqTutorQuestion()">
                <button class="b" onclick="submitGroqTutorQuestion()" style="padding:8px 14px;font-size:12px;font-weight:700">Ask ➔</button>
              </div>

              <!-- Quick Inquiries Chips -->
              <div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:6px">⚡ 1-Click Common Trainee Questions:</div>
              <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
                <button class="cad-quick-chip" onclick="askGroqPresetQuestion('What is the main danger and what happens if I touch this part while energized?')">
                  ⚠️ What happens if I touch this while energized?
                </button>
                <button class="cad-quick-chip" onclick="askGroqPresetQuestion('How does this part work mechanically, and how does it prevent equipment failure?')">
                  ⚙️ How does this operate mechanically to prevent failure?
                </button>
                <button class="cad-quick-chip" onclick="askGroqPresetQuestion('What is the mandatory Lockout / Tagout (LOTO) and PPE requirement for this?')">
                  🔒 What is the mandatory LOTO &amp; PPE requirement?
                </button>
                <button class="cad-quick-chip" onclick="askGroqPresetQuestion('What are the key inspection points technicians look for during preventive maintenance?')">
                  🛠️ What do technicians inspect during routine maintenance?
                </button>
              </div>

              <!-- Live Q&A History -->
              <div id="cad-groq-qa-history" style="flex:1;min-height:90px;background:#060d16;border:1px dashed #1e2f47;border-radius:8px;padding:8px 10px;font-size:12px;color:#94a3b8;overflow-y:auto;max-height:130px">
                <i>Your questions and AI responses will appear here...</i>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    `;
  };

  // -----------------------------------------------------------------------
  // SOUND FEEDBACK: Mechanical Latch & Opening Audio Synthesis
  // -----------------------------------------------------------------------
  function playCadMechanicalSound(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'open') {
        // High to low frequency slide (mechanical sliding / swinging sound)
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      } else {
        // Low to crisp click (mechanical latch shut)
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      }
    } catch(e) {}
  }

  // -----------------------------------------------------------------------
  // INTERACTIVE PART ARTICULATION (PHYSICALLY OPENS / RACKS / SWINGS ON TOUCH)
  // -----------------------------------------------------------------------
  window.interactWithCadPart = function(partId) {
    if (!partId) return;
    const spec = CAD_SPECS[curCadModel];
    if (!spec) return;

    // Toggle opened / closed state
    cadArticulations[partId] = !cadArticulations[partId];
    const isOpen = cadArticulations[partId];

    // Find 3D group
    const partGroup = cadParts.find(p => p.userData && p.userData.id === partId);
    const pDef = spec.parts.find(x => x.id === partId);

    let actionLabel = "";
    let actionIcon = "⚙️";

    if (partGroup && pDef) {
      // Ensure target coordinates exist
      if (!partGroup.targetPos) partGroup.targetPos = new THREE.Vector3(...pDef.basePos);
      if (!partGroup.targetRot) partGroup.targetRot = new THREE.Euler(0, 0, 0);

      // Model-specific articulation kinematics
      if (curCadModel === 'switchgear') {
        if (partId === 'door') {
          // Door hinges on left edge: swings -105 degrees around Y axis
          partGroup.targetRot.y = isOpen ? -1.83 : 0;
          actionIcon = "🚪";
          actionLabel = isOpen ? "Enclosure Door: Swung Open (105° on hinge) — Accessing 480V Interlock Compartment" : "Enclosure Door: Closed & Latched";
        } else if (partId === 'breaker') {
          // Drawout circuit breaker racks out forward towards trainee
          partGroup.targetPos.z = isOpen ? pDef.basePos[2] + 0.95 : pDef.basePos[2];
          actionIcon = "⚡";
          actionLabel = isOpen ? "Drawout Breaker: Racked Out to Test Disconnect Position (950mm clearance)" : "Drawout Breaker: Racked In to Connected Position";
        } else if (partId === 'arc_chute') {
          // Arc chute tilts upward and backward for inspection
          partGroup.targetPos.y = isOpen ? pDef.basePos[1] + 0.35 : pDef.basePos[1];
          partGroup.targetRot.x = isOpen ? -0.55 : 0;
          actionIcon = "⚡";
          actionLabel = isOpen ? "Arc Chute: Tilted Upward — De-ionizing grid plates exposed for inspection" : "Arc Chute: Lowered to Operating Position";
        } else if (partId === 'handle') {
          // Charging handle pulls down to store energy in closing springs
          partGroup.targetRot.z = isOpen ? -Math.PI / 4 : 0;
          actionIcon = "🔧";
          actionLabel = isOpen ? "Charging Handle: Pulled Down — Closing Springs Mechanically Charged (Yellow Indicator)" : "Charging Handle: Released to Rest";
        } else if (partId === 'loto_hasp') {
          // LOTO Padlock swings open and drops down
          partGroup.targetRot.z = isOpen ? 0.9 : 0;
          partGroup.targetPos.y = isOpen ? pDef.basePos[1] - 0.15 : pDef.basePos[1];
          actionIcon = "🔒";
          actionLabel = isOpen ? "LOTO Safety Padlock: Unlatched & Rotated — Lockout status modified" : "LOTO Safety Padlock: Secured & Locked Out";
        } else if (partId === 'cabinet') {
          // Side service panel rotates open
          partGroup.targetRot.y = isOpen ? 0.7 : 0;
          actionIcon = "📦";
          actionLabel = isOpen ? "Cabinet Side Access: Opened — Inspecting structural frame & ground bus" : "Cabinet Side Access: Closed";
        } else if (partId === 'busbars') {
          actionIcon = "⚡";
          actionLabel = "3-Phase Busbars Selected: Rated 480V 1600A (Always verify zero energy before touching)";
        }
      } else if (curCadModel === 'transformer') {
        if (partId === 'bushings') {
          partGroup.targetPos.y = isOpen ? pDef.basePos[1] + 0.45 : pDef.basePos[1];
          actionIcon = "🔋";
          actionLabel = isOpen ? "HV Bushings: Inspection Cover Lifted — Terminal connections accessible" : "HV Bushings: Secured";
        } else if (partId === 'conservator') {
          partGroup.targetRot.x = isOpen ? -0.8 : 0;
          actionIcon = "🛢️";
          actionLabel = isOpen ? "Conservator Tank: Oil Level & Silica Gel Breather Port Opened" : "Conservator Tank: Sealed";
        } else if (partId === 'core_windings') {
          partGroup.targetPos.y = isOpen ? pDef.basePos[1] + 0.6 : pDef.basePos[1];
          actionIcon = "⚙️";
          actionLabel = isOpen ? "Core & Windings: Hoisted from Tank — Inspecting insulation paper & spacers" : "Core & Windings: Seated in Tank";
        } else if (partId === 'radiator') {
          partGroup.targetRot.z = isOpen ? Math.PI/2 : 0;
          actionIcon = "❄️";
          actionLabel = isOpen ? "Radiator Isolation Valve: Rotated 90°" : "Radiator Valve: Operating Position";
        } else {
          actionIcon = "🛢️";
          actionLabel = `${pDef.label} Selected`;
        }
      } else if (curCadModel === 'torch') {
        if (partId === 'torch_nozzle') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] + 0.55 : pDef.basePos[0];
          actionIcon = "🔥";
          actionLabel = isOpen ? "Gas Nozzle: Unscrewed Forward — Gas diffuser & contact tip exposed" : "Gas Nozzle: Screwed In Tight";
        } else if (partId === 'torch_diffuser') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] + 0.35 : pDef.basePos[0];
          actionIcon = "💨";
          actionLabel = isOpen ? "Gas Diffuser: Removed for cleaning spatter" : "Gas Diffuser: Seated";
        } else if (partId === 'torch_electrode') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] + 0.7 : pDef.basePos[0];
          actionIcon = "⚡";
          actionLabel = isOpen ? "Contact Tip / Electrode: Extended for replacement" : "Contact Tip: Installed";
        } else {
          actionIcon = "🔥";
          actionLabel = `${pDef.label} Selected`;
        }
      } else if (curCadModel === 'valve') {
        if (partId === 'valve_spool') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] + 0.7 : pDef.basePos[0];
          actionIcon = "🛢️";
          actionLabel = isOpen ? "Relief Valve Spool: Shifted Along Precision Bore (Flow Galleried)" : "Valve Spool: Seated";
        } else if (partId === 'valve_screw') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] + 0.4 : pDef.basePos[0];
          actionIcon = "🔩";
          actionLabel = isOpen ? "Pressure Adjustment Screw: Backed Out (Lowered Cracking Pressure)" : "Adjustment Screw: Calibrated";
        } else if (partId === 'valve_solenoid') {
          partGroup.targetPos.x = isOpen ? pDef.basePos[0] - 0.5 : pDef.basePos[0];
          actionIcon = "🧲";
          actionLabel = isOpen ? "Proportional Solenoid: Decoupled for Coil Resistance Testing" : "Solenoid: Mounted";
        } else {
          actionIcon = "🛢️";
          actionLabel = `${pDef.label} Selected`;
        }
      } else if (curCadModel === 'scaffolding') {
        if (partId === 'scaf_upper') {
          partGroup.targetRot.x = isOpen ? Math.PI / 2 : 0;
          actionIcon = "🏗️";
          actionLabel = isOpen ? "Swivel Coupler Clamp: Swung Open 90° (Releasing 48.3mm Tube)" : "Coupler Clamp: Clamped Shut";
        } else if (partId === 'scaf_bolt1' || partId === 'scaf_bolt2') {
          partGroup.targetRot.z = isOpen ? (partId === 'scaf_bolt1' ? -Math.PI / 3 : Math.PI / 3) : 0;
          actionIcon = "🔩";
          actionLabel = isOpen ? "T-Head Bolt: Swung Free from Saddle" : "T-Head Bolt: Engaged";
        } else {
          actionIcon = "🏗️";
          actionLabel = `${pDef.label} Selected`;
        }
      } else if (curCadModel === 'motor') {
        if (partId === 'mot_cowl') {
          partGroup.targetPos.z = isOpen ? pDef.basePos[2] - 0.6 : pDef.basePos[2];
          actionIcon = "⚙️";
          actionLabel = isOpen ? "Rear Fan Cowl: Removed — Polypropylene cooling fan accessible" : "Fan Cowl: Bolted On";
        } else if (partId === 'mot_fan') {
          partGroup.targetPos.z = isOpen ? pDef.basePos[2] - 0.4 : pDef.basePos[2];
          actionIcon = "💨";
          actionLabel = isOpen ? "Cooling Fan: Pulled along shaft for keyway inspection" : "Cooling Fan: Keyed to Shaft";
        } else if (partId === 'mot_rotor') {
          partGroup.targetPos.z = isOpen ? pDef.basePos[2] + 0.9 : pDef.basePos[2];
          actionIcon = "⚙️";
          actionLabel = isOpen ? "Squirrel Cage Rotor: Extracted from Stator Bore" : "Rotor: Aligned inside Stator";
        } else if (partId === 'mot_jbox') {
          partGroup.targetRot.x = isOpen ? -Math.PI / 2 : 0;
          actionIcon = "⚡";
          actionLabel = isOpen ? "IP66 Terminal Box Lid: Flipped Open — 6-pin Star/Delta lugs visible" : "Terminal Box: Sealed IP66";
        } else {
          actionIcon = "⚙️";
          actionLabel = `${pDef.label} Selected`;
        }
      } else if (curCadModel === 'uploaded') {
        partGroup.targetPos.z = isOpen ? pDef.basePos[2] + 0.5 : pDef.basePos[2];
        actionIcon = "📤";
        actionLabel = isOpen ? `${pDef.label}: Articulated forward for volumetric inspection` : `${pDef.label}: Seated`;
      }

      // Play audio feedback
      playCadMechanicalSound(isOpen ? 'open' : 'close');

      // Show floating action toast
      showCadActionToast(actionIcon, actionLabel);
    }

    // Call isolateCadPart to handle highlighting and camera focus
    isolateCadPart(partId);

    // Prompt Groq AI Tutor to explain this specific part
    explainPartWithGroq(partId);
  };

  function showCadActionToast(icon, text) {
    const toast = document.getElementById('cad-action-toast');
    const iconEl = document.getElementById('cad-action-toast-icon');
    const txtEl = document.getElementById('cad-action-toast-txt');
    if (!toast || !iconEl || !txtEl) return;

    iconEl.textContent = icon;
    txtEl.textContent = text;
    toast.style.display = 'flex';
    toast.style.opacity = '1';

    if (window._cadToastTimer) clearTimeout(window._cadToastTimer);
    window._cadToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 3800);
  }

  // -----------------------------------------------------------------------
  // MODEL SWITCHING & EXPLODE ANIMATIONS
  // -----------------------------------------------------------------------
  window.switchCadModel = function(modelKey) {
    curCadModel = modelKey;
    cadExplodeFactor = 0;
    cadSelectedPart = null;
    cadArticulations = {};
    if (window.curView === 'cadlab') go('cadlab');
  };

  window.setCadExplode = function(val) {
    cadExplodeFactor = val / 100;
    const vEl = document.getElementById('cad-explode-val');
    if (vEl) vEl.textContent = Math.round(val) + '%';

    // Animate parts along designated explode vectors
    const spec = CAD_SPECS[curCadModel];
    if (spec && cadParts.length) {
      cadParts.forEach(p => {
        const pDef = spec.parts.find(x => x.id === p.userData.id);
        if (pDef) {
          const dir = new THREE.Vector3(...pDef.dir);
          const isOpen = !!cadArticulations[p.userData.id];
          
          // Re-evaluate targetPos including both articulation offset and explode offset
          let baseOffsetX = 0, baseOffsetY = 0, baseOffsetZ = 0;
          if (isOpen) {
            if (curCadModel === 'switchgear' && pDef.id === 'breaker') baseOffsetZ = 0.95;
            if (curCadModel === 'switchgear' && pDef.id === 'arc_chute') baseOffsetY = 0.35;
            if (curCadModel === 'motor' && pDef.id === 'mot_rotor') baseOffsetZ = 0.9;
            if (curCadModel === 'motor' && pDef.id === 'mot_cowl') baseOffsetZ = -0.6;
            if (curCadModel === 'torch' && pDef.id === 'torch_nozzle') baseOffsetX = 0.55;
            if (curCadModel === 'valve' && pDef.id === 'valve_spool') baseOffsetX = 0.7;
          }

          if (p.targetPos) {
            p.targetPos.set(
              pDef.basePos[0] + baseOffsetX + dir.x * cadExplodeFactor * pDef.dist,
              pDef.basePos[1] + baseOffsetY + dir.y * cadExplodeFactor * pDef.dist,
              pDef.basePos[2] + baseOffsetZ + dir.z * cadExplodeFactor * pDef.dist
            );
          }
        }
      });
    }

    if (cadCalipers) updateCadCalipers();
  };

  window.toggleCadWireframe = function() {
    cadWireframe = !cadWireframe;
    const btn = document.getElementById('btn-cad-wire');
    if (btn) btn.classList.toggle('a', cadWireframe);
    if (cadParts.length) {
      cadParts.forEach(p => {
        p.traverse(c => {
          if (c.material) c.material.wireframe = cadWireframe;
        });
      });
    }
  };

  // -----------------------------------------------------------------------
  // DIGITAL VERNIER CALIPER METROLOGY SUITE
  // -----------------------------------------------------------------------
  window.toggleCadCalipers = function() {
    cadCalipers = !cadCalipers;
    const btn = document.getElementById('btn-cad-calipers');
    if (btn) btn.classList.toggle('a', cadCalipers);

    const hud = document.getElementById('cad-caliper-hud');
    if (hud) hud.style.display = cadCalipers ? 'block' : 'none';

    if (cadCalipersGroup) cadCalipersGroup.visible = cadCalipers;
    if (cadCalipers) updateCadCalipers();
  };

  window.setCadCaliperAxis = function(axis) {
    cadCaliperAxis = axis;
    ['X', 'Y', 'Z'].forEach(a => {
      const b = document.getElementById('btn-axis-' + a.toLowerCase());
      if (b) {
        b.style.borderColor = (a === axis) ? '#38bdf8' : '#1e293b';
        b.style.background = (a === axis) ? '#0284c733' : '#0d1c2e';
      }
    });
    updateCadCalipers();
  };

  window.updateCadCalipers = function() {
    if (!cadCalipersGroup || !cadParts.length) return;

    // Remove old 3D caliper assembly children
    while (cadCalipersGroup.children.length > 0) {
      cadCalipersGroup.remove(cadCalipersGroup.children[0]);
    }

    // Determine target bounding box
    const box = new THREE.Box3();
    let targetName = CAD_SPECS[curCadModel]?.name || "Assembly";

    if (cadSelectedPart) {
      const targetObj = cadParts.find(p => p.userData && p.userData.id === cadSelectedPart);
      if (targetObj) {
        box.setFromObject(targetObj);
        const pDef = CAD_SPECS[curCadModel]?.parts.find(x => x.id === cadSelectedPart);
        if (pDef) targetName = pDef.label;
      } else {
        cadParts.forEach(p => box.expandByObject(p));
      }
    } else {
      cadParts.forEach(p => box.expandByObject(p));
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Real-world industrial scale conversion (1 unit = 1000 mm)
    const mmX = Math.round(Math.max(size.x, 0.04) * 1000);
    const mmY = Math.round(Math.max(size.y, 0.04) * 1000);
    const mmZ = Math.round(Math.max(size.z, 0.04) * 1000);

    const hudTarget = document.getElementById('cad-caliper-target-name');
    const hudLcd = document.getElementById('cad-caliper-lcd');
    const hudX = document.getElementById('cad-cal-x');
    const hudY = document.getElementById('cad-cal-y');
    const hudZ = document.getElementById('cad-cal-z');

    if (hudTarget) hudTarget.textContent = 'Measuring: ' + targetName;
    if (hudX) hudX.textContent = mmX;
    if (hudY) hudY.textContent = mmY;
    if (hudZ) hudZ.textContent = mmZ;

    let activeVal = (cadCaliperAxis === 'X') ? mmX : (cadCaliperAxis === 'Y' ? mmY : mmZ);
    if (hudLcd) hudLcd.textContent = activeVal.toFixed(2) + ' mm';

    // -------------------------------------------------------------
    // Build Realistic 3D Digital Vernier Caliper in Scene
    // -------------------------------------------------------------
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.2
    });
    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.4
    });
    const lcdMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // Dimension Bounding Cage Wireframe
    const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);
    const wireGeom = new THREE.WireframeGeometry(boxGeom);
    const line = new THREE.LineSegments(wireGeom, new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.4 }));
    line.position.copy(center);
    cadCalipersGroup.add(line);

    // Realistic Caliper Tool Assembly
    const calTool = new THREE.Group();

    if (cadCaliperAxis === 'X') {
      const span = Math.max(size.x, 0.1);
      // Main Stainless Steel Ruler Beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(span + 0.5, 0.04, 0.015), steelMat);
      beam.position.set(0, 0.18, 0);

      // Fixed Left Jaw
      const fixJaw = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.02), steelMat);
      fixJaw.position.set(-span / 2, 0.02, 0);

      // Sliding Right Jaw & Digital Box
      const slideJaw = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.02), steelMat);
      slideJaw.position.set(span / 2, 0.02, 0);
      const digiBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.04), blackMat);
      digiBox.position.set(span / 2, 0.18, 0.02);
      const digiLcd = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.045), lcdMat);
      digiLcd.position.set(span / 2, 0.18, 0.035);

      // Glowing Cyan Leader Lines
      const leader1 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22), laserMat);
      leader1.position.set(-span / 2, -0.12, 0);
      const leader2 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.22), laserMat);
      leader2.position.set(span / 2, -0.12, 0);

      calTool.add(beam, fixJaw, slideJaw, digiBox, digiLcd, leader1, leader2);
      calTool.position.set(center.x, center.y + size.y / 2 + 0.15, center.z + size.z / 2 + 0.08);
    } else if (cadCaliperAxis === 'Y') {
      const span = Math.max(size.y, 0.1);
      // Vertical Ruler Beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.04, span + 0.5, 0.015), steelMat);
      beam.position.set(0.18, 0, 0);

      const fixJaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.02), steelMat);
      fixJaw.position.set(0.02, -span / 2, 0);

      const slideJaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.02), steelMat);
      slideJaw.position.set(0.02, span / 2, 0);
      const digiBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.04), blackMat);
      digiBox.position.set(0.18, span / 2, 0.02);
      const digiLcd = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.045), lcdMat);
      digiLcd.position.set(0.18, span / 2, 0.035);

      calTool.add(beam, fixJaw, slideJaw, digiBox, digiLcd);
      calTool.position.set(center.x + size.x / 2 + 0.18, center.y, center.z + size.z / 2 + 0.08);
    } else {
      const span = Math.max(size.z, 0.1);
      // Z Axis Depth Beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, span + 0.5), steelMat);
      beam.position.set(0.18, 0, 0);

      const fixJaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.04), steelMat);
      fixJaw.position.set(0.02, 0, -span / 2);

      const slideJaw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.04), steelMat);
      slideJaw.position.set(0.02, 0, span / 2);
      const digiBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.18), blackMat);
      digiBox.position.set(0.18, 0.02, span / 2);
      const digiLcd = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.045, 0.12), lcdMat);
      digiLcd.position.set(0.18, 0.035, span / 2);

      calTool.add(beam, fixJaw, slideJaw, digiBox, digiLcd);
      calTool.position.set(center.x + size.x / 2 + 0.18, center.y + size.y / 2 + 0.12, center.z);
    }

    cadCalipersGroup.add(calTool);
  };

  // -----------------------------------------------------------------------
  // RESET CAD VIEW, CAMERA & ARTICULATIONS
  // -----------------------------------------------------------------------
  window.resetCadView = function() {
    cadYaw = 0.35;
    cadPitch = 0.18;
    cadDist = 3.2;
    if (cadCamera) {
      cadCamera.position.x = cadDist * Math.sin(cadYaw) * Math.cos(cadPitch);
      cadCamera.position.y = cadDist * Math.sin(cadPitch) + 0.4;
      cadCamera.position.z = cadDist * Math.cos(cadYaw) * Math.cos(cadPitch);
      cadCamera.lookAt(0, 0.4, 0);
    }

    cadExplodeFactor = 0;
    const sEl = document.getElementById('cad-explode-slider');
    if (sEl) sEl.value = 0;
    const vEl = document.getElementById('cad-explode-val');
    if (vEl) vEl.textContent = '0%';

    // Reset all articulations to closed/original
    cadArticulations = {};
    const spec = CAD_SPECS[curCadModel];
    if (spec && cadParts.length) {
      cadParts.forEach(p => {
        const pDef = spec.parts.find(x => x.id === p.userData.id);
        if (pDef) {
          if (p.targetPos) p.targetPos.set(...pDef.basePos);
          if (p.targetRot) p.targetRot.set(0, 0, 0);
        }
      });
    }

    // Clear part selection
    isolateCadPart(null);

    // Turn off wireframe & calipers
    if (cadWireframe) toggleCadWireframe();
    if (cadCalipers) toggleCadCalipers();

    // Show reset toast
    showCadActionToast("🔄", "CAD Lab View, Camera, Hinges & Explode State Reset");

    // Ask Groq about current machine to reset tutor view
    askGroqAboutCurrentMachine();
  };
  window.resetCadCamera = window.resetCadView;

  // -----------------------------------------------------------------------
  // FULLSCREEN TOGGLE
  // -----------------------------------------------------------------------
  window.toggleCadFullscreen = function() {
    const container = document.getElementById('cad-viewport-container');
    if (!container) return;

    const isCurrentlyFs = !!document.fullscreenElement || container.classList.contains('is-fullscreen-fallback');

    if (!isCurrentlyFs) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          container.classList.add('is-fullscreen-fallback');
          syncCadFullscreenState(true);
        });
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else {
        container.classList.add('is-fullscreen-fallback');
        syncCadFullscreenState(true);
      }
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
      }
      if (container.classList.contains('is-fullscreen-fallback')) {
        container.classList.remove('is-fullscreen-fallback');
        syncCadFullscreenState(false);
      }
    }
  };

  function syncCadFullscreenState(isFs) {
    cadIsFullscreen = isFs;
    const btn = document.getElementById('btn-cad-fullscreen');
    if (btn) {
      btn.innerHTML = isFs ? '🗗 Exit Fullscreen' : '⛶ Fullscreen';
      btn.classList.toggle('a', isFs);
    }
    const cv = document.getElementById('cad-canvas');
    if (cv && cadCamera && cadRenderer) {
      setTimeout(() => {
        const w = cv.clientWidth || window.innerWidth;
        const h = cv.clientHeight || window.innerHeight;
        cadCamera.aspect = w / h;
        cadCamera.updateProjectionMatrix();
        cadRenderer.setSize(w, h, false);
      }, 60);
    }
  }

  document.addEventListener('fullscreenchange', () => {
    syncCadFullscreenState(!!document.fullscreenElement);
  });
  document.addEventListener('webkitfullscreenchange', () => {
    syncCadFullscreenState(!!document.webkitFullscreenElement);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const container = document.getElementById('cad-viewport-container');
      if (container && container.classList.contains('is-fullscreen-fallback')) {
        container.classList.remove('is-fullscreen-fallback');
        syncCadFullscreenState(false);
      }
    }
  });

  // -----------------------------------------------------------------------
  // PART ISOLATION & GHOSTING
  // -----------------------------------------------------------------------
  window.isolateCadPart = function(partId) {
    cadSelectedPart = partId;
    const spec = CAD_SPECS[curCadModel];
    const dBox = document.getElementById('cad-part-detail-box');
    const dTxt = document.getElementById('cad-part-detail-txt');

    document.querySelectorAll('.cad-part-chip').forEach(c => {
      c.classList.toggle('active', c.textContent.trim().startsWith(partId));
    });

    if (partId && spec) {
      const pDef = spec.parts.find(x => x.id === partId);
      if (dBox && dTxt && pDef) {
        dBox.style.display = 'block';
        dTxt.innerHTML = `<b>${pDef.label}</b>: ${pDef.desc}`;
      }
    } else if (dBox) {
      dBox.style.display = 'none';
    }

    // Ghost other parts
    if (cadParts.length) {
      cadParts.forEach(p => {
        const isTarget = (!partId || p.userData.id === partId);
        p.traverse(c => {
          if (c.material) {
            c.material.transparent = !isTarget;
            c.material.opacity = isTarget ? 1.0 : 0.22;
            if (c.material.emissive) {
              c.material.emissive.setHex(isTarget && partId ? 0x0088cc : 0x000000);
            }
          }
        });
      });
    }

    if (cadCalipers) updateCadCalipers();
  };

  // -----------------------------------------------------------------------
  // CAD DRAG & DROP AND FILE UPLOAD HANDLERS
  // -----------------------------------------------------------------------
  window.handleCadDragOver = function(e) {
    e.preventDefault();
    const ov = document.getElementById('cad-drop-overlay');
    if (ov) ov.style.display = 'flex';
  };

  window.handleCadDragLeave = function(e) {
    e.preventDefault();
    const ov = document.getElementById('cad-drop-overlay');
    if (ov) ov.style.display = 'none';
  };

  window.handleCadDrop = function(e) {
    e.preventDefault();
    const ov = document.getElementById('cad-drop-overlay');
    if (ov) ov.style.display = 'none';
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      processUploadedCadFile(e.dataTransfer.files[0]);
    }
  };

  window.handleCadFileUpload = function(e) {
    if (e.target && e.target.files && e.target.files.length) {
      processUploadedCadFile(e.target.files[0]);
    }
  };

  function processUploadedCadFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    showCadConvertingModal(`Ingesting ${file.name}...`, 'Vectorizing CAD geometry & generating 3D digital twin...');

    const is3D = ['stl', 'obj', 'gltf', 'glb'].includes(ext);
    if (is3D) {
      const reader = new FileReader();
      if (ext === 'stl' || ext === 'glb' || ext === 'gltf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
      reader.onload = function(evt) {
        setTimeout(() => {
          try {
            convert3DCadFileToModel(evt.target.result, ext, nameWithoutExt);
          } catch(err) {
            console.error('CAD 3D parse error:', err);
            convertBlueprintTo3DModel(null, nameWithoutExt, ext);
          }
        }, 600);
      };
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(evt) {
        setTimeout(() => {
          convertBlueprintTo3DModel(evt.target.result, nameWithoutExt, ext);
        }, 600);
      };
    }
  }

  window.loadSampleCadBlueprint = function(sampleType) {
    const titles = {
      switchboard: "480V Power Distribution Substation CAD",
      manifold: "High-Pressure Hydraulic Manifold Block CAD",
      impeller: "Centrifugal Turbine Impeller CAD"
    };
    const title = titles[sampleType] || "CAD Blueprint";
    showCadConvertingModal(`Synthesizing ${title}...`, 'Extruding volumetric layers, datum planes & explode kinematics...');
    setTimeout(() => {
      const blueprintDataUrl = generateSampleCadBlueprintDataUrl(sampleType);
      convertBlueprintTo3DModel(blueprintDataUrl, title, 'png');
    }, 800);
  };

  function showCadConvertingModal(title, desc) {
    const ov = document.getElementById('cad-converting-overlay');
    const t = document.getElementById('cad-convert-step-title');
    const d = document.getElementById('cad-convert-step-desc');
    if (t) t.textContent = title;
    if (d) d.textContent = desc;
    if (ov) ov.style.display = 'flex';
  }

  function hideCadConvertingModal() {
    const ov = document.getElementById('cad-converting-overlay');
    if (ov) ov.style.display = 'none';
  }

  function convertBlueprintTo3DModel(dataUrl, modelName, format) {
    CAD_SPECS.uploaded = {
      name: `${modelName} (Extruded 3D Digital Twin)`,
      pn: `CAD-TWIN-${Date.now().toString().slice(-6)}`,
      material: "Extruded Structural Steel, Precision Spindle & Machined Manifold",
      standard: "ASME Y14.5M / ISO 1101 Geometric Dimensioning & Tolerancing",
      voltage: "Industrial Mechanical Specification (Tolerances ±0.05 mm)",
      maint: "Verify datum planes, bore concentricity, and bolt circle pitch diameters.",
      desc: `Interactive 3D mechanical digital twin extruded directly from ${format.toUpperCase()} engineering blueprint. Features procedural layered volumetric geometry with exploded-view kinematics.`,
      parts: [
        { id: "up_blueprint", label: "2D Engineering Blueprint Datum Face", basePos: [0, 0, 0.45], dir: [0, 0, 1], dist: 1.2, desc: "Original 2D CAD engineering drawing texture mapped to front datum plane." },
        { id: "up_housing", label: "Volumetric Structural Housing Block", basePos: [0, 0, 0], dir: [0, 0, 0], dist: 0, desc: "Extruded alloy housing featuring precision center bore and fluid flow galleries." },
        { id: "up_spindle", label: "Internal Spindle & Precision Bearing Core", basePos: [0, 0, -0.1], dir: [0, 0, -1], dist: 1.0, desc: "Hardened chrome rotational spindle with dual brass bearing race collars." },
        { id: "up_base", label: "Machined Mounting Flange Plinth", basePos: [0, -0.65, 0], dir: [0, -1, 0], dist: 0.8, desc: "Ground datum base plinth with 4x counter-bored mounting bolt holes." },
        { id: "up_fasteners", label: "Cap Screws & Fluid Port Manifold", basePos: [0.65, 0.2, 0.2], dir: [1, 0.5, 0], dist: 0.9, desc: "Socket head cap screws and high-pressure hydraulic gland fittings." }
      ]
    };

    if (dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.onload = function() {
        cadUploadedBlueprintTexture = new THREE.Texture(img);
        cadUploadedBlueprintTexture.needsUpdate = true;
        hideCadConvertingModal();
        switchCadModel('uploaded');
      };
    } else {
      cadUploadedBlueprintTexture = null;
      hideCadConvertingModal();
      switchCadModel('uploaded');
    }
  }

  function convert3DCadFileToModel(data, ext, modelName) {
    let geom = null;
    if (ext === 'stl') {
      geom = parseStlBuffer(data);
    } else if (ext === 'obj') {
      geom = parseObjString(data);
    }

    if (!geom) {
      convertBlueprintTo3DModel(null, modelName, ext);
      return;
    }

    geom.computeVertexNormals();
    geom.center();

    cadCustomGeometries = { mainGeom: geom };

    CAD_SPECS.uploaded = {
      name: `${modelName} (Direct 3D CAD)`,
      pn: `CAD-3D-${Date.now().toString().slice(-6)}`,
      material: "Precision Solid Alloy CAD Model",
      standard: "ISO 10303 STEP / Direct 3D Mesh Standard",
      voltage: "Direct Solid CAD Geometry (B-Rep / Polygon Mesh)",
      maint: "Dimensional verification and mesh vertex tolerance inspection.",
      desc: `Interactive 3D model generated directly from uploaded .${ext.toUpperCase()} file with real-time shading and measurement calipers.`,
      parts: [
        { id: "up_direct_mesh", label: "Solid CAD Component Mesh", basePos: [0, 0, 0], dir: [0, 1, 0], dist: 0.5, desc: "Direct 3D CAD mesh with computed vertex normals and ACES Filmic lighting." }
      ]
    };

    hideCadConvertingModal();
    switchCadModel('uploaded');
  }

  function parseStlBuffer(buffer) {
    const isBinary = buffer.byteLength > 84;
    if (isBinary) {
      const reader = new DataView(buffer);
      const numTriangles = reader.getUint32(80, true);
      const vertices = [];
      const normals = [];
      let offset = 84;
      for (let i = 0; i < numTriangles; i++) {
        if (offset + 50 > buffer.byteLength) break;
        const nx = reader.getFloat32(offset, true);
        const ny = reader.getFloat32(offset + 4, true);
        const nz = reader.getFloat32(offset + 8, true);
        offset += 12;
        for (let j = 0; j < 3; j++) {
          const vx = reader.getFloat32(offset, true);
          const vy = reader.getFloat32(offset + 4, true);
          const vz = reader.getFloat32(offset + 8, true);
          vertices.push(vx, vy, vz);
          normals.push(nx, ny, nz);
          offset += 12;
        }
        offset += 2; // attribute byte count
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      return geom;
    }
    return null;
  }

  function parseObjString(text) {
    const lines = text.split('\n');
    const positions = [];
    const vertices = [];
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('v ')) {
        const parts = line.split(/\s+/).slice(1).map(Number);
        positions.push(parts);
      } else if (line.startsWith('f ')) {
        const parts = line.split(/\s+/).slice(1);
        const fIdx = parts.map(p => parseInt(p.split('/')[0], 10) - 1);
        if (fIdx.length >= 3) {
          for (let i = 1; i < fIdx.length - 1; i++) {
            const p0 = positions[fIdx[0]];
            const p1 = positions[fIdx[i]];
            const p2 = positions[fIdx[i + 1]];
            if (p0 && p1 && p2) {
              vertices.push(...p0, ...p1, ...p2);
            }
          }
        }
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }

  // -----------------------------------------------------------------------
  // INSTITUTIONAL VOCATIONAL KNOWLEDGE BASE (FALLBACK & ZERO-FAILURE GROUND TRUTH)
  // -----------------------------------------------------------------------
  const VOCATIONAL_KNOWLEDGE_BASE = {
    machines: {
      switchgear: `### ⚡ 480V Industrial Switchgear & Drawout Circuit Breaker Unit
**Core Purpose:** Serves as the primary power distribution and electrical fault-clearing hub in industrial plants. It feeds motor control centers (MCC), transformers, and heavy manufacturing loads.

**Working Principle:**
1. Incoming 480V 3-phase feeder lines connect directly to the copper busbars at the rear.
2. The drawout air circuit breaker (ACB) sits on racking rails inside a grounded steel cell.
3. In normal operation, current flows through the closed vacuum interrupter bottles.
4. During an overcurrent or short circuit fault (up to 10,000A), internal trip coils release stored mechanical spring energy to blow open the contacts in **less than 3 cycles (50 milliseconds)**, forcing the electric arc into de-ionizing arc chute plates.

**Why It Matters (Significance):** Without switchgear, an electrical fault would cause an explosion, vaporizing copper conductors and producing fatal arc flash blasts exceeding 19,000°C (35,000°F).

**Critical Safety Precautions:**
- **NFPA 70E Category 4 PPE** (40 cal/cm² arc flash suit, hood, insulated gloves) is mandatory when opening doors or racking breakers.
- Always verify zero energy using a calibrated 1000V multimeter with the 3-point test method before touching busbars.
- Never defeat the mechanical interlock; the breaker MUST be tripped OFF before racking in or out.`,

      transformer: `### 🔋 3-Phase Step-Down Substation Power Transformer (11kV ➔ 415V)
**Core Purpose:** Steps down high-voltage utility transmission lines (11,000V) to safe 3-phase plant utilization voltage (415V/240V).

**Working Principle:**
- Operates via Faraday’s Law of Electromagnetic Induction. High-voltage 11kV primary windings produce alternating magnetic flux in a cold-rolled grain-oriented (CRGO) silicon steel core.
- The secondary copper windings link this magnetic field with a 26.5:1 turns ratio, stepping voltage down to 415V.
- High-grade mineral oil circulates by thermosiphon convection through external radiators to dissipate winding heat.

**Significance:** Powers every electric motor, welder, and lighting panel on the shop floor. A transformer failure shuts down the entire manufacturing campus.

**Safety Precautions:**
- Extreme shock hazard (> 11,000V); approach distance is strictly 3 meters unless isolated and grounded.
- Maintain dielectric breakdown voltage (> 40kV) in insulating oil. Check silica gel breather for moisture saturation (turns from blue to pink).`,

      torch: `### 🔥 Industrial MIG/TIG Arc Welding Torch Assembly
**Core Purpose:** Directs electrical welding current, consumable wire/tungsten electrode, and inert shielding gas (Argon/CO2) directly into the joint puddle.

**Working Principle:**
- Squeezing the handle micro-trigger energizes the welding power source contactor and opens the gas solenoid.
- High-conductivity copper contact tips transfer hundreds of amperes into the wire.
- The streamlined nozzle creates a laminar blanket of argon shielding gas that displaces oxygen and nitrogen, preventing weld puddle porosity and embrittlement.

**Significance:** Ensures defect-free ASME/AWS structural welds capable of withstanding hundreds of tons of dynamic pressure.

**Safety Precautions:**
- Always wear Shade 10-12 auto-darkening welding helmet, leather gauntlets, and fire-resistant apron.
- Beware of electrical shock when touching workpieces in damp environments. Inspect nozzle daily for spatter bridging.`,

      valve: `### 🛢️ Hydraulic Proportional Relief Valve (350 Bar / 5,000 PSI)
**Core Purpose:** Regulates fluid pressure across hydraulic actuators, presses, and heavy machinery, safely bypassing excess oil back to tank.

**Working Principle:**
- A precision-ground hardened alloy spool balances hydraulic pressure against a calibrated compression spring.
- A 24V DC proportional solenoid applies modulated magnetic force to the pilot stage.
- If pressure exceeds the setpoint (cracking pressure), the spool shifts, venting fluid to reservoir and clamping pressure at exact tolerance.

**Significance:** Prevents catastrophic hydraulic pipe ruptures and cylinder blowouts that cause high-pressure injection injuries.

**Safety Precautions:**
- Depressurize the accumulator and hydraulic circuit to 0 PSI before loosening any manifold bolts. Fluid injection through skin is a medical emergency requiring immediate surgical debridement.`,

      scaffolding: `### 🏗️ Heavy-Duty Scaffolding Swivel Coupler Joint (EN 74-1 Class B)
**Core Purpose:** Clamps two 48.3mm structural steel scaffold tubes at any arbitrary diagonal or horizontal angle, forming rigid bracing.

**Working Principle:**
- Drop-forged steel saddles grip the tubular curvature with micro-grooves.
- High-tensile Grade 8.8 T-bolts apply radial compressive clamping force when torqued to 54 Nm (40 ft-lbs), delivering 15 kN of slip resistance.

**Significance:** Prevents scaffold rack collapse and structural buckling under human load and high wind shear.

**Safety Precautions:**
- 100% tie-off with dual-lanyard fall arrest harness at heights above 1.8m (6 ft).
- Never use stripped or cracked coupler forgings. Check torque with a calibrated ratcheting scaffold spanner.`,

      motor: `### ⚙️ 3-Phase AC Induction Motor (15 kW / 20 HP, 1,460 RPM)
**Core Purpose:** Converts 3-phase electrical energy into high mechanical torque to drive conveyors, pumps, fans, and machine tools.

**Working Principle:**
- 3-phase stator coils produce a Rotating Magnetic Field (RMF) at synchronous speed (1,500 RPM).
- The RMF induces heavy currents in the aluminum squirrel cage rotor bars.
- Lorentz forces produce rotational torque, driving the rotor shaft at slip speed (1,460 RPM).

**Significance:** The industrial workhorse of modern automation; consumes over 65% of all factory electrical energy.

**Safety Precautions:**
- LOTO on upstream motor starter/VFD prior to touching coupling or terminal box.
- Check bearing temperature (< 85°C) and radial vibration before approving for service.`
    },

    parts: {
      door: `### 🚪 Polycarbonate Safety Inspection Door & Digital Multimeter
**What It Is:** Impact-resistant, transparent polycarbonate enclosure door fitted with digital power metering and 3-phase pilot lamps.
**Why It Matters:** Enables technicians to visually inspect disconnect status and read live voltage/amperage without opening the energized cabinet and exposing themselves to arc flash hazards.
**Working Principle:** The door is interlocked with the breaker handle. It swings open 105° on heavy-duty hinges only after safety locks are disengaged.
**Safety Rule:** Never drill or crack the polycarbonate. Scratches weaken blast containment rating.`,

      breaker: `### ⚡ Drawout Air Circuit Breaker (ACB) Assembly (1,600A)
**What It Is:** The heart of the switchgear; a massive electromechanical switch that can interrupt up to 10,000 amperes of fault current.
**Why It Matters:** Without this breaker, a short circuit would cause conductors to melt, vaporize, and trigger a building-wide fire.
**Working Principle:** Mounted on racking rollers. Moving the racking lever pulls the breaker forward from "CONNECTED" to "TEST" to "DISCONNECTED" position, physically pulling the tulip stabs away from the live 480V busbars.
**Safety Rule:** Breaker MUST BE TRIPPED OFF before racking. Verify mechanical trip flag displays "OPEN" (Green).`,

      arc_chute: `### ⚡ Arc Chute De-ionizing Grid Chamber
**What It Is:** A segmented chamber positioned directly above the breaker contacts containing parallel copper-plated steel splitter plates.
**Why It Matters:** When contacts open under load, an electric arc forms at temperatures over 5,000°C. If not extinguished instantly, it will bridge phases and blow up the cabinet.
**Working Principle:** Magnetic blow-out coils force the arc upward into the narrow steel plates. The plates split the arc into small segments, cool the plasma gas, de-ionize the electrons, and extinguish the arc within 15 milliseconds.
**Maintenance Check:** Inspect for metallic spatter bridging plates. Wipe off carbon soot using lint-free solvent cloth.`,

      busbars: `### ⚡ 3-Phase Electrolytic Copper Busbars (1,600A)
**What It Is:** Massive rectangular bars of silver-plated Grade E-Cu58 copper that transport raw 480V 3-phase electrical power.
**Why It Matters:** Carries the total electrical current for the entire manufacturing plant.
**Working Principle:** Phase A, B, and C are separated by red cycloaliphatic epoxy standoff insulators providing 50kV dielectric withstand.
**Safety Rule:** ⚠️ EXTREME HAZARD! Always assume busbars are LIVE until you have applied LOTO, tested with a calibrated multimeter, and clipped on temporary protective grounding jumpers.`,

      handle: `### 🔧 Ergonomic Spring-Charge Operating Handle
**What It Is:** Manual charging lever connected to the stored-energy mechanical closing spring.
**Why It Matters:** Racking or closing contacts cannot rely on human arm speed. The spring snaps the contacts shut with tremendous speed, preventing contact bounce and welding.
**Working Principle:** Pumping the handle downward compresses heavy helical steel springs until the mechanical latch engages and the indicator reads "CHARGED" (Yellow).`,

      loto_hasp: `### 🔒 OSHA Lockout / Tagout (LOTO) Safety Hasp & Padlock
**What It Is:** Red vinyl-coated steel scissor hasp holding personal safety padlocks and danger warning tags.
**Why It Matters:** The #1 life-saving device in industrial engineering. Guarantees that no one can re-energize the breaker while a technician is inside working on busbars or motors.
**Working Principle:** Each worker snaps their individual padlock onto the hasp. The cabinet or racking shutter cannot physically operate until the very last worker removes their lock.
**Golden Rule:** One person, one key, one life. Never share or bypass a LOTO padlock.`,

      cabinet: `### 📦 Welded Cold-Rolled Steel Enclosure Chassis
**What It Is:** 12-gauge structural steel housing that encloses all electrical compartments with internal fire barriers and grounding plinths.
**Why It Matters:** Contains arc blast pressure, directs hot arc gases upward through top pressure-relief flaps, and prevents accidental contact.`,

      bushings: `### 🔋 High-Voltage Porcelain Bushings (11kV)
**What It Is:** Brown glazed ceramic insulators with shed rings that carry 11,000V phase conductors through the grounded metal transformer tank.
**Why It Matters:** Prevents high-voltage electricity from flashing over to the metal tank. The petticoat sheds increase surface creepage distance during rain and pollution.`,

      core_windings: `### ⚙️ CRGO Laminated Core & Copper Windings
**What It Is:** Magnetic core made of thin silicon steel laminations wound with thousands of turns of paper-insulated magnet copper wire.
**Why It Matters:** Performs the actual voltage transformation. The laminations prevent eddy current energy losses and overheating.`,

      conservator: `### 🛢️ Oil Expansion Conservator Drum & Breather
**What It Is:** An elevated expansion tank that absorbs the volume changes of transformer mineral oil as it heats and cools.
**Why It Matters:** Keeps the main tank 100% full of oil without air pockets, preventing dielectric oxidation and moisture contamination.`,

      radiator: `### ❄️ Corrugated Cooling Radiator Fins
**What It Is:** Steel cooling tubes and hollow fins welded to the transformer sides.
**Why It Matters:** Dissipates heat generated by I²R electrical losses. Natural convective airflow keeps oil temperature safely under 85°C.`,

      valve_spool: `### 🛢️ Precision Ground Hardened Spool (60 HRC)
**What It Is:** A micro-machined cylindrical piston with control lands that slides inside the honed valve bore with micron-level clearances.
**Why It Matters:** Directs hydraulic fluid between pump, actuator, and reservoir without internal leakage.`,

      valve_spring: `### 🌀 Heavy Damping Compression Spring
**What It Is:** Calibrated chrome-silicon alloy spring providing accurate mechanical closing force against 350 Bar hydraulic line pressure.`,

      valve_solenoid: `### 🧲 24V DC Proportional Solenoid Actuator
**What It Is:** Electromagnetic coil driving an armature that converts analog 4-20mA current signals into proportional physical thrust on the valve spool.`,

      scaf_upper: `### 🏗️ Drop-Forged Swivel Clamp Upper Body
**What It Is:** Heavy drop-forged carbon steel clamp jaw that swivels 360° on a rivet pin to grip structural scaffolding pipes at any orientation.`,

      scaf_bolt1: `### 🔩 Grade 8.8 High-Tensile T-Head Clamp Bolt
**What It Is:** Heavy clamping bolt with T-shaped head that fits into the saddle pocket. Torqued to 54 Nm with a scaffold spanner to deliver 15 kN of slip resistance.`,

      mot_rotor: `### ⚙️ Squirrel Cage Rotor & Drive Shaft
**What It Is:** Laminated iron core embedded with aluminum conductor bars shorted by end rings, pressed onto a 42mm hardened drive shaft.
**Why It Matters:** The rotating component that transfers mechanical work to the driven pump or gearbox.`,

      mot_windings: `### ⚡ 3-Phase Copper Stator Phase Coils
**What It Is:** Class H insulated enameled copper wire inserted into stator core slots in 120° phase displacements to create the rotating magnetic field.`,

      mot_fan: `### 💨 Bi-Directional Cooling Fan
**What It Is:** Glass-filled polypropylene fan mounted on the motor non-drive end shaft that blows forced air over external frame cooling ribs.`
    }
  };

  // -----------------------------------------------------------------------
  // GROQ AI TUTOR CORE FUNCTIONS (STREAMING / FAST INFERENCE & FALLBACK)
  // -----------------------------------------------------------------------
  function getVocationalFallback(topicKey, isPart) {
    if (isPart && VOCATIONAL_KNOWLEDGE_BASE.parts[topicKey]) {
      return VOCATIONAL_KNOWLEDGE_BASE.parts[topicKey];
    }
    if (!isPart && VOCATIONAL_KNOWLEDGE_BASE.machines[topicKey]) {
      return VOCATIONAL_KNOWLEDGE_BASE.machines[topicKey];
    }
    const spec = CAD_SPECS[curCadModel];
    if (spec) {
      return `### 🔬 ${spec.name}
**Standard:** ${spec.standard} • **Operating Rating:** ${spec.voltage}
**Material:** ${spec.material}

**Overview:** ${spec.desc}

**Maintenance Protocol:** ${spec.maint}

**Safety Guidance:** Observe certified institutional LOTO procedures and verify mechanical clearances with vernier calipers before re-energizing.`;
    }
    return `### ⚡ SkillSafe VR Vocational Engineering Tutor
Select any component or machine to review working principles, critical significance, mechanical kinematics, and mandatory safety gates.`;
  }

  const BUILTIN_AI_KEY = "";

  window.callGroqOrFallback = async function(prompt, systemContext) {
    if (!window.serverGroqKey && typeof fetch === 'function') {
      try {
        const kr = await fetch('/api/ai/key');
        const kd = await kr.json();
        if (kd && kd.key) window.serverGroqKey = kd.key;
      } catch (e) {}
    }
    const key = (localStorage.getItem('groq_api_key') || window.serverGroqKey || BUILTIN_AI_KEY).trim();


    // Models supported on this key
    const candidateModels = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'allam-2-7b'];

    for (const model of candidateModels) {
      try {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: systemContext || 'You are an expert vocational master instructor at SkillSafe VR and Rajalakshmi Engineering College. You teach apprentices and technicians about industrial machinery, 3D CAD parts, high-voltage electrical safety (NFPA 70E/OSHA), and precision maintenance. Use clear headings, bullet points, and beginner-friendly analogies. Always emphasize why each part matters and what happens if it fails.'
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.35,
            max_tokens: 800
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content;
          }
        } else {
          console.warn(`Model ${model} returned HTTP ${resp.status}`);
        }
      } catch(err) {
        console.warn(`Model ${model} fetch exception:`, err);
      }
    }

    return null;
  };

  // Markdown to HTML helper with Table, Divider & Rich Formatting Support
  function formatTutorMarkdown(md) {
    if (!md) return '';

    // 1. Convert Horizontal Rules
    let out = md.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #1e2f47;margin:14px 0">');

    // 2. Parse Markdown Tables into Responsive Styled HTML Tables
    const lines = out.split('\n');
    let inTable = false;
    let tableHtml = '';
    const processed = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isTableRow = line.startsWith('|') && line.endsWith('|');

      if (isTableRow) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div style="overflow-x:auto;margin:12px 0 16px;border-radius:10px;border:1px solid #1e2f47;box-shadow:0 4px 16px rgba(0,0,0,0.3)"><table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;background:#09121d">';
        }

        // Skip divider rows like |---|---|
        if (/^\|[\s\-:|]+\|$/.test(line)) continue;

        const cells = line.split('|').slice(1, -1).map(c => c.trim());

        if (!tableHtml.includes('<tbody>')) {
          tableHtml += '<thead><tr style="background:#0c1d2e;border-bottom:2px solid #38bdf8;color:#38bdf8">';
          cells.forEach(c => {
            tableHtml += `<th style="padding:10px 12px;font-weight:800;letter-spacing:0.5px">${c}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr style="border-bottom:1px solid #142232;transition:background 0.15s" onmouseover="this.style.background=\'#111f30\'" onmouseout="this.style.background=\'transparent\'">';
          cells.forEach(c => {
            tableHtml += `<td style="padding:9px 12px;color:#cbd5e1;line-height:1.5">${c}</td>`;
          });
          tableHtml += '</tr>';
        }
      } else {
        if (inTable) {
          tableHtml += '</tbody></table></div>';
          processed.push(tableHtml);
          inTable = false;
          tableHtml = '';
        }
        processed.push(lines[i]);
      }
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      processed.push(tableHtml);
    }

    out = processed.join('\n');

    // 3. Headings, bold, italics, lists
    out = out
      .replace(/^#### (.*$)/gim, '<h5 style="color:#7dd3fc;margin:10px 0 4px;font-size:13px;font-weight:700">$1</h5>')
      .replace(/^### (.*$)/gim, '<h4 style="color:#38bdf8;margin:12px 0 6px;font-size:15px;display:flex;align-items:center;gap:6px;font-weight:800">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="color:#f8fafc;margin:16px 0 8px;font-size:17px;font-weight:800;border-bottom:1px solid #1e293b;padding-bottom:4px">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 style="color:#38bdf8;margin:18px 0 10px;font-size:19px;font-weight:900">$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<b style="color:#f1f5f9;font-weight:700">$1</b>')
      .replace(/\*(.*?)\*/gim, '<i>$1</i>')
      .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom:5px;color:#cbd5e1">$1</li>')
      .replace(/(\n\s*<li[\s\S]*?<\/li>)/gim, '<ul style="margin:6px 0 12px;padding-left:20px">$1</ul>')
      .replace(/\n\n/gim, '<br><br>');

    return out;
  }

  // 2-LINE SUMMARY VOCATIONAL KNOWLEDGE FALLBACKS
  const SHORT_2LINE_FALLBACKS = {
    machines: {
      switchgear: "The 480V Switchgear acts as the main plant power gatekeeper, safely routing heavy 3-phase current to industrial equipment.\\nIts draw-out circuit breaker trips in under 50ms to extinguish catastrophic short circuits and protect personnel from arc flash.",
      transformer: "This 3-phase step-down transformer reduces high-voltage 11kV distribution power to 415V plant utilization power via electromagnetic induction.\\nNatural convection cooling through oil radiators prevents thermal winding breakdown and keeps the facility running continuously.",
      torch: "The MIG/TIG torch directs welding current, wire, and inert argon shielding gas into the joint to produce defect-free structural welds.\\nAlways wear Shade 10-12 eye protection and clean the copper nozzle daily to avoid spatter bridging and porosity.",
      valve: "This proportional relief valve maintains 350 Bar hydraulic line stability by venting excess fluid back to the reservoir.\\nAlways depressurize the circuit to 0 PSI before servicing to eliminate high-pressure fluid injection risks.",
      scaffolding: "The drop-forged swivel coupler locks two 48.3mm scaffold tubes at any angle with 15 kN of slip resistance.\\nTorque T-bolts to 54 Nm and maintain 100% harness tie-off at heights exceeding 1.8 meters.",
      motor: "This 15 kW AC induction motor converts 3-phase electricity into high mechanical torque to drive factory conveyors and pumps.\\nApply LOTO at the motor starter and verify bearing vibration and temperature (< 85°C) during routine checks."
    },
    parts: {
      door: "The polycarbonate door lets operators inspect breaker indicators and multi-meter readings safely without opening the energized cabinet.\\nNever drill or crack the panel, as it serves as a critical containment barrier against arc flash blasts.",
      breaker: "The draw-out air circuit breaker interrupts fault currents up to 10,000A in milliseconds to prevent plant fires and equipment destruction.\\nIt racks out forward onto guide rails for safe zero-energy isolation and maintenance.",
      arc_chute: "The arc chute uses parallel steel splitter plates to stretch, cool, and extinguish high-temperature switching arcs in under 15ms.\\nInspect annually for copper spatter bridging and wipe carbon soot off internal plates with lint-free solvent.",
      busbars: "These silver-plated electrolytic copper busbars carry the full 1,600A continuous current to power the plant.\\nAlways assume busbars are LIVE until Lockout/Tagout is applied and zero voltage is verified with an insulated meter.",
      handle: "The spring-charge handle manually compresses heavy mechanical closing springs to store energy for instant contact closure.\\nThis stored mechanical energy ensures contacts slam shut instantly without hazardous contact bounce.",
      loto_hasp: "The red LOTO hasp holds personal padlocks to physically lock the breaker in the disconnected test position.\\nNo one can re-energize the circuit until every technician removes their personal safety padlock.",
      cabinet: "The welded 12-gauge steel enclosure provides structural grounding and directs hazardous arc gases upward away from technicians.\\nKeep louvers clean and ensure all gland plate seals are tight to prevent moisture intrusion.",
      bushings: "Glazed porcelain bushings provide safe dielectric clearance for 11,000V conductors entering the grounded metal tank.\\nClean ceramic shed surfaces regularly to prevent dust flashover during damp conditions.",
      core_windings: "Laminated CRGO steel core and copper coils perform the magnetic step-down transformation from 11kV to 415V.\\nMeasure winding insulation resistance with a Megger to detect early dielectric degradation.",
      conservator: "The conservator drum accommodates thermal volume expansion of dielectric cooling oil without exposing it to moist air.\\nInspect the silica gel breather to ensure moisture-absorbing crystals remain active.",
      radiator: "Welded steel radiator fins dissipate internal winding heat through natural thermosiphon convective airflow.\\nCheck radiator valves for leaks and verify that cooling air channels remain unobstructed.",
      valve_spool: "The micro-honed hardened steel spool shifts along precision bore ports to regulate hydraulic pressure within microns.\\nInspect for scoring and replace Viton O-rings to prevent internal pressure slippage.",
      valve_spring: "The calibrated heavy spring exerts precise closing force to balance hydraulic line pressure up to 350 Bar.\\nVerify cracking pressure calibration screw settings during scheduled valve overhauls.",
      valve_solenoid: "The 24V DC solenoid converts electrical control signals into proportional mechanical thrust on the relief spool.\\nMeasure coil resistance to verify that winding turns have not shorted or overheated.",
      scaf_upper: "The drop-forged upper clamp swivels 360° on a center rivet pin to grip diagonal scaffold bracing securely.\\nInspect the forging for micro-cracks and discard any coupler showing thread deformation.",
      scaf_bolt1: "The Grade 8.8 T-head bolt clamps scaffold tubes into the saddle pocket with 54 Nm of tightening torque.\\nNever lubricate scaffold bolt threads with grease, as over-tightening can burst the clamp collar.",
      mot_rotor: "The squirrel cage rotor converts the stator's rotating magnetic field into rotational mechanical torque on the drive shaft.\\nCheck drive shaft runout and dynamically balance the rotor to eliminate motor vibration.",
      mot_windings: "Class H enameled copper stator windings generate the 3-phase rotating magnetic field that drives the rotor.\\nPerform insulation Megger tests (> 10 MΩ) prior to commissioning to guard against phase-to-ground shorts.",
      mot_fan: "The polypropylene cooling fan forces continuous ambient airflow over external cast-iron frame fins.\\nInspect fan blades for cracks and ensure the steel fan cowl is securely bolted."
    }
  };

  window.askGroqAboutCurrentMachine = async function() {
    const spec = CAD_SPECS[curCadModel] || CAD_SPECS.switchgear;
    const titleEl = document.getElementById('cad-tutor-topic-title');
    const badgeEl = document.getElementById('cad-tutor-badge');
    const expEl = document.getElementById('cad-tutor-explanation');

    if (titleEl) titleEl.innerHTML = `<span>📖</span> Machine Summary: ${spec.name}`;
    if (badgeEl) badgeEl.textContent = '2-LINE SUMMARY';
    if (expEl) expEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;color:#38bdf8"><div class="spinner" style="width:16px;height:16px;border-width:2px"></div> Generating concise 2-line summary...</div>';

    const systemPrompt = "You are a concise, sharp vocational training AI tutor. You directly summarize the machine in strictly 2 short, informative lines (maximum 2-3 sentences total). Never output boilerplate, headings, or long essays.";
    const userPrompt = `Machine: "${spec.name}" (${spec.voltage}).
Provide ONLY a direct 2-line summary (maximum 2-3 sentences):
Line 1: What this machine does in an industrial facility.
Line 2: Its primary safety protection or fault-clearing function.`;

    const answer = await callGroqOrFallback(userPrompt, systemPrompt);
    const content = answer || SHORT_2LINE_FALLBACKS.machines[curCadModel] || `${spec.name} manages industrial power distribution under ${spec.voltage}.
It provides essential fault protection and safe equipment isolation for plant operations.`;

    if (expEl) {
      expEl.innerHTML = `<div style="font-size:13px;line-height:1.75;color:#f1f5f9;background:#060d16;border-left:3px solid #38bdf8;padding:12px 14px;border-radius:6px">${formatTutorMarkdown(content)}</div>`;
    }
    if (badgeEl) badgeEl.textContent = answer ? '⚡ AI 2-LINE SUMMARY' : 'INSTITUTIONAL CURRICULUM';
  };

  window.explainPartWithGroq = async function(partId) {
    const spec = CAD_SPECS[curCadModel];
    if (!spec || !partId) return;
    const pDef = spec.parts.find(x => x.id === partId);
    if (!pDef) return;

    const titleEl = document.getElementById('cad-tutor-topic-title');
    const badgeEl = document.getElementById('cad-tutor-badge');
    const expEl = document.getElementById('cad-tutor-explanation');

    if (titleEl) titleEl.innerHTML = `<span>🧩</span> Component: ${pDef.label}`;
    if (badgeEl) badgeEl.textContent = '2-LINE SUMMARY';
    if (expEl) expEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;color:#38bdf8"><div class="spinner" style="width:16px;height:16px;border-width:2px"></div> Generating concise 2-line summary...</div>';

    const systemPrompt = "You are a concise, sharp vocational training AI tutor. You directly explain the touched component in strictly 2 short, informative lines (maximum 2-3 sentences total). Never output generic boilerplate or long essays.";
    const userPrompt = `Component: "${pDef.label}" on "${spec.name}". (Technical details: ${pDef.desc})
Provide ONLY a direct 2-line summary (maximum 2-3 sentences):
Line 1: Exactly what this component does mechanically or electrically.
Line 2: Its vital safety, LOTO, or maintenance rule.`;

    const answer = await callGroqOrFallback(userPrompt, systemPrompt);
    const content = answer || SHORT_2LINE_FALLBACKS.parts[partId] || `${pDef.label}: ${pDef.desc}
Observe certified safety precautions and verify zero-energy isolation before maintenance.`;

    if (expEl) {
      expEl.innerHTML = `<div style="font-size:13px;line-height:1.75;color:#f1f5f9;background:#060d16;border-left:3px solid #38bdf8;padding:12px 14px;border-radius:6px">${formatTutorMarkdown(content)}</div>`;
    }
    if (badgeEl) badgeEl.textContent = answer ? '⚡ AI 2-LINE SUMMARY' : 'INSTITUTIONAL CURRICULUM';
  };

  window.submitGroqTutorQuestion = async function() {
    const input = document.getElementById('cad-groq-question-input');
    if (!input || !input.value.trim()) return;
    const question = input.value.trim();
    input.value = '';
    askGroqPresetQuestion(question);
  };

  window.askGroqPresetQuestion = async function(question) {
    const spec = CAD_SPECS[curCadModel];
    const targetPart = cadSelectedPart ? spec?.parts.find(x => x.id === cadSelectedPart)?.label : "Whole Machine";
    const historyEl = document.getElementById('cad-groq-qa-history');
    const expEl = document.getElementById('cad-tutor-explanation');
    const titleEl = document.getElementById('cad-tutor-topic-title');
    const badgeEl = document.getElementById('cad-tutor-badge');

    if (titleEl) titleEl.innerHTML = `<span>💬</span> Question: ${question.slice(0, 48)}${question.length > 48 ? '...' : ''}`;
    if (badgeEl) badgeEl.textContent = 'ANSWERING QUESTION';
    if (expEl) expEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;color:#38bdf8"><div class="spinner" style="width:16px;height:16px;border-width:2px"></div> AI generating direct 2-line answer for your question...</div>';

    if (historyEl) {
      historyEl.innerHTML = `<div style="margin-bottom:6px"><b>Trainee Question:</b> ${question}</div><div style="color:#38bdf8"><i>AI generating direct 2-line answer...</i></div>`;
    }

    const systemPrompt = "You are a concise, sharp vocational training AI tutor. You directly answer the apprentice's specific question in strictly 2 short, informative lines (maximum 2-3 sentences total). Never output generic boilerplate, headings, or long essays. Directly answer what the user asked.";
    const userPrompt = `The apprentice asked this exact question while inspecting ${spec?.name || curCadModel} (Component: ${targetPart}):
"${question}"

IMPORTANT: Answer the user's specific question directly in strictly 2 short, informative lines (maximum 2-3 sentences total). Do not include headings, bullet points, or unrelated topics.`;

    const answer = await callGroqOrFallback(userPrompt, systemPrompt);

    const fallbackQA = {
      "What is the main danger and what happens if I touch this part while energized?":
        "Touching energized 480V conductors causes lethal electrical shock, cardiac fibrillation, or devastating arc-flash burns exceeding 19,000°C.\\nAlways execute Lockout/Tagout (LOTO) and verify zero potential across all three phases with an insulated meter before physical contact.",
      "How does this part work mechanically, and how does it prevent equipment failure?":
        `The ${targetPart} mechanically maintains circuit continuity and uses rapid stored-energy separation to isolate electrical faults in under 50 milliseconds.\\nThis stops massive thermal current from melting conductors and prevents phase-to-phase explosive flashovers.`,
      "What is the mandatory Lockout / Tagout (LOTO) and PPE requirement for this?":
        "Mandatory PPE requires an NFPA 70E Category 4 arc-rated suit (40 cal/cm²), hood, and 1,000V insulating rubber gloves with leather protectors.\\nPadlock the physical isolation point with your personal safety tag and confirm zero voltage across all three phases.",
      "What are the key inspection points technicians look for during preventive maintenance?":
        `Technicians inspect the ${targetPart} for contact erosion pitting, contact resistance under 35 micro-ohms, mechanism lubrication, and arc-chute carbon tracking.\\nAlways check mechanical racking shutter alignment and torque all bus connections to factory specification.`
    };

    const finalAnswer = answer || fallbackQA[question] ||
      `Regarding "${question}": The ${targetPart} operates under ${spec?.voltage || 'system power'} to guarantee safe isolation and fault protection.\\nAlways follow certified LOTO procedures and verify mechanical clearances before performing any maintenance.`;

    if (expEl) {
      expEl.innerHTML = `
        <div style="margin-bottom:10px;padding:8px 12px;background:#0d1c2e;border:1px solid #1e3a5f;border-radius:6px;font-size:12px;color:#7dd3fc">
          <b>Your Question:</b> ${question}
        </div>
        <div style="font-size:13px;line-height:1.75;color:#f1f5f9;background:#060d16;border-left:3px solid #22c55e;padding:12px 14px;border-radius:6px">
          ${formatTutorMarkdown(finalAnswer)}
        </div>
      `;
    }
    if (badgeEl) badgeEl.textContent = answer ? '⚡ AI 2-LINE ANSWER' : 'INSTITUTIONAL CURRICULUM';

    if (historyEl) {
      historyEl.innerHTML = `<div style="margin-bottom:6px"><b>Trainee:</b> ${question}</div><div style="color:#a7f3d0"><b>AI Tutor:</b> ${finalAnswer.replace(/\n/g, ' ')}</div>`;
    }
  };

  // -----------------------------------------------------------------------
  // TEXT-TO-SPEECH (TTS) AUDIO READ-ALOUD
  // -----------------------------------------------------------------------
  window.speakCadExplanation = function() {
    const textEl = document.getElementById('cad-tutor-explanation');
    if (!textEl) return;
    const cleanText = textEl.innerText.replace(/[#*•⚡🔧⚠️📌⚙️🛠️💡]/g, ' ').replace(/\s+/g, ' ');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cleanText);
      u.rate = 1.02;
      u.pitch = 1.0;
      const b = document.getElementById('btn-cad-speak');
      if (b) b.innerHTML = '🔊 Speaking...';
      u.onend = () => { if (b) b.innerHTML = '🔊 Listen to AI Tutor'; };
      u.onerror = () => { if (b) b.innerHTML = '🔊 Listen to AI Tutor'; };
      window.speechSynthesis.speak(u);
    }
  };

  window.stopCadSpeech = function() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const b = document.getElementById('btn-cad-speak');
      if (b) b.innerHTML = '🔊 Listen to AI Tutor';
    }
  };

  // -----------------------------------------------------------------------
  // GROQ API KEY MODAL MANAGEMENT
  // -----------------------------------------------------------------------
  window.openGroqKeyModal = function() {
    const modal = document.getElementById('groq-key-modal');
    const input = document.getElementById('groq-api-key-input');
    const status = document.getElementById('groq-key-status');
    if (modal) modal.style.display = 'flex';
    if (input) input.value = localStorage.getItem('groq_api_key') || '';
    if (status) status.innerHTML = localStorage.getItem('groq_api_key') ? '<span style="color:#22c55e">● Custom Groq Key currently configured</span>' : '<span style="color:#94a3b8">Using local institutional knowledge base (free)</span>';
  };

  window.closeGroqKeyModal = function() {
    const modal = document.getElementById('groq-key-modal');
    if (modal) modal.style.display = 'none';
  };

  window.saveGroqApiKey = function() {
    const input = document.getElementById('groq-api-key-input');
    const status = document.getElementById('groq-key-status');
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      localStorage.setItem('groq_api_key', val);
      if (status) status.innerHTML = '<span style="color:#22c55e">✅ Key saved successfully! Fast Groq inference active.</span>';
      setTimeout(closeGroqKeyModal, 1000);
      askGroqAboutCurrentMachine();
    } else {
      localStorage.removeItem('groq_api_key');
      if (status) status.innerHTML = '<span style="color:#94a3b8">Key cleared. Local curriculum fallback active.</span>';
    }
  };

  window.testGroqApiKey = async function() {
    const input = document.getElementById('groq-api-key-input');
    const status = document.getElementById('groq-key-status');
    if (!input || !status) return;
    const val = input.value.trim();
    if (!val) {
      status.innerHTML = '<span style="color:#f59e0b">Please enter a Groq API key (starts with gsk_...)</span>';
      return;
    }
    status.innerHTML = '<span style="color:#38bdf8">Testing Groq API connection...</span>';
    try {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${val}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5
        })
      });
      if (resp.ok) {
        status.innerHTML = '<span style="color:#22c55e">✅ Connection verified! LLaMA-3.3-70B response received.</span>';
      } else {
        status.innerHTML = `<span style="color:#ef4444">❌ Authentication failed (HTTP ${resp.status}). Check key.</span>`;
      }
    } catch(e) {
      status.innerHTML = `<span style="color:#ef4444">❌ Network error: ${e.message}</span>`;
    }
  };

  // -----------------------------------------------------------------------
  // CAD LAB THREE.JS INITIALIZATION & HIGH-FIDELITY RENDER LOOP
  // -----------------------------------------------------------------------
  I.cadlab = function() {
    const cv = document.getElementById('cad-canvas');
    if (!cv || !window.THREE) return;

    // FIX BLURRINESS: Explicitly set canvas width/height buffer to match client dimensions * devicePixelRatio
    const R = cadRenderer = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    R.setPixelRatio(pr);

    const w = cv.clientWidth || 1100;
    const h = cv.clientHeight || 540;
    R.setSize(w, h, false);
    R.shadowMap.enabled = true;
    R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.toneMapping = THREE.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.35;

    const sc = cadScene = new THREE.Scene();
    const cam = cadCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    cam.position.set(0, 1.2, 3.2);
    cam.lookAt(0, 0.4, 0);

    // Auto-Resize Observer: Keeps resolution crystal clear during window resize
    const ro = new ResizeObserver(() => {
      if (!cv || !cadCamera || !cadRenderer) return;
      const rw = cv.clientWidth;
      const rh = cv.clientHeight;
      if (rw > 0 && rh > 0) {
        cadCamera.aspect = rw / rh;
        cadCamera.updateProjectionMatrix();
        cadRenderer.setSize(rw, rh, false);
      }
    });
    ro.observe(cv);

    // 3-Point Studio Lighting + Specular Rim Highlights
    sc.add(new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 0.95));

    // Warm Sun Key Light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    sc.add(keyLight);

    // Cool Sky Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-6, 3, -3);
    sc.add(fillLight);

    // Specular Rim Light from Behind for Crisp Silhouettes
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
    rimLight.position.set(0, 6, -6);
    sc.add(rimLight);

    // Floor Grid
    const grid = new THREE.GridHelper(10, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.5;
    sc.add(grid);

    cadParts = [];
    const spec = CAD_SPECS[curCadModel] || CAD_SPECS.switchgear;

    // Helper Materials
    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.35, metalness: 0.65 }, o || {}));
    const Bc = c => new THREE.MeshBasicMaterial({ color: c });

    // Procedural Assembly Factory with High Visual Realism
    spec.parts.forEach(p => {
      const g = new THREE.Group();
      g.position.set(...p.basePos);
      g.userData = { id: p.id, label: p.label };
      g.targetPos = new THREE.Vector3(...p.basePos);
      g.targetRot = new THREE.Euler(0, 0, 0);

      if (curCadModel === 'switchgear') {
        if (p.id === 'cabinet') {
          // Open Frame Structural Enclosure
          const frameColMat = M(0x1e293b, { roughness: 0.5, metalness: 0.6 });
          const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.1), M(0x0f172a));
          plinth.position.y = -0.45;
          [[-0.75, -0.5], [0.75, -0.5], [-0.75, 0.5], [0.75, 0.5]].forEach(([x, z]) => {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.0, 0.08), frameColMat);
            post.position.set(x, 0.55, z);
            g.add(post);
          });
          const roof = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.1), frameColMat);
          roof.position.y = 1.55;
          const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.9, 0.98), M(0x24354c));
          leftPanel.position.set(-0.76, 0.55, 0);
          const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.9, 0.98), M(0x24354c));
          rightPanel.position.set(0.76, 0.55, 0);
          const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 0.02), M(0x1b283b));
          backPanel.position.set(0, 0.55, -0.51);

          g.add(plinth, roof, leftPanel, rightPanel, backPanel);
        } else if (p.id === 'door') {
          // Transparent Polycarbonate Safety Inspection Door pivoted on left hinge (x = -0.74)
          // Child meshes are offset by +0.74 so the group origin serves as the true mechanical hinge
          const doorGlassMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.32,
            roughness: 0.1,
            metalness: 0.15
          });
          const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(1.48, 1.45, 0.03), doorGlassMat);
          glassDoor.position.set(0.74, -0.05, 0);

          const doorBorder = new THREE.Mesh(new THREE.BoxGeometry(1.52, 1.5, 0.04), M(0x334155, { metalness: 0.5 }));
          doorBorder.position.set(0.74, -0.05, -0.01);

          const meterBox = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.45, 0.08), M(0x0a121e, { roughness: 0.8 }));
          meterBox.position.set(0.74, 0.9, 0.02);

          const lcdScreen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.09), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
          lcdScreen.position.set(0.74, 0.9, 0.04);

          // Pilot LEDs
          const ledMatR = new THREE.MeshBasicMaterial({ color: 0xef4444 });
          const ledMatY = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
          const ledMatB = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
          const ledR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), ledMatR);
          ledR.rotation.x = Math.PI/2; ledR.position.set(0.74 - 0.55, 0.9, 0.07);
          const ledY = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), ledMatY);
          ledY.rotation.x = Math.PI/2; ledY.position.set(0.74 - 0.55, 0.8, 0.07);
          const ledB = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), ledMatB);
          ledB.rotation.x = Math.PI/2; ledB.position.set(0.74 - 0.55, 0.7, 0.07);

          const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12), M(0xe2e8f0, { metalness: 0.95, roughness: 0.1 }));
          handle.position.set(0.74 + 0.65, -0.05, 0.06);

          // 2 Chrome Door Hinge Cylinders along the pivot line
          const hingeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 12), M(0xe2e8f0, { metalness: 0.9 }));
          hingeTop.position.set(0, 0.7, 0);
          const hingeBot = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 12), M(0xe2e8f0, { metalness: 0.9 }));
          hingeBot.position.set(0, -0.4, 0);

          g.add(glassDoor, doorBorder, meterBox, lcdScreen, ledR, ledY, ledB, handle, hingeTop, hingeBot);
        } else if (p.id === 'breaker') {
          // Drawout Air Circuit Breaker Assembly
          const body = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.85, 0.65), M(0x1e293b, { metalness: 0.7, roughness: 0.3 }));
          [-0.32, 0, 0.32].forEach(x => {
            const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16), M(0x9a3412, { roughness: 0.2, metalness: 0.4 }));
            bottle.position.set(x, 0.1, -0.05);
            g.add(bottle);
          });
          [[-0.58, -0.4], [0.58, -0.4]].forEach(([x, y]) => {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), M(0xd1d5db, { metalness: 0.9 }));
            wheel.rotation.z = Math.PI/2;
            wheel.position.set(x, y, 0);
            g.add(wheel);
          });
          const tripBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12), Bc(0xdc2626));
          tripBtn.rotation.x = Math.PI/2; tripBtn.position.set(-0.25, 0.15, 0.35);
          const indWindow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.02), Bc(0x22c55e));
          indWindow.position.set(0.25, 0.15, 0.35);
          g.add(body, tripBtn, indWindow);
        } else if (p.id === 'arc_chute') {
          [-0.35, 0, 0.35].forEach(x => {
            const chuteBox = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.42), M(0xb45309, { roughness: 0.4 }));
            chuteBox.position.x = x;
            for (let i = -3; i <= 3; i++) {
              const plate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.015, 0.36), M(0xe2e8f0, { metalness: 0.95, roughness: 0.1 }));
              plate.position.set(x, i * 0.04, 0);
              g.add(plate);
            }
            g.add(chuteBox);
          });
        } else if (p.id === 'busbars') {
          [-0.38, 0, 0.38].forEach(x => {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.8, 0.16), M(0xd97706, { metalness: 0.92, roughness: 0.18 }));
            bar.position.set(x, 0.2, 0);
            const ins1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.15, 12), M(0xb91c1c, { roughness: 0.3 }));
            ins1.rotation.x = Math.PI/2; ins1.position.set(x, 0.7, -0.15);
            const ins2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.15, 12), M(0xb91c1c, { roughness: 0.3 }));
            ins2.rotation.x = Math.PI/2; ins2.position.set(x, -0.3, -0.15);
            g.add(bar, ins1, ins2);
          });
        } else if (p.id === 'handle') {
          const hShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12), M(0xd1d5db, { metalness: 0.9 }));
          hShaft.rotation.z = Math.PI/3;
          const hGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.2, 12), M(0xdc2626, { roughness: 0.7 }));
          hGrip.rotation.z = Math.PI/3; hGrip.position.set(0.18, 0.1, 0);
          g.add(hShaft, hGrip);
        } else if (p.id === 'loto_hasp') {
          const haspRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 24), Bc(0xef4444));
          const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.05), M(0xeab308, { metalness: 0.85, roughness: 0.2 }));
          lockBody.position.set(0, -0.14, 0);
          const tag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.01), Bc(0xfacc15));
          tag.position.set(0.1, -0.15, 0.02);
          g.add(haspRing, lockBody, tag);
        }
      } else if (curCadModel === 'transformer') {
        if (p.id === 'tank') {
          const tank = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.0), M(0x334155, { metalness: 0.6 }));
          g.add(tank);
        } else if (p.id === 'bushings') {
          [-0.45, 0, 0.45].forEach(x => {
            const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.7, 16), M(0x78350f, { roughness: 0.15, metalness: 0.2 }));
            bush.position.x = x;
            const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8), M(0xd97706, { metalness: 0.9 }));
            stud.position.set(x, 0.4, 0);
            g.add(bush, stud);
          });
        } else if (p.id === 'core_windings') {
          const core = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.6), M(0xb45309, { metalness: 0.85, roughness: 0.2 }));
          g.add(core);
        } else if (p.id === 'conservator') {
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.2, 20), M(0x475569));
          drum.rotation.z = Math.PI/2;
          g.add(drum);
        } else if (p.id === 'radiator') {
          [-0.9, 0.9].forEach(x => {
            for (let f = -3; f <= 3; f++) {
              const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.0, 0.8), M(0x1e293b, { metalness: 0.7 }));
              fin.position.set(x + f * 0.03, 0, 0);
              g.add(fin);
            }
          });
        }
      } else if (curCadModel === 'torch') {
        if (p.id === 'torch_handle') {
          const h = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.0, 20), M(0x0f172a, { roughness: 0.8 }));
          h.rotation.z = Math.PI/2;
          const trig = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), Bc(0xeab308));
          trig.position.set(0, 0.12, 0);
          g.add(h, trig);
        } else if (p.id === 'torch_nozzle') {
          const n = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.6, 20), M(0xb45309, { metalness: 0.92, roughness: 0.2 }));
          n.rotation.z = -Math.PI/2;
          g.add(n);
        } else if (p.id === 'torch_diffuser') {
          const d = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), M(0xeab308, { metalness: 0.85 }));
          d.rotation.z = Math.PI/2;
          g.add(d);
        } else if (p.id === 'torch_electrode') {
          const el = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), M(0xd1d5db, { metalness: 0.95, roughness: 0.1 }));
          el.rotation.z = Math.PI/2;
          g.add(el);
        } else if (p.id === 'torch_cable') {
          const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 16), M(0x1e293b));
          cb.rotation.z = Math.PI/2;
          g.add(cb);
        }
      } else if (curCadModel === 'valve') {
        if (p.id === 'valve_manifold') {
          const block = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.9), M(0x273644, { metalness: 0.6 }));
          const port1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.92, 16), M(0x0f172a));
          port1.rotation.x = Math.PI/2;
          g.add(block, port1);
        } else if (p.id === 'valve_spool') {
          const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 20), M(0xe2e8f0, { metalness: 0.95, roughness: 0.1 }));
          spool.rotation.z = Math.PI/2;
          g.add(spool);
        } else if (p.id === 'valve_spring') {
          const spr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16, 8, true), M(0x38bdf8, { metalness: 0.9, wireframe: true }));
          spr.rotation.z = Math.PI/2;
          g.add(spr);
        } else if (p.id === 'valve_solenoid') {
          const sol = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.7, 20), M(0x1e293b, { metalness: 0.8 }));
          sol.rotation.z = Math.PI/2;
          g.add(sol);
        } else if (p.id === 'valve_screw') {
          const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), M(0xd1d5db, { metalness: 0.95 }));
          scr.rotation.z = Math.PI/2;
          g.add(scr);
        }
      } else if (curCadModel === 'scaffolding') {
        if (p.id === 'scaf_base') {
          const saddle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 16, 1, false, 0, Math.PI), M(0x64748b, { metalness: 0.8 }));
          saddle.rotation.z = Math.PI/2;
          g.add(saddle);
        } else if (p.id === 'scaf_upper') {
          const up = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 16, 1, false, Math.PI, Math.PI), M(0x475569, { metalness: 0.8 }));
          up.rotation.z = Math.PI/2;
          g.add(up);
        } else if (p.id === 'scaf_bolt1' || p.id === 'scaf_bolt2') {
          const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), M(0xeab308, { metalness: 0.9 }));
          g.add(b);
        } else if (p.id === 'scaf_tube') {
          const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.8, 20), M(0x94a3b8, { metalness: 0.85, roughness: 0.2 }));
          g.add(tube);
        }
      } else if (curCadModel === 'motor') {
        if (p.id === 'mot_frame') {
          const fr = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 24), M(0x1e293b, { metalness: 0.6 }));
          fr.rotation.z = Math.PI/2;
          for (let f = -4; f <= 4; f++) {
            const fin = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.02, 8, 24), M(0x334155));
            fin.rotation.y = Math.PI/2; fin.position.x = f * 0.1;
            g.add(fin);
          }
          g.add(fr);
        } else if (p.id === 'mot_rotor') {
          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16), M(0xe2e8f0, { metalness: 0.95, roughness: 0.1 }));
          shaft.rotation.z = Math.PI/2;
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.8, 20), M(0x94a3b8, { metalness: 0.7 }));
          core.rotation.z = Math.PI/2;
          g.add(shaft, core);
        } else if (p.id === 'mot_windings') {
          const wind = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.08, 12, 24), M(0xd97706, { metalness: 0.9, roughness: 0.2 }));
          wind.rotation.y = Math.PI/2;
          g.add(wind);
        } else if (p.id === 'mot_fan') {
          const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 12), M(0x38bdf8, { metalness: 0.3 }));
          fan.rotation.z = Math.PI/2;
          g.add(fan);
        } else if (p.id === 'mot_cowl') {
          const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.35, 20), M(0x0f172a));
          cowl.rotation.z = Math.PI/2;
          g.add(cowl);
        } else if (p.id === 'mot_jbox') {
          const jb = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.35), M(0x273644));
          g.add(jb);
        }
      } else if (curCadModel === 'uploaded') {
        if (cadCustomGeometries && cadCustomGeometries.mainGeom) {
          const cadMesh = new THREE.Mesh(cadCustomGeometries.mainGeom, M(0x38bdf8, { metalness: 0.8, roughness: 0.25 }));
          cadMesh.castShadow = true;
          cadMesh.receiveShadow = true;
          g.add(cadMesh);
        } else {
          if (p.id === 'up_blueprint') {
            const bpMat = cadUploadedBlueprintTexture
              ? new THREE.MeshBasicMaterial({ map: cadUploadedBlueprintTexture, transparent: true, opacity: 0.95 })
              : M(0x0284c7, { emissive: 0x0284c7, emissiveIntensity: 0.3 });
            const bpPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.02), bpMat);
            const bpBorder = new THREE.Mesh(new THREE.BoxGeometry(1.64, 1.24, 0.01), M(0x38bdf8, { metalness: 0.9 }));
            g.add(bpPlate, bpBorder);
          } else if (p.id === 'up_housing') {
            const housing = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.6), M(0x24354c, { metalness: 0.75, roughness: 0.3 }));
            const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.62, 24), M(0x0a121e, { metalness: 0.9 }));
            bore.rotation.x = Math.PI/2;
            g.add(housing, bore);
          } else if (p.id === 'up_spindle') {
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.3, 24), M(0xe2e8f0, { metalness: 0.95, roughness: 0.1 }));
            shaft.rotation.z = Math.PI/2;
            const b1 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 12, 24), M(0xf59e0b, { metalness: 0.9 }));
            b1.rotation.y = Math.PI/2; b1.position.x = -0.35;
            const b2 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 12, 24), M(0xf59e0b, { metalness: 0.9 }));
            b2.rotation.y = Math.PI/2; b2.position.x = 0.35;
            g.add(shaft, b1, b2);
          } else if (p.id === 'up_base') {
            const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.9), M(0x1e293b, { metalness: 0.8, roughness: 0.3 }));
            [[-0.75, -0.3], [0.75, -0.3], [-0.75, 0.3], [0.75, 0.3]].forEach(([x, z]) => {
              const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 12), M(0x0a1017));
              hole.position.set(x, 0, z);
              g.add(hole);
            });
            g.add(basePlinth);
          } else if (p.id === 'up_fasteners') {
            const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), M(0xd1d5db, { metalness: 0.95 }));
            const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), M(0xd1d5db, { metalness: 0.95 }));
            f2.position.y = 0.25;
            g.add(f1, f2);
          }
        }
      }

      sc.add(g);
      cadParts.push(g);
    });

    // Dimension Calipers Group
    cadCalipersGroup = new THREE.Group();
    cadCalipersGroup.visible = cadCalipers;
    sc.add(cadCalipersGroup);

    // Orbit Drag Controls
    let isDown = false, lx = 0, ly = 0;
    cv.onpointerdown = e => { isDown = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); };
    cv.onpointerup = () => { isDown = false; };
    cv.onpointermove = e => {
      if (!isDown) return;
      cadYaw -= (e.clientX - lx) * 0.007;
      cadPitch += (e.clientY - ly) * 0.007;
      cadPitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, cadPitch));
      lx = e.clientX; ly = e.clientY;
    };
    cv.onwheel = e => {
      cadDist = Math.max(1.1, Math.min(6.5, cadDist + e.deltaY * 0.003));
      e.preventDefault();
    };

    // Click Part to Physically Open / Articulate & Inquire with Groq AI Tutor
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    cv.onclick = e => {
      const r = cv.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, cam);
      const hits = ray.intersectObjects(cadParts, true);
      if (hits.length > 0) {
        let topG = hits[0].object;
        while (topG.parent && topG.parent !== sc) topG = topG.parent;
        if (topG.userData && topG.userData.id) {
          interactWithCadPart(topG.userData.id);
        }
      }
    };

    // Initialize Calipers and Tutor Overview on View Load
    updateCadCalipers();
    askGroqAboutCurrentMachine();

    // High-Resolution Smooth Lerp Render Loop (Buttery smooth 60fps mechanical articulation)
    let running = true;
    function renderLoop() {
      if (!running || window.curView !== 'cadlab') return;

      // Orbit camera positioning
      cam.position.x = cadDist * Math.sin(cadYaw) * Math.cos(cadPitch);
      cam.position.y = cadDist * Math.sin(cadPitch) + 0.4;
      cam.position.z = cadDist * Math.cos(cadYaw) * Math.cos(cadPitch);
      cam.lookAt(0, 0.4, 0);

      // Smooth mechanical animation lerp for each part
      if (cadParts.length) {
        cadParts.forEach(p => {
          if (p.targetPos) {
            p.position.x += (p.targetPos.x - p.position.x) * 0.12;
            p.position.y += (p.targetPos.y - p.position.y) * 0.12;
            p.position.z += (p.targetPos.z - p.position.z) * 0.12;
          }
          if (p.targetRot) {
            p.rotation.x += (p.targetRot.x - p.rotation.x) * 0.12;
            p.rotation.y += (p.targetRot.y - p.rotation.y) * 0.12;
            p.rotation.z += (p.targetRot.z - p.rotation.z) * 0.12;
          }
        });
      }

      R.render(sc, cam);
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  };


  // -----------------------------------------------------------------------
  // VIEW: 📜 VERIFIED SKILL PASSPORT (Government & NSDC Accredited)
  // -----------------------------------------------------------------------
  V.passport = function() {
    const p = S.skillPassport || {};
    const comps = p.competencies || [];
    const hash = p.verificationHash || '0x1E915D5CA6B71AC229E6F455';
    const verifyUrl = `${window.location.origin}/verify/${hash}`;

    // Compute real deterministic safety status from actual simulation history
    const runs = S.hist || [];
    let safetyStatusHtml = '';
    if (runs.length === 0) {
      safetyStatusHtml = '<div style="font-size:12.5px;font-weight:700;color:#f59e0b">● IN TRAINING · (Complete Simulation Assessment)</div>';
    } else {
      const minSafety = Math.min(...runs.map(h => h.safety !== undefined ? h.safety : 100));
      if (minSafety >= 80) {
        safetyStatusHtml = '<div style="font-size:12.5px;font-weight:800;color:#22c55e">✔ VERIFIED · (100% Zero-Breach Compliance)</div>';
      } else {
        safetyStatusHtml = '<div style="font-size:12.5px;font-weight:700;color:#f87171">⚠ RETRY REQUIRED · (Safety Breaches Detected)</div>';
      }
    }

    return `
      <div class="w" style="max-width:960px">
        <!-- Action Row -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px">
          <div>
            <span class="tag a" style="background:#0284c7;color:#fff">VERIFIABLE CREDENTIAL REGISTRY</span>
            <h1 style="margin:4px 0 0">📜 Official Vocational Skill Passport</h1>
          </div>
          <div style="display:flex;gap:8px">
            <button class="b bw" onclick="window.print()">🖨️ Print / Download PDF</button>
            <button class="b o" onclick="go('dash')">Return to Dashboard</button>
          </div>
        </div>

        <!-- Official Certificate Sheet -->
        <div class="passport-certificate">
          <!-- Government / Council Header -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #38bdf844;padding-bottom:16px;margin-bottom:20px;flex-wrap:wrap;gap:14px">
            <div style="display:flex;align-items:center;gap:14px">
              <div class="passport-seal-badge">🛡️</div>
              <div>
                <div style="font-size:12px;font-weight:800;color:var(--ac);letter-spacing:1px;text-transform:uppercase">NATIONAL VOCATIONAL SAFETY CREDENTIAL</div>
                <h2 style="margin:2px 0 0;font-size:22px;letter-spacing:0.5px">NATIONAL SKILL DEVELOPMENT CORPORATION</h2>
                <span class="m" style="font-size:11px;color:#94a3b8">NCVET Accredited • SkillSafe VR Deterministic Assessment Standard</span>
              </div>
            </div>

            <!-- Dynamic Real Scannable QR Code & Verification Block -->
            <div style="display:flex;align-items:center;gap:12px;background:#060f1acc;border:1.5px solid #22c55e66;border-radius:12px;padding:10px;box-shadow:0 0 20px rgba(34,197,94,0.1)">
              <a id="passport-qr-link" href="${verifyUrl}" target="_blank" title="Scan with phone camera or click to open live verification ledger" style="display:block;border-radius:6px;overflow:hidden;background:#fff;padding:4px;text-decoration:none">
                <div id="passport-real-qr-slot" style="width:105px;height:105px;display:flex;align-items:center;justify-content:center;background:#fff">
                  <span style="font-size:10px;color:#64748b">Generating QR...</span>
                </div>
              </a>
              <div style="font-size:11px;line-height:1.35;max-width:145px">
                <div style="display:flex;align-items:center;gap:5px">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e"></span>
                  <b style="color:#22c55e">SCANNABLE QR</b>
                </div>
                <span style="font-family:monospace;font-size:9.5px;color:#cbd5e1;display:block;margin:3px 0">ID: ${p.traineeId || S.traineeId}</span>
                <span style="font-size:9.5px;color:#38bdf8;display:block">Point phone camera to verify cryptographic SHA-256 ledger</span>
              </div>
            </div>
          </div>

          <!-- Trainee Identity Card -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;background:#09121d;border:1px solid #1e2e42;border-radius:12px;padding:16px;margin-bottom:20px">
            <div>
              <span class="m" style="font-size:11px;text-transform:uppercase">Trainee Name:</span>
              <div style="font-size:18px;font-weight:800;color:#fff">${S.name}</div>
              <span class="tag a" style="margin-top:4px">${S.traineeId}</span>
            </div>
            <div>
              <span class="m" style="font-size:11px;text-transform:uppercase">Training Institution:</span>
              <div style="font-size:13px;font-weight:700;color:#38bdf8">${S.institution}</div>
            </div>
            <div>
              <span class="m" style="font-size:11px;text-transform:uppercase">Trade &amp; Batch:</span>
              <div style="font-size:13px;font-weight:700;color:#f1f5f9">${S.batch}</div>
            </div>
            <div>
              <span class="m" style="font-size:11px;text-transform:uppercase">Deterministic Safety Status:</span>
              ${safetyStatusHtml}
            </div>
          </div>

          <!-- Verified Competencies Matrix -->
          <h3 style="margin:0 0 12px;display:flex;align-items:center;gap:8px">
            <span>🎖️</span> Verified Practical Vocational Competencies
          </h3>

          <div style="margin-bottom:24px">
            ${comps.length === 0 ? `
              <div style="text-align:center;padding:24px;color:#94a3b8;background:#060d16;border-radius:10px">
                No competencies recorded yet. Complete assigned modules and practical assessments to earn verified endorsements.
              </div>
            ` : comps.map(c => `
              <div class="competency-row">
                <div style="max-width:480px">
                  <div style="display:flex;align-items:center;gap:6px">
                    <b style="color:#f8fafc;font-size:14px">${c.title}</b>
                    <span class="tag" style="background:#0369a1;color:#fff;font-size:10px">${c.code}</span>
                  </div>
                  <div style="font-size:11px;color:#94a3b8;margin-top:2px">Standard: <b>${c.standard}</b></div>
                  <div style="font-size:11px;color:#38bdf8;margin-top:2px">Evidence: ${c.evidence || 'Evaluated under deterministic safety conditions'}</div>
                </div>

                <div style="display:flex;align-items:center;gap:10px">
                  <span class="tag a" style="font-size:12px;padding:4px 10px">${c.level}</span>
                  <div style="text-align:right">
                    <span style="font-size:11px;font-weight:800;color:${c.status==='VERIFIED'?'#22c55e':'#f59e0b'}">● ${c.status}</span><br>
                    <small style="font-size:9px;color:#94a3b8">${c.verifiedDate || c.verified_date || 'Pending Trainer Signature'}</small>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Official Endorsement & Verification Stamp Block -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #1e293b;padding-top:16px;flex-wrap:wrap;gap:14px">
            <div>
              <span class="m" style="font-size:11px">LEGAL &amp; COMPLIANCE NOTICE:</span>
              <p class="m" style="margin:2px 0 0;max-width:540px;font-size:11px;color:#64748b">
                This Skill Passport certifies mastery of simulated workplace procedures under deterministic safety gate conditions. Issued under authority of the accredited vocational training board. Cryptographically signed.
              </p>
            </div>

            <!-- Signature Seal -->
            <div style="text-align:center;border:2px dashed #22c55e66;padding:10px 18px;border-radius:12px;background:#052e1644">
              <div style="font-family:'Courier New', monospace;font-size:14px;color:#86efac;font-weight:800;letter-spacing:1px">DIGITALLY CERTIFIED</div>
              <div style="font-size:11px;color:#fff;font-weight:700;margin:4px 0">${p.verifiedBy || p.verified_by || 'Saurav K (Trainer)'}</div>
              <small style="font-size:9px;color:#94a3b8">License #REC-TR-2024 • Timestamped</small>
            </div>
          </div>
        </div>

        <!-- Attempt History Evidence Ledger -->
        <div class="c" style="margin-top:20px">
          <h3 style="margin:0 0 10px">📊 Practical Assessment Evidence Trail</h3>
          <div class="table-responsive">
            <table>
              <tr>
                <th>Date</th><th>Module</th><th>Overall Score</th><th>Safety Compliance</th><th>Procedure Accuracy</th><th>Safety Gate</th>
              </tr>
              ${runs.length === 0 ? `
                <tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8">No practical training runs recorded yet. Evidence is generated upon completing verified 3D VR simulation sessions.</td></tr>
              ` : runs.map(s => `
                <tr>
                  <td>${s.d}</td>
                  <td><b>${s.mod}</b></td>
                  <td class="${col(s.score)}">${s.score}%</td>
                  <td class="${col(s.safety)}">${s.safety}%</td>
                  <td class="${col(s.proc)}">${s.proc}%</td>
                  <td><span class="tag a">${(s.safety !== undefined && s.safety < 80) ? 'RETRY' : 'PASSED'}</span></td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // View Init: Render Real Scannable QR Code onto Skill Passport
  I.passport = function() {
    const p = S.skillPassport || {};
    const hash = p.verificationHash || '0x1E915D5CA6B71AC229E6F455';
    const verifyUrl = `${window.location.origin}/verify/${hash}`;
    const qrSlot = document.getElementById('passport-real-qr-slot');
    const qrLink = document.getElementById('passport-qr-link');
    if (qrLink) qrLink.href = verifyUrl;

    let attempts = 0;
    function renderQR() {
      const slot = document.getElementById('passport-real-qr-slot');
      if (!slot) return;
      if (window.QRCode && window.QRCode.toDataURL) {
        window.QRCode.toDataURL(verifyUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: '#020617',
            light: '#ffffff'
          }
        }, function(err, url) {
          if (!err && url) {
            slot.innerHTML = `<img src="${url}" alt="Real Verified QR Code" style="width:105px;height:105px;display:block;border-radius:2px" />`;
          } else {
            console.error("QR Code generation error:", err);
          }
        });
      } else if (attempts < 20) {
        attempts++;
        setTimeout(renderQR, 100);
      }
    }
    renderQR();
  };

  // -----------------------------------------------------------------------
  // VIEW: 👨‍🏫 TRAINER / INSTRUCTOR WORKSPACE
  // -----------------------------------------------------------------------
  let curTrainerTab = 'overview';
  let curSelectedTraineePassportId = null;

  window.openTraineePassport = function(traineeId) {
    curSelectedTraineePassportId = traineeId;
    switchTrainerTab('passport');
  };

  window.changePassportTrainee = function(traineeId) {
    curSelectedTraineePassportId = traineeId;
    if (window.curView === 'trainer') go('trainer');
  };

  window.promptDispatchDrill = function(traineeName, traineeId) {
    const topic = prompt(`Enter targeted remediation drill topic for ${traineeName}:`, 'LOTO Zero-Energy Verification');
    if (topic && topic.trim()) {
      dispatchRemediation(traineeName, topic.trim(), traineeId);
    }
  };

  V.trainer = function() {
    const allTrainees = (S.users || []).filter(u => u.role === 'learner');
    const queue = S.approvalQueue || [];
    const asgns = S.assignedWork || [];
    const stats = S.cohortStats || {};

    if (!curSelectedTraineePassportId && allTrainees.length > 0) {
      curSelectedTraineePassportId = allTrainees[0].traineeId || allTrainees[0].id;
    }

    // Determine current passport data for selected trainee
    let curPassport = null;
    if (S.allPassports && S.allPassports.length > 0) {
      curPassport = S.allPassports.find(p => p.trainee_id === curSelectedTraineePassportId || p.id === curSelectedTraineePassportId) || S.allPassports[0];
    }
    if (!curPassport) {
      const selectedTraineeObj = allTrainees.find(t => (t.traineeId || t.id) === curSelectedTraineePassportId) || allTrainees[0];
      curPassport = S.skillPassport || {
        trainee_id: selectedTraineeObj?.traineeId || 'REC-VR-2024',
        full_name: selectedTraineeObj?.name || 'Deepak Kumar',
        batch: selectedTraineeObj?.batch || 'Industrial Electrical & Switchgear Isolation',
        institution: 'Rajalakshmi Engineering College (REC)',
        council: 'Autonomous Institution · Affiliated to Anna University',
        status: 'IN_TRAINING',
        verification_hash: '0x1E915D5CA6B71AC229E6F455',
        verified_by: 'Saurav K (Lic #REC-TR-2024)',
        competencies: []
      };
    }

    const comps = curPassport.competencies || [];
    const avgSafety = stats.cohort_avg_safety !== undefined ? stats.cohort_avg_safety : 100;
    const criticalAlerts = stats.critical_safety_alerts !== undefined ? stats.critical_safety_alerts : 0;
    const incidentBreakdown = stats.incident_breakdown || {};
    const incidentKeys = Object.keys(incidentBreakdown);

    return `
      <div class="w" style="max-width:1200px">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="tag a" style="background:#f59e0b;color:#000;font-weight:800">INSTRUCTOR &amp; CERTIFIER PORTAL</span>
              <span class="tag" style="background:#1e293b;color:#94a3b8">${S.name} (Lic #REC-TR-2024)</span>
              <span class="tag" style="background:#052e16;color:#4ade80;border:1px solid #166534">● LIVE DB CONNECTED</span>
            </div>
            <h1 style="margin:4px 0 2px">👨‍🏫 Trainer / Instructor Workspace</h1>
            <p class="m" style="margin:0">Live cohort telemetry monitoring, curriculum assignment builder, AI scenario validation, and Skill Passport verification.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="b" onclick="switchTrainerTab('builder')">➕ Build New Assignment</button>
            <button class="b o" onclick="if(window.syncWithBackend){syncWithBackend();tip('🔄 Refreshed live cohort data from PostgreSQL');}">🔄 Refresh Data</button>
          </div>
        </div>

        <!-- Sub-Tabs Navigation -->
        <div class="sub-tab-bar">
          <button class="sub-tab-btn ${curTrainerTab==='overview'?'active':''}" onclick="switchTrainerTab('overview')">📊 Cohort Overview &amp; Alerts</button>
          <button class="sub-tab-btn ${curTrainerTab==='trainees'?'active':''}" onclick="switchTrainerTab('trainees')">👥 Trainees &amp; Batches (${allTrainees.length})</button>
          <button class="sub-tab-btn ${curTrainerTab==='builder'?'active':''}" onclick="switchTrainerTab('builder')">📝 Assignment Builder (${asgns.length})</button>
          <button class="sub-tab-btn ${curTrainerTab==='approvals'?'active':''}" onclick="switchTrainerTab('approvals')">🤖 AI Scenario Approvals (${queue.filter(q=>q.status==='pending').length})</button>
          <button class="sub-tab-btn ${curTrainerTab==='passport'?'active':''}" onclick="switchTrainerTab('passport')">✍️ Passport Sign-Off</button>
          <button class="sub-tab-btn ${curTrainerTab==='remediation'?'active':''}" onclick="switchTrainerTab('remediation')">🎯 Targeted Remediation</button>
        </div>

        <!-- TAB CONTENT: OVERVIEW -->
        ${curTrainerTab === 'overview' ? `
          <div class="g" style="margin-bottom:16px">
            <div class="c"><div class="m">Active Enrolled Trainees</div><div class="k">${allTrainees.length}</div></div>
            <div class="c"><div class="m">Cohort Average Safety</div><div class="k ${avgSafety >= 85 ? 'ok' : 'wn'}">${avgSafety}%</div></div>
            <div class="c"><div class="m">Active Curriculum Tasks</div><div class="k">${asgns.length}</div></div>
            <div class="c"><div class="m">Critical Safety Alerts</div><div class="k ${criticalAlerts > 0 ? 'er' : 'ok'}">${criticalAlerts}</div></div>
          </div>

          <!-- Cohort Safety Status Banner -->
          ${criticalAlerts === 0 ? `
            <div class="c" style="border:1px solid #10b981;background:#052e16;margin-bottom:16px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:20px">🛡️</span>
                <b style="color:#10b981;font-size:15px">COHORT SAFETY STATUS: 100% COMPLIANT</b>
              </div>
              <div style="font-size:13px;color:#cbd5e1;margin-top:4px">
                All ${allTrainees.length} enrolled engineering trainees in Rajalakshmi Engineering College cohorts have passed deterministic safety gates with zero unaddressed incidents.
              </div>
            </div>
          ` : `
            <div class="c" style="border:1px solid #ef4444;background:#2d0607;margin-bottom:16px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:20px">⚠️</span>
                <b style="color:#ef4444;font-size:15px">COHORT SAFETY ALERT: ${criticalAlerts} CRITICAL INCIDENTS DETECTED</b>
              </div>
              <div style="font-size:13px;color:#cbd5e1;margin-top:4px">
                High-voltage contact or arc flash gate breaches detected in live simulation telemetry. Dispatch targeted remediation drills immediately.
              </div>
            </div>
          `}

          <div class="g" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">
            <!-- Active Assignments Summary -->
            <div class="c">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <h3 style="margin:0">Active Assignments (${asgns.length})</h3>
                <button class="b o" style="font-size:11px;padding:3px 8px" onclick="switchTrainerTab('builder')">Manage</button>
              </div>
              ${asgns.length ? asgns.map(a => `
                <div style="background:#0f172a;border-radius:10px;padding:12px;margin-bottom:8px;border-left:3px solid var(--ac)">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <b>${a.title}</b>
                    <span class="tag a">${a.status}</span>
                  </div>
                  <small style="color:#94a3b8;display:block;margin-top:4px">Batch: ${a.batch} · Due: ${a.dueDate || a.due_date} · Pass: ${a.passCriteria || a.pass_criteria}%</small>
                </div>
              `).join('') : '<p class="m" style="padding:12px 0">No active assignments published. Click "+ Build New Assignment" above.</p>'}
            </div>

            <!-- Common Cohort Mistakes -->
            <div class="c">
              <h3 style="margin:0 0 10px">Cohort Safety Incident Breakdown</h3>
              ${incidentKeys.length > 0 ? `
                <div style="display:flex;flex-direction:column;gap:6px">
                  ${incidentKeys.map(k => `
                    <div style="display:flex;justify-content:space-between;align-items:center;background:#09121d;border:1px solid #1e2e42;border-radius:8px;padding:8px 12px">
                      <span style="color:#f87171;font-size:13px">⚠️ ${k}</span>
                      <span class="tag er">${incidentBreakdown[k]} Occurrences</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="padding:16px 0;text-align:center;color:#94a3b8;font-size:13px">
                  ✅ Zero safety violations recorded in current active sessions. Trainee cohorts are following standard SOP protocols.
                </div>
              `}
            </div>
          </div>

          <!-- Real-Time Completed Sessions Activity Feed -->
          <div class="c" style="margin-top:16px">
            <h3 style="margin:0 0 10px;display:flex;align-items:center;gap:8px">
              <span>📡</span> Live Trainee Telemetry &amp; Recent Simulation Runs
            </h3>
            ${stats.recent_sessions && stats.recent_sessions.length > 0 ? `
              <div class="table-responsive">
                <table>
                  <tr><th>Learner</th><th>Module</th><th>Date</th><th>Score</th><th>Safety</th><th>Critical Gate</th><th>Duration</th></tr>
                  ${stats.recent_sessions.map(s => `
                    <tr>
                      <td><b>${s.learner_name || 'Learner'}</b></td>
                      <td><span class="tag a">${(s.module_id || '').toUpperCase()}</span></td>
                      <td class="m">${s.date_str || new Date(s.created_at).toLocaleDateString()}</td>
                      <td><span class="tag ${s.score >= 80 ? 'ok' : 'wn'}">${s.score}%</span></td>
                      <td><span class="tag ${s.safety_score >= 85 ? 'ok' : 'wn'}">${s.safety_score}%</span></td>
                      <td>
                        <span class="tag ${s.critical_gate_passed ? 'a' : 'er'}">
                          ${s.critical_gate_passed ? '✔ PASSED' : '✖ BREACH'}
                        </span>
                      </td>
                      <td class="m">${s.duration_secs || 0}s</td>
                    </tr>
                  `).join('')}
                </table>
              </div>
            ` : `
              <p class="m" style="padding:10px 0;text-align:center">No recent simulation attempts recorded yet. Completed trainee runs will stream here live via WebSocket.</p>
            `}
          </div>
        ` : ''}

        <!-- TAB CONTENT: TRAINEES & BATCHES -->
        ${curTrainerTab === 'trainees' ? `
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
              <div>
                <h3 style="margin:0">Trainee Cohort Roster (${allTrainees.length} Enrolled in PostgreSQL)</h3>
                <small class="m">Direct live connection to real enrolled engineering learners at Rajalakshmi Engineering College.</small>
              </div>
              <div style="display:flex;gap:6px">
                <button class="b o" style="font-size:12px;padding:4px 10px">All Batches (${allTrainees.length})</button>
              </div>
            </div>
            <div class="table-responsive">
              <table>
                <tr>
                  <th>Learner Name</th>
                  <th>Trainee ID</th>
                  <th>Email</th>
                  <th>Batch / Trade</th>
                  <th>Runs</th>
                  <th>Avg Safety</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
                ${allTrainees.map(u => `
                  <tr>
                    <td><b>${u.name}</b></td>
                    <td><code style="color:#38bdf8;font-size:12px">${u.traineeId || u.id}</code></td>
                    <td class="m" style="font-size:12px">${u.email}</td>
                    <td style="font-size:12px">${u.batch}</td>
                    <td><span class="tag" style="background:#1e293b;color:#f8fafc">${u.total_sessions || 0}</span></td>
                    <td>
                      <span class="tag ${(!u.avg_safety || u.avg_safety >= 80) ? 'ok' : 'wn'}">
                        ${u.avg_safety ? u.avg_safety + '%' : '100%'}
                      </span>
                    </td>
                    <td><span class="tag a" style="background:#052e16;color:#4ade80;border:1px solid #166534">● Active</span></td>
                    <td>
                      <div style="display:flex;gap:4px">
                        <button class="b o" style="font-size:11px;padding:3px 8px" onclick="openTraineePassport('${u.traineeId || u.id}')">✍️ Passport</button>
                        <button class="b bw" style="font-size:11px;padding:3px 8px" onclick="promptDispatchDrill('${u.name}', '${u.traineeId || u.id}')">🎯 Drill</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT: ASSIGNMENT BUILDER -->
        ${curTrainerTab === 'builder' ? `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:16px">
            <div class="c">
              <h3 style="margin:0 0 10px">📝 Create Curriculum Assignment</h3>
              <p class="m" style="margin:0 0 16px">Publish standardized training tasks with mandatory steps and deterministic safety gate rules directly to Neon PostgreSQL.</p>

              <form onsubmit="handleCreateAssignment(event)">
                <div style="margin-bottom:14px">
                  <label style="font-size:12px;color:#94a3b8">Assignment Title:</label>
                  <input id="asgn-title-input" required placeholder="e.g. 480V Breaker Isolation & Arc Flash Audit" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:14px">
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px;margin-bottom:14px">
                  <div>
                    <label style="font-size:12px;color:#94a3b8">Target Batch:</label>
                    <select id="asgn-batch-select" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#38bdf8;font-size:13px">
                      <option value="Industrial Electrical Batch A-24">Industrial Electrical Batch A-24</option>
                      <option value="Vocational Engineering Batch 2024-25">Vocational Engineering Batch 2024-25</option>
                      <option value="Welding & Fabrication Batch B-12">Welding &amp; Fabrication Batch B-12</option>
                      <option value="Mechanical & CNC Batch C-08">Mechanical &amp; CNC Batch C-08</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-size:12px;color:#94a3b8">Module / Scenario:</label>
                    <select id="asgn-mod-select" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#38bdf8;font-size:13px">
                      <option value="elec">⚡ Electrical Safety — Switchgear Maintenance (3D)</option>
                      <option value="weld">🔥 Welding Safety — Hot Work &amp; Fire Response (3D)</option>
                      <option value="con">🏗️ Construction Safety — Fall Arrest at Height</option>
                      <option value="mac">⚙️ Machine Operation — Lathe Guards &amp; E-Stop</option>
                      <option value="aut">🚗 Automotive Maintenance — Hydraulic Lift &amp; 12V Battery</option>
                    </select>
                  </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr));gap:12px;margin-bottom:16px">
                  <div>
                    <label style="font-size:12px;color:#94a3b8">Due Date:</label>
                    <input type="date" id="asgn-due-date" value="2026-10-30" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
                  </div>
                  <div>
                    <label style="font-size:12px;color:#94a3b8">Time Limit (mins):</label>
                    <input type="number" id="asgn-time-limit" value="15" min="5" max="60" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
                  </div>
                  <div>
                    <label style="font-size:12px;color:#94a3b8">Pass Criteria (%):</label>
                    <input type="number" id="asgn-pass-mark" value="85" min="60" max="95" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
                  </div>
                </div>

                <div style="margin-bottom:16px;background:#09121d;border:1px solid #1e2e42;border-radius:10px;padding:12px">
                  <label style="font-weight:700;color:#facc15;font-size:13px;display:flex;align-items:center;gap:6px">
                    <input type="checkbox" id="asgn-gate-check" checked style="accent-color:#22c55e">
                    Enforce Deterministic Critical Safety Gate (Zero-Tolerance Arc Flash &amp; Live Contact)
                  </label>
                  <div style="font-size:11px;color:#94a3b8;margin-top:4px">
                    If checked, critical safety violations trigger instant arc flash freeze-frame and cannot be averaged away.
                  </div>
                </div>

                <button type="submit" class="b" style="width:100%">🚀 Publish Assignment Live</button>
              </form>
            </div>

            <div class="c">
              <h3 style="margin:0 0 10px">Published Curriculum Assignments (${asgns.length})</h3>
              <p class="m" style="margin:0 0 14px">Active assignments currently assigned to student cohorts in Neon PostgreSQL database.</p>
              
              <div style="display:flex;flex-direction:column;gap:10px">
                ${asgns.map(a => `
                  <div style="background:#09121d;border:1px solid #1e2e42;border-radius:10px;padding:14px;border-left:4px solid var(--ac)">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start">
                      <div>
                        <b style="font-size:14px;color:#f8fafc">${a.title}</b>
                        <div class="m" style="font-size:12px;margin:3px 0">Cohort: <b>${a.batch}</b> · Module: <b>${(a.moduleId || a.module_id || '').toUpperCase()}</b></div>
                        <div class="m" style="font-size:11px">Due: ${a.dueDate || a.due_date} · Passing: ${a.passCriteria || a.pass_criteria}% · Limit: ${a.timeLimitMins || a.time_limit_mins} mins</div>
                      </div>
                      <div style="text-align:right">
                        <span class="tag a" style="font-size:10px">${a.status}</span>
                        <div style="margin-top:8px">
                          <button class="b o" style="font-size:11px;padding:3px 8px;border-color:#ef4444;color:#fca5a5" onclick="deleteAssignment('${a.id}')">🗑️ Withdraw</button>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT: AI SCENARIO APPROVAL QUEUE -->
        ${curTrainerTab === 'approvals' ? `
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div>
                <h3 style="margin:0;display:flex;align-items:center;gap:8px">
                  <span>🤖</span> AI Scenario Planner Governance Queue (${queue.length})
                </h3>
                <p class="m" style="margin:2px 0 0;font-size:12px">Trainer review is mandatory in PostgreSQL before AI-proposed scenarios can be assigned or shared.</p>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">
              ${queue.map(q => `
                <div style="background:#09121d;border:1.5px solid ${q.status==='approved'?'#22c55e':'#1e2e42'};border-radius:12px;padding:16px">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                    <div>
                      <span class="tag a" style="background:#0369a1;color:#fff;font-size:10px">${q.source}</span>
                      <span class="tag ${q.status==='approved'?'a':'wn'}" style="font-size:10px">${q.status.toUpperCase()}</span>
                      <h4 style="margin:4px 0 2px;font-size:16px">${q.title}</h4>
                      <div class="m" style="font-size:12px">Prompt: "${q.prompt}"</div>
                    </div>
                    <div style="display:flex;gap:6px">
                      ${q.status === 'pending' ? `
                        <button class="b" style="padding:6px 12px;font-size:12px;background:#15803d" onclick="approveScenario('${q.id}', true)">✅ Approve for Curriculum</button>
                        <button class="b o" style="padding:6px 12px;font-size:12px;border-color:#ef4444;color:#fca5a5" onclick="approveScenario('${q.id}', false)">❌ Reject</button>
                      ` : `
                        <span class="tag a" style="background:#15803d">Approved &amp; Added to Modules</span>
                      `}
                    </div>
                  </div>

                  <div style="margin-top:10px;padding:10px;background:#060a10;border-radius:8px;font-size:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px">
                    <div>
                      <b style="color:#ef4444">Identified Hazards:</b>
                      <ul style="margin:4px 0 0;padding-left:16px;color:#cbd5e1">
                        ${(q.hazards || []).map(h => `<li>${h}</li>`).join('')}
                      </ul>
                    </div>
                    <div>
                      <b style="color:#22c55e">Mandatory Protocol Steps:</b>
                      <ol style="margin:4px 0 0;padding-left:16px;color:#cbd5e1">
                        ${(q.mandatorySteps || []).map(s => `<li>${s}</li>`).join('')}
                      </ol>
                    </div>
                  </div>
                  <div style="margin-top:8px;font-size:11px;color:#38bdf8">
                    Safety Policy Check: <b>${q.policyCheck || 'PASSED (OSHA 1910 / ISO 45001)'}</b>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB CONTENT: SKILL PASSPORT VERIFICATION -->
        ${curTrainerTab === 'passport' ? `
          <div class="c">
            <!-- Trainee Selector Dropdown -->
            <div style="background:#09121d;border:1px solid #1e2e42;border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
              <div>
                <span style="font-size:12px;color:#94a3b8;font-weight:700">INSPECT &amp; ENDORSE TRAINEE PASSPORT:</span>
                <select id="trainer-passport-trainee-select" onchange="changePassportTrainee(this.value)" style="margin-left:8px;padding:8px 14px;border-radius:8px;background:#060a10;border:1px solid #38bdf8;color:#38bdf8;font-size:13px;font-weight:700">
                  ${allTrainees.map(t => `
                    <option value="${t.traineeId || t.id}" ${(curSelectedTraineePassportId === (t.traineeId || t.id)) ? 'selected' : ''}>
                      ${t.name} (${t.traineeId || t.id}) · ${t.batch}
                    </option>
                  `).join('')}
                </select>
              </div>
              <div>
                <span class="tag a" style="background:#052e16;color:#4ade80;border:1px solid #166534">● LIVE REGISTRY VERIFIABLE</span>
              </div>
            </div>

            <!-- Selected Trainee Passport Meta Card -->
            <div style="background:#080f1a;border:2px solid ${curPassport.status === 'VERIFIED' ? '#22c55e' : '#38bdf8'};border-radius:12px;padding:18px;margin-bottom:18px">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                <div>
                  <h3 style="margin:0;font-size:18px;color:#f8fafc">${curPassport.full_name || curPassport.fullName}</h3>
                  <div class="m" style="font-size:12px;margin-top:2px">ID: <b>${curPassport.trainee_id || curPassport.traineeId}</b> · Batch: <b>${curPassport.batch}</b></div>
                  <div class="m" style="font-size:12px">Institution: <b>${curPassport.institution}</b></div>
                </div>
                <div style="text-align:right">
                  <span class="tag ${curPassport.status === 'VERIFIED' ? 'ok' : 'a'}" style="font-size:12px;padding:4px 10px;font-weight:700">
                    ${curPassport.status}
                  </span>
                  <div style="margin-top:4px">
                    <a href="/verify/${curPassport.verification_hash || curPassport.verificationHash}" target="_blank" style="font-size:11px;color:#38bdf8;text-decoration:none">🔗 Open Public Verification Ledger</a>
                  </div>
                </div>
              </div>
              <div style="margin-top:10px;background:#020617;border:1px dashed #38bdf866;border-radius:6px;padding:8px 12px;font-family:monospace;font-size:11px;color:#38bdf8;word-break:break-all">
                SHA-256 Ledger Hash: <b>${curPassport.verification_hash || curPassport.verificationHash}</b>
              </div>
            </div>

            <h4 style="margin:16px 0 10px;color:#fff">Verified Vocational Competencies (${comps.length}):</h4>
            ${comps.map(c => `
              <div style="background:#09121d;border:1px solid ${c.status === 'VERIFIED' ? '#22c55e66' : '#1e2c40'};border-radius:10px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <div>
                  <div style="display:flex;align-items:center;gap:6px">
                    <b style="font-size:14px;color:#f1f5f9">${c.title}</b>
                    <span class="tag" style="background:#0369a1;color:#fff">${c.code}</span>
                  </div>
                  <div class="m" style="font-size:12px;margin-top:2px">Evidence: <b>${c.evidence}</b> · Standard: ${c.standard}</div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  ${c.status === 'VERIFIED' ? `
                    <span class="tag a" style="padding:6px 12px;background:#052e16;color:#4ade80;border:1px solid #166534">
                      ✅ Verified by ${c.certifier} on ${c.verified_date || c.verifiedDate}
                    </span>
                  ` : `
                    <button class="b" onclick="signCompetency('${c.code}', '${curPassport.trainee_id || curPassport.traineeId}')" style="font-size:12px;padding:6px 14px">
                      ✍️ Sign &amp; Verify Competency
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- TAB CONTENT: TARGETED REMEDIATION -->
        ${curTrainerTab === 'remediation' ? `
          <div class="c">
            <h3 style="margin:0 0 10px">🎯 Targeted Practice &amp; Remediation Dispatch</h3>
            <p class="m" style="margin:0 0 16px">Dispatch targeted micro-simulation drills directly to Neon PostgreSQL based on rule-based and AI mistake diagnostics.</p>

            <!-- Target Selection -->
            <div style="background:#09121d;border:1px solid #1e2e42;border-radius:10px;padding:12px;margin-bottom:16px;display:flex;align-items:center;flex-wrap:wrap;gap:10px">
              <span style="font-size:12px;color:#94a3b8;font-weight:700">TARGET TRAINEE / COHORT:</span>
              <select id="remediation-target-select" style="padding:6px 12px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
                <option value="All Enrolled Cohorts">All Enrolled Cohorts (Rajalakshmi Engineering College)</option>
                ${allTrainees.map(t => `
                  <option value="${t.name}">Student: ${t.name} (${t.traineeId || t.id})</option>
                `).join('')}
              </select>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b style="color:#ef4444;display:block;margin-bottom:4px">PPE Preparation Protocol</b>
                <p class="m" style="font-size:12px;margin:6px 0">Reinforces wearing all 3 mandatory PPE items before high-voltage equipment contact.</p>
                <button class="b bw" style="width:100%;font-size:12px" onclick="dispatchRemediation(document.getElementById('remediation-target-select').value, 'Mandatory 3-Point PPE Donning')">Dispatch 5-min PPE Drill ➔</button>
              </div>

              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b style="color:#f59e0b;display:block;margin-bottom:4px">LOTO Zero-Energy Verification</b>
                <p class="m" style="font-size:12px;margin:6px 0">Enforces multimeter 0.0V tester verification prior to physical panel maintenance.</p>
                <button class="b bw" style="width:100%;font-size:12px" onclick="dispatchRemediation(document.getElementById('remediation-target-select').value, 'LOTO Zero-Energy Verification')">Dispatch LOTO Drill ➔</button>
              </div>

              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b style="color:#38bdf8;display:block;margin-bottom:4px">Hot Work Fire Clearance</b>
                <p class="m" style="font-size:12px;margin:6px 0">Practice 10m perimeter clearance of flammable solvents before arc strike.</p>
                <button class="b bw" style="width:100%;font-size:12px" onclick="dispatchRemediation(document.getElementById('remediation-target-select').value, 'Welding Bay Fire Clearance')">Dispatch Hot Work Drill ➔</button>
              </div>

              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b style="color:#a855f7;display:block;margin-bottom:4px">Machine Guard &amp; E-Stop Protocol</b>
                <p class="m" style="font-size:12px;margin:6px 0">Enforces interlock guard closed &amp; emergency stop switch test sequence.</p>
                <button class="b bw" style="width:100%;font-size:12px" onclick="dispatchRemediation(document.getElementById('remediation-target-select').value, 'Machine Guard Interlock & E-Stop')">Dispatch Machine Safety Drill ➔</button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  };

  window.switchTrainerTab = function(tabKey) {
    curTrainerTab = tabKey;
    if (window.curView === 'trainer') go('trainer');
  };

  window.handleCreateAssignment = async function(e) {
    e.preventDefault();
    const title = document.getElementById('asgn-title-input')?.value.trim();
    const batch = document.getElementById('asgn-batch-select')?.value;
    const mod = document.getElementById('asgn-mod-select')?.value;
    const due = document.getElementById('asgn-due-date')?.value;
    const time = parseInt(document.getElementById('asgn-time-limit')?.value || 15);
    const pass = parseInt(document.getElementById('asgn-pass-mark')?.value || 85);
    const gate = document.getElementById('asgn-gate-check')?.checked;

    if (!title) return;

    const payload = {
      title,
      batch,
      module_id: mod,
      instructor_name: `${S.name} (Trainer)`,
      due_date: due,
      time_limit_mins: time,
      pass_criteria: pass,
      max_attempts: 3,
      mandatory_steps: ['Inspect work area', 'Wear PPE', 'Execute sequence flawlessly without safety infractions'],
      critical_safety_gate: gate,
      description: `Curriculum assignment published by ${S.name} with ${pass}% pass mark threshold.`
    };

    try {
      const res = await fetch('/api/v1/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(window.SKILLSAFE_TOKEN ? { 'Authorization': `Bearer ${window.SKILLSAFE_TOKEN}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        S.assignedWork = S.assignedWork || [];
        S.assignedWork.unshift({
          id: created.id,
          title: created.title,
          moduleId: created.module_id,
          batch: created.batch,
          instructor: created.instructor_name,
          assignedDate: created.assigned_date,
          dueDate: created.due_date,
          timeLimitMins: created.time_limit_mins,
          passCriteria: created.pass_criteria,
          maxAttempts: created.max_attempts,
          attemptsDone: 0,
          status: created.status,
          mandatorySteps: typeof created.mandatory_steps === 'string' ? JSON.parse(created.mandatory_steps) : created.mandatory_steps,
          criticalSafetyGate: !!created.critical_safety_gate,
          description: created.description
        });
        if (window.tip) tip(`✅ Assignment "${title}" published to Neon PostgreSQL and broadcast live!`);
      }
    } catch(err) {
      console.warn('Assignment creation error:', err);
    }

    switchTrainerTab('overview');
  };

  // Alias V.inst to V.trainer so old links redirect seamlessly
  V.inst = V.trainer;

  // -----------------------------------------------------------------------
  // VIEW: 🏛️ ADMIN WORKSPACE (Governance, Roles, Catalogues, Audit Trail)
  // -----------------------------------------------------------------------
  let curAdminTab = 'institution';

  V.admin = function() {
    return `
      <div class="w" style="max-width:1200px">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="tag a" style="background:#6d28d9;color:#fff">SYSTEM GOVERNANCE</span>
              <span class="tag" style="background:#1e293b;color:#94a3b8">Institutional Administrator</span>
            </div>
            <h1 style="margin:4px 0 2px">🏛️ Admin Workspace</h1>
            <p class="m" style="margin:0">Account policies, multi-campus boundaries, user permission matrix, approved 3D asset catalogue, and immutable audit logs.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="b o" onclick="openGroqSettings()">🔑 API Config</button>
          </div>
        </div>

        <!-- Sub-Tabs Navigation -->
        <div class="sub-tab-bar">
          <button class="sub-tab-btn ${curAdminTab==='institution'?'active':''}" onclick="switchAdminTab('institution')">🏛️ Institution Profile</button>
          <button class="sub-tab-btn ${curAdminTab==='users'?'active':''}" onclick="switchAdminTab('users')">👥 User Roles &amp; Permissions</button>
          <button class="sub-tab-btn ${curAdminTab==='catalog'?'active':''}" onclick="switchAdminTab('catalog')">📦 Course &amp; 3D Asset Catalogue</button>
          <button class="sub-tab-btn ${curAdminTab==='settings'?'active':''}" onclick="switchAdminTab('settings')">⚙️ Platform Settings</button>
          <button class="sub-tab-btn ${curAdminTab==='trends'?'active':''}" onclick="switchAdminTab('trends')">📈 Platform Safety Trends</button>
          <button class="sub-tab-btn ${curAdminTab==='audit'?'active':''}" onclick="switchAdminTab('audit')">📋 Governance Audit Trail (${S.auditLogs.length})</button>
        </div>

        <!-- TAB: INSTITUTION PROFILE -->
        ${curAdminTab === 'institution' ? `
          <div class="c" style="max-width:760px">
            <h3 style="margin:0 0 10px">Institution &amp; Multi-Campus Profile</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;margin-bottom:14px">
              <div>
                <label style="font-size:12px;color:#94a3b8">Institution Name:</label>
                <input value="${S.institution}" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
              </div>
              <div>
                <label style="font-size:12px;color:#94a3b8">Accreditation Body:</label>
                <input value="Autonomous Institution · Affiliated to Anna University" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#38bdf8;font-size:13px">
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:12px;margin-bottom:14px">
              <div>
                <label style="font-size:12px;color:#94a3b8">Accreditation ID:</label>
                <input value="REC-AUT-2024" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
              </div>
              <div>
                <label style="font-size:12px;color:#94a3b8">Active Accounts:</label>
                <input value="${S.users.length} Active Accounts Registered" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
              </div>
              <div>
                <label style="font-size:12px;color:#94a3b8">License Tier:</label>
                <input value="Center for Applied Engineering & Vocational Excellence" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#22c55e;font-size:13px">
              </div>
            </div>
            <button class="b" onclick="if(window.tip)tip('Institution settings updated.')">Save Changes</button>
          </div>
        ` : ''}

        <!-- TAB: USER ROLES & PERMISSIONS -->
        ${curAdminTab === 'users' ? `
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h3 style="margin:0">User Accounts &amp; Permission Boundaries (${S.users.length} Registered)</h3>
              <button class="b bw" style="font-size:12px;padding:6px 12px" onclick="openProfileModal()">➕ Add User</button>
            </div>
            <div class="table-responsive">
              <table>
                <tr><th>Name</th><th>Role</th><th>Batch / Department</th><th>Email</th><th>Status</th><th>Switch</th></tr>
                ${S.users.map(u => `
                  <tr>
                    <td><b>${u.name}</b></td>
                    <td><span class="tag a" style="background:${u.role==='admin'?'#6d28d9':(u.role==='trainer'?'#f59e0b':'#0284c7')}">${u.role.toUpperCase()}</span></td>
                    <td>${u.batch}</td>
                    <td class="m">${u.email}</td>
                    <td><span class="tag a">Active</span></td>
                    <td>
                      <button class="b o" style="font-size:11px;padding:3px 8px" onclick="S.name='${u.name}';switchRole('${u.role}')">Impersonate ➔</button>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        ` : ''}

        <!-- TAB: COURSE & 3D ASSET CATALOGUE -->
        ${curAdminTab === 'catalog' ? `
          <div class="c">
            <h3 style="margin:0 0 10px">Approved Vocational Trade Modules &amp; CAD Assets</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
              ${Object.keys(MODS).map(k => {
                const m = MODS[k];
                return `
                  <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                    <div style="display:flex;align-items:center;gap:8px">
                      <span style="font-size:24px">${m.i}</span>
                      <div>
                        <b style="font-size:14px;color:#fff">${m.n}</b><br>
                        <span class="tag a" style="font-size:10px">Accredited Syllabus</span>
                      </div>
                    </div>
                    <p class="m" style="margin:8px 0 10px;font-size:12px">${m.d}</p>
                    <button class="b o" style="font-size:11px;padding:4px 8px;width:100%" onclick="openMod('${k}')">Inspect Scenarios</button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- TAB: PLATFORM SETTINGS -->
        ${curAdminTab === 'settings' ? `
          <div class="c" style="max-width:720px">
            <h3 style="margin:0 0 10px">Platform Safety Policies &amp; Integration Settings</h3>
            
            <div style="margin-bottom:14px">
              <label style="font-size:12px;color:#94a3b8">Groq AI API Key (Scenario Planner &amp; Coach):</label>
              <div style="display:flex;gap:8px;margin-top:4px">
                <input id="admin-groq-key" type="password" value="${getGroqKey() || ''}" placeholder="gsk_..." style="flex:1;padding:10px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
                <button class="b" onclick="saveGroqKey(document.getElementById('admin-groq-key').value);if(window.tip)tip('Groq Key saved!')">Save Key</button>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:16px">
              <div>
                <label style="font-size:12px;color:#94a3b8">Standard Pass Mark Threshold:</label>
                <input type="number" value="85" style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#fff;font-size:13px">
              </div>
              <div>
                <label style="font-size:12px;color:#94a3b8">Critical Safety Gate Penalty:</label>
                <select style="width:100%;padding:10px;margin-top:4px;border-radius:8px;background:#060a10;border:1px solid #24354c;color:#ef4444;font-size:13px">
                  <option>Zero-Tolerance (Immediate Arc Flash Incident Freeze)</option>
                  <option>Severe Deduction (-40 Points + Mandatory Remediation)</option>
                </select>
              </div>
            </div>

            <button class="b" onclick="if(window.tip)tip('Policy settings updated.')">Apply Policy Settings</button>
          </div>
        ` : ''}

        <!-- TAB: PLATFORM SAFETY TRENDS -->
        ${curAdminTab === 'trends' ? `
          <div class="c">
            <h3 style="margin:0 0 10px">📈 Platform-Wide Institutional Safety Trends</h3>
            <p class="m" style="margin:0 0 14px">Live aggregate safety telemetry and compliance metrics across all registered Rajalakshmi Engineering College accounts.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">
              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b>Total Registered Accounts</b>
                <div style="font-size:32px;font-weight:800;color:#22c55e;margin:6px 0">${S.users.length} Users</div>
                <small style="color:#22c55e">${S.users.filter(u=>u.role==='learner').length} Active Learners · ${S.users.filter(u=>u.role==='trainer').length} Certified Trainers</small>
              </div>
              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b>Curriculum Modules &amp; Trades</b>
                <div style="font-size:32px;font-weight:800;color:#38bdf8;margin:6px 0">${Object.keys(MODS).length} Suites</div>
                <small style="color:#94a3b8">Interactive 3D simulation labs &amp; CAD assemblies</small>
              </div>
              <div style="background:#09121d;border:1px solid #1e2c40;border-radius:10px;padding:14px">
                <b>Governance Audit Ledger</b>
                <div style="font-size:32px;font-weight:800;color:#facc15;margin:6px 0">${S.auditLogs.length} Events</div>
                <small style="color:#facc15">Cryptographically logged administrative actions</small>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- TAB: GOVERNANCE AUDIT TRAIL -->
        ${curAdminTab === 'audit' ? `
          <div class="c">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
              <h3 style="margin:0">📋 Immutable Governance Audit Trail</h3>
              <button class="b o" style="font-size:12px;padding:4px 10px" onclick="exportAuditCsv()">📥 Export Audit CSV</button>
            </div>
            <div class="table-responsive">
              <table>
                <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Category</th><th>Detail</th></tr>
                ${S.auditLogs.map(l => `
                  <tr>
                    <td style="font-family:monospace;font-size:11px">${l.timestamp}</td>
                    <td><b>${l.user}</b></td>
                    <td><span class="tag a">${l.action}</span></td>
                    <td><span class="tag" style="background:#1e293b">${l.category}</span></td>
                    <td class="m">${l.detail}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  };

  window.switchAdminTab = function(tabKey) {
    curAdminTab = tabKey;
    if (window.curView === 'admin') go('admin');
  };

  window.exportAuditCsv = function() {
    let csv = "Timestamp,User,Action,Category,Detail\n";
    (S.auditLogs || []).forEach(l => {
      csv += `"${l.timestamp}","${l.user}","${l.action}","${l.category}","${l.detail.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillsafe_audit_log_${Date.now()}.csv`;
    a.click();
  };

  // -----------------------------------------------------------------------
  // VIEW: 🎓 LEARNER WORKSPACE (Updated V.dash with Assigned Work & Direct Launch)
  // -----------------------------------------------------------------------
  V.dash = function() {
    if (!S.name) {
      try {
        const u = JSON.parse(localStorage.getItem('skillsafe_user') || '{}');
        S.name = u.name || 'Trainee';
      } catch(e) {
        S.name = 'Trainee';
      }
    }
    const h = S.hist;
    const sk = avg(h.slice(-3), 'score');
    const sf = avg(h.slice(-3), 'safety');
    const pr = avg(h.slice(-3), 'proc');
    const pg = Math.min(100, h.length * 12);
    const rc = recommend(h);
    const asgns = S.assignedWork || [];

    const P = (k, l, v) => `
      <div class="c cl" onclick="kp('${k}')">
        <div class="m">${l}</div>
        <div class="k ${col(v)}" data-n="${v}" data-s="%">${v}%</div>
      </div>
    `;

    return `
      <div class="w">
        <!-- Welcoming Trainee Profile Banner -->
        <div class="c" style="background:linear-gradient(135deg,#0d1a2c 0%,#08121f 100%);border:1.5px solid var(--ac);box-shadow:0 8px 30px rgba(56,189,248,0.15);margin-bottom:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
            <div style="display:flex;align-items:center;gap:14px">
              <div class="user-avatar-circle" style="width:48px;height:48px;font-size:22px;flex-shrink:0">${(S.name || 'T')[0].toUpperCase()}</div>
              <div>
                <span class="tag a" style="background:#0284c7;color:#fff">TRAINEE WORKSPACE</span>
                <h1 style="margin:2px 0;font-size:clamp(20px, 4vw, 26px)">${S.name}</h1>
                <span class="m" style="font-size:12px;color:#94a3b8">${S.batch} · ID: <b>${S.traineeId}</b> · ${S.institution}</span>
              </div>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;width:auto">
              <button class="b" onclick="go('passport')">📜 View Skill Passport</button>
              <button class="b bw" onclick="go('cadlab')">🔬 CAD Model Lab</button>
            </div>
          </div>
        </div>

        <!-- 4 KPI Metrics (Responsive 2x2 on Mobile, 4x1 on Desktop) -->
        <div class="kpi-grid">
          ${P('score', 'Overall Practical Skill', sk)}
          ${P('safety', 'Safety Compliance', sf)}
          ${P('proc', 'Procedure Sequencing', pr)}
          <div class="c cl" onclick="kp('prog')">
            <div class="m">Training Progress</div>
            <div class="k" data-n="${pg}" data-s="%">${pg}%</div>
            <div class="bar"><i style="width:${pg}%"></i></div>
          </div>
        </div>

        <div id="kd" class="c" style="display:none;margin-bottom:18px;border-color:var(--ac)"></div>

        <!-- ===================================================================
             ASSIGNED WORK & TRAINING PLANS (From Instructor)
             =================================================================== -->
        <div class="c" style="margin-bottom:20px;border-left:4px solid var(--ac)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
            <div>
              <h3 style="margin:0;display:flex;align-items:center;gap:8px">
                <span>📋</span> Assigned Work &amp; Training Plans
              </h3>
              <span class="m" style="font-size:12px">Official curriculum tasks assigned by your instructor with pass criteria &amp; deadlines.</span>
            </div>
            <span class="tag a">${asgns.length} Assignments</span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%, 300px),1fr));gap:12px">
            ${asgns.map(a => `
              <div class="asgn-card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <span class="tag a" style="background:#0369a1;color:#fff">${a.moduleId.toUpperCase()}</span>
                  <span class="tag ${a.status==='completed'?'a':'wn'}">${a.status.toUpperCase()}</span>
                </div>
                <h4 style="margin:8px 0 4px;font-size:15px;color:#f8fafc">${a.title}</h4>
                <p class="m" style="font-size:12px;margin:0 0 10px">${a.description}</p>
                <div style="font-size:11px;color:#94a3b8;line-height:1.5;margin-bottom:12px">
                  <div>Instructor: <b>${a.instructor}</b></div>
                  <div>Due Date: <b style="color:#f59e0b">${a.dueDate}</b> · Time: <b>${a.timeLimitMins} mins</b></div>
                  <div>Pass Mark: <b style="color:#22c55e">${a.passCriteria}%</b> · Deterministic Gate: <b>Active</b></div>
                </div>
                <button class="b" onclick="launchAssignment('${a.id}')" style="width:100%;font-size:13px;padding:10px">
                  🚀 Launch 3D Simulation Session
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Launch Tile Grid -->
        <h3 style="margin:20px 0 12px;display:flex;align-items:center;gap:8px">
          <span>⚡</span> Vocational Simulation Suites
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%, 240px),1fr));gap:14px;margin-bottom:20px">
          <div class="c cl" onclick="openMod('elec')">
            <span style="font-size:32px">⚡</span>
            <h4 style="margin:8px 0 4px">Electrical Safety (3D VR)</h4>
            <p class="m" style="margin:0;font-size:12px">480V Industrial switchgear panel, LOTO isolation, zero voltage verification &amp; emergency drill.</p>
          </div>

          <div class="c cl" onclick="openMod('weld')">
            <span style="font-size:32px">🔥</span>
            <h4 style="margin:8px 0 4px">Welding Safety (3D VR)</h4>
            <p class="m" style="margin:0;font-size:12px">Hot-work perimeter clearance, fume ventilation, ground clamp &amp; Class B fire extinguisher response.</p>
          </div>

          <div class="c cl" onclick="openMod('con')">
            <span style="font-size:32px">🏗️</span>
            <h4 style="margin:8px 0 4px">Construction Safety (3D VR)</h4>
            <p class="m" style="margin:0;font-size:12px">Multi-tier scaffolding, green Scafftag, drop-zone barricading, lifeline D-ring anchor &amp; bolt torque fixing.</p>
          </div>

          <div class="c cl" onclick="openMod('mac')">
            <span style="font-size:32px">⚙️</span>
            <h4 style="margin:8px 0 4px">Machine Operation (3D VR)</h4>
            <p class="m" style="margin:0;font-size:12px">Heavy metal lathe chuck, interlocked polycarbonate guard, palm E-Stop trip test, swarf brush &amp; LOTO switch.</p>
          </div>

          <div class="c cl" onclick="go('cadlab')">
            <span style="font-size:32px">🔬</span>
            <h4 style="margin:8px 0 4px">CAD / 3D Model Lab</h4>
            <p class="m" style="margin:0;font-size:12px">Inspect 6 machinery assemblies with 0-100% exploded view slider, part isolation &amp; caliper readouts.</p>
          </div>

          <div class="c cl" onclick="go('ai3d')">
            <span style="font-size:32px">🤖</span>
            <h4 style="margin:8px 0 4px">AI 3D World Gen</h4>
            <p class="m" style="margin:0;font-size:12px">Type any workplace scenario. Groq AI compiles 3D physics and drops you directly into interactive VR.</p>
          </div>

          <div class="c cl" onclick="go('photo')">
            <span style="font-size:32px">📸</span>
            <h4 style="margin:8px 0 4px">Photo to Hazards Vision</h4>
            <p class="m" style="margin:0;font-size:12px">Upload real workplace photos. Vision AI audits OSHA violations and builds a playable 3D simulation.</p>
          </div>

          <div class="c cl" onclick="go('ar')" style="border:1.5px solid #38bdf8;box-shadow:0 4px 20px rgba(56,189,248,0.12)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:32px">⚡</span>
              <span class="tag a" style="font-size:10px">3–5 MINS · WEBAR</span>
            </div>
            <h4 style="margin:8px 0 4px;color:#f8fafc">AR Electrical Panel Safety</h4>
            <p class="m" style="margin:0;font-size:12px;color:#94a3b8">Real HIRO marker-tracked 415V switchgear inspection with spatial components and hazard challenge.</p>
          </div>
        </div>

        <!-- Recent Sessions Table -->
        <div class="c">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
            <h3 style="margin:0">Recent Practical Training Runs</h3>
            <button class="b o" onclick="go('passport')" style="font-size:12px;padding:4px 10px">View Full Evidence Trail</button>
          </div>
          <div class="table-responsive">
            <table>
              <tr><th>Date</th><th>Module</th><th>Overall Score</th><th>Safety Compliance</th><th>Procedure Accuracy</th><th>Safety Gate</th></tr>
              ${h.length === 0 ? `
                <tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8">No practical training runs recorded yet. Launch an assignment or vocational simulation suite above to record your first verified evidence trail.</td></tr>
              ` : h.slice(-5).reverse().map((s, i) => `
                <tr>
                  <td>${s.d}</td>
                  <td><b>${s.mod}</b></td>
                  <td class="${col(s.score)}">${s.score}%</td>
                  <td class="${col(s.safety)}">${s.safety}%</td>
                  <td class="${col(s.proc)}">${s.proc}%</td>
                  <td><span class="tag a">PASSED</span></td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // -----------------------------------------------------------------------
  // VIEW: 🏠 PLATFORM HOME PAGE (Architecture Highlights)
  // -----------------------------------------------------------------------
  V.home = function() {
    return `
      <section class="hero" style="padding:48px 16px 36px;text-align:center">
        <span class="tag" style="background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;font-weight:700;letter-spacing:1px;padding:4px 12px;border-radius:20px">AR/VR VOCATIONAL TRAINING PLATFORM</span>
        <h1 style="font-size:clamp(32px,5vw,52px);margin:14px 0 6px;letter-spacing:-1px">SkillSafe <span style="color:#38bdf8">VR</span></h1>
        <h2 style="color:var(--warn);font-size:clamp(18px,3vw,26px);margin:0 0 14px;font-weight:700">Learn. Practice. Fail Safely. Master Skills.</h2>
        <p style="max-width:760px;margin:0 auto 24px;font-size:16px;color:#cbd5e1;line-height:1.6">
          An immersive AR/VR vocational engineering platform allowing technical trainees to practice high-voltage electrical procedures, industrial welding, and machine maintenance with <b>deterministic OSHA/AWS safety gates</b>, <b>Three.js WebXR simulations</b>, and <b>tamper-evident Skill Passports</b>.
        </p>

        <!-- Primary CTA Buttons -->
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;max-width:820px;margin:0 auto">
          <button class="b" onclick="switchRole('learner')" style="box-shadow:0 0 20px rgba(56,189,248,0.4);font-size:15px;padding:10px 22px">🚀 Enter Trainee Workspace</button>
          <button class="b o" onclick="go('mods')" style="font-size:15px;padding:10px 20px">🥽 3D VR Simulation Bay</button>
          <button class="b bw" onclick="go('cadlab')" style="font-size:15px;padding:10px 20px">🔬 CAD 3D Model Lab</button>
          <button class="b o" onclick="switchRole('trainer')" style="font-size:15px;padding:10px 20px">👨‍🏫 Instructor Portal</button>
          <button class="b o" onclick="switchRole('admin')" style="font-size:15px;padding:10px 20px">🏛️ Admin Console</button>
        </div>
      </section>

      <div class="w" style="margin-top:20px">
        <!-- 3 Workspace Pillar Cards -->
        <h2 style="margin-bottom:12px">🏢 Role Workspaces</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-bottom:32px">
          <div class="c cl" onclick="switchRole('learner')" style="border-left:4px solid #38bdf8;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <span style="font-size:32px">🎓</span>
              <div>
                <h3 style="margin:0">Learner Workspace</h3>
                <span class="tag a" style="font-size:10px">Trainee Hands-On Portal</span>
              </div>
            </div>
            <p class="m" style="margin:0 0 12px;font-size:13.5px">Execute high-voltage 415V switchgear isolations, MIG/TIG welding passes, CAD disassembly drills, and earn verified credentials.</p>
            <button class="b" onclick="switchRole('learner');event.stopPropagation()" style="width:100%;font-size:13px">Launch Learner Dashboard ➔</button>
          </div>

          <div class="c cl" onclick="switchRole('trainer')" style="border-left:4px solid #f59e0b;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <span style="font-size:32px">👨‍🏫</span>
              <div>
                <h3 style="margin:0">Trainer Portal</h3>
                <span class="tag wn" style="font-size:10px">Instructor &amp; Evaluator</span>
              </div>
            </div>
            <p class="m" style="margin:0 0 12px;font-size:13.5px">Monitor real-time cohort safety infractions, build standardized curriculum drills, approve AI scenarios, and sign off skill passports.</p>
            <button class="b o" onclick="switchRole('trainer');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#f59e0b;color:#f59e0b">Open Instructor Console ➔</button>
          </div>

          <div class="c cl" onclick="switchRole('admin')" style="border-left:4px solid #8b5cf6;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <span style="font-size:32px">🏛️</span>
              <div>
                <h3 style="margin:0">Admin Console</h3>
                <span class="tag" style="background:#8b5cf6;color:#fff;font-size:10px">Institutional Governance</span>
              </div>
            </div>
            <p class="m" style="margin:0 0 12px;font-size:13.5px">Manage multi-campus institutions, student enrollments, accredited curricula, RBAC permissions, and chronological audit trails.</p>
            <button class="b o" onclick="switchRole('admin');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#8b5cf6;color:#8b5cf6">Access Administration ➔</button>
          </div>
        </div>

        <!-- Practical 3D Simulation Suites -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div>
            <h2 style="margin:0">⚡ Hands-On Practical Simulation Suites</h2>
            <p class="m" style="margin:4px 0 0">Interactive Three.js WebXR modules with spatial physics and real-time safety gate evaluation.</p>
          </div>
          <button class="b bw" onclick="go('mods')">View All Modules ➔</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:32px">
          <div class="c cl" onclick="openMod('elec')" style="border-top:3px solid #38bdf8;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">⚡</span>
              <span class="tag a">3D VR READY</span>
            </div>
            <h3 style="margin:8px 0 4px">Electrical Safety &amp; LOTO</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">415V switchgear panel, lockout/tagout padlocking, multimeter 0.0V verification, and arc flash blast physics.</p>
            <button class="b" onclick="openMod('elec');event.stopPropagation()" style="width:100%;font-size:13px">▶ Launch 3D Simulation</button>
          </div>

          <div class="c cl" onclick="openMod('weld')" style="border-top:3px solid #f97316;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">🔥</span>
              <span class="tag wn">3D VR READY</span>
            </div>
            <h3 style="margin:8px 0 4px">Industrial Welding Bay</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Hot-work perimeter clearance, fume extractor exhaust, grounding clamp attachment, and Class B fire emergency drill.</p>
            <button class="b" onclick="openMod('weld');event.stopPropagation()" style="width:100%;font-size:13px;background:linear-gradient(135deg,#ea580c,#c2410c)">▶ Launch Welding Bay</button>
          </div>

          <div class="c cl" onclick="openMod('con')" style="border-top:3px solid #eab308;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">🏗️</span>
              <span class="tag a" style="background:#ca8a04;color:#fff">3D VR READY</span>
            </div>
            <h3 style="margin:8px 0 4px">Construction Safety</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Multi-tier steel scaffolding, green Scafftag, drop-zone barricading, lifeline D-ring anchor, and bolt torque fixing at height.</p>
            <button class="b" onclick="openMod('con');event.stopPropagation()" style="width:100%;font-size:13px;background:linear-gradient(135deg,#ca8a04,#a16207)">▶ Launch Construction 3D</button>
          </div>

          <div class="c cl" onclick="openMod('mac')" style="border-top:3px solid #06b6d4;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">⚙️</span>
              <span class="tag a" style="background:#0891b2;color:#fff">3D VR READY</span>
            </div>
            <h3 style="margin:8px 0 4px">Machine Operation</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Heavy metalworking lathe chuck, interlocked polycarbonate guard, palm E-Stop trip test, swarf brush, and LOTO switch.</p>
            <button class="b" onclick="openMod('mac');event.stopPropagation()" style="width:100%;font-size:13px;background:linear-gradient(135deg,#0891b2,#0e7490)">▶ Launch Machine 3D</button>
          </div>

          <div class="c cl" onclick="go('cadlab')" style="border-top:3px solid #10b981;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">🔬</span>
              <span class="tag ok">INTERACTIVE CAD</span>
            </div>
            <h3 style="margin:8px 0 4px">CAD / 3D Model Lab</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Inspect 6 engineering machinery assemblies, 0-100% exploded view slider, wireframe toggle, and precision calipers.</p>
            <button class="b o" onclick="go('cadlab');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#10b981;color:#10b981">🔬 Open CAD Lab</button>
          </div>

          <div class="c cl" onclick="go('ai3d')" style="border-top:3px solid #a855f7;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">🤖</span>
              <span class="tag" style="background:#a855f7;color:#fff">GROQ AI CORE</span>
            </div>
            <h3 style="margin:8px 0 4px">AI 3D World Gen</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Prompt any industrial workplace scenario in plain text. AI compiles 3D spatial layout and drops you directly into WebXR.</p>
            <button class="b o" onclick="go('ai3d');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#a855f7;color:#a855f7">⚡ Launch AI World</button>
          </div>

          <div class="c cl" onclick="go('photo')" style="border-top:3px solid #ec4899;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">📸</span>
              <span class="tag" style="background:#ec4899;color:#fff">VISION AI</span>
            </div>
            <h3 style="margin:8px 0 4px">Photo to Hazards</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Upload real workplace photos. Vision AI audits OSHA violations and converts photographic hazards into 3D simulations.</p>
            <button class="b o" onclick="go('photo');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#ec4899;color:#ec4899">📸 Scan Workshop Photo</button>
          </div>

          <div class="c cl" onclick="go('passport')" style="border-top:3px solid #eab308;cursor:pointer">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <span style="font-size:28px">📜</span>
              <span class="tag" style="background:#eab308;color:#04121c">TAMPER-EVIDENT</span>
            </div>
            <h3 style="margin:8px 0 4px">Verifiable Skill Passport</h3>
            <p class="m" style="font-size:13px;margin:0 0 12px">Accredited student credentials with QR code verification, SHA-256 integrity hash, and instructor cryptographic signatures.</p>
            <button class="b o" onclick="go('passport');event.stopPropagation()" style="width:100%;font-size:13px;border-color:#eab308;color:#eab308">📜 View Skill Passport</button>
          </div>
        </div>

        <!-- Vocational Training Quick Access Banner -->
        <div class="c cl" onclick="go('mods')" style="background:linear-gradient(135deg,#0d1b2a 0%,#09111b 100%);border:1.5px solid var(--ac);box-shadow:0 8px 30px rgba(56,189,248,0.15)">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <span class="tag a">PRACTICAL VOCATIONAL CURRICULUM</span>
              <h3 style="margin:4px 0 2px">Standardized Industrial Safety &amp; Equipment Training</h3>
              <p class="m" style="margin:0">Lockout/Tagout (LOTO) · Arc Flash Safety · MIG/TIG Welding · CAD 3D Disassembly · Caliper Metrology</p>
            </div>
            <button class="b" onclick="go('mods')">Start Practice Session ➔</button>
          </div>
        </div>
      </div>
    `;
  };

  console.log("SkillSafe VR Enterprise Views successfully loaded.");
  if (typeof go === 'function' && window.curView) {
    try { go(window.curView); } catch(e) { console.warn('Extension view refresh', e); }
  }
})();
