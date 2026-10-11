# Python script to build the complete SkillSafe VR enterprise architecture into index.html
import os
import re

print("Starting platform build...")

with open("d:/dreamovation 2.0/index.backup.html", "r", encoding="utf-8") as f:
    html = f.read()

# -------------------------------------------------------------
# 1. NEW CSS STYLES FOR THE ENTERPRISE ARCHITECTURE
# -------------------------------------------------------------
ARCH_CSS = """
/* =========================================================================
   ⚡ SKILLSAFE VR ENTERPRISE ARCHITECTURE STYLES (v6.0)
   ========================================================================= */

/* Glass Navigation Bar & Role Switcher */
nav {
  display: flex !important;
  gap: 8px !important;
  align-items: center !important;
  padding: 8px 16px !important;
  background: rgba(15, 23, 42, 0.94) !important;
  backdrop-filter: blur(12px) !important;
  border-bottom: 2px solid #38bdf844 !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  flex-wrap: wrap !important;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 6px;
}
.brand-wrap:hover { opacity: 0.9; }

.brand-logo {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.brand-logo span { color: var(--ac); }
.brand-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #04121c;
  padding: 2px 7px;
  border-radius: 99px;
  letter-spacing: 0.5px;
}

/* Role Selector Pills */
.role-nav-group {
  display: inline-flex;
  align-items: center;
  background: #090e17;
  border: 1px solid #1e293b;
  border-radius: 99px;
  padding: 3px;
  gap: 3px;
}
.role-nav-btn {
  background: none;
  border: 0;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.role-nav-btn:hover {
  color: #fff;
  background: #1e293b;
}
.role-nav-btn.active {
  background: var(--ac);
  color: #04121c;
  font-weight: 800;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
}

/* Nav Menu Links */
.nav-link-btn {
  background: none;
  border: 0;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.nav-link-btn:hover {
  background: #1e293b;
  color: #fff;
}
.nav-link-btn.active {
  background: #0369a133;
  color: var(--ac);
  border: 1px solid #38bdf866;
}

/* Institution Select */
.inst-select-box {
  background: #090e17;
  border: 1px solid #1e293b;
  color: #38bdf8;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  max-width: 170px;
  text-overflow: ellipsis;
}
.inst-select-box:focus { border-color: var(--ac); }

/* User Profile Badge */
.user-profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #1e293b66;
  border: 1px solid #334155;
  border-radius: 99px;
  padding: 3px 10px 3px 4px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.user-profile-badge:hover {
  border-color: var(--ac);
  background: #1e293b;
}
.user-avatar-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #04121c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 11px;
}
.user-meta-txt {
  font-size: 12px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
}
.user-meta-txt small {
  font-size: 9px;
  font-weight: 500;
  color: #94a3b8;
}

/* =========================================================================
   📐 ARCHITECTURE DIAGRAM & DATA FLOW VISUALIZER
   ========================================================================= */
.arch-card {
  background: #0d1522;
  border: 1.5px solid #1e293b;
  border-radius: 14px;
  padding: 18px;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;
}
.arch-card:hover {
  border-color: var(--ac);
  transform: translateY(-2px);
}
.arch-card.clients { border-left: 4px solid #38bdf8; }
.arch-card.frontend { border-left: 4px solid #22c55e; }
.arch-card.workspaces { border-left: 4px solid #f59e0b; }
.arch-card.services { border-left: 4px solid #8b5cf6; }
.arch-card.runtime { border-left: 4px solid #ec4899; }
.arch-card.pipeline { border-left: 4px solid #06b6d4; }
.arch-card.safety { border-left: 4px solid #ef4444; }

.arch-stage-btn {
  background: #111b2b;
  border: 1.5px solid #24354c;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.4, 1);
  color: #f1f5f9;
}
.arch-stage-btn:hover, .arch-stage-btn.active {
  border-color: var(--ac);
  background: #0c1a2e;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.25);
  transform: translateY(-3px);
}
.arch-stage-num {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--ac);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: block;
}

/* =========================================================================
   🔬 CAD / 3D MODEL LAB STYLES
   ========================================================================= */
.cad-viewport-box {
  position: relative;
  height: 540px;
  border-radius: 14px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #152232 0%, #0a1017 100%);
  border: 1px solid #1e293b;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
}
.cad-viewport-box canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
}
.cad-viewport-box canvas:active { cursor: grabbing; }

.cad-glass-toolbar {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  background: rgba(11, 19, 32, 0.85);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  z-index: 5;
}

.cad-part-chip {
  padding: 6px 10px;
  border-radius: 8px;
  background: #111a26;
  border: 1px solid #24354c;
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.cad-part-chip:hover {
  border-color: var(--ac);
  color: #fff;
  background: #162438;
}
.cad-part-chip.active {
  border-color: #38bdf8;
  background: #0369a133;
  color: #38bdf8;
  font-weight: 700;
}

/* =========================================================================
   📜 SKILL PASSPORT STYLES (Government & NSDC Accredited)
   ========================================================================= */
.passport-certificate {
  background: linear-gradient(135deg, #0b1422 0%, #0e1a2c 100%);
  border: 3px solid #38bdf888;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 14px 50px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(56, 189, 248, 0.05);
  position: relative;
  overflow: hidden;
  color: #f1f5f9;
}
.passport-certificate:before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px dashed rgba(56, 189, 248, 0.3);
  border-radius: 14px;
  pointer-events: none;
}
.passport-seal-badge {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid #facc15;
  background: radial-gradient(circle, #854d0e 0%, #1e1b4b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
}

.competency-row {
  background: #0c1624;
  border: 1px solid #1e2c40;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* =========================================================================
   📡 RUNTIME EVENT CONTRACT LIVE TELEMETRY HUD
   ========================================================================= */
#telemetry-contract-hud {
  position: absolute;
  right: 14px;
  bottom: 84px;
  width: 320px;
  max-height: 240px;
  background: rgba(11, 18, 30, 0.92);
  border: 1.5px solid #06b6d4;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 11px;
  z-index: 30;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  transition: max-height 0.3s ease;
}
#telemetry-contract-hud.collapsed { max-height: 38px; }
.telemetry-hud-hdr {
  background: #083344;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #22d3ee;
  cursor: pointer;
  border-bottom: 1px solid #06b6d444;
}
.telemetry-hud-list {
  padding: 8px;
  max-height: 190px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.telemetry-item {
  padding: 4px 6px;
  border-radius: 6px;
  background: #0f172a;
  border-left: 3px solid #22c55e;
  word-break: break-all;
  line-height: 1.35;
}
.telemetry-item.err { border-left-color: #ef4444; background: #450a0a44; }

/* Assignment Card */
.asgn-card {
  background: #0d1726;
  border: 1.5px solid #1e2c40;
  border-radius: 14px;
  padding: 18px;
  position: relative;
  transition: all 0.2s ease;
}
.asgn-card:hover {
  border-color: var(--ac);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
"""

