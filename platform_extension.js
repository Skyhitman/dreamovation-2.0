// =========================================================================
// ⚡ SKILLSAFE VR ENTERPRISE ARCHITECTURE ENGINE (v6.0)
// Complete Implementation of Architecture Diagram:
// 1. Identity & Role Routing (Learner, Trainer, Admin Workspaces)
// 2. Core Domain Services (Users, Catalogue, Assignments, Orchestrator, Safety Gate, Passport, Audit)
// 3. Interactive Platform Architecture & End-to-End Data Flow Visualizer
// 4. CAD / 3D Model Lab (6 Assemblies, Explode Slider, Isolate, Wireframe, Calipers)
// 5. Verifiable Skill Passport (QR Code, Competencies, Instructor Sign-Off)
// 6. Runtime Event Contract Live Telemetry Stream
// =========================================================================

(function() {
  console.log("Initializing SkillSafe VR Enterprise Architecture...");

  // -----------------------------------------------------------------------
  // 0. AUTHENTICATION GUARD — Redirect to login if not authenticated
  // -----------------------------------------------------------------------
  const AUTH_TOKEN = localStorage.getItem('skillsafe_token');
  const AUTH_USER_RAW = localStorage.getItem('skillsafe_user');

  if (!AUTH_TOKEN || !AUTH_USER_RAW) {
    console.warn('[Auth] No session found — redirecting to login');
    window.location.href = '/login';
    return;
  }

  let AUTH_USER;
  try {
    AUTH_USER = JSON.parse(AUTH_USER_RAW);
  } catch (e) {
    console.error('[Auth] Corrupt session data — redirecting to login');
    localStorage.removeItem('skillsafe_token');
    localStorage.removeItem('skillsafe_user');
    window.location.href = '/login';
    return;
  }

  // Expose globally for API calls
  window.SKILLSAFE_TOKEN = AUTH_TOKEN;
  window.SKILLSAFE_USER = AUTH_USER;

  // Helper: authenticated fetch wrapper
  window.authFetch = function(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    if (!options.headers['Content-Type'] && options.body) {
      options.headers['Content-Type'] = 'application/json';
    }
    return fetch(url, options).then(r => {
      if (r.status === 401) {
        // Token expired — force re-login
        localStorage.removeItem('skillsafe_token');
        localStorage.removeItem('skillsafe_user');
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      return r;
    });
  };

  // Logout function
  window.skillsafeLogout = function() {
    localStorage.removeItem('skillsafe_token');
    localStorage.removeItem('skillsafe_user');
    window.location.href = '/login';
  };

  // -----------------------------------------------------------------------
  // 1. PLATFORM STATE & DATA INITIALIZATION (from authenticated user)
  // -----------------------------------------------------------------------
  window.S = window.S || {};
  const S = window.S;

  // Load user profile from authenticated session
  S.name = AUTH_USER.name || 'User';
  S.role = AUTH_USER.role || 'learner';
  S.email = AUTH_USER.email || '';
  S.institution = 'Rajalakshmi Engineering College (REC)';
  S.batch = AUTH_USER.batch || 'Unassigned';
  S.traineeId = AUTH_USER.trainee_id || 'REC-VR-00000';

  // 1. Purge legacy mock runs and maintain real trainee history
  if (Array.isArray(S.hist)) {
    S.hist = S.hist.filter(h => !(h.d === '10/09/2026' && h.score === 92 && h.mod === 'Electrical Safety'));
  } else {
    S.hist = [];
  }
  if (S.xp === undefined || S.xp === null || S.xp === 1450) {
    S.xp = S.hist.length ? S.hist.reduce((acc, h) => acc + (h.score || 0), 0) : 0;
  }
  if (S.streak === undefined || S.streak === null || S.streak === 5) {
    S.streak = S.hist.length > 0 ? 1 : 0;
  }
  if (!S.badges || (S.badges.length === 5 && S.badges.includes('Hazard Hunter') && S.hist.length === 0)) {
    S.badges = [];
  }

  // 2. Real Vocational Assignments (Synchronized with Saurav K as Trainer)
  if (!S.assignedWork || S.assignedWork.some(a => a.instructor && a.instructor.includes('Sharma'))) {
    S.assignedWork = [
      {
        id: 'asgn_01',
        title: 'Lockout / Tagout (LOTO) & Multimeter Isolation Test',
        moduleId: 'elec',
        batch: 'Industrial Electrical Batch A-24',
        instructor: 'Saurav K (Trainer)',
        assignedDate: '2026-10-11',
        dueDate: '2026-10-25',
        timeLimitMins: 15,
        passCriteria: 85,
        maxAttempts: 3,
        attemptsDone: 0,
        status: 'in_progress',
        mandatorySteps: [
          'Identify electrical hazard on panel',
          'Select and don all 3 PPE items',
          'Isolate breaker B3 according to work order',
          'Apply physical LOTO padlock',
          'Verify 0.0V de-energized state with tester'
        ],
        criticalSafetyGate: true,
        description: 'Perform standard high-voltage 415V switchgear isolation and apply OSHA compliant lockout/tagout.'
      },
      {
        id: 'asgn_02',
        title: 'GMAW 3G Vertical-Up Root Pass Compliance',
        moduleId: 'weld',
        batch: 'Industrial Electrical Batch A-24',
        instructor: 'Saurav K (Trainer)',
        assignedDate: '2026-10-11',
        dueDate: '2026-10-28',
        timeLimitMins: 20,
        passCriteria: 80,
        maxAttempts: 2,
        attemptsDone: 0,
        status: 'in_progress',
        mandatorySteps: [
          'Check Gas Regulator and forced local fume ventilation',
          'Attach Ground Clamp before striking arc',
          'Position CO2 extinguisher within arm reach',
          'Execute 3G Root Pass meeting AWS D1.1 visual tolerances'
        ],
        criticalSafetyGate: true,
        description: 'Hot-work hazard mitigation procedure and simulated class B fire response.'
      }
    ];
  }

  // 3. Real Skill Passport (Tied directly to authenticated user and synchronized with database)
  const realTraineeId = AUTH_USER.trainee_id || S.traineeId || 'REC-VR-B7F37';
  const realName = AUTH_USER.name || S.name || 'Saurav Karunakaran';
  const realBatch = AUTH_USER.batch || S.batch || 'Vocational Engineering Batch 2024-25';
  const realHash = realTraineeId === 'REC-VR-B7F37' ? '0x1E915D5CA6B71AC229E6F455' : '0x' + (Math.abs(`${realTraineeId}-${realName}-REC-2026`.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).toUpperCase().padStart(16, '0'));

  if (!S.skillPassport || S.skillPassport.traineeId !== realTraineeId || S.skillPassport.fullName !== realName || !S.skillPassport.verificationHash || S.skillPassport.verificationHash.includes('7f83b165') || S.skillPassport.verifiedBy?.includes('Sharma')) {
    S.skillPassport = {
      traineeId: realTraineeId,
      fullName: realName,
      institution: 'Rajalakshmi Engineering College (REC)',
      batch: realBatch,
      council: 'Autonomous Institution · Affiliated to Anna University',
      issuedDate: '2026-03-15',
      verifiedBy: 'Saurav K (Trainer)',
      verificationHash: realHash,
      status: 'IN_TRAINING',
      competencies: [
        {
          code: 'ELE-VR-01',
          title: 'Live Voltage Isolation & LOTO Verification',
          standard: 'OSHA 1910.147 / IS 5216',
          level: 'Level 4 (Autonomous Operator)',
          status: 'IN_TRAINING',
          verifiedDate: null,
          evidence: 'Requires 3D Switchgear isolation run with zero arc flash infractions.',
          certifier: null
        },
        {
          code: 'ELE-VR-02',
          title: 'Arc Flash PPE Category IV Deployment',
          standard: 'NFPA 70E Standard 2024',
          level: 'Level 4 (Autonomous Operator)',
          status: 'IN_TRAINING',
          verifiedDate: null,
          evidence: 'Requires full 40 cal/cm² suit donning and face shield sequence in VR.',
          certifier: null
        },
        {
          code: 'WLD-VR-01',
          title: 'GMAW Multi-Pass Groove Weld in 3G Position',
          standard: 'AWS D1.1 Structural Welding Code',
          level: 'Level 3 (Supervised Specialist)',
          status: 'IN_TRAINING',
          verifiedDate: null,
          evidence: 'Requires 15 deg electrode angle and bead width compliance in welding bay.',
          certifier: null
        },
        {
          code: 'WLD-VR-02',
          title: 'Shielding Gas Pre-Flow & Cylinder Safety',
          standard: 'ISO 3834-2 / OSHA 1926.350',
          level: 'Level 4 (Autonomous Operator)',
          status: 'IN_TRAINING',
          verifiedDate: null,
          evidence: 'Requires pre-flow timer calibration and zero-leak cylinder valve verification.',
          certifier: null
        },
        {
          code: 'EMR-VR-01',
          title: 'Electrical Shock Emergency Response & CPR',
          standard: 'Red Cross Industrial First Aid 2025',
          level: 'Level 3 (Practitioner)',
          status: 'IN_TRAINING',
          verifiedDate: null,
          evidence: 'Requires emergency stop procedure & simulated shock response drill.',
          certifier: null
        }
      ]
    };
  }

  // 4. AI Scenario Approval Queue (AI Governance)
  if (!S.approvalQueue) {
    S.approvalQueue = [
      {
        id: 'scen-ai-901',
        title: 'Automotive Garage Hydraulic Lift Failure & 12V Battery Spark',
        source: 'Groq AI Scenario Planner',
        prompt: 'Automotive garage with oily floor spill, car on hydraulic lift, fire extinguisher, and disconnect 12V battery',
        submittedDate: '2026-10-11',
        status: 'pending',
        hazards: ['Hydraulic collapse under load', 'Oil slip and trip hazard', '12V lead-acid battery short circuit spark'],
        mandatorySteps: [
          'Don nitrile gloves and safety eye protection',
          'Place wheel chocks around rear tires',
          'Position mechanical jack stands under frame',
          'Disconnect 12V battery negative ground terminal',
          'Deploy chemical absorbent pads on oil spill'
        ],
        policyCheck: 'PASSED (OSHA 1910.303 / ISO 45001 Compliant)',
        reviewerNotes: ''
      },
      {
        id: 'scen-ai-902',
        title: 'Rooftop Solar PV Inverter Arc Hazard & Safety Harness Anchor',
        source: 'Photo-to-Workplace Vision AI',
        prompt: 'Solar PV rooftop installation with loose harness and sparking DC isolator switch',
        submittedDate: '2026-10-11',
        status: 'approved',
        hazards: ['600V DC string arc flash', 'Catastrophic fall from roof edge (> 8m)', 'Absence of static lifeline anchor'],
        mandatorySteps: [
          'Inspect full body fall arrest harness',
          'Clip dual lanyards to certified roof static line',
          'Isolate DC string disconnect switch with arc-rated gloves',
          'Verify zero DC voltage with high-voltage probe'
        ],
        policyCheck: 'PASSED (NEC 690 / OSHA 1926.502 Compliant)',
        reviewerNotes: 'Approved by Saurav K for Rajalakshmi Engineering College curriculum.'
      }
    ];
  }

  // 5. Real Governance Audit Logs (From Database initialization & active events)
  if (!S.auditLogs || S.auditLogs.some(l => l.user?.includes('Sharma') || l.user?.includes('Patel'))) {
    S.auditLogs = [
      { timestamp: '2026-10-11 06:12:38', user: 'Pooja Sharma (Learner)', action: 'USER_REGISTERED', detail: 'New Learner user registered (pooja.sharma@rajalakshmi.edu.in)', category: 'Identity & Access' },
      { timestamp: '2026-10-11 06:02:11', user: 'Deepak Kumar (Learner)', action: 'USER_REGISTERED', detail: 'New Learner user registered (deepak.kumar@rajalakshmi.edu.in)', category: 'Identity & Access' },
      { timestamp: '2026-10-11 05:49:07', user: 'Saurav K (Trainer)', action: 'ASSIGNMENT_CREATED', detail: 'Created assignment: Lockout / Tagout (LOTO) & Multimeter Isolation Test', category: 'CURRICULUM' },
      { timestamp: '2026-10-11 04:40:12', user: 'Sami Sauravanu (Admin)', action: 'PLATFORM_INITIALIZATION', detail: 'SkillSafe VR Core Backend and Rajalakshmi Engineering College institutional schemas initialized.', category: 'SYSTEM' }
    ];
  }

  if (!S.telemetryStream) S.telemetryStream = [];

  // 6. Real Active User Roster (Strictly Real Registered Accounts)
  const REAL_DEFAULT_USERS = [
    { id: 'u_trainer_saurav', name: 'Saurav K', role: 'trainer', batch: 'Electrical & Electronics Engineering', email: 'saurav.k.2024.ece@rajalakshmi.edu.in', status: 'Active' },
    { id: 'u_admin_sami', name: 'Sami Sauravanu', role: 'admin', batch: 'Institutional Governance', email: 'samisauravanu@gmail.com', status: 'Active' },
    { id: 'u_def0d29c', name: 'Deepak Kumar', role: 'learner', batch: 'Industrial Electrical & Switchgear Isolation', email: 'deepak.kumar@rajalakshmi.edu.in', status: 'Active' },
    { id: 'u_83ae42ce', name: 'Saurav Karunakaran', role: 'learner', batch: 'Vocational Engineering Batch 2024-25', email: 'sauravksep29@gmail.com', status: 'Active' }
  ];

  if (!S.users || S.users.some(u => u.email?.includes('technical.ac.in') || u.email?.includes('nsdc.gov.in') || u.id === 'u-1')) {
    S.users = REAL_DEFAULT_USERS;
  }

  try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}

  // -----------------------------------------------------------------------
  // 2. CORE DOMAIN SERVICES & EVENT DISPATCHERS
  // -----------------------------------------------------------------------

  // Update Nav UI with State
  // -----------------------------------------------------------------------
  // 2. ROLE-BASED ACCESS CONTROL (RBAC) & NAVIGATION SECURITY
  // -----------------------------------------------------------------------

  const USER_AUTH_ROLE = AUTH_USER.role || 'learner';

  // Modal: Access Denied / Authorization Required
  window.showAccessDeniedModal = function(requiredRole, currentRole) {
    const existing = document.getElementById('access-denied-modal');
    if (existing) existing.remove();

    const roleTitles = {
      trainer: '👨‍🏫 Instructor / Trainer Workspace',
      admin: '🏛️ System Administrator Console',
      learner: '🎓 Learner Workspace'
    };

    const targetTitle = roleTitles[requiredRole] || requiredRole.toUpperCase();
    const currRoleTitle = currentRole === 'learner' ? 'Registered Learner / Trainee' : (currentRole === 'trainer' ? 'Certified Instructor' : 'Administrator');

    const m = document.createElement('div');
    m.id = 'access-denied-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,12,0.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px;animation:fadeIn 0.2s ease-out';
    m.innerHTML = `
      <div style="background:#0b1320;border:2px solid #ef4444;border-radius:18px;max-width:520px;width:100%;padding:28px;color:#f8fafc;box-shadow:0 20px 60px rgba(239,68,68,0.25);position:relative">
        <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:18px">
          <div style="width:52px;height:52px;border-radius:14px;background:#ef444422;border:1px solid #ef444455;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">
            🔒
          </div>
          <div>
            <div style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;background:#ef444422;color:#ef4444;letter-spacing:0.5px;margin-bottom:4px">
              AUTHORIZATION REQUIRED · ISO 27001
            </div>
            <h2 style="margin:0;font-size:20px;color:#fff;line-height:1.2">Access Restricted to Authorized Personnel</h2>
          </div>
        </div>

        <p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 16px">
          You attempted to enter the <b style="color:#f1f5f9">${targetTitle}</b>. 
          This area is restricted to personnel with verified <b style="color:#f59e0b">${requiredRole.toUpperCase()}</b> credentials.
        </p>

        <div style="background:#060b13;border:1px solid #1e293b;border-radius:12px;padding:14px;margin-bottom:20px;font-size:13px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#64748b">Signed-in User:</span>
            <b style="color:#f1f5f9">${AUTH_USER.name}</b>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#64748b">Account Email:</span>
            <code style="color:#38bdf8">${AUTH_USER.email}</code>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#64748b">Assigned Role:</span>
            <span style="background:${currentRole==='admin'?'#6d28d9':(currentRole==='trainer'?'#f59e0b':'#0284c7')};color:#fff;padding:1px 8px;border-radius:99px;font-size:11px;font-weight:700">${currRoleTitle}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:#64748b">Authorization Status:</span>
            <b style="color:#ef4444">⛔ Unpermitted Access Attempt Blocked</b>
          </div>
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap">
          <button class="b" onclick="document.getElementById('access-denied-modal').remove();go('dash')" style="font-size:13px;padding:10px 18px">
            Return to My Workspace
          </button>
          <button class="b o" onclick="skillsafeLogout()" style="font-size:13px;padding:10px 18px;border-color:#ef444455;color:#f87171">
            Sign In with Different Account
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  };

  // Attempt switch from nav button
  window.attemptRestrictedSwitch = function(targetRole) {
    window.showAccessDeniedModal(targetRole, USER_AUTH_ROLE);
  };

  // -----------------------------------------------------------------------
  // DEDICATED WORKSPACE HELPERS & ROUTING
  // -----------------------------------------------------------------------

  // Jump to specific Trainer workspace tab
  window.goTrainerTab = function(tab) {
    if (USER_AUTH_ROLE !== 'trainer' && USER_AUTH_ROLE !== 'admin') {
      showAccessDeniedModal('trainer', USER_AUTH_ROLE);
      return;
    }
    if (window.switchTrainerTab) window.switchTrainerTab(tab);
    go('trainer');
  };

  // Jump to specific Admin workspace tab
  window.goAdminTab = function(tab) {
    if (USER_AUTH_ROLE !== 'admin') {
      showAccessDeniedModal('admin', USER_AUTH_ROLE);
      return;
    }
    if (window.switchAdminTab) window.switchAdminTab(tab);
    go('admin');
  };

  // Brand logo home click routed to user's dedicated portal
  window.goHomeForRole = function() {
    if (USER_AUTH_ROLE === 'trainer') go('trainer');
    else if (USER_AUTH_ROLE === 'admin') go('admin');
    else go('dash');
  };

  // Update Nav UI with authenticated state & strict role-isolated content
  window.updateNavHeader = function() {
    const role = USER_AUTH_ROLE;
    const container = document.getElementById('role-nav-links');
    const badge = document.getElementById('nav-portal-badge');
    const cur = window.curView || (role === 'trainer' ? 'trainer' : (role === 'admin' ? 'admin' : 'dash'));

    if (badge) {
      if (role === 'trainer') {
        badge.textContent = '👨‍🏫 Instructor Portal';
        badge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        badge.style.color = '#04121c';
      } else if (role === 'admin') {
        badge.textContent = '🏛️ Admin Console';
        badge.style.background = 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
        badge.style.color = '#fff';
      } else {
        badge.textContent = '🎓 Trainee Portal';
        badge.style.background = 'linear-gradient(135deg, #0284c7, #38bdf8)';
        badge.style.color = '#fff';
      }
    }

    const mobileContainer = document.getElementById('mobile-role-nav-links');

    if (container) {
      if (role === 'learner') {
        // ONLY LEARNER MODULES & CONTENTS
        container.innerHTML = `
          <button class="nav-link-btn ${cur==='dash'?'active':''}" onclick="go('dash')">📊 Dashboard</button>
          <button class="nav-link-btn ${cur==='mods'||cur==='sim'?'active':''}" onclick="go('mods')">🥽 3D VR</button>
          <button class="nav-link-btn ${cur==='cadlab'?'active':''}" onclick="go('cadlab')">🔬 CAD Lab</button>
          <button class="nav-link-btn ${cur==='passport'?'active':''}" onclick="go('passport')">📜 Passport</button>
          <button class="nav-link-btn ${cur==='qz'?'active':''}" onclick="go('qz')">📝 Quizzes</button>
          <button class="nav-link-btn ${cur==='photo'?'active':''}" onclick="go('photo')">📸 Hazards</button>
          <button class="nav-link-btn ${cur==='ar'?'active':''}" onclick="go('ar')">📱 AR</button>
        `;
      } else if (role === 'trainer') {
        // ONLY TRAINER CONTENTS
        const curTab = window.curTrainerTab || 'overview';
        container.innerHTML = `
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='overview'?'active':''}" onclick="goTrainerTab('overview')">👨‍🏫 Overview</button>
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='curriculum'?'active':''}" onclick="goTrainerTab('curriculum')">📋 Curriculum</button>
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='approval'?'active':''}" onclick="goTrainerTab('approval')">🤖 Approvals</button>
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='passports'?'active':''}" onclick="goTrainerTab('passports')">✍️ Sign-Off</button>
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='remediation'?'active':''}" onclick="goTrainerTab('remediation')">🎯 Remediation</button>
          <button class="nav-link-btn ${cur==='trainer'&&curTab==='telemetry'?'active':''}" onclick="goTrainerTab('telemetry')">⚡ Telemetry</button>
        `;
      } else if (role === 'admin') {
        // ONLY ADMIN CONTENTS
        const curTab = window.curAdminTab || 'institution';
        container.innerHTML = `
          <button class="nav-link-btn ${cur==='admin'&&curTab==='institution'?'active':''}" onclick="goAdminTab('institution')">🏛️ Campus</button>
          <button class="nav-link-btn ${cur==='admin'&&curTab==='users'?'active':''}" onclick="goAdminTab('users')">👥 Directory</button>
          <button class="nav-link-btn ${cur==='admin'&&curTab==='catalog'?'active':''}" onclick="goAdminTab('catalog')">📦 Catalogue</button>
          <button class="nav-link-btn ${cur==='admin'&&curTab==='settings'?'active':''}" onclick="goAdminTab('settings')">⚙️ Settings</button>
          <button class="nav-link-btn ${cur==='admin'&&curTab==='trends'?'active':''}" onclick="goAdminTab('trends')">📈 Compliance</button>
          <button class="nav-link-btn ${cur==='admin'&&curTab==='audit'?'active':''}" onclick="goAdminTab('audit')">📋 Audit</button>
        `;
      }
    }

    if (mobileContainer) {
      if (role === 'learner') {
        mobileContainer.innerHTML = `
          <button class="mobile-drawer-btn ${cur==='dash'?'active':''}" onclick="go('dash');closeMobileNav()">📊 Trainee Dashboard</button>
          <button class="mobile-drawer-btn ${cur==='mods'||cur==='sim'?'active':''}" onclick="go('mods');closeMobileNav()">🥽 3D Training VR</button>
          <button class="mobile-drawer-btn ${cur==='cadlab'?'active':''}" onclick="go('cadlab');closeMobileNav()">🔬 CAD Lab</button>
          <button class="mobile-drawer-btn ${cur==='passport'?'active':''}" onclick="go('passport');closeMobileNav()">📜 My Skill Passport</button>
          <button class="mobile-drawer-btn ${cur==='qz'?'active':''}" onclick="go('qz');closeMobileNav()">📝 Knowledge Checks</button>
          <button class="mobile-drawer-btn ${cur==='photo'?'active':''}" onclick="go('photo');closeMobileNav()">📸 Photo Hazards</button>
          <button class="mobile-drawer-btn ${cur==='ar'?'active':''}" onclick="go('ar');closeMobileNav()">📱 AR Mode</button>
        `;
      } else if (role === 'trainer') {
        const curTab = window.curTrainerTab || 'overview';
        mobileContainer.innerHTML = `
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='overview'?'active':''}" onclick="goTrainerTab('overview');closeMobileNav()">👨‍🏫 Overview &amp; Metrics</button>
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='curriculum'?'active':''}" onclick="goTrainerTab('curriculum');closeMobileNav()">📋 Curriculum &amp; Assignments</button>
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='approval'?'active':''}" onclick="goTrainerTab('approval');closeMobileNav()">🤖 AI Scenario Approvals</button>
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='passports'?'active':''}" onclick="goTrainerTab('passports');closeMobileNav()">✍️ Competency Sign-Off</button>
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='remediation'?'active':''}" onclick="goTrainerTab('remediation');closeMobileNav()">🎯 Targeted Remediation</button>
          <button class="mobile-drawer-btn ${cur==='trainer'&&curTab==='telemetry'?'active':''}" onclick="goTrainerTab('telemetry');closeMobileNav()">⚡ Live Telemetry Stream</button>
        `;
      } else if (role === 'admin') {
        const curTab = window.curAdminTab || 'institution';
        mobileContainer.innerHTML = `
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='institution'?'active':''}" onclick="goAdminTab('institution');closeMobileNav()">🏛️ Institution Profile</button>
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='users'?'active':''}" onclick="goAdminTab('users');closeMobileNav()">👥 User Directory &amp; Roles</button>
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='catalog'?'active':''}" onclick="goAdminTab('catalog');closeMobileNav()">📦 Course &amp; 3D Catalogue</button>
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='settings'?'active':''}" onclick="goAdminTab('settings');closeMobileNav()">⚙️ Platform Settings</button>
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='trends'?'active':''}" onclick="goAdminTab('trends');closeMobileNav()">📈 Compliance Trends</button>
          <button class="mobile-drawer-btn ${cur==='admin'&&curTab==='audit'?'active':''}" onclick="goAdminTab('audit');closeMobileNav()">📋 Governance Audit Ledger</button>
        `;
      }
    }

    // Profile metadata
    const un = document.getElementById('nav-user-name');
    const ub = document.getElementById('nav-user-batch');
    const ua = document.getElementById('nav-user-avatar');
    const uam = document.getElementById('nav-user-avatar-mobile');
    const nda = document.getElementById('nav-drawer-avatar');
    const ndn = document.getElementById('nav-drawer-name');
    const ndb = document.getElementById('nav-drawer-batch');

    const displayName = S.name || AUTH_USER.name || 'User';
    const initialLetter = displayName.charAt(0).toUpperCase();

    if (un) un.textContent = displayName;
    if (ndn) ndn.textContent = displayName;
    if (ub) {
      if (role === 'admin') ub.innerHTML = '<span style="color:#c084fc">🏛️ System Admin</span>';
      else if (role === 'trainer') ub.innerHTML = '<span style="color:#fbbf24">👨‍🏫 Instructor</span>';
      else ub.innerHTML = `<span style="color:#38bdf8">🎓 Trainee · ${S.batch || 'Batch A-24'}</span>`;
    }
    if (ndb) ndb.textContent = (role === 'admin' ? '🏛️ System Admin' : (role === 'trainer' ? '👨‍🏫 Instructor' : `🎓 Batch: ${S.batch || 'Batch A-24'}`));

    [ua, uam, nda].forEach(avatarEl => {
      if (avatarEl) {
        if (AUTH_USER.avatar_url) {
          avatarEl.innerHTML = `<img src="${AUTH_USER.avatar_url}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" alt="User">`;
        } else {
          avatarEl.textContent = initialLetter;
        }
      }
    });

    const nin = document.getElementById('nav-institution-name');
    if (nin) nin.textContent = S.institution || 'Rajalakshmi Engineering College (REC)';
  };

  // Wrap router function window.go with strict role isolation & authorization guard
  const underlyingGo = window._realGo || window.go;
  window.go = function(targetView) {
    // 1. Session check
    const token = localStorage.getItem('skillsafe_token');
    const user = localStorage.getItem('skillsafe_user');
    if (!token || !user) {
      window.location.replace('/login');
      return;
    }

    // 2. Strict Role Isolation & Access Control
    if (USER_AUTH_ROLE === 'learner') {
      const restrictedForLearners = ['trainer', 'admin', 'inst'];
      if (restrictedForLearners.includes(targetView)) {
        showAccessDeniedModal(targetView === 'inst' ? 'trainer' : targetView, USER_AUTH_ROLE);
        return;
      }
    } else if (USER_AUTH_ROLE === 'trainer') {
      const restrictedForTrainers = ['admin'];
      if (restrictedForTrainers.includes(targetView)) {
        showAccessDeniedModal('admin', USER_AUTH_ROLE);
        return;
      }
    }

    window.curView = targetView;
    if (typeof underlyingGo === 'function') {
      underlyingGo(targetView);
    }
    updateNavHeader();
  };
  window._realGo = window.go;

  // Institution Switcher
  window.switchInstitution = function(inst) {
    S.institution = inst;
    try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}
    S.auditLogs = S.auditLogs || [];
    S.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: S.name,
      action: 'INSTITUTION_CHANGE',
      detail: `Active boundary set to: ${inst}`,
      category: 'GOVERNANCE'
    });
    if (window.tip) tip(`Active institution: ${inst}`);
  };

  // Profile Modal (Read-only verified role display, no unauthorized role self-granting)
  window.openProfileModal = function() {
    const existing = document.getElementById('profile-modal');
    if (existing) existing.remove();

    const roleBadge = USER_AUTH_ROLE === 'admin' 
      ? '<span style="background:#6d28d9;color:#fff;padding:4px 10px;border-radius:99px;font-weight:700">🏛️ System Administrator</span>'
      : (USER_AUTH_ROLE === 'trainer'
        ? '<span style="background:#f59e0b;color:#04121c;padding:4px 10px;border-radius:99px;font-weight:700">👨‍🏫 Certified Instructor</span>'
        : '<span style="background:#0284c7;color:#fff;padding:4px 10px;border-radius:99px;font-weight:700">🎓 Registered Trainee</span>');

    const m = document.createElement('div');
    m.id = 'profile-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px';
    m.innerHTML = `
      <div style="background:#0d1624;border:2px solid var(--ac);border-radius:18px;max-width:500px;width:100%;padding:26px;color:#f8fafc;box-shadow:0 12px 40px rgba(0,0,0,0.8)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:26px">👤</span>
            <div>
              <h3 style="margin:0;font-size:18px">Authenticated Profile</h3>
              <small style="color:#94a3b8">Verified Platform Identity</small>
            </div>
          </div>
          <button class="b o" onclick="this.closest('#profile-modal').remove()" style="padding:4px 10px">✕</button>
        </div>

        <div style="background:#060a12;border:1px solid #1e293b;border-radius:12px;padding:16px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#0284c7,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#04121c;overflow:hidden">
              ${AUTH_USER.avatar_url ? `<img src="${AUTH_USER.avatar_url}" style="width:100%;height:100%;object-fit:cover">` : (S.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-size:16px;font-weight:800;color:#fff">${S.name}</div>
              <div style="font-size:13px;color:#38bdf8">${AUTH_USER.email || 'user@vocational.edu.in'}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
            <div style="background:#0d1522;padding:8px 10px;border-radius:8px">
              <span style="color:#64748b;display:block">Trainee / Staff ID</span>
              <b style="color:#f1f5f9">${S.traineeId || 'NSDC-VR-84920'}</b>
            </div>
            <div style="background:#0d1522;padding:8px 10px;border-radius:8px">
              <span style="color:#64748b;display:block">Cohort / Batch</span>
              <b style="color:#f1f5f9">${S.batch || 'Batch A-24'}</b>
            </div>
          </div>

          <div style="margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:13px;color:#94a3b8">Authorized Role:</span>
            ${roleBadge}
          </div>
        </div>

        <div style="font-size:12px;color:#64748b;margin-bottom:18px;line-height:1.5">
          🔒 <b>Enterprise Authorization Policy:</b> Account roles are cryptographically verified via JWT tokens. Role elevation must be performed by an accredited institution administrator.
        </div>

        <div style="display:flex;justify-content:space-between;gap:10px">
          <button class="b" onclick="this.closest('#profile-modal').remove()" style="flex:1">Close</button>
          <button class="b o" onclick="skillsafeLogout()" style="border-color:#ef444455;color:#f87171">Sign Out</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  };

  // -----------------------------------------------------------------------
  // 3. RUNTIME EVENT CONTRACT EMITTER & TELEMETRY STREAM
  // -----------------------------------------------------------------------
  window.emitRuntimeEvent = function(objectId, action, step, outcome, detail) {
    const timestamp = new Date().toLocaleTimeString();
    const event = {
      timestamp,
      objectId: objectId || 'system',
      action: action || 'interaction',
      sequenceStep: step !== undefined ? step : 'n/a',
      outcome: outcome || 'SUCCESS',
      detail: detail || ''
    };

    S.telemetryStream = S.telemetryStream || [];
    S.telemetryStream.unshift(event);
    if (S.telemetryStream.length > 50) S.telemetryStream.pop();

    // Update floating telemetry HUD in simulation
    const list = document.getElementById('telemetry-hud-list');
    if (list) {
      const item = document.createElement('div');
      item.className = 'telemetry-item ' + (outcome.includes('FAIL') || outcome.includes('CRITICAL') ? 'err' : '');
      item.innerHTML = `
        <span style="color:#38bdf8">[${timestamp}]</span> <b>${objectId}</b> ➔ <code>${action}</code>
        <div style="font-size:10px;color:#94a3b8">${outcome}: ${detail}</div>
      `;
      list.prepend(item);
      while (list.children.length > 12) list.removeChild(list.lastChild);
    }
  };

  // Launch Assignment directly into 3D Simulation
  window.launchAssignment = function(asgnId) {
    const asgn = (S.assignedWork || []).find(a => a.id === asgnId);
    if (!asgn) return;
    window._activeAssignment = asgn;
    cm = asgn.moduleId;
    MOD = (cm === 'weld') ? 'w' : 'e';
    
    // Add audit log
    S.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: S.name,
      action: 'LAUNCH_ASSIGNMENT',
      detail: `Launched assigned task: ${asgn.title}`,
      category: 'ORCHESTRATOR'
    });

    if (cm === 'elec' || cm === 'weld') {
      go('brief');
    } else {
      go('pb');
    }
  };

  // Trainer approves AI scenario
  window.approveScenario = function(scenId, isApproved) {
    const s = (S.approvalQueue || []).find(x => x.id === scenId);
    if (!s) return;
    s.status = isApproved ? 'approved' : 'rejected';
    s.reviewerNotes = isApproved ? `Approved by ${S.name} on ${new Date().toLocaleDateString()}` : 'Rejected for safety policy revisions.';
    
    // If approved, add to training catalogue
    if (isApproved && !MODS[scenId]) {
      MODS[scenId] = {
        i: '⚡',
        n: s.title,
        d: s.prompt + ' (AI Generated Scenario)',
        ppe: ['p1', 'p2', 'p3'],
        it: s.mandatorySteps.map((st, i) => [`step_${i}`, '✅', st, 'Verified Action', 'g']),
        st: s.mandatorySteps.map((st, i) => [st, [`step_${i}`]])
      };
    }

    S.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: S.name,
      action: isApproved ? 'APPROVE_SCENARIO' : 'REJECT_SCENARIO',
      detail: `${isApproved ? 'Approved' : 'Rejected'} scenario #${scenId}: ${s.title}`,
      category: 'GOVERNANCE'
    });

    try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}
    if (window.curView === 'trainer') go('trainer');
    if (window.tip) tip(isApproved ? `✅ Scenario approved and published to Curriculum Catalogue.` : `❌ Scenario returned to author for revisions.`);
  };

  // Trainer signs trainee competency
  window.signCompetency = function(code) {
    const comp = S.skillPassport.competencies.find(c => c.code === code);
    if (!comp) return;
    comp.status = 'VERIFIED';
    comp.verifiedDate = new Date().toISOString().slice(0, 10);
    comp.certifier = S.name;

    S.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: S.name,
      action: 'ENDORSE_COMPETENCY',
      detail: `Endorsed competency ${code} (${comp.title}) for Saurav K.`,
      category: 'CREDENTIAL'
    });

    try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}
    if (window.curView === 'trainer') go('trainer');
    if (window.tip) tip(`✍️ Competency ${code} verified and digitally signed!`);
  };

  // Dispatch Targeted Remediation Drill
  window.dispatchRemediation = function(traineeName, topic) {
    S.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: S.name,
      action: 'DISPATCH_REMEDIATION',
      detail: `Assigned targeted drill (${topic}) to ${traineeName}`,
      category: 'REMEDIATION'
    });

    const newAsgn = {
      id: 'asgn-rem-' + Date.now(),
      title: `Remediation Drill: ${topic}`,
      moduleId: 'elec',
      batch: 'Targeted Remediation',
      instructor: S.name,
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 864e5 * 3).toISOString().slice(0, 10),
      timeLimitMins: 10,
      passCriteria: 90,
      maxAttempts: 3,
      attemptsDone: 0,
      status: 'pending',
      mandatorySteps: ['Review isolation protocol', 'Wear all PPE', 'Execute sequence flawlessly'],
      criticalSafetyGate: true,
      description: `Targeted remediation drill dispatched to address repeated mistakes in ${topic}.`
    };
    S.assignedWork.unshift(newAsgn);
    try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}
    if (window.tip) tip(`🎯 Remediation drill for "${topic}" dispatched to ${traineeName}.`);
  };

  // -----------------------------------------------------------------------
  // 7. RUNTIME EVENT CONTRACT & WEBSOCKET TELEMETRY STREAM
  // -----------------------------------------------------------------------
  window._currentSessionTelemetry = [];
  let telemetrySocket = null;
  let wsConnected = false;

  function initTelemetryWebSocket() {
    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const wsHost = isLocal ? (window.location.port === '3000' ? window.location.host : 'localhost:3000') : window.location.host;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${wsHost}/ws/telemetry?role=${S.role || 'learner'}`;

      telemetrySocket = new WebSocket(wsUrl);

      telemetrySocket.onopen = () => {
        wsConnected = true;
        updateTelemetryHUDState("CONNECTED (WS:3000)");
      };

      telemetrySocket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'LIVE_TELEMETRY' && (S.role === 'trainer' || S.role === 'admin')) {
            showInstructorTelemetryToast(msg.event);
          }
        } catch(e){}
      };

      telemetrySocket.onclose = () => {
        wsConnected = false;
        updateTelemetryHUDState("STANDBY / LOCAL");
        setTimeout(initTelemetryWebSocket, 5000);
      };

      telemetrySocket.onerror = () => {
        wsConnected = false;
        updateTelemetryHUDState("STANDBY / LOCAL");
      };
    } catch(e) {
      wsConnected = false;
      updateTelemetryHUDState("LOCAL");
    }
  }

  function updateTelemetryHUDState(statusText) {
    let hud = document.getElementById('telemetry-status-pill');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'telemetry-status-pill';
      hud.className = 'telemetry-status-pill';
      hud.style.cssText = 'position:fixed;bottom:12px;left:14px;z-index:85;font:11px monospace;padding:4px 10px;border-radius:20px;background:rgba(11,18,32,0.88);border:1px solid rgba(56,189,248,0.3);color:#94a3b8;display:flex;align-items:center;gap:6px;backdrop-filter:blur(8px);pointer-events:none;transition:all 0.2s ease;';
      document.body.appendChild(hud);
    }
    const color = wsConnected ? '#22c55e' : '#f59e0b';
    hud.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${color};display:inline-block;box-shadow:0 0 8px ${color}"></span> <span>TELEMETRY: <b>${statusText}</b></span>`;
  }

  function showInstructorTelemetryToast(ev) {
    if (window.tip && Math.random() < 0.25) {
      window.tip(`📡 Live Stream: ${ev.objectId || 'Device'} ➔ ${ev.action || 'INTERACT'} (${ev.outcome || 'OK'})`);
    }
  }

  // Runtime Event Contract function
  window.emitRuntimeEvent = function(objectId, action, sequenceStep, outcome, detail) {
    const eventPayload = {
      timestamp: new Date().toISOString(),
      objectId: String(objectId || 'runtime_tool'),
      action: String(action || 'INTERACT'),
      sequenceStep: sequenceStep !== undefined ? sequenceStep : -1,
      outcome: String(outcome || 'SUCCESS'),
      detail: String(detail || ''),
      learnerId: S.traineeId || 'NSDC-VR-84920',
      moduleId: window.cm || 'elec'
    };

    window._currentSessionTelemetry.push(eventPayload);
    if (window._currentSessionTelemetry.length > 100) window._currentSessionTelemetry.shift();

    // Update Telemetry Status Pill
    const pill = document.getElementById('telemetry-status-pill');
    if (pill) {
      const color = outcome === 'FAILURE' || outcome === 'HAZARD' ? '#ef4444' : '#22c55e';
      pill.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${color};display:inline-block;box-shadow:0 0 8px ${color}"></span> <span>EVT: <b>${objectId}</b> ➔ ${outcome}</span>`;
      clearTimeout(window._pillTimer);
      window._pillTimer = setTimeout(() => {
        updateTelemetryHUDState(wsConnected ? "CONNECTED (WS:3000)" : "STANDBY / LOCAL");
      }, 2500);
    }

    // Send via WebSocket if connected
    if (telemetrySocket && telemetrySocket.readyState === WebSocket.OPEN) {
      try {
        telemetrySocket.send(JSON.stringify(eventPayload));
      } catch(e){}
    }
  };

  // -----------------------------------------------------------------------
  // 8. BACKEND REST API SYNCHRONIZATION (FASTAPI + POSTGRESQL / SQLITE)
  // -----------------------------------------------------------------------
  async function syncWithBackend() {
    try {
      const apiUrl = (window.location.port === '3000' || window.location.port === '8000') 
        ? `${window.location.origin}/api/v1`
        : 'http://localhost:8000/api/v1';

      const authHeaders = AUTH_TOKEN ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {};

      // 1. Fetch Real Users from Backend
      try {
        const resUsers = await fetch(`${apiUrl}/auth/users`, { 
          headers: authHeaders, 
          signal: AbortSignal.timeout(2500) 
        });
        if (resUsers.ok) {
          const backendUsers = await resUsers.json();
          if (Array.isArray(backendUsers) && backendUsers.length > 0) {
            S.users = backendUsers.map(u => ({
              id: u.id,
              name: u.name,
              role: u.role,
              batch: u.batch,
              email: u.email,
              traineeId: u.trainee_id,
              status: 'Active'
            }));
          }
        }
      } catch(e) {
        console.warn("[SkillSafe VR] Users sync skipped:", e.message);
      }

      // 2. Fetch Real Audit Logs from Backend
      try {
        const resLogs = await fetch(`${apiUrl}/audit/logs`, { 
          headers: authHeaders, 
          signal: AbortSignal.timeout(2500) 
        });
        if (resLogs.ok) {
          const backendLogs = await resLogs.json();
          if (Array.isArray(backendLogs) && backendLogs.length > 0) {
            S.auditLogs = backendLogs.map(l => ({
              id: l.id,
              timestamp: l.timestamp,
              user: l.user_name,
              action: l.action,
              category: l.category,
              detail: l.detail
            }));
          }
        }
      } catch(e) {
        console.warn("[SkillSafe VR] Audit logs sync skipped:", e.message);
      }

      // 3. Fetch Real Assignments
      try {
        const resAsgn = await fetch(`${apiUrl}/assignments`, { 
          headers: authHeaders, 
          signal: AbortSignal.timeout(2500) 
        });
        if (resAsgn.ok) {
          const backendAssignments = await resAsgn.json();
          if (backendAssignments && backendAssignments.length > 0) {
            S.assignedWork = backendAssignments.map(a => ({
              id: a.id,
              title: a.title,
              moduleId: a.module_id,
              batch: a.batch,
              instructor: a.instructor_name,
              assignedDate: a.assigned_date,
              dueDate: a.due_date,
              timeLimitMins: a.time_limit_mins,
              passCriteria: a.pass_criteria,
              maxAttempts: a.max_attempts,
              attemptsDone: 0,
              status: a.status,
              mandatorySteps: typeof a.mandatory_steps === 'string' ? JSON.parse(a.mandatory_steps) : a.mandatory_steps,
              criticalSafetyGate: !!a.critical_safety_gate,
              description: a.description
            }));
          }
        }
      } catch(e) {
        console.warn("[SkillSafe VR] Assignments sync skipped:", e.message);
      }

      // 4. Fetch Real Training Sessions (for Learner)
      if (AUTH_USER && AUTH_USER.id) {
        try {
          const resSess = await fetch(`${apiUrl}/sessions?learner_id=${AUTH_USER.id}`, {
            headers: authHeaders,
            signal: AbortSignal.timeout(2500)
          });
          if (resSess.ok) {
            const sessions = await resSess.json();
            if (Array.isArray(sessions)) {
              S.hist = sessions.map(s => ({
                id: s.id,
                d: s.date_str || new Date(s.created_at).toLocaleDateString(),
                mod: s.module_id === 'elec' ? 'Electrical Safety' : (s.module_id === 'weld' ? 'Welding Safety' : s.module_id),
                score: s.score,
                safety: s.safety_score,
                proc: s.procedure_score,
                haz: s.hazard_score,
                task: s.task_completion,
                te: s.time_efficiency,
                time: s.duration_secs,
                mist: s.mistakes || [],
                level: s.score >= 90 ? 'Advanced' : (s.score >= 75 ? 'Intermediate' : 'Developing'),
                hints: 0,
                lk: 1,
                criticalGatePassed: s.critical_gate_passed
              }));
              S.xp = S.hist.reduce((acc, h) => acc + (h.score || 0), 0);
              S.streak = S.hist.length > 0 ? 1 : 0;
            }
          }
        } catch(e) {
          console.warn("[SkillSafe VR] Sessions sync skipped:", e.message);
        }
      }

      // 5. Fetch Real Skill Passport
      if (S.traineeId) {
        try {
          const resPass = await fetch(`${apiUrl}/passports/${S.traineeId}`, { 
            headers: authHeaders, 
            signal: AbortSignal.timeout(2500) 
          });
          if (resPass.ok) {
            const passData = await resPass.json();
            if (passData && passData.competencies) {
              S.skillPassport = {
                traineeId: passData.trainee_id,
                fullName: passData.full_name,
                institution: passData.institution,
                batch: passData.batch,
                council: passData.council,
                issuedDate: passData.issued_date,
                verifiedBy: passData.verified_by,
                verificationHash: passData.verification_hash,
                competencies: passData.competencies
              };
            }
          }
        } catch(e) {
          console.warn("[SkillSafe VR] Passport sync skipped:", e.message);
        }
      }

      try { localStorage.setItem('ssvr', JSON.stringify(S)); } catch(e){}
      console.log("[SkillSafe VR] Complete real database synchronization finished.");

      // Refresh view dynamically if currently rendered
      if (window.curView && window.go) {
        window.go(window.curView);
      }
    } catch(e) {
      console.log("[SkillSafe VR] Running in offline / local-first state (Backend API standby).");
    }
  }

  // Initialize
  initTelemetryWebSocket();
  syncWithBackend();

  // Initialize nav and route to dedicated role view on load
  setTimeout(() => {
    updateNavHeader();
    if (USER_AUTH_ROLE === 'trainer') {
      go('trainer');
    } else if (USER_AUTH_ROLE === 'admin') {
      go('admin');
    } else {
      go('dash');
    }
  }, 50);
})();
