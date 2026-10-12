// =========================================================================
// ⚡ SKILLSAFE VR: ADVANCED 3D VOCATIONAL WORKSHOPS EXTENSION (v6.0)
// Modules:
// 1. 🏗️ Construction Safety (Work at Height, Scaffolding, Drop Zone, Fall Arrest Lifeline)
// 2. ⚙️ Machine Operation (Heavy Lathe / CNC Safety, Guards, E-Stop, Push Stick, LOTO)
// Full 3D interactive Three.js workshops with procedural physics, audio feedback,
// step-by-step HUD, situational guidance, AI coach, and verified skill assessment.
// =========================================================================

(function() {
  window.V = window.V || {};
  window.I = window.I || {};

  // -----------------------------------------------------------------------
  // CONSTRUCTION SAFETY CONFIGURATION & DATA
  // -----------------------------------------------------------------------
  const CSTEPS = [
    'Read overhead hazard & fall warning signs',
    'Pick up PPE (hard hat, hi-vis vest, safety harness)',
    'Wear PPE (strap harness & hard hat)',
    'Perform scaffold safety inspection (Scafftag)',
    'Set up barricades around drop zone',
    'Climb scaffold & clip harness to anchor point',
    'Perform structural fixing at height (torque bolts)',
    'Unclip, descend scaffold & clear tools'
  ];

  const CTIPS = [
    'Click the OVERHEAD WORK / FALL HAZARD signs on the wall.',
    'Pick up the hard hat, hi-vis vest and safety harness from the bench, then click Wear PPE.',
    'Click the [🦺 Wear PPE] button in the bottom dock.',
    'Click the green Scafftag inspection holder at the base of the scaffolding ladder.',
    'Click the warning barricade & cones to cordon off the ground drop zone.',
    'Click the overhead lifeline anchor point / D-ring on the platform.',
    'Click the steel beam bracket (or press E) to torque the structural bolts.',
    'Click the ladder / tool pouch to safely unclip, descend and clear the site.'
  ];

  window.CSTEPS = CSTEPS;
  window.CTIPS = CTIPS;

  const cprog = () => {
    const s = (typeof st !== 'undefined' && st ? st : window.st);
    return [
      s && s.haz && (s.haz.has('sign1') || s.haz.has('sign2')),
      s && s.pick && s.pick.size === 3,
      s && Boolean(s.worn),
      s && Boolean(s.ins),
      s && Boolean(s.bar),
      s && Boolean(s.anc),
      s && Boolean(s.fix),
      s && Boolean(s.dsc)
    ].map(Boolean);
  };

  window.cprog = cprog;

  const cppe = () => {
    const s = (typeof st !== 'undefined' && st ? st : window.st) || {};
    return '<div class="pc">' + [
      ['helmet', '⛑️ Hard Hat'],
      ['vest', '🦺 Hi-Vis Vest'],
      ['harness', '🪢 Safety Harness']
    ].map(a => `<span class="${s.worn ? 'on' : (s.pick && s.pick.has(a[0]) ? 'pk' : '')}">${a[1]}${s.worn ? ' ✓' : (s.pick && s.pick.has(a[0]) ? ' · ready' : '')}</span>`).join('') + '</div>';
  };

  window.cppe = cppe;

  const CON_GUIDE = [
    {
      title: 'Overhead & Fall Hazard Warnings',
      action: "Click the yellow 'OVERHEAD CRANE' or 'FALL HAZARD' signs on the construction perimeter wall.",
      voice: "Welcome to the construction work-at-height bay. Before entering the scaffold zone, click the warning signs to acknowledge overhead and fall hazards.",
      getSituation: () => "OSHA 1926.501 requires recognizing fall hazards and drop zones before entering any work-at-height zone."
    },
    {
      title: 'Select PPE (Hard Hat, Vest, Harness)',
      action: "Click the Hard Hat, Hi-Vis Vest, and Fall Arrest Harness on the workbench to collect them.",
      voice: () => st.pick.size === 0
        ? "Turn to the gear bench. Collect your three items of personal protection: the hard hat, reflective hi-vis vest, and full-body fall arrest harness."
        : (st.pick.size < 3 ? `Collected ${st.pick.size} of 3 items. Pick up the remaining gear from the bench.` : "All gear collected! Click Wear P P E in the bottom dock."),
      getSituation: () => `Collected ${st.pick ? st.pick.size : 0} of 3 PPE items. You must equip all three before approaching the scaffold.`
    },
    {
      title: 'Wear Construction PPE',
      action: "Click the blue [🦺 Wear PPE] button in the dock to don and adjust your safety gear.",
      voice: "Click Wear P P E in the dock. Fasten the harness leg loops, chest strap, and secure your hard hat chin strap.",
      getSituation: () => st.worn ? "Full-body harness and hard hat equipped and tensioned!" : "Never climb scaffolding without a certified, inspected full-body harness."
    },
    {
      title: 'Scaffold Safety Inspection (Scafftag)',
      action: "Click the green Scafftag inspection holder mounted at the ladder footing.",
      voice: "Always inspect before you climb. Click the green Scafftag at the base of the ladder to verify base plates, sole boards, bracing, and guardrails.",
      getSituation: () => st.ins ? "Scafftag verified: Scaffold inspected and structurally green-tagged." : "Uninspected scaffolding causes severe falls. Check the Scafftag at the ladder base."
    },
    {
      title: 'Set Up Drop Zone Barricades',
      action: "Click the yellow warning barricade & cones on the ground to cordon off the drop zone.",
      voice: "Workers below are vulnerable to dropped tools. Click the barricades and traffic cones to establish a secure perimeter around the drop zone.",
      getSituation: () => st.bar ? "Drop zone barricaded: ground personnel protected." : "Establish a controlled drop zone perimeter to protect ground personnel (OSHA 1926.502)."
    },
    {
      title: 'Climb & Anchor Harness to Lifeline',
      action: "Click the overhead D-ring anchor clamp on the platform lifeline to connect your lanyard.",
      voice: "Climb the ladder to the working deck. Click the overhead lifeline anchor to connect your shock-absorbing lanyard snap hook before stepping onto the plank.",
      getSituation: () => st.anc ? "100% Tie-Off established: shock-absorbing lanyard secured to overhead anchor." : "100% tie-off is mandatory above 6 feet. Click the overhead lifeline anchor point."
    },
    {
      title: 'Perform Structural Fixing at Height',
      action: "Click the steel I-beam bracket (or press E) to torque and tighten the structural bolts.",
      voice: "You are securely anchored. Click the steel beam bracket or press E to align the joint and torque the structural connection bolts.",
      getSituation: () => st.fix ? "Structural bolts torqued to specification." : "Perform the fixing task with two hands while tethered to the certified overhead lifeline."
    },
    {
      title: 'Unclip, Descend & Clear Worksite',
      action: "Click the scaffold ladder / tool pouch to safely unclip, descend and clear the site.",
      voice: "Structural fixing complete. Secure all tools in your pouch, disconnect from the anchor line, and descend the ladder facing the rungs.",
      getSituation: () => st.dsc ? "Descent complete and worksite verified safe!" : "Maintain 3 points of contact while descending the ladder."
    }
  ];

  window.CON_GUIDE = CON_GUIDE;

  // -----------------------------------------------------------------------
  // MACHINE OPERATION CONFIGURATION & DATA
  // -----------------------------------------------------------------------
  const MSTEPS = [
    'Read rotating parts & pinch point hazard signs',
    'Pick up PPE (safety glasses, ear defenders, boots)',
    'Wear PPE (shield eyes, ears and feet)',
    'Check & close safety interlock guards',
    'Test emergency stop trip & reset',
    'Clear swarf & chips from bed with brush',
    'Start machine spindle (green button)',
    'Feed material using push stick (keep hands clear)',
    'Press Stop & wait for spindle spin-down',
    'Apply Lockout / Tagout (LOTO) padlock'
  ];

  const MTIPS = [
    'Click the ROTATING PARTS / PINCH POINT hazard signs on the wall.',
    'Pick up the safety glasses, ear defenders and boots from the bench, then click Wear PPE.',
    'Click the [🦺 Wear PPE] button in the bottom dock.',
    'Click the transparent polycarbonate safety guard to lower and lock it over the chuck.',
    'Click the red mushroom E-Stop button on the console to test the trip circuit.',
    'Click the bench brush / swarf tray to clear metal chips without using bare hands.',
    'Click the green START button on the control console.',
    'Click the material stock / push stick (or press E) to feed material safely.',
    'Click the red STOP button and wait for the rotating spindle to come to a complete stop.',
    'Click the yellow/red disconnect switch to attach your LOTO padlock.'
  ];

  window.MSTEPS = MSTEPS;
  window.MTIPS = MTIPS;

  const mprog = () => {
    const s = (typeof st !== 'undefined' && st ? st : window.st);
    return [
      s && s.haz && (s.haz.has('sign1') || s.haz.has('sign2')),
      s && s.pick && s.pick.size === 3,
      s && Boolean(s.worn),
      s && Boolean(s.gd),
      s && Boolean(s.es),
      s && Boolean(s.clr),
      s && Boolean(s.go),
      s && Boolean(s.fd),
      s && Boolean(s.sp),
      s && Boolean(s.lk)
    ].map(Boolean);
  };

  window.mprog = mprog;

  const mppe = () => {
    const s = (typeof st !== 'undefined' && st ? st : window.st) || {};
    return '<div class="pc">' + [
      ['glasses', '🥽 Safety Glasses'],
      ['ear', '🎧 Ear Defenders'],
      ['boots', '👢 Safety Boots']
    ].map(a => `<span class="${s.worn ? 'on' : (s.pick && s.pick.has(a[0]) ? 'pk' : '')}">${a[1]}${s.worn ? ' ✓' : (s.pick && s.pick.has(a[0]) ? ' · ready' : '')}</span>`).join('') + '</div>';
  };

  window.mppe = mppe;

  const MAC_GUIDE = [
    {
      title: 'Machinery Hazard Warnings',
      action: "Click the yellow 'ROTATING MACHINERY' or 'PINCH POINT' signs on the bay wall.",
      voice: "Welcome to the heavy machinery workshop. Click the warning signs on the wall to review rotating spindle and pinch point hazard protocols.",
      getSituation: () => "Rotating chucks at 1200+ RPM and power feed gears create severe entanglement and crush hazards (OSHA 1910.212)."
    },
    {
      title: 'Select PPE (Glasses, Ear Defenders, Boots)',
      action: "Click the Safety Glasses, Ear Defenders, and Steel-Toe Boots on the workbench to collect them.",
      voice: () => st.pick.size === 0
        ? "Turn to the bench. Collect your three required PPE items: impact safety glasses, ear defenders, and heavy steel-toe boots."
        : (st.pick.size < 3 ? `Collected ${st.pick.size} of 3 items. Pick up remaining gear from the bench.` : "All gear collected! Click Wear P P E in the dock."),
      getSituation: () => `Collected ${st.pick ? st.pick.size : 0} of 3 PPE items. Never operate high-speed rotating equipment without eye, hearing, and foot protection.`
    },
    {
      title: 'Wear Machinery PPE',
      action: "Click the blue [🦺 Wear PPE] button in the dock to put on your safety gear.",
      voice: "Click Wear P P E in the dock. Never wear loose ties, long jewelry, or baggy gloves near spinning chucks.",
      getSituation: () => st.worn ? "PPE equipped! Eyes shielded from swarf, hearing protected from motor decibels." : "Put on safety glasses and ear defenders before approaching the lathe."
    },
    {
      title: 'Check & Close Safety Interlock Guard',
      action: "Click the transparent polycarbonate safety guard to lower and interlock it over the chuck.",
      voice: "Before powering up, click the transparent chuck shield to lower it into the locked position. The interlock prevents motor startup if open.",
      getSituation: () => st.gd ? "Machine interlock guard closed and latched over rotating chuck." : "Never run rotating machinery with guards open or interlocks bypassed."
    },
    {
      title: 'Test Emergency Stop & Reset',
      action: "Click the red mushroom E-Stop button on the console to test the safety trip mechanism.",
      voice: "Always verify your emergency stop works before starting work. Click the red palm button on the console to verify trip continuity, then reset it.",
      getSituation: () => st.es ? "Emergency Stop trip tested and reset successfully." : "Test the E-Stop before machine operation so you know it will instantly halt the motor."
    },
    {
      title: 'Clear Swarf & Chips with Bench Brush',
      action: "Click the bench brush / swarf tray to clear metal chips away from the machine bed.",
      voice: "Metal chips are razor sharp. Click the bench brush to sweep swarf into the tray. Never use your bare hands or compressed air.",
      getSituation: () => st.clr ? "Work area and lathe bed swept clean of razor-sharp swarf." : "Never clear metal turnings with bare hands. Always use a dedicated machine brush."
    },
    {
      title: 'Start Machine Spindle (Green Button)',
      action: "Click the green [START] button on the machine control console to power on the spindle.",
      voice: "Work area clear and guards interlocked. Click the green Start button on the console to engage the spindle drive.",
      getSituation: () => st.go ? "Spindle running at 1250 RPM. Sound and vibration normal." : "All pre-flight checks verified. Click green Start button to power on."
    },
    {
      title: 'Feed Material Using Push Stick',
      action: "Click the material stock / push stick (or press E) to guide stock safely into the cutter.",
      voice: "Spindle is at operating speed. Click the push stick or press E to feed material into the cutting path without putting your hands near the cutter.",
      getSituation: () => st.fd ? "Material fed smoothly using safety push stick." : "Keep hands at least 150 mm away from cutting tools. Always utilize a push stick."
    },
    {
      title: 'Press Stop & Wait for Spin-Down',
      action: "Click the red [STOP] button on the console and wait for the spindle to come to zero RPM.",
      voice: "Feed complete. Click the red Stop button on the console. Stand back and wait until the spindle comes to a complete, full stop.",
      getSituation: () => st.sp ? "Spindle completely stopped (0 RPM)." : "Spindles carry high rotational momentum. Wait for full spin-down before touching parts."
    },
    {
      title: 'Apply Lockout / Tagout (LOTO)',
      action: "Click the yellow/red electrical disconnect switch on the wall to apply your safety padlock.",
      voice: "Procedure finished. Click the electrical disconnect switch to apply your personal LOTO padlock and tag so no one accidentally re-energizes the machine.",
      getSituation: () => st.lk ? "LOTO hasp and danger padlock securely attached to main disconnect." : "Apply Lockout Tagout before leaving machine unattended (OSHA 1910.147)."
    }
  ];

  window.MAC_GUIDE = MAC_GUIDE;

  // -----------------------------------------------------------------------
  // HUD BUILDERS
  // -----------------------------------------------------------------------
  function hudC() {
    const s = (typeof st !== 'undefined' && st ? st : window.st);
    if (!s) return;
    const em = s.phase === 'em', p = cprog();
    const curIndex = p.indexOf(false);
    const nw = hudC.last !== curIndex;
    hudC.last = curIndex;

    if (em) {
      if (nw && typeof say === 'function') {
        say("Emergency drill active! Worker fall or dropped object detected. Sound the site horn, secure the drop zone, and evacuate to the muster zone.", 1);
      }
      const E = st.em || {};
      let h = `
        <div class="hud-hdr">
          <div class="hud-title-badge">🚨 SITE EMERGENCY RESPONSE</div>
          <div class="hud-step-counter">FALL DRILL</div>
        </div>
        <div class="hud-step-card" style="border-color:#ef4444">
          <div class="hud-step-lbl" style="color:#ef4444">EMERGENCY PROTOCOL ACTIVE</div>
          <div class="hud-step-action">
            ${!E.alarm ? '1. Sound the site emergency air horn on the wall.' : (!E.bar ? '2. Clear all personnel and lock the drop zone barricade.' : '3. Walk to the green evacuation assembly zone.')}
          </div>
        </div>
        <div class="hud-seq-list">
          <div class="hud-seq-item ${E.alarm ? 'done' : 'next'}">${E.alarm ? '✅' : '▶'} 1. Sound site alarm horn</div>
          <div class="hud-seq-item ${E.bar ? 'done' : 'next'}">${E.bar ? '✅' : '▶'} 2. Secure drop zone</div>
          <div class="hud-seq-item ${E.out ? 'done' : 'next'}">${E.out ? '✅' : '▶'} 3. Evacuate to assembly zone</div>
        </div>
        <div class="hud-footer">
          <span>⏱ <b>${Math.round((Date.now() - st.t0) / 1000)}s</b></span>
        </div>
      `;
      const e = document.getElementById('hud'); if (e) e.innerHTML = h;
      return;
    }

    const isAllComplete = curIndex === -1;
    const activeStep = isAllComplete ? 7 : curIndex;
    const stepInfo = CON_GUIDE[activeStep];
    const actionText = typeof stepInfo.action === 'function' ? stepInfo.action() : stepInfo.action;
    const situationText = typeof stepInfo.getSituation === 'function' ? stepInfo.getSituation() : stepInfo.getSituation();

    if (nw && typeof say === 'function') {
      if (isAllComplete) {
        say("Outstanding work! You have completed all construction work-at-height and fall protection procedures safely.", 1);
      } else {
        const vText = typeof stepInfo.voice === 'function' ? stepInfo.voice() : stepInfo.voice;
        say(vText || `Step ${activeStep + 1}: ${stepInfo.title}. ${actionText}`, 1);
      }
    }

    let h = `
      <div class="hud-hdr">
        <div class="hud-title-badge">🏗️ CONSTRUCTION SAFETY SOP</div>
        <div class="hud-step-counter">${isAllComplete ? 'COMPLETED' : `STEP ${activeStep + 1} OF 8`}</div>
      </div>
      <div class="hud-track">
        ${p.map((d, k) => `<div class="hud-seg ${d ? 'done' : (k === curIndex ? 'active' : '')}" title="Step ${k+1}: ${CSTEPS[k]}"></div>`).join('')}
      </div>
      <div class="hud-step-card" style="${isAllComplete ? 'border-color:#22c55e' : ''}">
        <div class="hud-step-lbl" style="${isAllComplete ? 'color:#22c55e' : ''}">
          ${isAllComplete ? '✅ ALL PROCEDURES COMPLETE' : `▶ STEP ${activeStep + 1}: ${stepInfo.title.toUpperCase()}`}
        </div>
        <div class="hud-step-action">
          ${isAllComplete ? 'Work-at-height procedures completed safely and verified!' : `👉 ${actionText}`}
        </div>
        <div class="hud-situational-tip">
          <b>Current Situation:</b> ${situationText}
        </div>
      </div>
    `;

    h += `<div class="hud-seq-list">`;
    if (activeStep > 0) {
      h += `<div class="hud-seq-item done">✔ Step ${activeStep}. ${CSTEPS[activeStep - 1]}</div>`;
    }
    if (!isAllComplete && activeStep < 7) {
      h += `<div class="hud-seq-item next">⏳ Next: Step ${activeStep + 2}. ${CSTEPS[activeStep + 1]}</div>`;
    }
    h += `</div>`;

    if (!st.worn && (st.pick && st.pick.size > 0 || activeStep === 1 || activeStep === 2)) {
      h += cppe();
    }

    h += `
      <div class="hud-footer">
        <span>⏱ <b>${Math.round((Date.now() - st.t0) / 1000)}s</b></span>
        <span>⚠ Violations: <b class="cr">${st.mist ? st.mist.length : 0}</b></span>
      </div>
    `;

    const el = document.getElementById('hud');
    if (el) el.innerHTML = h;
    if (sim && sim.olr) sim.olr();
  }

  function hudM() {
    const s = (typeof st !== 'undefined' && st ? st : window.st);
    if (!s) return;
    const em = s.phase === 'em', p = mprog();
    const curIndex = p.indexOf(false);
    const nw = hudM.last !== curIndex;
    hudM.last = curIndex;

    if (em) {
      if (nw && typeof say === 'function') {
        say("Machine emergency drill active! Jammed spindle and overload detected. Smash the Emergency Stop, pull the main disconnect, and evacuate.", 1);
      }
      const E = st.em || {};
      let h = `
        <div class="hud-hdr">
          <div class="hud-title-badge">🛑 MACHINE RUNAWAY EMERGENCY</div>
          <div class="hud-step-counter">E-STOP DRILL</div>
        </div>
        <div class="hud-step-card" style="border-color:#ef4444">
          <div class="hud-step-lbl" style="color:#ef4444">EMERGENCY PROTOCOL ACTIVE</div>
          <div class="hud-step-action">
            ${!E.estop ? '1. Smash the red mushroom Emergency Stop button on the console!' : (!E.disc ? '2. Pull the red main electrical disconnect handle on the wall.' : '3. Walk to the green evacuation assembly zone.')}
          </div>
        </div>
        <div class="hud-seq-list">
          <div class="hud-seq-item ${E.estop ? 'done' : 'next'}">${E.estop ? '✅' : '▶'} 1. Smash E-Stop palm button</div>
          <div class="hud-seq-item ${E.disc ? 'done' : 'next'}">${E.disc ? '✅' : '▶'} 2. Disconnect main power</div>
          <div class="hud-seq-item ${E.out ? 'done' : 'next'}">${E.out ? '✅' : '▶'} 3. Evacuate to assembly zone</div>
        </div>
        <div class="hud-footer">
          <span>⏱ <b>${Math.round((Date.now() - st.t0) / 1000)}s</b></span>
        </div>
      `;
      const e = document.getElementById('hud'); if (e) e.innerHTML = h;
      return;
    }

    const isAllComplete = curIndex === -1;
    const activeStep = isAllComplete ? 9 : curIndex;
    const stepInfo = MAC_GUIDE[activeStep];
    const actionText = typeof stepInfo.action === 'function' ? stepInfo.action() : stepInfo.action;
    const situationText = typeof stepInfo.getSituation === 'function' ? stepInfo.getSituation() : stepInfo.getSituation();

    if (nw && typeof say === 'function') {
      if (isAllComplete) {
        say("Outstanding work! You have completed all machine safety, interlock guarding, and lockout tagout protocols safely.", 1);
      } else {
        const vText = typeof stepInfo.voice === 'function' ? stepInfo.voice() : stepInfo.voice;
        say(vText || `Step ${activeStep + 1}: ${stepInfo.title}. ${actionText}`, 1);
      }
    }

    let h = `
      <div class="hud-hdr">
        <div class="hud-title-badge">⚙️ LATHE &amp; MACHINERY SAFETY SOP</div>
        <div class="hud-step-counter">${isAllComplete ? 'COMPLETED' : `STEP ${activeStep + 1} OF 10`}</div>
      </div>
      <div class="hud-track">
        ${p.map((d, k) => `<div class="hud-seg ${d ? 'done' : (k === curIndex ? 'active' : '')}" title="Step ${k+1}: ${MSTEPS[k]}"></div>`).join('')}
      </div>
      <div class="hud-step-card" style="${isAllComplete ? 'border-color:#22c55e' : ''}">
        <div class="hud-step-lbl" style="${isAllComplete ? 'color:#22c55e' : ''}">
          ${isAllComplete ? '✅ ALL PROCEDURES COMPLETE' : `▶ STEP ${activeStep + 1}: ${stepInfo.title.toUpperCase()}`}
        </div>
        <div class="hud-step-action">
          ${isAllComplete ? 'Machinery operation and LOTO isolation completed safely and verified!' : `👉 ${actionText}`}
        </div>
        <div class="hud-situational-tip">
          <b>Current Situation:</b> ${situationText}
        </div>
      </div>
    `;

    h += `<div class="hud-seq-list">`;
    if (activeStep > 0) {
      h += `<div class="hud-seq-item done">✔ Step ${activeStep}. ${MSTEPS[activeStep - 1]}</div>`;
    }
    if (!isAllComplete && activeStep < 9) {
      h += `<div class="hud-seq-item next">⏳ Next: Step ${activeStep + 2}. ${MSTEPS[activeStep + 1]}</div>`;
    }
    h += `</div>`;

    if (!st.worn && (st.pick && st.pick.size > 0 || activeStep === 1 || activeStep === 2)) {
      h += mppe();
    }

    h += `
      <div class="hud-footer">
        <span>⏱ <b>${Math.round((Date.now() - st.t0) / 1000)}s</b></span>
        <span>⚠ Violations: <b class="cr">${st.mist ? st.mist.length : 0}</b></span>
      </div>
    `;

    const el = document.getElementById('hud');
    if (el) el.innerHTML = h;
    if (sim && sim.olr) sim.olr();
  }

  window.hudC = hudC;
  window.hudM = hudM;

  // -----------------------------------------------------------------------
  // BRIEFING VIEWS
  // -----------------------------------------------------------------------
  V.briefC = () => `
    <div class="w" style="max-width:760px">
      <h1>🏗️ Construction Safety — Introduction</h1>
      <div class="c">
        <h3>Task</h3>
        <p><b>Inspect multi-tier scaffolding, establish drop zone barricades, don full-body harness, anchor to overhead lifeline, perform structural bolt fixing at height, and respond to site emergencies.</b></p>
        <h3>Safety instructions</h3>
        <ul>
          <li>Simulated educational environment — complies with OSHA 1926 Subpart M &amp; Subpart L.</li>
          <li>Never climb above 6 feet without an inspected full-body harness and 100% tie-off.</li>
          <li>Verify the green Scafftag at the ladder base before touching any rungs.</li>
          <li>Cordon off the drop zone below before taking any tools aloft.</li>
        </ul>
        <h3>Required sequence</h3>
        <ol>${CSTEPS.map(s => `<li>${s}</li>`).join('')}</ol>
        <p class="m">Controls: drag to look · W A S D to move · click objects · E = tool / fix · 💡 Hint shows next step · 🧰 Objects lists equipment.</p>
        <button class="b" onclick="startCon()" style="font-size:15px;padding:12px 24px">🏗️ Enter Construction Site</button>
      </div>
    </div>
  `;

  V.briefM = () => `
    <div class="w" style="max-width:760px">
      <h1>⚙️ Machine Operation — Introduction</h1>
      <div class="c">
        <h3>Task</h3>
        <p><b>Verify machine interlock guards, perform pre-operational Emergency Stop trip tests, clear swarf with a bench brush, start spindle, feed material using a push stick, wait for full spin-down, and apply LOTO lockout.</b></p>
        <h3>Safety instructions</h3>
        <ul>
          <li>Simulated educational environment — complies with OSHA 1910.212 &amp; 1910.147 (LOTO).</li>
          <li>Never wear loose clothing, ties, or dangling jewelry near spinning chucks.</li>
          <li>Never bypass machine interlocks; never run machinery with chuck guards open.</li>
          <li>Never clear razor-sharp metal turnings with bare hands; always use a dedicated machine brush.</li>
          <li>Always apply your personal padlock and danger tag before servicing or leaving equipment.</li>
        </ul>
        <h3>Required sequence</h3>
        <ol>${MSTEPS.map(s => `<li>${s}</li>`).join('')}</ol>
        <p class="m">Controls: drag to look · W A S D to move · click objects · E = feed tool · 💡 Hint shows next step · 🧰 Objects lists equipment.</p>
        <button class="b" onclick="startMac()" style="font-size:15px;padding:12px 24px">⚙️ Enter Machine Workshop</button>
      </div>
    </div>
  `;

  // -----------------------------------------------------------------------
  // TOOL SHORTCUTS & WEAR ACTIONS
  // -----------------------------------------------------------------------
  window.wearC = () => sim.wear && sim.wear();
  window.wearM = () => sim.wear && sim.wear();
  window.conFixNow = () => sim.pick && sim.run && sim.pick('fix');
  window.macFeedNow = () => sim.pick && sim.run && sim.pick('fd');

  function afterC() {
    hudC();
    if (st.dsc && st.phase === 'basic') {
      st.phase = 'choice';
      if (typeof beep === 'function') beep(660, 0.25);
      const m = document.getElementById('md');
      if (m) {
        m.style.display = 'flex';
        m.innerHTML = '<div style="border-color:var(--ok)"><h2 class="ok">✅ Procedure complete</h2><p>Optional: run the site emergency drill (dropped object &amp; rescue alarm).</p><button class="b" onclick="sim.em&&sim.em()">Start site emergency drill</button> <button class="b o" onclick="finish()">Finish &amp; view report</button></div>';
        if (m.firstChild) m.firstChild.style.borderColor = 'var(--ok)';
      }
    }
  }

  function afterM() {
    hudM();
    if (st.lk && st.phase === 'basic') {
      st.phase = 'choice';
      if (typeof beep === 'function') beep(660, 0.25);
      const m = document.getElementById('md');
      if (m) {
        m.style.display = 'flex';
        m.innerHTML = '<div style="border-color:var(--ok)"><h2 class="ok">✅ Procedure complete</h2><p>Optional: run the machine runaway jam / vibration emergency drill.</p><button class="b" onclick="sim.em&&sim.em()">Start E-Stop emergency drill</button> <button class="b o" onclick="finish()">Finish &amp; view report</button></div>';
        if (m.firstChild) m.firstChild.style.borderColor = 'var(--ok)';
      }
    }
  }

  window.afterC = afterC;
  window.afterM = afterM;

  // -----------------------------------------------------------------------
  // 🏗️ 3D WORKSHOP SIMULATION ENGINE: CONSTRUCTION SAFETY (`startCon`)
  // -----------------------------------------------------------------------
  window.startCon = function() {
    window.MOD = (typeof MOD !== 'undefined' ? (MOD = 'c') : 'c');
    window.cm = (typeof cm !== 'undefined' ? (cm = 'con') : 'con');
    if (typeof go === 'function') go('sim');

    const newState = {
      haz: new Set(),
      pick: new Set(),
      worn: 0,
      ins: 0,
      bar: 0,
      anc: 0,
      fix: 0,
      dsc: 0,
      mist: [],
      t0: Date.now(),
      phase: 'basic',
      hints: 0,
      em: null,
      inZone: 0
    };
    window.st = (typeof st !== 'undefined' ? (st = newState) : newState);

    const cv = document.getElementById('cv');
    const sw = document.getElementById('sw');
    const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(70, 1, 0.1, 80);
    const objs = [];
    const me = window.sim = { run: true, objs, R };
    const PI = Math.PI, rnd = Math.random;

    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    R.shadowMap.enabled = true;
    R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.xr.enabled = true;
    sc.background = new THREE.Color(0x1a2634); // Daylight industrial sky
    sc.fog = new THREE.Fog(0x1a2634, 18, 45);

    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.65, metalness: 0.25 }, o || {}));
    const Bc = c => new THREE.MeshBasicMaterial({ color: c });
    const add = (g, m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m; };
    const bx = (g, w, h, d, c, x, y, z) => add(g, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? M(c) : c), x, y, z);
    const cy = (g, r, h, c, x, y, z, r2) => add(g, new THREE.Mesh(new THREE.CylinderGeometry(r, r2 == null ? r : r2, h, 18), typeof c === 'number' ? M(c) : c), x, y, z);

    const tex = (w, h, fn, rx, ry) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      fn(c.getContext('2d'), w, h);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx || 1, ry || 1);
      return t;
    };

    const lab = (t, x, y, z) => {
      const c = document.createElement('canvas'); c.width = 384; c.height = 96;
      const g = c.getContext('2d');
      g.fillStyle = 'rgba(8,14,22,0.9)';
      g.beginPath(); g.moveTo(20,4); g.lineTo(364,4); g.quadraticCurveTo(380,4,380,20); g.lineTo(380,76); g.quadraticCurveTo(380,92,364,92); g.lineTo(20,92); g.quadraticCurveTo(4,92,4,76); g.lineTo(4,20); g.quadraticCurveTo(4,4,20,4); g.fill();
      g.strokeStyle = 'rgba(56,189,248,0.85)'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#fff'; g.font = 'bold 36px -apple-system,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(t, 192, 48);
      const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: true, transparent: true }));
      p.position.set(x, y, z); p.scale.set(0.55, 0.14, 1); p.renderOrder = 9;
      sc.add(p);
      return p;
    };

    const ob = (id, x, y, z, f, hs, lb) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.userData = { id };
      f(g);
      const hb = new THREE.Mesh(new THREE.BoxGeometry(hs || 0.9, hs || 0.9, hs || 0.9), M(0));
      hb.visible = false;
      g.add(hb);
      sc.add(g);
      objs.push(g);
      if (lb) g.userData.lab = lab(lb, x, y + (hs || 0.9) * 0.55 + 0.15, z);
      return g;
    };

    const post = (id, x, y, z, ry, t1, t2, bg, fg) => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = bg; g.fillRect(0, 0, 512, 256);
      g.strokeStyle = fg; g.lineWidth = 12; g.strokeRect(8, 8, 496, 240);
      g.fillStyle = fg; g.textAlign = 'center';
      g.font = 'bold 54px sans-serif'; g.fillText(t1, 256, 100);
      g.font = 'bold 32px sans-serif'; g.fillText(t2, 256, 175);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
      if (id) {
        const g2 = ob(id, x, y, z, grp => grp.add(m), 1.3);
        g2.rotation.y = ry;
      } else {
        m.position.set(x, y, z); m.rotation.y = ry; sc.add(m);
      }
      return m;
    };

    const mark = g => {
      g.userData.sel = 1;
      g.traverse(c => { if (c.material && c.material.emissive) c.material.emissive.setHex(0x1a7f3c); });
    };

    const hl = (g, on) => g.traverse(c => {
      if (c.material && c.material.emissive) c.material.emissive.setHex(on ? 0x665500 : (g.userData.sel ? 0x1a7f3c : 0));
    });

    const NM = {
      sign1: 'Overhead Crane Hazard Sign',
      sign2: 'Fall From Height Hazard Sign',
      helmet: 'Construction Hard Hat',
      vest: 'High-Vis Safety Vest',
      harness: 'Full-Body Fall Arrest Harness',
      ins: 'Scafftag Inspection Tag',
      bar: 'Drop Zone Perimeter Barricade',
      anc: 'Overhead Lifeline Anchor D-Ring',
      fix: 'Structural Beam Fixing Bracket',
      dsc: 'Ladder Rungs / Safe Descent',
      horn: 'Site Emergency Air Horn'
    };

    // ---------- LIGHTING
    sc.add(new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.65));
    const sun = new THREE.DirectionalLight(0xfff7ed, 0.85);
    sun.position.set(6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 30 });
    sc.add(sun);

    // Site floodlight fixtures
    [[-5, -4], [5, -4], [0, 4]].forEach(p => {
      const l = new THREE.PointLight(0xffedd5, 0.45, 16);
      l.position.set(p[0], 5, p[1]);
      sc.add(l);
    });

    // ---------- GROUND & SITE FOUNDATIONS
    const groundT = tex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#374151'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 400; i++) {
        const v = rnd() * 255 | 0; g.fillStyle = `rgba(${v},${v},${v},0.08)`;
        g.fillRect(rnd() * w, rnd() * h, 4, 4);
      }
      // Drop zone crosshatch
      g.fillStyle = 'rgba(239,68,68,0.18)'; g.fillRect(180, 180, 420, 420);
      g.strokeStyle = '#ef4444'; g.lineWidth = 10; g.strokeRect(180, 180, 420, 420);
      g.fillStyle = '#fff'; g.font = 'bold 24px sans-serif'; g.textAlign = 'center';
      g.fillText('DANGER: DROP ZONE — KEEP CLEAR', 390, 220);

      // Safe muster / assembly area
      g.fillStyle = 'rgba(34,197,94,0.85)'; g.fillRect(720, 720, 260, 260);
      g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(724, 724, 252, 252);
      g.fillStyle = '#fff'; g.font = 'bold 26px sans-serif';
      g.fillText('MUSTER POINT', 850, 850);
    });

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), M(0xffffff, { map: groundT, roughness: 0.9 }));
    ground.rotation.x = -PI / 2;
    sc.add(ground);

    // Concrete perimeter walls with column pillars
    bx(sc, 20, 6, 0.3, 0x475569, 0, 3, -8);
    bx(sc, 0.3, 6, 20, 0x475569, -9, 3, 0);
    bx(sc, 0.3, 6, 20, 0x475569, 9, 3, 0);

    // Overhead structural steel crane gantry beam
    bx(sc, 18, 0.45, 0.3, 0xd97706, 0, 5.8, -3);
    bx(sc, 0.35, 6, 0.35, 0xd97706, -7, 3, -3);
    bx(sc, 0.35, 6, 0.35, 0xd97706, 7, 3, -3);

    // ---------- HEAVY STEEL SCAFFOLDING TOWER
    const Scaf = new THREE.Group();
    Scaf.position.set(0, 0, -3.5);
    sc.add(Scaf);

    // 4 Vertical Standards (tubular steel)
    const stds = [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]];
    stds.forEach(p => {
      cy(Scaf, 0.05, 5.4, 0x94a3b8, p[0], 2.7, p[1]); // Standard
      bx(Scaf, 0.3, 0.04, 0.3, 0x334155, p[0], 0.02, p[1]); // Base jack / plate
    });

    // Horizontal Ledgers & Transoms at Tier 1 (1.8m) & Tier 2 (3.6m)
    [1.8, 3.6].forEach(y => {
      bx(Scaf, 3.2, 0.08, 0.08, 0x64748b, 0, y, -1.2);
      bx(Scaf, 3.2, 0.08, 0.08, 0x64748b, 0, y, 1.2);
      bx(Scaf, 0.08, 0.08, 2.4, 0x64748b, -1.6, y, 0);
      bx(Scaf, 0.08, 0.08, 2.4, 0x64748b, 1.6, y, 0);
      // Wood plank working deck
      bx(Scaf, 3.1, 0.06, 2.3, 0xa16207, 0, y + 0.04, 0);
      // Yellow Safety Toe boards (OSHA mandatory to stop falling objects)
      bx(Scaf, 3.1, 0.16, 0.03, 0xeab308, 0, y + 0.14, 1.15);
      bx(Scaf, 3.1, 0.16, 0.03, 0xeab308, 0, y + 0.14, -1.15);
      bx(Scaf, 0.03, 0.16, 2.3, 0xeab308, -1.55, y + 0.14, 0);
      bx(Scaf, 0.03, 0.16, 2.3, 0xeab308, 1.55, y + 0.14, 0);
      // Top guardrails (1.05m high) and mid-rails (0.55m)
      [0.55, 1.05].forEach(ry => {
        bx(Scaf, 3.2, 0.05, 0.05, 0xf59e0b, 0, y + ry, 1.2);
        bx(Scaf, 3.2, 0.05, 0.05, 0xf59e0b, 0, y + ry, -1.2);
        bx(Scaf, 0.05, 0.05, 2.4, 0xf59e0b, -1.6, y + ry, 0);
        bx(Scaf, 0.05, 0.05, 2.4, 0xf59e0b, 1.6, y + ry, 0);
      });
    });

    // Diagonal Cross Bracing
    const diag1 = cy(Scaf, 0.03, 4.2, 0x64748b, 0, 2.7, 1.22);
    diag1.rotation.z = 0.65;
    const diag2 = cy(Scaf, 0.03, 4.2, 0x64748b, 0, 2.7, -1.22);
    diag2.rotation.z = -0.65;

    // Access Ladder on front left
    const ladX = -1.2;
    cy(Scaf, 0.04, 4.0, 0x475569, ladX - 0.25, 2.0, 1.35);
    cy(Scaf, 0.04, 4.0, 0x475569, ladX + 0.25, 2.0, 1.35);
    for (let r = 0.3; r <= 3.8; r += 0.3) {
      cy(Scaf, 0.025, 0.5, 0xe2e8f0, ladX, r, 1.35).rotation.z = PI / 2;
    }

    // ---------- INTERACTIVE SCAFFOLD OBJECTS
    // 1. Scafftag Inspection Holder at ladder base
    ob('ins', ladX, 1.1, -2.1, g => {
      bx(g, 0.18, 0.3, 0.04, 0x15803d); // Green tag holder
      bx(g, 0.14, 0.24, 0.01, 0xffffff, 0, 0, 0.025); // Inspection record insert
      cy(g, 0.015, 0.08, 0x0f172a, 0, 0.14, 0.02);
    }, 0.6, 'Scafftag');

    // 2. Drop Zone Barricade System (Cones & Barricade Trestle)
    const BarG = ob('bar', 0, 0.45, -1.5, g => {
      // Traffic cones
      [-1.8, 1.8].forEach(cx => {
        cy(g, 0.02, 0.7, 0xf97316, cx, 0, 0, 0.18);
        cy(g, 0.1, 0.12, 0xffffff, cx, 0.05, 0, 0.13);
        bx(g, 0.42, 0.04, 0.42, 0x111827, cx, -0.33, 0);
      });
      // Barricade rail with black/yellow caution stripes
      bx(g, 3.6, 0.2, 0.04, 0xeab308, 0, 0.15, 0);
      bx(g, 3.6, 0.08, 0.04, 0x111827, 0, 0.15, 0.005);
      cy(g, 0.03, 0.8, 0x334155, -1.6, -0.1, 0);
      cy(g, 0.03, 0.8, 0x334155, 1.6, -0.1, 0);
    }, 1.4, 'Barricade');

    // 3. Overhead Lifeline & Fall Arrest Anchor Clamp (`anc`)
    const ancG = ob('anc', 0, 4.9, -3.5, g => {
      // Steel static cable
      cy(g, 0.015, 4.0, 0xd4d4d8, 0, 0, 0).rotation.z = PI / 2;
      // D-Ring Anchor Trolley
      bx(g, 0.15, 0.12, 0.15, 0xf59e0b, 0, -0.05, 0);
      // Heavy Steel D-Ring
      add(g, new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 20), M(0xffffff, { metalness: 0.8 })), 0, -0.18, 0);
      // Fall arrest shock-pack pack
      bx(g, 0.08, 0.2, 0.05, 0xdc2626, 0, -0.32, 0);
    }, 0.8, 'Lifeline Anchor');

    // 4. Structural Fixing Joint at Height (`fix`)
    const fixG = ob('fix', 0.8, 3.9, -3.5, g => {
      // Steel I-beam connector plate
      bx(g, 0.5, 0.35, 0.12, 0x475569, 0, 0, 0);
      // High-strength bolts with washers
      [[-0.15, -0.08], [0.15, -0.08], [-0.15, 0.08], [0.15, 0.08]].forEach(bp => {
        cy(g, 0.035, 0.08, 0xfacc15, bp[0], bp[1], 0.07).rotation.x = PI / 2;
      });
      // Structural bracket flange
      bx(g, 0.1, 0.35, 0.3, 0x334155, 0, 0, -0.15);
    }, 0.9, 'Beam Fixing');

    // 5. Ladder Descent & Tool Pouch (`dsc`)
    ob('dsc', ladX, 3.4, -2.1, g => {
      bx(g, 0.28, 0.3, 0.18, 0x854d0e); // Tool pouch
      cy(g, 0.02, 0.35, 0x9ca3af, 0.1, 0.05, 0.1); // Ratchet wrench in pouch
      bx(g, 0.05, 0.12, 0.05, 0x22c55e, -0.08, 0.08, 0.05); // Level
    }, 0.8, 'Tool Pouch');

    // ---------- PPE BENCH
    bx(sc, 2.4, 0.08, 0.8, 0x5b4636, -3.5, 0.9, 2);
    [[-1.1, -0.3], [1.1, -0.3], [-1.1, 0.3], [1.1, 0.3]].forEach(p => {
      bx(sc, 0.07, 0.86, 0.07, 0x3b2a1a, -3.5 + p[0], 0.43, 2 + p[1]);
    });

    ob('helmet', -4.2, 1.15, 2, g => {
      add(g, new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 12, 0, 2 * PI, 0, PI * 0.6), M(0xfacc15, { roughness: 0.3 })), 0, 0, 0);
      bx(g, 0.34, 0.03, 0.06, 0xca8a04, 0, 0, 0.2); // Brim
      cy(g, 0.015, 0.24, 0x0f172a, 0, -0.1, 0.05); // Chin strap
    }, 0.6, 'Hard Hat');

    ob('vest', -3.5, 1.0, 2, g => {
      bx(g, 0.45, 0.04, 0.55, 0xf97316); // High-vis neon orange
      bx(g, 0.06, 0.05, 0.55, 0xe2e8f0, -0.12, 0.005, 0); // Reflective silver tape
      bx(g, 0.06, 0.05, 0.55, 0xe2e8f0, 0.12, 0.005, 0);
    }, 0.6, 'Hi-Vis Vest');

    ob('harness', -2.8, 1.02, 2, g => {
      // Body webbing harness straps
      bx(g, 0.42, 0.05, 0.5, 0x0284c7); // Blue webbing
      bx(g, 0.06, 0.06, 0.5, 0xfacc15, 0, 0.005, 0); // Chest strap
      add(g, new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16), M(0xffffff, { metalness: 0.8 })), 0, 0.04, -0.22); // Dorsal D-ring
      cy(g, 0.02, 0.45, 0xdc2626, 0.12, 0.02, 0.15).rotation.z = PI / 2; // Lanyard
    }, 0.7, 'Safety Harness');

    // Site Emergency Air Horn
    ob('horn', 6.5, 1.6, -7.8, g => {
      bx(g, 0.22, 0.32, 0.1, 0xdc2626);
      cy(g, 0.06, 0.2, 0xfacc15, 0, 0.18, 0.08, 0.02).rotation.x = PI / 2; // Horn cone
    }, 0.6, 'Emergency Horn');

    // ---------- POSTERS & SIGNS
    post('sign1', -4.5, 3.2, -7.85, 0, 'OVERHEAD HAZARD', 'CRANE / FALLING OBJECTS', '#eab308', '#000000');
    post('sign2', 4.5, 3.2, -7.85, 0, 'FALL PROTECTION', '100% TIE-OFF REQUIRED', '#0284c7', '#ffffff');
    post(0, -8.85, 3.2, -1.0, PI / 2, 'SCAFFOLD SAFETY', 'CHECK SCAFFTAG DAILY', '#15803d', '#ffffff');

    // Camera Rig & First Person Hands
    const rig = new THREE.Group();
    sc.add(rig);
    rig.add(cam);
    cam.position.set(0, 1.6, 5.0);
    cam.rotation.order = 'YXZ';

    const hand = new THREE.Group();
    const mkH = x => {
      const g = new THREE.Group();
      bx(g, 0.11, 0.05, 0.13, 0xf97316, 0, 0, 0);
      cy(g, 0.06, 0.22, 0x1e293b, 0, 0, 0.17).rotation.x = PI / 2;
      g.position.set(x, -0.3, -0.6);
      return g;
    };
    const hR = mkH(0.32), hL = mkH(-0.34);
    hand.add(hR, hL);
    hand.visible = false;
    cam.add(hand);

    // Held tool: Ratchet / Torque Wrench
    const heldTool = new THREE.Group();
    cy(heldTool, 0.016, 0.32, 0x1e293b, 0, 0, 0).rotation.x = PI / 2;
    bx(heldTool, 0.06, 0.05, 0.1, 0x94a3b8, 0, 0.02, -0.16);
    cy(heldTool, 0.03, 0.06, 0xd4d4d8, 0, 0.06, -0.16);
    heldTool.position.set(0, 0.02, -0.1);
    heldTool.visible = false;
    hR.add(heldTool);

    // Interaction Logic
    const P = id => {
      if (st.phase === 'em') {
        const E = st.em = st.em || { alarm: 0, bar: 0, out: 0, t0: Date.now() };
        if (id === 'horn') {
          E.alarm = 1;
          if (typeof tip === 'function') tip('🚨 Site emergency alarm sounded! All workers alerted.');
          if (typeof beep === 'function') beep(880, 0.35);
        } else if (id === 'bar') {
          E.bar = 1;
          if (typeof tip === 'function') tip('Drop zone locked and secured.');
        }
        return hudC();
      }

      if (st.phase !== 'basic') return;
      const g = objs.find(o => o.userData.id === id);

      if (id === 'sign1' || id === 'sign2') {
        st.haz.add(id);
        if (typeof tip === 'function') tip(id === 'sign1' ? 'OVERHEAD HAZARD: Wear hard hat; drop zone must be barricaded.' : 'FALL HAZARD: Full-body harness & certified anchor required above 6ft.');
        if (typeof beep === 'function') beep(440, 0.15);
        return afterC();
      }

      if (['helmet', 'vest', 'harness'].includes(id)) {
        if (st.worn) return tip && tip('PPE already equipped.');
        st.pick.add(id);
        mark(g);
        if (typeof tip === 'function') tip(NM[id] + ' ready (' + st.pick.size + '/3).');
        if (typeof beep === 'function') beep(520, 0.1);
        return afterC();
      }

      if (!st.worn) {
        if (typeof mist === 'function') mist('ppe', '⚠️ Safety Violation', 'Construction equipment touched without safety gear.', 'Pick up hard hat, vest and harness, click Wear PPE, then proceed.');
        return;
      }

      if (id === 'ins') {
        st.ins = 1;
        mark(g);
        if (typeof tip === 'function') tip('✅ Scafftag verified: Scaffold inspected and structurally sound (OSHA Subpart L).');
        if (typeof beep === 'function') beep(600, 0.15);
      } else if (id === 'bar') {
        if (!st.ins) {
          if (typeof mist === 'function') mist('seq', '⚠️ Unsafe Sequence', 'Barricade established before scaffolding was inspected.', 'Verify Scafftag at ladder base first.');
          return;
        }
        st.bar = 1;
        mark(g);
        if (typeof tip === 'function') tip('🚧 Drop zone barricaded: perimeter cleared of pedestrian ground traffic.');
        if (typeof beep === 'function') beep(620, 0.15);
      } else if (id === 'anc') {
        if (!st.bar) {
          if (typeof mist === 'function') mist('zone', '⚠️ Drop Zone Unprotected', 'Climbing scaffold before barricading ground drop zone.', 'Set up the drop zone barricade first.');
          return;
        }
        st.anc = 1;
        mark(g);
        heldTool.visible = true;
        // Smoothly glide camera up onto the scaffold platform
        if (me.glide) me.glide(0, 3.2, 0, -0.15);
        if (typeof tip === 'function') tip('⚓ 100% Tie-Off Verified: Double-locking snap hook secured to overhead lifeline.');
        if (typeof beep === 'function') beep(700, 0.2);
      } else if (id === 'fix') {
        if (!st.anc) {
          if (typeof mist === 'function') mist('seq', '⚠️ Fall Hazard Violation', 'Performing work at height without being anchored to the lifeline.', 'Clip your safety harness to the anchor point before performing work.');
          return;
        }
        st.fix = 1;
        mark(g);
        if (typeof tip === 'function') tip('🔩 Structural joint aligned: bolts torqued to 180 Nm with ratchet wrench.');
        if (typeof beep === 'function') beep(750, 0.2);
      } else if (id === 'dsc') {
        if (!st.fix) {
          if (typeof tip === 'function') tip('Complete the structural fixing before clearing tools.');
          return;
        }
        st.dsc = 1;
        heldTool.visible = false;
        // Glide camera back to ground level
        if (me.glide) me.glide(0, 5.0, 0, 0);
        if (typeof tip === 'function') tip('⬇️ Tools tethered and descended safely. Work area verified 100% safe.');
        if (typeof beep === 'function') beep(800, 0.25);
      }

      afterC();
    };

    me.pick = P;

    me.wear = () => {
      if (st.worn) return tip && tip('You are already wearing your safety gear.');
      if (st.pick.size < 3) return tip && tip('Collect hard hat, hi-vis vest, and harness from the bench first.');
      ['helmet', 'vest', 'harness'].forEach(q => {
        const o = objs.find(o => o.userData.id === q);
        if (o) { o.visible = false; if (o.userData.lab) o.userData.lab.visible = false; }
      });
      st.worn = 1;
      hand.visible = true;
      if (typeof tip === 'function') tip('🪢 PPE Equipped: Hard hat chin strap secured, fall harness fitted.');
      if (typeof beep === 'function') beep(880, 0.2);
      afterC();
    };

    me.em = () => {
      const md = document.getElementById('md'); if (md) md.style.display = 'none';
      st.phase = 'em';
      st.em = { alarm: 0, bar: 0, out: 0, t0: Date.now() };
      const emv = document.getElementById('emv'); if (emv) emv.classList.add('on');
      if (typeof tip === 'function') tip('🚨 SITE EMERGENCY! Worker fall or dropped object detected. Sound the horn!');
      if (typeof beep === 'function') beep(880, 0.35);
      hudC();
    };

    // Camera Glide
    let yaw = 0, pit = 0, dn = null, hov = null;
    me.glide = (x, z, ty, tp) => {
      const x0 = cam.position.x, z0 = cam.position.z, t0 = performance.now();
      const targetY = z < 0 ? 3.6 : 1.6;
      const y0 = cam.position.y;
      (function f() {
        const u = Math.min(1, (performance.now() - t0) / 1000);
        const e = u * u * (3 - 2 * u);
        cam.position.x = x0 + (x - x0) * e;
        cam.position.z = z0 + (z - z0) * e;
        cam.position.y = y0 + (targetY - y0) * e;
        if (u < 1 && me.run) requestAnimationFrame(f);
      })();
    };

    // Pointer Events
    const rc = new THREE.Raycaster();
    const nd = e => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1];
    };
    const ray = (x, y) => {
      rc.setFromCamera({ x, y }, cam);
      const h = rc.intersectObjects(objs, true).filter(h => h.distance < 18)[0];
      if (!h) return null;
      let o = h.object;
      while (o && !(o.userData && o.userData.id)) o = o.parent;
      return o;
    };

    cv.onpointerdown = e => {
      dn = { x: e.clientX, y: e.clientY, m: 0 };
      cv.setPointerCapture(e.pointerId);
    };

    cv.onpointermove = e => {
      if (dn) {
        const dx = e.clientX - dn.x, dy = e.clientY - dn.y;
        dn.m += Math.abs(dx) + Math.abs(dy);
        yaw -= dx * 0.005;
        pit = Math.max(-1.1, Math.min(1.1, pit - dy * 0.005));
        dn.x = e.clientX; dn.y = e.clientY;
        return;
      }
      const o = ray(...nd(e)), n = document.getElementById('tt');
      if (o !== hov) {
        if (hov) hl(hov, 0);
        hov = o;
        if (o) hl(o, 1);
      }
      cv.style.cursor = o ? 'pointer' : 'grab';
      if (o && n) {
        const r = cv.getBoundingClientRect();
        n.style.display = 'block';
        n.textContent = '👆 ' + (NM[o.userData.id] || o.userData.id);
        n.style.left = e.clientX - r.left + 14 + 'px';
        n.style.top = e.clientY - r.top + 14 + 'px';
      } else if (n) n.style.display = 'none';
    };

    cv.onpointerup = e => {
      if (dn && dn.m < 8) {
        const o = ray(...nd(e));
        if (o) P(o.userData.id);
      }
      dn = null;
    };

    // Responsive Canvas
    const rs = () => {
      if (!sw.clientWidth) return;
      R.setSize(sw.clientWidth, sw.clientHeight, false);
      cam.aspect = sw.clientWidth / sw.clientHeight;
      cam.updateProjectionMatrix();
    };
    rs();
    window.onresize = () => { if (me.run) rs(); };

    // Main Animation Loop
    let fl = 0;
    const loop = () => {
      if (!me.run) { R.setAnimationLoop(null); return; }
      fl++;
      const kk = window.K || {};
      const f = (kk.w || kk.arrowup ? 1 : 0) - (kk.s || kk.arrowdown ? 1 : 0);
      const r = (kk.d || kk.arrowright ? 1 : 0) - (kk.a || kk.arrowleft ? 1 : 0);
      const sp = 0.08;

      cam.position.x = Math.max(-8, Math.min(8, cam.position.x + (-Math.sin(yaw) * f + Math.cos(yaw) * r) * sp));
      cam.position.z = Math.max(-7, Math.min(7, cam.position.z + (-Math.cos(yaw) * f - Math.sin(yaw) * r) * sp));
      cam.rotation.set(pit, yaw, 0);

      // Emergency muster evacuation check
      const s = (typeof st !== 'undefined' && st ? st : window.st);
      if (s && s.phase === 'em') {
        const E = s.em;
        if (E && E.alarm && cam.position.x > 5 && cam.position.z > 5) {
          E.out = 1;
          const emv = document.getElementById('emv'); if (emv) emv.classList.remove('on');
          st.phase = 'x';
          if (typeof tip === 'function') tip('✅ Muster evacuation verified safe!');
          if (typeof finish === 'function') finish();
          return;
        }
      }

      R.render(sc, cam);
    };

    R.setAnimationLoop(loop);
    if (typeof mkCoach === 'function') {
      mkCoach({
        steps: CSTEPS,
        tips: CTIPS,
        prog: cprog,
        alive: () => me.run,
        name: 'construction',
        kb: [
          [/ppe|helmet|vest|harness|hard\s*hat|wear/i, 'At height, 100% fall protection is non-negotiable. Inspect your harness webbings, connect the D-ring, and cinch the chinstrap on your helmet.'],
          [/scaff|tag|ladder|inspect/i, 'Always look for the green Scafftag at the ladder base before climbing. Never access a red-tagged or uninspected tower.'],
          [/barricade|drop\s*zone|cordon|cone/i, 'Tools or material dropped from 3m can cause fatal impact injuries below. Cordon off the ground drop zone with warning barricades.'],
          [/anchor|lifeline|clip|d-ring/i, 'Clip your lanyard snap-hook to an approved overhead anchor point before performing any elevated work.'],
          [/torque|bolt|fix|bracket/i, 'Use the torque tool at height to secure the structural fixing plate while maintaining 3 points of contact or harness restraint.'],
          [/descend|ladder|clear|tether/i, 'Tether all hand tools before descending. Use the ladder facing the rungs with hands free.']
        ],
        why: {
          ppe: 'Full PPE (hard hat, vest, safety harness) is mandatory on construction sites.',
          zone: 'Ground drop zone must be barricaded to prevent dropped objects striking pedestrians.',
          seq: 'Scaffold must be inspected (green Scafftag) and barricaded before climbing.',
          tool: 'Ensure tools are tethered and safety lanyard clipped to the overhead anchor.'
        },
        em: 'Site emergency! Sound the air horn, establish drop-zone clearance, and evacuate to the muster point.'
      });
    }
    hudC();
    if (typeof tip === 'function') tip('Welcome to Construction Safety. Read the hazard signs on the wall.');
  };

  // -----------------------------------------------------------------------
  // ⚙️ 3D WORKSHOP SIMULATION ENGINE: MACHINE OPERATION (`startMac`)
  // -----------------------------------------------------------------------
  window.startMac = function() {
    window.MOD = (typeof MOD !== 'undefined' ? (MOD = 'm') : 'm');
    window.cm = (typeof cm !== 'undefined' ? (cm = 'mac') : 'mac');
    if (typeof go === 'function') go('sim');

    const newState = {
      haz: new Set(),
      pick: new Set(),
      worn: 0,
      gd: 0,
      es: 0,
      clr: 0,
      go: 0,
      fd: 0,
      sp: 0,
      lk: 0,
      mist: [],
      t0: Date.now(),
      phase: 'basic',
      hints: 0,
      em: null,
      inZone: 0
    };
    window.st = (typeof st !== 'undefined' ? (st = newState) : newState);

    const cv = document.getElementById('cv');
    const sw = document.getElementById('sw');
    const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(70, 1, 0.1, 70);
    const objs = [];
    const me = window.sim = { run: true, objs, R };
    const PI = Math.PI, rnd = Math.random;

    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    R.shadowMap.enabled = true;
    R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.xr.enabled = true;
    sc.background = new THREE.Color(0x0a111a); // Machine shop ambient
    sc.fog = new THREE.Fog(0x0a111a, 16, 40);

    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.6, metalness: 0.35 }, o || {}));
    const Bc = c => new THREE.MeshBasicMaterial({ color: c });
    const add = (g, m, x, y, z) => { m.position.set(x, y, z); g.add(m); return m; };
    const bx = (g, w, h, d, c, x, y, z) => add(g, new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? M(c) : c), x, y, z);
    const cy = (g, r, h, c, x, y, z, r2) => add(g, new THREE.Mesh(new THREE.CylinderGeometry(r, r2 == null ? r : r2, h, 20), typeof c === 'number' ? M(c) : c), x, y, z);

    const tex = (w, h, fn, rx, ry) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      fn(c.getContext('2d'), w, h);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx || 1, ry || 1);
      return t;
    };

    const lab = (t, x, y, z) => {
      const c = document.createElement('canvas'); c.width = 384; c.height = 96;
      const g = c.getContext('2d');
      g.fillStyle = 'rgba(8,14,22,0.9)';
      g.beginPath(); g.moveTo(20,4); g.lineTo(364,4); g.quadraticCurveTo(380,4,380,20); g.lineTo(380,76); g.quadraticCurveTo(380,92,364,92); g.lineTo(20,92); g.quadraticCurveTo(4,92,4,76); g.lineTo(4,20); g.quadraticCurveTo(4,4,20,4); g.fill();
      g.strokeStyle = 'rgba(56,189,248,0.85)'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#fff'; g.font = 'bold 36px -apple-system,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(t, 192, 48);
      const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: true, transparent: true }));
      p.position.set(x, y, z); p.scale.set(0.55, 0.14, 1); p.renderOrder = 9;
      sc.add(p);
      return p;
    };

    const ob = (id, x, y, z, f, hs, lb) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.userData = { id };
      f(g);
      const hb = new THREE.Mesh(new THREE.BoxGeometry(hs || 0.9, hs || 0.9, hs || 0.9), M(0));
      hb.visible = false;
      g.add(hb);
      sc.add(g);
      objs.push(g);
      if (lb) g.userData.lab = lab(lb, x, y + (hs || 0.9) * 0.55 + 0.15, z);
      return g;
    };

    const post = (id, x, y, z, ry, t1, t2, bg, fg) => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = bg; g.fillRect(0, 0, 512, 256);
      g.strokeStyle = fg; g.lineWidth = 12; g.strokeRect(8, 8, 496, 240);
      g.fillStyle = fg; g.textAlign = 'center';
      g.font = 'bold 52px sans-serif'; g.fillText(t1, 256, 100);
      g.font = 'bold 30px sans-serif'; g.fillText(t2, 256, 175);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
      if (id) {
        const g2 = ob(id, x, y, z, grp => grp.add(m), 1.3);
        g2.rotation.y = ry;
      } else {
        m.position.set(x, y, z); m.rotation.y = ry; sc.add(m);
      }
      return m;
    };

    const mark = g => {
      g.userData.sel = 1;
      g.traverse(c => { if (c.material && c.material.emissive) c.material.emissive.setHex(0x1a7f3c); });
    };

    const hl = (g, on) => g.traverse(c => {
      if (c.material && c.material.emissive) c.material.emissive.setHex(on ? 0x665500 : (g.userData.sel ? 0x1a7f3c : 0));
    });

    const NM = {
      sign1: 'Rotating Parts Warning Sign',
      sign2: 'Pinch Point Hazard Sign',
      glasses: 'Safety Glasses',
      ear: 'Ear Defenders',
      boots: 'Steel-Toe Boots',
      gd: 'Polycarbonate Safety Guard',
      es: 'Emergency Stop Palm Button',
      clr: 'Bench Brush & Swarf Tray',
      go: 'Machine Spindle Start (Green)',
      fd: 'Push Stick / Stock Feeder',
      sp: 'Machine Spindle Stop (Red)',
      lk: 'LOTO Disconnect Switch Box'
    };

    // ---------- LIGHTING
    sc.add(new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 0.75);
    dl.position.set(5, 12, 6);
    dl.castShadow = true;
    sc.add(dl);

    // Lathe overhead halogen work light
    const workLamp = new THREE.PointLight(0xfef08a, 1.2, 7);
    workLamp.position.set(0, 2.5, -2.6);
    sc.add(workLamp);

    // ---------- FLOOR & WALLS
    const shopT = tex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#1e293b'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 2;
      for (let i = 0; i <= 8; i++) {
        g.beginPath(); g.moveTo(i * w / 8, 0); g.lineTo(i * w / 8, h); g.stroke();
        g.beginPath(); g.moveTo(0, i * h / 8); g.lineTo(w, i * h / 8); g.stroke();
      }
      // Yellow operator safety perimeter box
      g.fillStyle = 'rgba(234,179,8,0.15)'; g.fillRect(320, 260, 380, 500);
      g.strokeStyle = '#eab308'; g.lineWidth = 8; g.strokeRect(320, 260, 380, 500);
      g.fillStyle = '#fff'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center';
      g.fillText('OPERATOR WORK ZONE', 510, 300);

      // Muster station
      g.fillStyle = 'rgba(34,197,94,0.85)'; g.fillRect(720, 720, 260, 260);
      g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(724, 724, 252, 252);
      g.fillStyle = '#fff'; g.font = 'bold 26px sans-serif';
      g.fillText('SAFE MUSTER ZONE', 850, 850);
    });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), M(0xffffff, { map: shopT, roughness: 0.8 }));
    floor.rotation.x = -PI / 2;
    sc.add(floor);

    bx(sc, 16, 5, 0.2, 0x1e293b, 0, 2.5, -6.5);
    bx(sc, 0.2, 5, 16, 0x1e293b, -8, 2.5, 0);
    bx(sc, 0.2, 5, 16, 0x1e293b, 8, 2.5, 0);

    // ---------- HEAVY INDUSTRIAL LATHE & MILLING MACHINERY
    const Machine = new THREE.Group();
    Machine.position.set(0, 0, -3.0);
    sc.add(Machine);

    // Heavy Cast Iron Machine Bed & Legs
    bx(Machine, 3.2, 0.7, 1.2, 0x064e3b, 0, 0.45, 0); // Industrial green cast bed
    bx(Machine, 3.0, 0.2, 0.9, 0x334155, 0, 0.9, 0); // Ground steel slideways
    bx(Machine, 0.6, 0.8, 1.1, 0x064e3b, -1.2, 0.4, 0); // Headstock base
    bx(Machine, 0.6, 0.8, 1.1, 0x064e3b, 1.2, 0.4, 0); // Tailstock base

    // Headstock Gearbox Unit
    bx(Machine, 0.9, 0.8, 0.9, 0x047857, -1.0, 1.2, 0);
    cy(Machine, 0.05, 0.2, 0x94a3b8, -1.2, 1.45, 0.46).rotation.x = PI / 2; // Gear lever

    // 3-Jaw Spindle Chuck (Animated during rotation!)
    const ChuckGroup = new THREE.Group();
    ChuckGroup.position.set(-0.45, 1.2, 0);
    Machine.add(ChuckGroup);
    cy(ChuckGroup, 0.26, 0.22, 0xd4d4d8, 0, 0, 0).rotation.z = PI / 2; // Chuck cylinder
    // 3 Hardened Steel Gripping Jaws
    [0, 2 * PI / 3, 4 * PI / 3].forEach(a => {
      const jaw = bx(ChuckGroup, 0.08, 0.12, 0.07, 0x1e293b, 0.12, Math.cos(a) * 0.16, Math.sin(a) * 0.16);
    });

    // Workpiece stock in chuck
    const workStock = cy(ChuckGroup, 0.06, 1.2, 0xf59e0b, 0.6, 0, 0);
    workStock.rotation.z = PI / 2;

    // Tailstock Assembly on right
    bx(Machine, 0.6, 0.6, 0.7, 0x047857, 1.0, 1.15, 0);
    cy(Machine, 0.06, 0.35, 0xd4d4d8, 0.65, 1.2, 0).rotation.z = PI / 2; // Quill
    cy(Machine, 0.15, 0.04, 0x94a3b8, 1.35, 1.2, 0).rotation.z = PI / 2; // Handwheel

    // ---------- INTERACTIVE MACHINE CONTROLS & SAFETY GUARDS
    // 1. Transparent Interlocked Safety Guard (`gd`)
    const GuardG = ob('gd', -0.45, 1.35, 0.1, g => {
      // Polycarbonate curved transparent shield
      const sm = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.55, 16, 1, true, -PI/2, PI), new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide
      }));
      sm.rotation.z = PI / 2;
      g.add(sm);
      // Steel hinge frame & yellow handle
      bx(g, 0.55, 0.04, 0.04, 0xeab308, 0, 0.36, 0);
      cy(g, 0.02, 0.14, 0xfacc15, 0, 0.42, 0.1);
    }, 0.9, 'Safety Guard');

    // 2. Control Console with Buttons
    const Console = new THREE.Group();
    Console.position.set(0.2, 1.3, 0.55);
    Machine.add(Console);
    bx(Console, 0.6, 0.4, 0.15, 0x0f172a, 0, 0, 0);
    // Digital RPM Readout
    const rpmBox = bx(Console, 0.28, 0.08, 0.02, 0x000000, 0, 0.1, 0.08);

    // Emergency Stop Palm Button (`es`)
    ob('es', 0.4, 1.3, -2.4, g => {
      cy(g, 0.09, 0.04, 0xfacc15, 0, 0, 0); // Yellow collar
      cy(g, 0.07, 0.06, 0xdc2626, 0, 0.04, 0); // Red mushroom head
    }, 0.5, 'E-Stop');

    // Start Button (Green `go`)
    ob('go', 0.1, 1.26, -2.4, g => {
      cy(g, 0.04, 0.04, 0x16a34a, 0, 0, 0);
    }, 0.4, 'Start');

    // Stop Button (Red `sp`)
    ob('sp', 0.25, 1.26, -2.4, g => {
      cy(g, 0.045, 0.04, 0xef4444, 0, 0, 0);
    }, 0.4, 'Stop');

    // 3. Swarf Tray & Cleaning Bench Brush (`clr`)
    ob('clr', 0.5, 0.95, -2.6, g => {
      bx(g, 0.12, 0.04, 0.35, 0x854d0e); // Wooden handle
      bx(g, 0.1, 0.06, 0.18, 0x1e293b, 0, -0.04, -0.06); // Horsehair bristles
      bx(g, 0.3, 0.02, 0.3, 0x64748b, 0.15, -0.05, 0); // Metal chips
    }, 0.6, 'Bench Brush');

    // 4. Material Stock / Push Stick Feeder Tool (`fd`)
    ob('fd', -0.1, 1.05, -2.4, g => {
      bx(g, 0.04, 0.03, 0.45, 0xd97706); // Wooden push stick
      bx(g, 0.06, 0.05, 0.1, 0xb45309, 0, 0.01, -0.2); // Notched pushing head
    }, 0.6, 'Push Stick');

    // 5. Main Electrical LOTO Disconnect Switch Box (`lk`)
    ob('lk', -3.5, 1.5, -6.35, g => {
      bx(g, 0.35, 0.55, 0.2, 0x334155); // Industrial switch enclosure
      bx(g, 0.08, 0.22, 0.06, 0xdc2626, 0.16, 0.05, 0); // Red throw handle
      // LOTO Danger Padlock & Hasp
      bx(g, 0.06, 0.08, 0.04, 0xfacc15, 0.16, -0.08, 0.04);
      add(g, new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 14), M(0xffffff, { metalness: 0.8 })), 0.16, -0.03, 0.04);
    }, 0.8, 'LOTO Disconnect');

    // ---------- PPE BENCH
    bx(sc, 2.4, 0.08, 0.8, 0x5b4636, -3.5, 0.9, 2);
    [[-1.1, -0.3], [1.1, -0.3], [-1.1, 0.3], [1.1, 0.3]].forEach(p => {
      bx(sc, 0.07, 0.86, 0.07, 0x3b2a1a, -3.5 + p[0], 0.43, 2 + p[1]);
    });

    ob('glasses', -4.2, 1.02, 2, g => {
      bx(g, 0.28, 0.08, 0.04, 0x0284c7);
      bx(g, 0.24, 0.06, 0.01, 0x7dd3fc, 0, 0, 0.02);
    }, 0.5, 'Safety Glasses');

    ob('ear', -3.5, 1.06, 2, g => {
      add(g, new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.015, 6, 18, PI), M(0x1e293b)), 0, 0.08, 0);
      cy(g, 0.06, 0.08, 0xdc2626, -0.15, 0, 0);
      cy(g, 0.06, 0.08, 0xdc2626, 0.15, 0, 0);
    }, 0.6, 'Ear Defenders');

    ob('boots', -2.8, 1.02, 2, g => {
      bx(g, 0.16, 0.18, 0.28, 0x1c1917, -0.1, 0, 0);
      bx(g, 0.16, 0.18, 0.28, 0x1c1917, 0.1, 0, 0);
      bx(g, 0.14, 0.04, 0.1, 0x78716c, -0.1, -0.06, 0.1); // Steel toe cap
      bx(g, 0.14, 0.04, 0.1, 0x78716c, 0.1, -0.06, 0.1);
    }, 0.7, 'Safety Boots');

    // Signs
    post('sign1', -3.5, 2.8, -6.35, 0, 'ROTATING CHUCK', 'ENTANGLEMENT HAZARD', '#eab308', '#000000');
    post('sign2', 3.5, 2.8, -6.35, 0, 'PINCH POINTS', 'KEEP HANDS CLEAR', '#0284c7', '#ffffff');

    // Camera Rig & First Person Hands
    const rig = new THREE.Group();
    sc.add(rig);
    rig.add(cam);
    cam.position.set(0, 1.6, 4.2);
    cam.rotation.order = 'YXZ';

    const hand = new THREE.Group();
    const mkH = x => {
      const g = new THREE.Group();
      bx(g, 0.11, 0.05, 0.13, 0x334155, 0, 0, 0);
      cy(g, 0.06, 0.22, 0x1e293b, 0, 0, 0.17).rotation.x = PI / 2;
      g.position.set(x, -0.3, -0.6);
      return g;
    };
    const hR = mkH(0.32), hL = mkH(-0.34);
    hand.add(hR, hL);
    hand.visible = false;
    cam.add(hand);

    const heldPushStick = new THREE.Group();
    bx(heldPushStick, 0.03, 0.03, 0.45, 0xd97706);
    bx(heldPushStick, 0.05, 0.05, 0.1, 0xb45309, 0, 0.01, -0.2);
    heldPushStick.position.set(0, 0.02, -0.1);
    heldPushStick.visible = false;
    hR.add(heldPushStick);

    // Interaction Logic
    const P = id => {
      if (st.phase === 'em') {
        const E = st.em = st.em || { estop: 0, disc: 0, out: 0, t0: Date.now() };
        if (id === 'es') {
          E.estop = 1;
          st.running = 0;
          if (typeof tip === 'function') tip('🛑 EMERGENCY STOP SLAPPED: Spindle power killed instantly!');
          if (typeof beep === 'function') beep(900, 0.35);
        } else if (id === 'lk') {
          E.disc = 1;
          if (typeof tip === 'function') tip('Main disconnect opened & locked out.');
        }
        return hudM();
      }

      if (st.phase !== 'basic') return;
      const g = objs.find(o => o.userData.id === id);

      if (id === 'sign1' || id === 'sign2') {
        st.haz.add(id);
        if (typeof tip === 'function') tip(id === 'sign1' ? 'ROTATING PARTS: Entanglement risk — tie back hair, no loose clothing.' : 'PINCH POINTS: Crush risk — keep hands outside cutter zone.');
        if (typeof beep === 'function') beep(440, 0.15);
        return afterM();
      }

      if (['glasses', 'ear', 'boots'].includes(id)) {
        if (st.worn) return tip && tip('PPE already equipped.');
        st.pick.add(id);
        mark(g);
        if (typeof tip === 'function') tip(NM[id] + ' ready (' + st.pick.size + '/3).');
        if (typeof beep === 'function') beep(520, 0.1);
        return afterM();
      }

      if (!st.worn) {
        if (typeof mist === 'function') mist('ppe', '⚠️ Safety Violation', 'Machine controls operated without eye and ear protection.', 'Pick up glasses, ear defenders and boots, click Wear PPE, then proceed.');
        return;
      }

      if (id === 'gd') {
        st.gd = 1;
        mark(g);
        // Animate guard lowering down into position
        GuardG.position.y = 1.25;
        GuardG.position.z = 0.0;
        if (typeof tip === 'function') tip('🛡️ Interlock guard closed and latched over chuck.');
        if (typeof beep === 'function') beep(600, 0.15);
      } else if (id === 'es') {
        st.es = 1;
        mark(g);
        if (typeof tip === 'function') tip('🛑 E-Stop tested and verified functional. Twist-to-reset checked.');
        if (typeof beep === 'function') beep(640, 0.15);
      } else if (id === 'clr') {
        if (!st.es) {
          if (typeof mist === 'function') mist('seq', '⚠️ Unsafe Sequence', 'Cleared bed before testing Emergency Stop mechanism.', 'Test Emergency Stop trip function first.');
          return;
        }
        st.clr = 1;
        mark(g);
        if (typeof tip === 'function') tip('🧹 Bed and slideways swept clean of sharp turnings using bench brush.');
        if (typeof beep === 'function') beep(680, 0.15);
      } else if (id === 'go') {
        if (!st.gd) {
          if (typeof mist === 'function') mist('iso', '⚠️ Guard Interlock Open', 'Attempted to start machine with safety interlock guard open.', 'Close and latch the transparent chuck guard first.');
          return;
        }
        if (!st.clr) {
          if (typeof mist === 'function') mist('seq', '⚠️ Unsafe Work Area', 'Machine started with metal swarf accumulation.', 'Sweep chips clear with the brush first.');
          return;
        }
        st.go = 1;
        st.running = 1;
        mark(g);
        heldPushStick.visible = true;
        if (typeof tip === 'function') tip('⚡ Spindle active: 1250 RPM. Acoustic vibration nominal.');
        if (typeof beep === 'function') beep(740, 0.25);
      } else if (id === 'fd') {
        if (!st.go) {
          if (typeof tip === 'function') tip('Start the spindle first before advancing material.');
          return;
        }
        st.fd = 1;
        mark(g);
        if (typeof tip === 'function') tip('🪵 Material fed safely with push stick — hands kept 200mm clear of cutter.');
        if (typeof beep === 'function') beep(780, 0.2);
      } else if (id === 'sp') {
        if (!st.fd) {
          if (typeof tip === 'function') tip('Perform feed pass before completing cycle.');
          return;
        }
        st.running = 0;
        st.sp = 1;
        mark(g);
        heldPushStick.visible = false;
        if (typeof tip === 'function') tip('⏹️ Stop pressed: Spindle spun down to 0 RPM.');
        if (typeof beep === 'function') beep(600, 0.2);
      } else if (id === 'lk') {
        if (!st.sp) {
          if (typeof mist === 'function') mist('iso', '⚠️ Moving Parts Danger', 'Attempted to lock out equipment while spindle was still spinning.', 'Press STOP and wait for zero RPM before isolating power.');
          return;
        }
        st.lk = 1;
        mark(g);
        if (typeof tip === 'function') tip('🔒 LOTO Verified: Lockout hasp & danger padlock attached to main disconnect.');
        if (typeof beep === 'function') beep(820, 0.25);
      }

      afterM();
    };

    me.pick = P;

    me.wear = () => {
      if (st.worn) return tip && tip('You are already wearing your safety gear.');
      if (st.pick.size < 3) return tip && tip('Collect safety glasses, ear defenders, and boots from the bench first.');
      ['glasses', 'ear', 'boots'].forEach(q => {
        const o = objs.find(o => o.userData.id === q);
        if (o) { o.visible = false; if (o.userData.lab) o.userData.lab.visible = false; }
      });
      st.worn = 1;
      hand.visible = true;
      if (typeof tip === 'function') tip('🥽 PPE Equipped: Impact eye protection, hearing protection fitted.');
      if (typeof beep === 'function') beep(880, 0.2);
      afterM();
    };

    me.em = () => {
      const md = document.getElementById('md'); if (md) md.style.display = 'none';
      st.phase = 'em';
      st.em = { estop: 0, disc: 0, out: 0, t0: Date.now() };
      const emv = document.getElementById('emv'); if (emv) emv.classList.add('on');
      if (typeof tip === 'function') tip('🚨 MACHINE RUNAWAY! Spindle chatter and jam detected. Smash the E-Stop!');
      if (typeof beep === 'function') beep(900, 0.35);
      hudM();
    };

    // Pointer Events
    let yaw = 0, pit = 0, dn = null, hov = null;
    const rc = new THREE.Raycaster();
    const nd = e => {
      const r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1];
    };
    const ray = (x, y) => {
      rc.setFromCamera({ x, y }, cam);
      const h = rc.intersectObjects(objs, true).filter(h => h.distance < 16)[0];
      if (!h) return null;
      let o = h.object;
      while (o && !(o.userData && o.userData.id)) o = o.parent;
      return o;
    };

    cv.onpointerdown = e => {
      dn = { x: e.clientX, y: e.clientY, m: 0 };
      cv.setPointerCapture(e.pointerId);
    };

    cv.onpointermove = e => {
      if (dn) {
        const dx = e.clientX - dn.x, dy = e.clientY - dn.y;
        dn.m += Math.abs(dx) + Math.abs(dy);
        yaw -= dx * 0.005;
        pit = Math.max(-1.1, Math.min(1.1, pit - dy * 0.005));
        dn.x = e.clientX; dn.y = e.clientY;
        return;
      }
      const o = ray(...nd(e)), n = document.getElementById('tt');
      if (o !== hov) {
        if (hov) hl(hov, 0);
        hov = o;
        if (o) hl(o, 1);
      }
      cv.style.cursor = o ? 'pointer' : 'grab';
      if (o && n) {
        const r = cv.getBoundingClientRect();
        n.style.display = 'block';
        n.textContent = '👆 ' + (NM[o.userData.id] || o.userData.id);
        n.style.left = e.clientX - r.left + 14 + 'px';
        n.style.top = e.clientY - r.top + 14 + 'px';
      } else if (n) n.style.display = 'none';
    };

    cv.onpointerup = e => {
      if (dn && dn.m < 8) {
        const o = ray(...nd(e));
        if (o) P(o.userData.id);
      }
      dn = null;
    };

    // Responsive Canvas
    const rs = () => {
      if (!sw.clientWidth) return;
      R.setSize(sw.clientWidth, sw.clientHeight, false);
      cam.aspect = sw.clientWidth / sw.clientHeight;
      cam.updateProjectionMatrix();
    };
    rs();
    window.onresize = () => { if (me.run) rs(); };

    // Animation Loop (with chuck rotation when running)
    let fl = 0;
    const loop = () => {
      if (!me.run) { R.setAnimationLoop(null); return; }
      fl++;
      const kk = window.K || {};
      const f = (kk.w || kk.arrowup ? 1 : 0) - (kk.s || kk.arrowdown ? 1 : 0);
      const r = (kk.d || kk.arrowright ? 1 : 0) - (kk.a || kk.arrowleft ? 1 : 0);
      const sp = 0.08;

      cam.position.x = Math.max(-7, Math.min(7, cam.position.x + (-Math.sin(yaw) * f + Math.cos(yaw) * r) * sp));
      cam.position.z = Math.max(-6, Math.min(6, cam.position.z + (-Math.cos(yaw) * f - Math.sin(yaw) * r) * sp));
      cam.rotation.set(pit, yaw, 0);

      const s = (typeof st !== 'undefined' && st ? st : window.st);
      // Rotate spindle chuck when running
      if (s && s.running) {
        ChuckGroup.rotation.x += 0.35;
        if (fl % 25 === 0 && typeof beep === 'function') beep(140 + rnd() * 20, 0.04);
      }

      // Emergency evacuation check
      if (s && s.phase === 'em') {
        const E = s.em;
        if (E && E.estop && cam.position.x > 5 && cam.position.z > 5) {
          E.out = 1;
          const emv = document.getElementById('emv'); if (emv) emv.classList.remove('on');
          st.phase = 'x';
          if (typeof tip === 'function') tip('✅ E-Stop emergency evacuation verified!');
          if (typeof finish === 'function') finish();
          return;
        }
      }

      R.render(sc, cam);
    };

    R.setAnimationLoop(loop);
    if (typeof mkCoach === 'function') {
      mkCoach({
        steps: MSTEPS,
        tips: MTIPS,
        prog: mprog,
        alive: () => me.run,
        name: 'machine',
        kb: [
          [/ppe|glass|eye|ear|boot|wear/i, 'Eye protection against high-speed metal swarf and hearing defenders are mandatory around heavy machining lathes.'],
          [/guard|interlock|chuck|shield/i, 'Never run rotating machinery without the polycarbonate safety guard locked firmly in place.'],
          [/estop|emergency\s*stop|trip|test/i, 'Always perform a pre-operational slap test on the palm E-Stop to verify the safety circuit works before turning on the spindle.'],
          [/brush|swarf|clean|chips|sweep/i, 'Razor-sharp swarf turnings cause severe lacerations. Never use bare hands; always sweep chips with the workshop bench brush.'],
          [/feed|push\s*stick|workpiece|stock/i, 'Keep fingers away from rotating pinch points. Always use a wooden push stick when feeding material near cutters.'],
          [/lock|loto|padlock|power|disconnect/i, 'Before cleaning, servicing or leaving machinery, isolate the main breaker and apply your personal danger padlock.']
        ],
        why: {
          ppe: 'Safety glasses and hearing protection are required near metalworking equipment.',
          iso: 'Never bypass safety interlock guards or service machinery while the spindle is spinning.',
          seq: 'Pre-flight E-Stop tests and chip clearing must happen before production starts.',
          tool: 'Use the push stick to feed stock and the bench brush for swarf—never bare hands.'
        },
        em: 'Machine runaway or jam! Slap the red palm E-Stop immediately, turn off the disconnect, and evacuate.'
      });
    }
    hudM();
    if (typeof tip === 'function') tip('Welcome to Machine Operation. Read the warning signs on the wall.');
  };

  console.log("[SkillSafe VR] 3D Workshops Extension (Construction Safety & Machine Operation) loaded.");
})();