# Insert CSS right before </style> around line 92
css_marker = "</style>\n<nav>"
if css_marker in html:
    html = html.replace(css_marker, ARCH_CSS + "\n</style>\n<nav>")
    print("Inserted ARCH_CSS before nav")
else:
    print("WARNING: css_marker not found, attempting secondary match...")
    html = re.sub(r'</style>\s*<nav>', ARCH_CSS + '\n</style>\n<nav>', html, count=1)

# -------------------------------------------------------------
# 2. ENHANCED MULTI-WORKSPACE NAVBAR
# -------------------------------------------------------------
NAV_HTML = """<nav>
  <div class="brand-wrap" onclick="go('home')">
    <div class="brand-logo">⚡ SkillSafe<span>VR</span></div>
    <span class="brand-badge">Enterprise v6.0</span>
  </div>

  <!-- Role Workspace Selector (Learner, Trainer, Admin) -->
  <div class="role-nav-group" id="nav-role-group">
    <button class="role-nav-btn active" id="btn-role-learner" onclick="switchRole('learner')">🎓 Learner</button>
    <button class="role-nav-btn" id="btn-role-trainer" onclick="switchRole('trainer')">👨‍🏫 Trainer</button>
    <button class="role-nav-btn" id="btn-role-admin" onclick="switchRole('admin')">🏛️ Admin</button>
  </div>

  <!-- Core Module Links -->
  <button class="nav-link-btn" onclick="go('arch')" title="Interactive Platform Architecture & End-to-End Data Flow">📐 Architecture</button>
  <button class="nav-link-btn" onclick="go('mods')">📚 Training Library</button>
  <button class="nav-link-btn" onclick="go('cadlab')" title="Interactive 3D Engineering Model & Exploded View Lab">🔬 CAD Lab</button>
  <button class="nav-link-btn" onclick="go('ai3d')">⚡ AI 3D World Gen</button>
  <button class="nav-link-btn" onclick="go('photo')">📸 Photo Hazards</button>
  <button class="nav-link-btn" onclick="go('ar')">📱 AR Mode</button>
  <button class="nav-link-btn" onclick="go('passport')" title="Official Verifiable Skill Passport">📜 Skill Passport</button>

  <!-- Institution Switcher & User Profile -->
  <div style="display:inline-flex;gap:6px;margin-left:auto;align-items:center">
    <select class="inst-select-box" id="global-inst-select" onchange="switchInstitution(this.value)" title="Active Training Institution">
      <option value="Apex Industrial Technical Institute (Accredited by NSDC / NCVET)">Apex Industrial Technical Institute</option>
      <option value="National Skill Training Institute (NSTI Mumbai & Bengaluru)">National Skill Training Institute (NSTI)</option>
      <option value="Tata Skill Development Academy (Industrial Excellence Hub)">Tata Skill Development Academy</option>
    </select>

    <div class="user-profile-badge" onclick="openProfileModal()" title="Click to view profile or switch trainee account">
      <div class="user-avatar-circle" id="nav-user-avatar">S</div>
      <div class="user-meta-txt">
        <span id="nav-user-name">Saurav K.</span>
        <small id="nav-user-batch">Batch A-24</small>
      </div>
    </div>

    <!-- Localization & Controls -->
    <div style="display:inline-flex;gap:3px;align-items:center">
      <button class="lang-btn on" data-l="en" onclick="setLang('en')" style="padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--card);color:var(--tx);cursor:pointer;font-size:12px;font-weight:700">EN</button>
      <button class="lang-btn" data-l="ta" onclick="setLang('ta')" style="padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--card);color:var(--tx);cursor:pointer;font-size:12px;font-weight:700">தமிழ்</button>
      <button class="lang-btn" data-l="hi" onclick="setLang('hi')" style="padding:4px 8px;border-radius:6px;border:1px solid var(--bd);background:var(--card);color:var(--tx);cursor:pointer;font-size:12px;font-weight:700">हिंदी</button>
    </div>
    <div id="google_translate_element" title="Translate whole website"></div>
    <button id="vb" title="Voice coach" onclick="togVO()">🔊</button>
    <button title="Larger text" onclick="document.documentElement.style.fontSize=(window._fz=!window._fz)?'20px':''">Aa</button>
  </div>
</nav>"""

# Replace the old <nav>...</nav>
old_nav_pattern = r'<nav>.*?</nav>'
if re.search(old_nav_pattern, html, flags=re.DOTALL):
    html = re.sub(old_nav_pattern, NAV_HTML, html, count=1, flags=re.DOTALL)
    print("Replaced <nav> with enhanced Multi-Workspace navigation")
else:
    print("WARNING: Could not find old <nav> block!")

with open("d:/dreamovation 2.0/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved updated navigation and CSS.")
