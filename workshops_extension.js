// =========================================================================
// ⚡ SKILLSAFE VR: ADVANCED 3D VOCATIONAL WORKSHOPS EXTENSION (v7.0)
// Modules:
// 1. 🏗️ Construction Safety (Work at Height, Scaffolding, Drop Zone, Fall Arrest Lifeline)
// 2. ⚙️ Machine Operation (Heavy Lathe / CNC Safety, Guards, E-Stop, Push Stick, LOTO)
// Full 3D interactive Three.js workshops with procedural physics, audio feedback,
// step-by-step HUD, situational guidance, AI coach, and verified skill assessment.
// =========================================================================

(function() {
  window.V = window.V || {};
  window.I = window.I || {};

  // =========================================================================
  // 🔊 PROCEDURAL AUDIO SYNTHESIZER (ZERO-LATENCY WEB AUDIO API ENGINE)
  // =========================================================================
  const AudioFX = (function() {
    let ctx = null;
    const getCtx = () => {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    };

    if (typeof window !== 'undefined') {
      const unlock = () => {
        getCtx();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock);
      window.addEventListener('keydown', unlock);
    }

    return {
      // Footsteps with surface acoustics
      step: function(surface) {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        if (surface === 'wood') {
          // Hollow timber scaffold deck resonance
          const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
          o.type = 'triangle';
          o.frequency.setValueAtTime(140 + Math.random() * 25, t);
          o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
          f.type = 'bandpass'; f.frequency.value = 320; f.Q.value = 2.0;
          g.gain.setValueAtTime(0.18, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(f); f.connect(g); g.connect(ac.destination);
          o.start(t); o.stop(t + 0.13);
        } else if (surface === 'rung') {
          // Tubular steel ladder rung metallic ping
          const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
          o1.type = 'sine'; o1.frequency.setValueAtTime(820, t);
          o1.frequency.exponentialRampToValueAtTime(740, t + 0.15);
          o2.type = 'square'; o2.frequency.setValueAtTime(1640, t);
          o2.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          o1.connect(g); o2.connect(g); g.connect(ac.destination);
          o1.start(t); o2.start(t); o1.stop(t + 0.19); o2.stop(t + 0.19);
        } else {
          // Concrete floor thump
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(90, t);
          o.frequency.exponentialRampToValueAtTime(35, t + 0.09);
          g.gain.setValueAtTime(0.14, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          o.connect(g); g.connect(ac.destination);
          o.start(t); o.stop(t + 0.11);
        }
      },

      // Mechanical ratchet torque wrench clicks
      ratchet: function(isFinal) {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        if (isFinal) {
          // Calibrated torque wrench break-away "CRACK-CLICK"
          const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
          o1.type = 'sawtooth'; o1.frequency.setValueAtTime(260, t);
          o1.frequency.exponentialRampToValueAtTime(90, t + 0.14);
          o2.type = 'square'; o2.frequency.setValueAtTime(1850, t);
          o2.frequency.exponentialRampToValueAtTime(600, t + 0.08);
          g.gain.setValueAtTime(0.28, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          o1.connect(g); o2.connect(g); g.connect(ac.destination);
          o1.start(t); o2.start(t); o1.stop(t + 0.17); o2.stop(t + 0.17);
        } else {
          // High-tensile pawl tooth click
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'square'; o.frequency.setValueAtTime(1400 + Math.random() * 200, t);
          o.frequency.exponentialRampToValueAtTime(450, t + 0.04);
          g.gain.setValueAtTime(0.12, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          o.connect(g); g.connect(ac.destination);
          o.start(t); o.stop(t + 0.06);
        }
      },

      // Interlock door latch snap
      latch: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(950, t);
        o.frequency.exponentialRampToValueAtTime(220, t + 0.07);
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + 0.09);
      },

      // Heavy E-Stop mushroom slap
      estop: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o1 = ac.createOscillator(), g1 = ac.createGain();
        o1.type = 'sine'; o1.frequency.setValueAtTime(65, t);
        o1.frequency.exponentialRampToValueAtTime(25, t + 0.2);
        g1.gain.setValueAtTime(0.35, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        o1.connect(g1); g1.connect(ac.destination);
        o1.start(t); o1.stop(t + 0.23);

        const o2 = ac.createOscillator(), g2 = ac.createGain();
        o2.type = 'sawtooth'; o2.frequency.setValueAtTime(1150, t);
        o2.frequency.exponentialRampToValueAtTime(320, t + 0.1);
        g2.gain.setValueAtTime(0.25, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        o2.connect(g2); g2.connect(ac.destination);
        o2.start(t); o2.stop(t + 0.13);
      },

      // Spindle dynamic injection brake screech
      dynamicBrake: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(480, t);
        o.frequency.exponentialRampToValueAtTime(50, t + 0.28);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + 0.32);
      },

      // Bench brush bristle sweep
      brushSweep: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const bSize = Math.floor(ac.sampleRate * 0.18);
        const buf = ac.createBuffer(1, bSize, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bSize; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * (i / bSize));
        const src = ac.createBufferSource(); src.buffer = buf;
        const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = 1.2;
        const g = ac.createGain(); g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        src.connect(f); f.connect(g); g.connect(ac.destination);
        src.start(t);
      },

      // Dropped metal spanner impact & floor bounce
      toolCrash: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        [0, 0.08, 0.16].forEach((dt, idx) => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime((850 - idx * 160) + Math.random() * 80, t + dt);
          o.frequency.exponentialRampToValueAtTime(300, t + dt + 0.1);
          g.gain.setValueAtTime(0.28 / (idx + 1), t + dt);
          g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.12);
          o.connect(g); g.connect(ac.destination);
          o.start(t + dt); o.stop(t + dt + 0.13);
        });
      },

      // Dual-tone industrial air horn blast
      airHorn: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        [440, 554].forEach(freq => {
          const o = ac.createOscillator(), g = ac.createGain();
          o.type = 'sawtooth'; o.frequency.value = freq;
          g.gain.setValueAtTime(0.0, t);
          g.gain.linearRampToValueAtTime(0.22, t + 0.04);
          g.gain.setValueAtTime(0.22, t + 0.45);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
          o.connect(g); g.connect(ac.destination);
          o.start(t); o.stop(t + 0.68);
        });
      },

      // Metal grinding sparks / swarf cutting
      sparkSpray: function(duration) {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const dur = duration || 0.25;
        const bSize = Math.floor(ac.sampleRate * dur);
        const buf = ac.createBuffer(1, bSize, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bSize; i++) data[i] = (Math.random() * 2 - 1) * 0.7;
        const src = ac.createBufferSource(); src.buffer = buf;
        const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2800;
        const g = ac.createGain(); g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        src.connect(f); f.connect(g); g.connect(ac.destination);
        src.start(t);
      },

      // Brass padlock snap
      padlock: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(1400, t);
        o.frequency.exponentialRampToValueAtTime(260, t + 0.06);
        g.gain.setValueAtTime(0.24, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + 0.09);
      },

      // Scafftag paper / vinyl inspection card rustle
      tagRustle: function() {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(620, t);
        o.frequency.exponentialRampToValueAtTime(180, t + 0.08);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + 0.1);
      },

      // Clean procedural tone
      tone: function(f, d) {
        const ac = getCtx(); if (!ac) return;
        const t = ac.currentTime;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f || 440;
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + (d || 0.15));
        o.connect(g); g.connect(ac.destination);
        o.start(t); o.stop(t + (d || 0.15) + 0.02);
      }
    };
  })();
  window.AudioFX = AudioFX;
  window.beep = (f, d) => AudioFX.tone(f, d);

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
      title: 'Climb & Anchor Lifeline (100% Tie-Off)',
      action: "Click the ladder or overhead lifeline D-ring on the scaffold platform to climb and hook on.",
      voice: "Climb the ladder facing the rungs with hands free. On the working platform, connect your harness lanyard to the overhead static cable anchor.",
      getSituation: () => st.anc ? "100% Tie-off secured: shock-absorbing lanyard clipped to overhead lifeline!" : "Never work at height unanchored. Connect to the overhead lifeline anchor trolley."
    },
    {
      title: 'Structural Beam Fixing at Height',
      action: "Click the beam fixing bracket (or press E) to torque the structural bolts to 180 Nm.",
      voice: "Use the torque wrench to secure the structural beam joint. Tighten all high-tensile bolts to 180 Newton meters while maintaining tethered tools.",
      getSituation: () => st.fix ? "Structural joint torqued to 180 Nm and witnessed with torque stripe!" : "Align and torque the high-tensile bolts to structural specification."
    },
    {
      title: 'Safe Descent & Site Clearance',
      action: "Click the ladder or tool pouch to unclip, descend facing the rungs, and clear the site.",
      voice: "Tether all hand tools in your pouch, unclip from the lifeline, and descend the ladder facing the rungs.",
      getSituation: () => st.dsc ? "Descent completed safely! Site secured." : "Maintain 3 points of contact when descending the access ladder."
    }
  ];

  window.CON_GUIDE = CON_GUIDE;

  // -----------------------------------------------------------------------
  // MACHINE OPERATION CONFIGURATION & DATA
  // -----------------------------------------------------------------------
  const MSTEPS = [
    'Read rotating parts & pinch hazard signs',
    'Pick up PPE (safety glasses, ear defenders, steel-toe boots)',
    'Wear PPE (eye protection & ear defenders)',
    'Close & latch interlocked chuck safety guard',
    'Perform E-Stop pre-flight slap test',
    'Clear bed & slideways of swarf using bench brush',
    'Start machine spindle (1250 RPM)',
    'Feed stock safely using wooden push stick',
    'Stop spindle & verify zero rotation',
    'Apply Lockout/Tagout (LOTO) padlock to disconnect'
  ];

  const MTIPS = [
    'Click the ROTATING CHUCK / PINCH POINTS signs on the wall.',
    'Pick up safety glasses, ear defenders, and boots from the bench, then click Wear PPE.',
    'Click the [🦺 Wear PPE] button in the bottom dock.',
    'Click the transparent polycarbonate chuck guard to swing it down and latch it shut.',
    'Click the red mushroom Emergency Stop button on the front console to test trip function.',
    'Click the bench brush & chip tray to sweep sharp metal turnings off the lathe shears.',
    'Click the green START push-button on the control console.',
    'Click the push stick tool (or press E) to feed workpiece stock into the cutter.',
    'Click the red STOP button on the control console.',
    'Click the main electrical disconnect switch box on the back wall to apply your LOTO padlock.'
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
      ['boots', '🥾 Steel-Toe Boots']
    ].map(a => `<span class="${s.worn ? 'on' : (s.pick && s.pick.has(a[0]) ? 'pk' : '')}">${a[1]}${s.worn ? ' ✓' : (s.pick && s.pick.has(a[0]) ? ' · ready' : '')}</span>`).join('') + '</div>';
  };

  window.mppe = mppe;

  const MAC_GUIDE = [
    {
      title: 'Rotating Machinery Hazards',
      action: "Click the yellow 'ROTATING CHUCK' or blue 'PINCH POINTS' signs on the wall.",
      voice: "Welcome to the heavy machine shop. Rotating chucks and pinch points cause catastrophic entanglement. Click the warning signs to acknowledge machine hazards.",
      getSituation: () => "Never wear loose clothing, gloves, ties, or jewelry around spinning machine spindles (OSHA 1910.212)."
    },
    {
      title: 'Select Machine PPE',
      action: "Click the Safety Glasses, Ear Defenders, and Steel-Toe Boots on the workbench.",
      voice: () => st.pick.size === 0
        ? "Turn to the bench. Collect impact safety glasses, industrial ear defenders, and safety footwear."
        : (st.pick.size < 3 ? `Picked up ${st.pick.size} of 3 items. Collect remaining gear.` : "All PPE collected! Click Wear P P E in the dock."),
      getSituation: () => `Collected ${st.pick ? st.pick.size : 0} of 3 items. Never operate machinery without eye and hearing protection.`
    },
    {
      title: 'Wear Eye & Hearing Protection',
      action: "Click the blue [🦺 Wear PPE] button in the bottom dock.",
      voice: "Click Wear P P E. Secure impact glasses to shield against high-speed flying chips, and seat your hearing protection.",
      getSituation: () => st.worn ? "Machine operator PPE fitted and verified!" : "High-speed metal chips travel at over 100 km/h: eye protection is non-negotiable."
    },
    {
      title: 'Close & Latch Interlock Guard',
      action: "Click the transparent polycarbonate safety guard over the lathe chuck.",
      voice: "The interlock guard prevents entanglement and deflects flying swarf. Click the curved guard to swing it closed over the chuck.",
      getSituation: () => st.gd ? "Interlock guard latched shut: limit switch closed (Circuit OK)." : "The spindle motor interlock is OPEN. Machine will not start until guard is closed."
    },
    {
      title: 'Emergency Stop Pre-Flight Slap Test',
      action: "Click the red mushroom E-Stop button on the control console.",
      voice: "Always verify safety shutdown circuits before powering equipment. Slap the red mushroom E-Stop button to test instantaneous trip.",
      getSituation: () => st.es ? "Emergency Stop trip tested and verified functional!" : "A failed E-stop switch during a jam is fatal. Slap test the button before starting."
    },
    {
      title: 'Clear Bed & Swarf with Bench Brush',
      action: "Click the bench brush & chip tray to sweep sharp turnings off the shears.",
      voice: "Never use bare hands to clear razor-sharp metal turnings. Take the bench brush and sweep chips clear into the chip pan.",
      getSituation: () => st.clr ? "Slideways and bed swept clean of swarf accumulation." : "Accumulated chips cause cutter jams and severe hand lacerations. Sweep the bed."
    },
    {
      title: 'Start Spindle (1250 RPM)',
      action: "Click the green START push-button on the control console.",
      voice: "With the guard latched and bed clear, press the green START button to spin up the spindle to 1250 RPM.",
      getSituation: () => st.go ? "Spindle running at 1250 RPM: rotational acoustics stable." : "Interlock closed. Press green START to energize the spindle drive."
    },
    {
      title: 'Feed Workpiece Stock with Push Stick',
      action: "Click the wooden push stick (or press E) to advance material safely into the cutter.",
      voice: "Keep your hands at least 200 millimeters away from spinning cutters. Use the notched wooden push stick to feed stock.",
      getSituation: () => st.fd ? "Stock fed safely with push stick — hands kept outside the danger zone." : "Use the push stick to advance material. Never feed stock by hand near spinning tools."
    },
    {
      title: 'Stop Spindle & Verify Zero Motion',
      action: "Click the red STOP button on the control console.",
      voice: "Cycle complete. Press the red STOP button and wait for the spindle chuck to come to a complete dead stop.",
      getSituation: () => st.sp ? "Spindle decelerated to 0 RPM: rotational hazard eliminated." : "Press STOP and verify zero motion before opening guards."
    },
    {
      title: 'Apply Lockout / Tagout (LOTO)',
      action: "Click the main electrical disconnect switch box on the back wall.",
      voice: "Isolate the power supply. Throw the disconnect handle down and attach your red LOTO danger padlock and hasp.",
      getSituation: () => st.lk ? "Main power isolated: LOTO padlock and danger tag secured (OSHA 1910.147)." : "Equipment must be isolated and locked out before leaving the machine bay."
    }
  ];

  window.MAC_GUIDE = MAC_GUIDE;

  // -----------------------------------------------------------------------
  // SAFE-BOT AI VOICE & CHAT COACH (`mkCoach`)
  // -----------------------------------------------------------------------
  function mkCoach(opt) {
    const chat = document.getElementById('chat');
    if (!chat) return { say: () => {} };
    let msgs = chat.querySelector('.msgs');
    if (!msgs) {
      chat.innerHTML = `
        <div class="ch">
          <span>🤖 SafeBot AI Safety Coach</span>
          <div style="display:flex;gap:4px">
            <button class="b o" style="padding:2px 8px;font-size:11px" onclick="document.getElementById('chat').classList.toggle('min')">_</button>
          </div>
        </div>
        <div class="msgs"></div>
        <div class="ci">
          <input type="text" placeholder="Ask SafeBot about OSHA safety rules..." onkeydown="if(event.key==='Enter')window.askCoach&&window.askCoach(this.value)">
          <button class="b" onclick="const i=this.previousElementSibling;window.askCoach&&window.askCoach(i.value)">Ask</button>
        </div>
      `;
      msgs = chat.querySelector('.msgs');
    }

    const postMsg = (txt, isUser) => {
      if (!msgs) return;
      const m = document.createElement('div');
      m.className = isUser ? 'cm u' : 'cm b';
      m.textContent = txt;
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
    };

    window.askCoach = q => {
      if (!q || !q.trim()) return;
      postMsg(q, true);
      const inp = chat.querySelector('.ci input');
      if (inp) inp.value = '';

      let answer = null;
      for (const item of opt.kb) {
        if (item[0].test(q)) {
          answer = item[1];
          break;
        }
      }
      if (!answer) {
        const p = opt.prog();
        const cur = p.indexOf(false);
        answer = cur >= 0
          ? `Right now, focus on Step ${cur + 1}: ${opt.steps[cur]}. ${opt.tips[cur]}`
          : "All standard procedures are verified! Maintain site vigilance and zero complacency.";
      }
      setTimeout(() => {
        postMsg(answer, false);
        if (typeof say === 'function') say(answer);
      }, 350);
    };

    const say = (t, f) => {
      postMsg(t, false);
      if (typeof window.say === 'function') window.say(t, f);
    };

    return { say };
  }

  window.mkCoach = mkCoach;

  // -----------------------------------------------------------------------
  // HUD BUILDERS WITH INTERACTIVE REAL-WORLD SIMULATION ACTIONS
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

    // Interactive 3D World Simulation Actions Toolbar
    h += `
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="sim.inspectScafftag&&sim.inspectScafftag()" title="Pull out Scafftag card">📋 Scafftag Card</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="sim.toggleClimb&&sim.toggleClimb()" title="Climb or descend ladder">🪜 Climb / Descend</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="window.conFixNow&&window.conFixNow()" title="Torque bolts at height">🔩 Torque Bolts (E)</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px;background:#451a1a;border-color:#ef4444" onclick="sim.dropTest&&sim.dropTest()" title="Simulate falling tool gravity impact">🔨 Test Dropped Tool (T)</button>
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

    // Interactive 3D World Simulation Actions Toolbar
    h += `
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="sim.toggleGuard&&sim.toggleGuard()" title="Open/close interlock guard">🛡️ Safety Guard (G)</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="sim.sweepBed&&sim.sweepBed()" title="Sweep metal turnings with brush">🧹 Sweep Swarf</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px" onclick="window.macFeedNow&&window.macFeedNow()" title="Feed stock with push stick">🪵 Push Stick (E)</button>
        <button class="b bw" style="font-size:11px;padding:5px 9px;background:#451a1a;border-color:#ef4444" onclick="sim.slapEstop&&sim.slapEstop()" title="Palm slap mushroom button">🛑 Slap E-Stop</button>
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
        <p class="m">Controls: drag to look · W A S D to move · click objects · E = torque tool · T = test dropped tool · 💡 Hint shows next step · 🧰 Objects lists equipment.</p>
        <button class="b" onclick="startCon()" style="font-size:15px;padding:12px 24px">🏗️ Enter Construction Site</button>
      </div>
    </div>
  `;

  V.briefM = () => `
    <div class="w" style="max-width:760px">
      <h1>⚙️ Machine Operation — Introduction</h1>
      <div class="c">
        <h3>Task</h3>
        <p><b>Inspect heavy metalworking lathe, close and latch interlock guard, test palm Emergency Stop, clear metal swarf using bench brush, start spindle, feed material using push stick, and apply Lockout/Tagout (LOTO).</b></p>
        <h3>Safety instructions</h3>
        <ul>
          <li>Simulated educational environment — complies with OSHA 1910.212 &amp; 1910.147.</li>
          <li>Never wear loose clothing, gloves, ties, or neck chains near rotating spindles.</li>
          <li>Never operate without the polycarbonate interlock guard latched shut.</li>
          <li>Always test the Emergency Stop button before starting any machining operation.</li>
          <li>Always apply your personal padlock and danger tag before servicing or leaving equipment.</li>
        </ul>
        <h3>Required sequence</h3>
        <ol>${MSTEPS.map(s => `<li>${s}</li>`).join('')}</ol>
        <p class="m">Controls: drag to look · W A S D to move · click objects · E = feed push stick · G = toggle guard · 💡 Hint shows next step · 🧰 Objects lists equipment.</p>
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
      AudioFX.tone(660, 0.25);
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
      AudioFX.tone(660, 0.25);
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
    sc.fog = new THREE.Fog(0x1a2634, 18, 48);

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
      g.fillStyle = 'rgba(8,14,22,0.92)';
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
      if (!g) return;
      g.userData.sel = 1;
      g.traverse(c => { if (c.material && c.material.emissive) c.material.emissive.setHex(0x1a7f3c); });
    };

    const hl = (g, on) => {
      if (!g) return;
      g.traverse(c => {
        if (c.material && c.material.emissive) c.material.emissive.setHex(on ? 0x665500 : (g.userData.sel ? 0x1a7f3c : 0));
      });
    };

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

    // Emergency Flashing Amber Strobes on scaffolding tower top
    const strobeL1 = new THREE.PointLight(0xf59e0b, 0, 15);
    strobeL1.position.set(-1.6, 5.5, -2.3);
    sc.add(strobeL1);
    const strobeL2 = new THREE.PointLight(0xf59e0b, 0, 15);
    strobeL2.position.set(1.6, 5.5, -2.3);
    sc.add(strobeL2);

    // Strobe Beacon mesh caps
    const beaconMesh1 = cy(sc, 0.08, 0.16, 0xf59e0b, -1.6, 5.45, -2.3);
    const beaconMesh2 = cy(sc, 0.08, 0.16, 0xf59e0b, 1.6, 5.45, -2.3);

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
      cy(Scaf, 0.05, 5.4, 0x94a3b8, p[0], 2.7, p[1]);
      bx(Scaf, 0.3, 0.04, 0.3, 0x334155, p[0], 0.02, p[1]);
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
    const tagCard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.01), M(0xffffff));
    tagCard.position.set(0, 0, 0.025);
    const insG = ob('ins', ladX, 1.1, -2.1, g => {
      bx(g, 0.18, 0.3, 0.04, 0x15803d); // Green tag holder
      g.add(tagCard);
      cy(g, 0.015, 0.08, 0x0f172a, 0, 0.14, 0.02);
    }, 0.6, 'Scafftag');

    // 2. Drop Zone Barricade System (Cones & Dynamic Caution Tape)
    const tapeMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.12), new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide
    }));
    tapeMesh.position.set(0, 0.72, -1.5);
    tapeMesh.visible = false;
    sc.add(tapeMesh);

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

    // 3. Overhead Lifeline Static Steel Cable & Sliding Trolley
    const trolleyGroup = new THREE.Group();
    trolleyGroup.position.set(0, 4.9, -3.5);
    sc.add(trolleyGroup);
    // Overhead steel cable
    const staticCable = cy(sc, 0.012, 4.2, 0xd4d4d8, 0, 4.9, -3.5);
    staticCable.rotation.z = PI / 2;
    // Trolley carriage
    bx(trolleyGroup, 0.15, 0.12, 0.15, 0xf59e0b, 0, -0.05, 0);
    add(trolleyGroup, new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 20), M(0xffffff, { metalness: 0.8 })), 0, -0.18, 0);
    // Shock absorber energy pack
    const shockPack = bx(trolleyGroup, 0.08, 0.2, 0.05, 0xdc2626, 0, -0.32, 0);

    // Interactive Anchor Target
    const ancG = ob('anc', 0, 4.9, -3.5, g => {
      // Invisible anchor hitbox
    }, 0.8, 'Lifeline Anchor');

    // Dynamic 3D Physical Safety Lanyard Rope connecting Trolley to Worker
    const lanyardGeom = new THREE.BufferGeometry();
    const lanyardPts = new Float32Array(16 * 3);
    lanyardGeom.setAttribute('position', new THREE.BufferAttribute(lanyardPts, 3));
    const lanyardLine = new THREE.Line(lanyardGeom, new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 }));
    lanyardLine.visible = false;
    sc.add(lanyardLine);

    // 4. Structural Fixing Joint at Height (`fix`) with animated hex bolts & torque dial
    const hexBolts = [];
    const fixG = ob('fix', 0.8, 3.9, -3.5, g => {
      // Steel I-beam connector plate
      bx(g, 0.5, 0.35, 0.12, 0x475569, 0, 0, 0);
      // 4 High-strength hexagonal structural bolts
      [[-0.15, -0.08], [0.15, -0.08], [-0.15, 0.08], [0.15, 0.08]].forEach(bp => {
        const hb = cy(g, 0.035, 0.08, 0xfacc15, bp[0], bp[1], 0.07, 0.035);
        hb.rotation.x = PI / 2;
        hexBolts.push(hb);
      });
      bx(g, 0.1, 0.35, 0.3, 0x334155, 0, 0, -0.15);
    }, 0.9, 'Beam Fixing');

    // Floating 3D Torque Readout Gauge Sprite
    const torqueCanvas = document.createElement('canvas'); torqueCanvas.width = 384; torqueCanvas.height = 128;
    const torqueCtx = torqueCanvas.getContext('2d');
    const updateTorqueGauge = (nm, ok) => {
      torqueCtx.fillStyle = 'rgba(15,23,42,0.95)'; torqueCtx.fillRect(0, 0, 384, 128);
      torqueCtx.strokeStyle = ok ? '#22c55e' : '#f59e0b'; torqueCtx.lineWidth = 6; torqueCtx.strokeRect(4, 4, 376, 120);
      torqueCtx.fillStyle = '#fff'; torqueCtx.font = 'bold 22px sans-serif'; torqueCtx.textAlign = 'center';
      torqueCtx.fillText('TORQUE WRENCH CALIBRATION', 192, 34);
      torqueCtx.fillStyle = ok ? '#22c55e' : '#facc15'; torqueCtx.font = 'bold 44px monospace';
      torqueCtx.fillText(`${nm} Nm`, 192, 85);
      if (ok) {
        torqueCtx.fillStyle = '#22c55e'; torqueCtx.font = 'bold 16px sans-serif';
        torqueCtx.fillText('✓ WITNESSED (OSHA 1926.756)', 192, 114);
      }
    };
    updateTorqueGauge(0, false);
    const torqueTex = new THREE.CanvasTexture(torqueCanvas);
    const torqueSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: torqueTex, transparent: true }));
    torqueSprite.position.set(0.8, 4.45, -3.5);
    torqueSprite.scale.set(0.7, 0.24, 1);
    torqueSprite.visible = false;
    sc.add(torqueSprite);

    // Friction Spark Particles for bolt torquing
    const sparkCount = 35;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = [];
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = 0.8; sparkPos[i * 3 + 1] = 3.9; sparkPos[i * 3 + 2] = -3.4;
      sparkVel.push({ x: 0, y: 0, z: 0, life: 0 });
    }
    const sparkGeom = new THREE.BufferGeometry();
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkPoints = new THREE.Points(sparkGeom, new THREE.PointsMaterial({
      color: 0xffb703,
      size: 0.05,
      transparent: true,
      blending: THREE.AdditiveBlending
    }));
    sparkPoints.visible = false;
    sc.add(sparkPoints);

    // 5. Ladder Descent & Tool Pouch (`dsc`)
    ob('dsc', ladX, 3.4, -2.1, g => {
      bx(g, 0.28, 0.3, 0.18, 0x854d0e);
      cy(g, 0.02, 0.35, 0x9ca3af, 0.1, 0.05, 0.1);
      bx(g, 0.05, 0.12, 0.05, 0x22c55e, -0.08, 0.08, 0.05);
    }, 0.8, 'Tool Pouch');

    // 6. Dropped Tool Gravity Physics Simulation Object (`dropTool`)
    const droppedWrench = new THREE.Group();
    cy(droppedWrench, 0.016, 0.38, 0x94a3b8, 0, 0, 0); // Steel handle
    bx(droppedWrench, 0.08, 0.08, 0.04, 0x475569, 0, 0.19, 0); // Adjustable jaw
    bx(droppedWrench, 0.08, 0.08, 0.04, 0x475569, 0, -0.19, 0);
    droppedWrench.position.set(0.5, 3.6, -2.2);
    droppedWrench.visible = false;
    sc.add(droppedWrench);

    let dropPhysics = { active: false, y: 3.6, vy: 0, rx: 0, rz: 0 };

    // Impact Dust Puff Particles
    const dustCount = 20;
    const dustPos = new Float32Array(dustCount * 3);
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustPoints = new THREE.Points(dustGeom, new THREE.PointsMaterial({
      color: 0x9ca3af,
      size: 0.12,
      transparent: true,
      opacity: 0.7
    }));
    dustPoints.visible = false;
    sc.add(dustPoints);

    // ---------- PPE BENCH
    bx(sc, 2.4, 0.08, 0.8, 0x5b4636, -3.5, 0.9, 2);
    [[-1.1, -0.3], [1.1, -0.3], [-1.1, 0.3], [1.1, 0.3]].forEach(p => {
      bx(sc, 0.07, 0.86, 0.07, 0x3b2a1a, -3.5 + p[0], 0.43, 2 + p[1]);
    });

    ob('helmet', -4.2, 1.15, 2, g => {
      add(g, new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 12, 0, 2 * PI, 0, PI * 0.6), M(0xfacc15, { roughness: 0.3 })), 0, 0, 0);
      bx(g, 0.34, 0.03, 0.06, 0xca8a04, 0, 0, 0.2);
      cy(g, 0.015, 0.24, 0x0f172a, 0, -0.1, 0.05);
    }, 0.6, 'Hard Hat');

    ob('vest', -3.5, 1.0, 2, g => {
      bx(g, 0.45, 0.04, 0.55, 0xf97316);
      bx(g, 0.06, 0.05, 0.55, 0xe2e8f0, -0.12, 0.005, 0);
      bx(g, 0.06, 0.05, 0.55, 0xe2e8f0, 0.12, 0.005, 0);
    }, 0.6, 'Hi-Vis Vest');

    ob('harness', -2.8, 1.02, 2, g => {
      bx(g, 0.42, 0.05, 0.5, 0x0284c7);
      bx(g, 0.06, 0.06, 0.5, 0xfacc15, 0, 0.005, 0);
      add(g, new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 16), M(0xffffff, { metalness: 0.8 })), 0, 0.04, -0.22);
      cy(g, 0.02, 0.45, 0xdc2626, 0.12, 0.02, 0.15).rotation.z = PI / 2;
    }, 0.7, 'Safety Harness');

    // Site Emergency Air Horn
    ob('horn', 6.5, 1.6, -7.8, g => {
      bx(g, 0.22, 0.32, 0.1, 0xdc2626);
      cy(g, 0.06, 0.2, 0xfacc15, 0, 0.18, 0.08, 0.02).rotation.x = PI / 2;
    }, 0.6, 'Emergency Horn');

    // Posters
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
    cy(heldTool, 0.016, 0.35, 0x1e293b, 0, 0, 0).rotation.x = PI / 2;
    bx(heldTool, 0.06, 0.05, 0.1, 0x94a3b8, 0, 0.02, -0.18);
    cy(heldTool, 0.035, 0.07, 0xd4d4d8, 0, 0.06, -0.18);
    heldTool.position.set(0, 0.02, -0.1);
    heldTool.visible = false;
    hR.add(heldTool);

    // Interactive Proximity Reticle UI Element
    let reticleEl = document.getElementById('sim-reticle');
    if (!reticleEl && sw) {
      reticleEl = document.createElement('div');
      reticleEl.id = 'sim-reticle';
      reticleEl.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:15;display:flex;align-items:center;justify-content:center;';
      reticleEl.innerHTML = `
        <div id="ret-ring" style="width:24px;height:24px;border:2px solid rgba(56,189,248,0.7);border-radius:50%;transition:transform 0.15s ease, border-color 0.15s ease;"></div>
        <div id="ret-dot" style="position:absolute;width:4px;height:4px;background:#38bdf8;border-radius:50%;"></div>
        <div id="ret-badge" style="position:absolute;top:30px;background:rgba(15,23,42,0.92);border:1px solid #38bdf8;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;color:#fff;white-space:nowrap;display:none;"></div>
      `;
      sw.appendChild(reticleEl);
    }

    // ---------------------------------------------------------------------
    // REAL 3D ANIMATION SYSTEMS: LADDER CLIMBING & BOLT TORQUING
    // ---------------------------------------------------------------------
    let climbAnimation = null;
    me.climbLadder = function(direction, cb) {
      if (climbAnimation) return;
      const t0 = performance.now();
      const startPos = cam.position.clone();
      const targetPos = direction > 0
        ? new THREE.Vector3(0, 3.4, -3.2) // Platform top
        : new THREE.Vector3(0, 1.6, 3.5);  // Ground level

      climbAnimation = {
        t0,
        dur: 2400,
        startPos,
        targetPos,
        direction,
        cb,
        stepsTaken: 0
      };
      if (typeof tip === 'function') {
        tip(direction > 0 ? '🪜 Ascending scaffolding ladder with 3 points of contact...' : '🪜 Descending ladder safely facing the rungs...');
      }
    };

    me.toggleClimb = function() {
      if (cam.position.y > 2.5) {
        me.climbLadder(-1, () => {
          st.dsc = 1;
          lanyardLine.visible = false;
          heldTool.visible = false;
          afterC();
        });
      } else {
        if (!st.worn) {
          if (typeof mist === 'function') mist('ppe', '⚠️ Safety Violation', 'Attempted to climb scaffold without full fall arrest harness.', 'Wear your PPE first.');
          return;
        }
        if (!st.bar) {
          if (typeof mist === 'function') mist('zone', '⚠️ Drop Zone Unprotected', 'Climbing scaffold before barricading ground drop zone.', 'Set up the drop zone barricade first.');
          return;
        }
        me.climbLadder(1, () => {
          st.anc = 1;
          lanyardLine.visible = true;
          heldTool.visible = true;
          mark(ancG);
          AudioFX.latch();
          afterC();
        });
      }
    };

    // Scafftag Interactive Inspection Modal
    me.inspectScafftag = function() {
      AudioFX.tagRustle();
      tagCard.position.y = -0.15; // Slide tag out
      st.ins = 1;
      mark(insG);

      const oldM = document.getElementById('scafftag-modal');
      if (oldM) oldM.remove();

      const modal = document.createElement('div');
      modal.id = 'scafftag-modal';
      modal.style.cssText = 'position:absolute;inset:0;background:rgba(8,15,25,0.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:35;padding:16px;';
      modal.innerHTML = `
        <div style="background:#0f172a;border:2px solid #22c55e;border-radius:12px;max-width:440px;width:100%;padding:20px;color:#fff;font-family:system-ui,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,0.8);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="background:#22c55e;color:#000;font-weight:900;font-size:14px;padding:4px 10px;border-radius:4px;">OSHA 1926.451</div>
            <h2 style="margin:0;font-size:18px;color:#22c55e;">SCAFFTAG GREEN PERMIT</h2>
          </div>
          <div style="background:#1e293b;border-radius:8px;padding:12px;font-size:13px;line-height:1.6;margin-bottom:16px;">
            <div><b>Structure:</b> Heavy Tubular Scaffolding Tower</div>
            <div><b>Duty Class:</b> Medium Duty (200 kg/m²) · <b>Max Load:</b> 450 kg</div>
            <div><b>Sole Boards &amp; Base Jacks:</b> Level &amp; Bedded ✓</div>
            <div><b>Guardrails (1.05m) &amp; Toe Boards:</b> Secured ✓</div>
            <div><b>Bracing &amp; Ties:</b> Rigged and Clamped ✓</div>
            <div><b>Inspected By:</b> Competent Person #8492 · Valid 7 Days</div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button class="b" style="padding:10px 20px;font-weight:700" onclick="document.getElementById('scafftag-modal').remove()">✓ Sign Off &amp; Close</button>
          </div>
        </div>
      `;
      sw.appendChild(modal);
      if (typeof tip === 'function') tip('✅ Scafftag verified: Scaffold structure green-tagged and approved for work.');
      afterC();
    };

    // Structural Bolt Torquing Animation
    let torqueAnimation = null;
    me.torqueBolts = function() {
      if (!st.anc) {
        if (typeof mist === 'function') mist('seq', '⚠️ Fall Hazard Violation', 'Performing work at height without being anchored to the lifeline.', 'Anchor your safety harness to the overhead cable first.');
        return;
      }
      if (torqueAnimation) return;

      torqueSprite.visible = true;
      sparkPoints.visible = true;
      torqueAnimation = {
        stage: 0,
        t0: performance.now(),
        nm: 0
      };

      const strokeSequence = [
        { nm: 65, dur: 450, sound: () => AudioFX.ratchet(false) },
        { nm: 130, dur: 450, sound: () => AudioFX.ratchet(false) },
        { nm: 180, dur: 550, sound: () => { AudioFX.ratchet(true); AudioFX.sparkSpray(0.3); } }
      ];

      let step = 0;
      const doStep = () => {
        if (step >= strokeSequence.length) {
          torqueAnimation = null;
          st.fix = 1;
          mark(fixG);
          updateTorqueGauge(180, true);
          torqueTex.needsUpdate = true;
          // Turn hex bolts and give blue witness mark
          hexBolts.forEach(hb => {
            hb.material = M(0x38bdf8, { metalness: 0.9, roughness: 0.2 });
            hb.position.z = 0.05; // Screwed in tight
          });
          if (typeof tip === 'function') tip('🔩 Torqued to 180 Nm! Calibrated witness stripe applied (OSHA 1926.756).');
          afterC();
          return;
        }

        const s = strokeSequence[step];
        s.sound();
        updateTorqueGauge(s.nm, step === 2);
        torqueTex.needsUpdate = true;

        // Animate held wrench lever pump
        hR.position.z = -0.5;
        hR.rotation.z = 0.25;
        setTimeout(() => {
          hR.position.z = -0.6;
          hR.rotation.z = 0;
        }, 220);

        // Spawn friction sparks
        for (let i = 0; i < sparkCount; i++) {
          sparkPos[i * 3] = 0.8 + (Math.random() - 0.5) * 0.1;
          sparkPos[i * 3 + 1] = 3.9 + (Math.random() - 0.5) * 0.1;
          sparkPos[i * 3 + 2] = -3.4;
          sparkVel[i] = {
            x: (Math.random() - 0.5) * 0.04,
            y: (Math.random() * 0.03) + 0.01,
            z: Math.random() * 0.03,
            life: 1.0
          };
        }
        sparkGeom.attributes.position.needsUpdate = true;

        step++;
        setTimeout(doStep, s.dur);
      };
      doStep();
    };

    // Dropped Tool Gravity Hazard Simulation Test
    me.dropTest = function() {
      droppedWrench.visible = true;
      droppedWrench.position.set(cam.position.x * 0.6, 3.6, -2.4);
      dropPhysics = {
        active: true,
        y: 3.6,
        vy: 0,
        rx: 0,
        rz: 0
      };
      if (typeof tip === 'function') tip('⚠️ DROPPED TOOL HAZARD: Spanner falling under gravity...');
    };

    // Interaction Click Handler
    const P = id => {
      if (st.phase === 'em') {
        const E = st.em = st.em || { alarm: 0, bar: 0, out: 0, t0: Date.now() };
        if (id === 'horn') {
          E.alarm = 1;
          AudioFX.airHorn();
          if (typeof tip === 'function') tip('🚨 Site emergency alarm sounded! All workers alerted.');
        } else if (id === 'bar') {
          E.bar = 1;
          AudioFX.latch();
          if (typeof tip === 'function') tip('Drop zone locked and secured.');
        }
        return hudC();
      }

      if (st.phase !== 'basic') return;
      const g = objs.find(o => o.userData.id === id);

      if (id === 'sign1' || id === 'sign2') {
        st.haz.add(id);
        AudioFX.tone(440, 0.15);
        if (typeof tip === 'function') tip(id === 'sign1' ? 'OVERHEAD HAZARD: Wear hard hat; drop zone must be barricaded.' : 'FALL HAZARD: Full-body harness & certified anchor required above 6ft.');
        return afterC();
      }

      if (['helmet', 'vest', 'harness'].includes(id)) {
        if (st.worn) return tip && tip('PPE already equipped.');
        st.pick.add(id);
        mark(g);
        AudioFX.tone(520, 0.1);
        if (typeof tip === 'function') tip(NM[id] + ' ready (' + st.pick.size + '/3).');
        return afterC();
      }

      if (!st.worn) {
        if (typeof mist === 'function') mist('ppe', '⚠️ Safety Violation', 'Construction equipment touched without safety gear.', 'Pick up hard hat, vest and harness, click Wear PPE, then proceed.');
        return;
      }

      if (id === 'ins') {
        me.inspectScafftag();
      } else if (id === 'bar') {
        if (!st.ins) {
          if (typeof mist === 'function') mist('seq', '⚠️ Unsafe Sequence', 'Barricade established before scaffolding was inspected.', 'Verify Scafftag at ladder base first.');
          return;
        }
        st.bar = 1;
        mark(g);
        tapeMesh.visible = true; // Expand caution tape
        AudioFX.latch();
        if (typeof tip === 'function') tip('🚧 Drop zone barricaded: yellow caution tape secured across perimeter.');
        afterC();
      } else if (id === 'anc') {
        me.toggleClimb();
      } else if (id === 'fix') {
        me.torqueBolts();
      } else if (id === 'dsc') {
        if (!st.fix) {
          if (typeof tip === 'function') tip('Complete the structural fixing before descending.');
          return;
        }
        me.toggleClimb();
      } else if (id === 'horn') {
        AudioFX.airHorn();
        if (typeof tip === 'function') tip('🚨 Site Air Horn tested: 120 dB acoustic alarm broadcast.');
      }
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
      AudioFX.tone(880, 0.2);
      if (typeof tip === 'function') tip('🪢 PPE Equipped: Hard hat chin strap secured, fall harness fitted.');
      afterC();
    };

    me.em = () => {
      const md = document.getElementById('md'); if (md) md.style.display = 'none';
      st.phase = 'em';
      st.em = { alarm: 0, bar: 0, out: 0, t0: Date.now() };
      const emv = document.getElementById('emv'); if (emv) emv.classList.add('on');
      AudioFX.airHorn();
      if (typeof tip === 'function') tip('🚨 SITE EMERGENCY! Worker fall or dropped object detected. Sound the horn!');
      hudC();
    };

    // Camera Controls & Drag-Look
    let yaw = 0, pit = 0, dn = null, hov = null;
    let walkDist = 0, lastPos = cam.position.clone();

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

    // Keyboard Shortcuts: E = tool, T = dropped tool test
    const keyHandler = e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 't' && me.run) {
        me.dropTest();
      }
    };
    window.addEventListener('keydown', keyHandler);

    // Responsive Canvas
    const rs = () => {
      if (!sw.clientWidth) return;
      R.setSize(sw.clientWidth, sw.clientHeight, false);
      cam.aspect = sw.clientWidth / sw.clientHeight;
      cam.updateProjectionMatrix();
    };
    rs();
    window.onresize = () => { if (me.run) rs(); };

    // ---------------------------------------------------------------------
    // MAIN 3D SIMULATION ANIMATION LOOP
    // ---------------------------------------------------------------------
    let fl = 0;
    const loop = () => {
      if (!me.run) {
        R.setAnimationLoop(null);
        window.removeEventListener('keydown', keyHandler);
        return;
      }
      fl++;
      const s = (typeof st !== 'undefined' && st ? st : window.st);

      // Handle climbing animation interpolation
      if (climbAnimation) {
        const elapsed = performance.now() - climbAnimation.t0;
        const u = Math.min(1, elapsed / climbAnimation.dur);
        const ease = u * u * (3 - 2 * u);
        cam.position.lerpVectors(climbAnimation.startPos, climbAnimation.targetPos, ease);

        // Climbing vertical sway and rung audio
        const currentStep = Math.floor(u * 8);
        if (currentStep > climbAnimation.stepsTaken) {
          climbAnimation.stepsTaken = currentStep;
          AudioFX.step('rung');
          // Alternating hand reach
          if (currentStep % 2 === 0) {
            hL.position.y = -0.15; hR.position.y = -0.3;
          } else {
            hR.position.y = -0.15; hL.position.y = -0.3;
          }
        }

        if (u >= 1) {
          const cb = climbAnimation.cb;
          climbAnimation = null;
          hL.position.y = -0.3; hR.position.y = -0.3;
          AudioFX.step(cam.position.y > 2.5 ? 'wood' : 'concrete');
          if (cb) cb();
        }
      } else {
        // Normal Walking Movement (WASD / Arrows)
        const kk = window.K || {};
        const f = (kk.w || kk.arrowup ? 1 : 0) - (kk.s || kk.arrowdown ? 1 : 0);
        const r = (kk.d || kk.arrowright ? 1 : 0) - (kk.a || kk.arrowleft ? 1 : 0);
        const sp = 0.08;

        if (f !== 0 || r !== 0) {
          const dx = (-Math.sin(yaw) * f + Math.cos(yaw) * r) * sp;
          const dz = (-Math.cos(yaw) * f - Math.sin(yaw) * r) * sp;

          // If on platform, keep on platform deck bounds
          if (cam.position.y > 2.5) {
            cam.position.x = Math.max(-1.45, Math.min(1.45, cam.position.x + dx));
            cam.position.z = Math.max(-4.4, Math.min(-2.4, cam.position.z + dz));
          } else {
            cam.position.x = Math.max(-8, Math.min(8, cam.position.x + dx));
            cam.position.z = Math.max(-7, Math.min(7, cam.position.z + dz));
          }

          // Accumulate walk distance for surface-aware footstep audio
          const stepDist = Math.hypot(dx, dz);
          walkDist += stepDist;
          if (walkDist > 0.65) {
            walkDist = 0;
            AudioFX.step(cam.position.y > 2.5 ? 'wood' : 'concrete');
          }

          // Subtle head bob
          const baseHeight = cam.position.y > 2.5 ? 3.4 : 1.6;
          cam.position.y = baseHeight + Math.sin(fl * 0.3) * 0.02;
        }
      }

      cam.rotation.set(pit, yaw, 0);

      // -------------------------------------------------------------------
      // DYNAMIC 3D LIFELINE LANYARD TENSION PHYSICS
      // -------------------------------------------------------------------
      if (s && s.anc) {
        // Trolley slides along overhead wire to track worker's X
        const targetTrolleyX = Math.max(-1.8, Math.min(1.8, cam.position.x));
        trolleyGroup.position.x += (targetTrolleyX - trolleyGroup.position.x) * 0.12;

        lanyardLine.visible = true;
        const pArr = lanyardGeom.attributes.position.array;
        const startX = trolleyGroup.position.x, startY = 4.75, startZ = -3.5;
        const endX = cam.position.x, endY = cam.position.y - 0.2, endZ = cam.position.z + 0.1;
        const dist = Math.hypot(endX - startX, endZ - startZ);
        const sag = Math.max(0.04, 0.35 - dist * 0.14);

        for (let i = 0; i < 16; i++) {
          const u = i / 15;
          const px = startX + (endX - startX) * u;
          const pz = startZ + (endZ - startZ) * u;
          const py = startY + (endY - startY) * u - Math.sin(u * PI) * sag;
          pArr[i * 3] = px; pArr[i * 3 + 1] = py; pArr[i * 3 + 2] = pz;
        }
        lanyardGeom.attributes.position.needsUpdate = true;
      } else {
        lanyardLine.visible = false;
      }

      // -------------------------------------------------------------------
      // DROPPED TOOL GRAVITY HAZARD PHYSICS
      // -------------------------------------------------------------------
      if (dropPhysics.active) {
        dropPhysics.vy += 9.8 * 0.016; // g = 9.8 m/s^2
        dropPhysics.y -= dropPhysics.vy * 0.016;
        droppedWrench.position.y = dropPhysics.y;
        droppedWrench.rotation.x += 0.25;
        droppedWrench.rotation.z += 0.18;

        if (dropPhysics.y <= 0.08) {
          dropPhysics.active = false;
          droppedWrench.position.y = 0.05;
          droppedWrench.rotation.set(0, rnd() * PI, PI / 2);
          AudioFX.toolCrash();

          // Spawn dust puff particles
          dustPoints.visible = true;
          const dArr = dustGeom.attributes.position.array;
          for (let i = 0; i < dustCount; i++) {
            dArr[i * 3] = droppedWrench.position.x + (rnd() - 0.5) * 0.4;
            dArr[i * 3 + 1] = 0.06 + rnd() * 0.25;
            dArr[i * 3 + 2] = droppedWrench.position.z + (rnd() - 0.5) * 0.4;
          }
          dustGeom.attributes.position.needsUpdate = true;
          setTimeout(() => { dustPoints.visible = false; }, 600);

          if (typeof say === 'function') {
            say("Dropped object hazard demonstrated. A falling tool accelerates under gravity and strikes with lethal blunt force. Always barricade drop zones and wear hard hats.", 1);
          }
        }
      }

      // -------------------------------------------------------------------
      // SPARK PARTICLES UPDATE
      // -------------------------------------------------------------------
      if (sparkPoints.visible) {
        const sArr = sparkGeom.attributes.position.array;
        for (let i = 0; i < sparkCount; i++) {
          const v = sparkVel[i];
          if (v && v.life > 0) {
            v.life -= 0.04;
            sArr[i * 3] += v.x;
            sArr[i * 3 + 1] += v.y;
            sArr[i * 3 + 2] += v.z;
            v.y -= 0.003; // gravity
          }
        }
        sparkGeom.attributes.position.needsUpdate = true;
      }

      // -------------------------------------------------------------------
      // EMERGENCY STROBE BEACON FLASHING
      // -------------------------------------------------------------------
      if (s && s.phase === 'em') {
        const flash = Math.sin(fl * 0.35) > 0;
        strobeL1.intensity = flash ? 3.0 : 0.2;
        strobeL2.intensity = flash ? 3.0 : 0.2;
        beaconMesh1.material.color.setHex(flash ? 0xf59e0b : 0x78350f);
        beaconMesh2.material.color.setHex(flash ? 0xf59e0b : 0x78350f);

        // Evacuation muster check
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

      // -------------------------------------------------------------------
      // IN-WORLD PROXIMITY RETICLE & FLOATING PROMPTS
      // -------------------------------------------------------------------
      if (reticleEl) {
        const badge = document.getElementById('ret-badge');
        const ring = document.getElementById('ret-ring');
        // Find nearest interactive object
        let closestObj = null, minDist = 999;
        objs.forEach(o => {
          const d = cam.position.distanceTo(o.position);
          if (d < minDist) { minDist = d; closestObj = o; }
        });

        if (closestObj && minDist < 3.2) {
          if (ring) { ring.style.transform = 'scale(1.35)'; ring.style.borderColor = '#22c55e'; }
          if (badge) {
            badge.style.display = 'block';
            const actionPrompt = closestObj.userData.id === 'fix' ? '[E] Torque Bolts' :
                                 closestObj.userData.id === 'anc' ? (cam.position.y > 2.5 ? '[E] Unclip / Descend' : '[E] Climb Ladder') :
                                 `[E] ${NM[closestObj.userData.id] || closestObj.userData.id}`;
            badge.textContent = `${actionPrompt} (${minDist.toFixed(1)}m)`;
          }
        } else {
          if (ring) { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'rgba(56,189,248,0.7)'; }
          if (badge) badge.style.display = 'none';
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
          [/barricade|drop\s*zone|cordon|cone|tape/i, 'Tools or material dropped from 3m can cause fatal impact injuries below. Cordon off the ground drop zone with warning barricades.'],
          [/anchor|lifeline|clip|d-ring/i, 'Clip your lanyard snap-hook to an approved overhead anchor point before performing any elevated work.'],
          [/torque|bolt|fix|bracket/i, 'Use the torque tool at height to secure the structural fixing plate to 180 Nm and witness-mark the connection.'],
          [/descend|ladder|clear|tether/i, 'Tether all hand tools before descending. Use the ladder facing the rungs with 3 points of contact.']
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
    sc.fog = new THREE.Fog(0x0a111a, 16, 42);

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
      g.fillStyle = 'rgba(8,14,22,0.92)';
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
      if (!g) return;
      g.userData.sel = 1;
      g.traverse(c => { if (c.material && c.material.emissive) c.material.emissive.setHex(0x1a7f3c); });
    };

    const hl = (g, on) => {
      if (!g) return;
      g.traverse(c => {
        if (c.material && c.material.emissive) c.material.emissive.setHex(on ? 0x665500 : (g.userData.sel ? 0x1a7f3c : 0));
      });
    };

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

    // Headstock Emergency Warning Beacon Light
    const beaconLight = new THREE.PointLight(0xf59e0b, 0, 14);
    beaconLight.position.set(-1.0, 2.3, -3.0);
    sc.add(beaconLight);

    // Beacon dome mesh
    const beaconDome = cy(sc, 0.08, 0.14, 0xf59e0b, -1.0, 2.22, -3.0);

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

    // ---------- HEAVY INDUSTRIAL LATHE MACHINERY
    const Machine = new THREE.Group();
    Machine.position.set(0, 0, -3.0);
    sc.add(Machine);

    // Heavy Cast Iron Machine Bed & Legs
    bx(Machine, 3.2, 0.7, 1.2, 0x064e3b, 0, 0.45, 0);
    const slideways = bx(Machine, 3.0, 0.2, 0.9, 0x94a3b8, 0, 0.9, 0); // Steel slideways
    bx(Machine, 0.6, 0.8, 1.1, 0x064e3b, -1.2, 0.4, 0);
    bx(Machine, 0.6, 0.8, 1.1, 0x064e3b, 1.2, 0.4, 0);

    // Headstock Gearbox Unit
    bx(Machine, 0.9, 0.8, 0.9, 0x047857, -1.0, 1.2, 0);
    cy(Machine, 0.05, 0.2, 0x94a3b8, -1.2, 1.45, 0.46).rotation.x = PI / 2;

    // 3-Jaw Spindle Chuck (Rotates based on VFD live RPM!)
    const ChuckGroup = new THREE.Group();
    ChuckGroup.position.set(-0.45, 1.2, 0);
    Machine.add(ChuckGroup);
    cy(ChuckGroup, 0.26, 0.22, 0xd4d4d8, 0, 0, 0).rotation.z = PI / 2;
    [0, 2 * PI / 3, 4 * PI / 3].forEach(a => {
      bx(ChuckGroup, 0.08, 0.12, 0.07, 0x1e293b, 0.12, Math.cos(a) * 0.16, Math.sin(a) * 0.16);
    });

    // Workpiece stock in chuck
    const workStock = cy(ChuckGroup, 0.06, 1.2, 0xf59e0b, 0.6, 0, 0);
    workStock.rotation.z = PI / 2;

    // Turned shoulder groove formed when fed
    const cutGroove = cy(ChuckGroup, 0.048, 0.35, 0xe2e8f0, 0.45, 0, 0);
    cutGroove.rotation.z = PI / 2;
    cutGroove.visible = false;

    // Tailstock Assembly on right
    bx(Machine, 0.6, 0.6, 0.7, 0x047857, 1.0, 1.15, 0);
    cy(Machine, 0.06, 0.35, 0xd4d4d8, 0.65, 1.2, 0).rotation.z = PI / 2;
    cy(Machine, 0.15, 0.04, 0x94a3b8, 1.35, 1.2, 0).rotation.z = PI / 2;

    // ---------------------------------------------------------------------
    // INTERACTIVE MACHINE COMPONENTS: GUARD, TACHOMETER, E-STOP, SWARF
    // ---------------------------------------------------------------------
    // 1. Transparent Polycarbonate Safety Guard with Pivot Hinge (`gd`)
    const GuardPivot = new THREE.Group();
    GuardPivot.position.set(-0.45, 1.55, -0.2); // Hinge line
    GuardPivot.rotation.x = -1.45; // Starts open at 85 degrees
    Machine.add(GuardPivot);

    const shieldMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.55, 16, 1, true, -PI / 2, PI), new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide
    }));
    shieldMesh.rotation.z = PI / 2;
    shieldMesh.position.set(0, -0.2, 0.25);
    GuardPivot.add(shieldMesh);
    bx(GuardPivot, 0.55, 0.04, 0.04, 0xeab308, 0, 0.16, 0.25);
    cy(GuardPivot, 0.02, 0.14, 0xfacc15, 0, 0.22, 0.35);

    const GuardG = ob('gd', -0.45, 1.35, -2.9, g => {
      // Guard click hitbox
    }, 0.9, 'Safety Guard');

    // Control Console with 7-Segment Digital RPM Tachometer
    const Console = new THREE.Group();
    Console.position.set(0.2, 1.3, 0.55);
    Machine.add(Console);
    bx(Console, 0.65, 0.42, 0.15, 0x0f172a, 0, 0, 0);

    // Interlock Limit Switch Status LED
    const interlockLED = add(Console, new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), Bc(0xef4444)), -0.22, 0.12, 0.08);

    // Live 7-Segment Digital Tachometer Display
    const tachCanvas = document.createElement('canvas'); tachCanvas.width = 256; tachCanvas.height = 96;
    const tachCtx = tachCanvas.getContext('2d');
    const updateTach = rpm => {
      tachCtx.fillStyle = '#050b14'; tachCtx.fillRect(0, 0, 256, 96);
      tachCtx.strokeStyle = '#22d3ee'; tachCtx.lineWidth = 3; tachCtx.strokeRect(4, 4, 248, 88);
      tachCtx.fillStyle = '#38bdf8'; tachCtx.font = 'bold 16px monospace';
      tachCtx.fillText('SPINDLE TACH', 16, 26);
      tachCtx.fillStyle = rpm > 0 ? '#22c55e' : '#64748b';
      tachCtx.font = 'bold 44px monospace';
      tachCtx.fillText(`${Math.round(rpm)} RPM`, 16, 75);
    };
    updateTach(0);
    const tachTex = new THREE.CanvasTexture(tachCanvas);
    const tachScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.12), new THREE.MeshBasicMaterial({ map: tachTex }));
    tachScreen.position.set(0.06, 0.11, 0.08);
    Console.add(tachScreen);

    // Emergency Stop Palm Button (`es`) with physical button depression
    const eStopHead = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16), M(0xdc2626));
    eStopHead.position.set(0, 0.04, 0);
    const eStopG = ob('es', 0.4, 1.3, -2.4, g => {
      cy(g, 0.09, 0.04, 0xfacc15, 0, 0, 0); // Yellow collar
      g.add(eStopHead);
    }, 0.5, 'E-Stop');

    // Start Button (Green `go`)
    ob('go', 0.1, 1.26, -2.4, g => {
      cy(g, 0.04, 0.04, 0x16a34a, 0, 0, 0);
    }, 0.4, 'Start');

    // Stop Button (Red `sp`)
    ob('sp', 0.25, 1.26, -2.4, g => {
      cy(g, 0.045, 0.04, 0xef4444, 0, 0, 0);
    }, 0.4, 'Stop');

    // 2. Swarf Chips on Slideways & Bench Brush (`clr`)
    const swarfGroup = new THREE.Group();
    swarfGroup.position.set(0, 1.02, 0);
    Machine.add(swarfGroup);
    // 3D curly metal shavings
    for (let i = 0; i < 28; i++) {
      const chip = add(swarfGroup, new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 6, 10, PI * 1.5), M(0xd4d4d8, { metalness: 0.9 })),
        (rnd() - 0.5) * 1.6, 0, (rnd() - 0.5) * 0.4);
      chip.rotation.set(rnd() * PI, rnd() * PI, rnd() * PI);
    }

    const brushG = ob('clr', 0.5, 0.95, -2.6, g => {
      bx(g, 0.12, 0.04, 0.35, 0x854d0e);
      bx(g, 0.1, 0.06, 0.18, 0x1e293b, 0, -0.04, -0.06);
    }, 0.6, 'Bench Brush');

    // 3. Wooden Push Stick Tool (`fd`)
    const pushStickG = ob('fd', -0.1, 1.05, -2.4, g => {
      bx(g, 0.04, 0.03, 0.45, 0xd97706);
      bx(g, 0.06, 0.05, 0.1, 0xb45309, 0, 0.01, -0.2);
    }, 0.6, 'Push Stick');

    // Dynamic Metal Cutting Sparks & Chips Particle System
    const cutSparkCount = 40;
    const cutSparkPos = new Float32Array(cutSparkCount * 3);
    const cutSparkVel = [];
    for (let i = 0; i < cutSparkCount; i++) {
      cutSparkPos[i * 3] = 0; cutSparkPos[i * 3 + 1] = 1.2; cutSparkPos[i * 3 + 2] = -3.0;
      cutSparkVel.push({ x: 0, y: 0, z: 0, life: 0 });
    }
    const cutSparkGeom = new THREE.BufferGeometry();
    cutSparkGeom.setAttribute('position', new THREE.BufferAttribute(cutSparkPos, 3));
    const cutSparkPoints = new THREE.Points(cutSparkGeom, new THREE.PointsMaterial({
      color: 0xffa200,
      size: 0.06,
      transparent: true,
      blending: THREE.AdditiveBlending
    }));
    cutSparkPoints.visible = false;
    sc.add(cutSparkPoints);

    // 4. Main Electrical LOTO Disconnect Switch Box (`lk`)
    const knifeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.06), M(0xdc2626));
    knifeHandle.position.set(0.16, 0.05, 0);
    const lotoPadlock = new THREE.Group();
    bx(lotoPadlock, 0.06, 0.08, 0.04, 0xfacc15); // Brass body
    add(lotoPadlock, new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 6, 14), M(0xffffff, { metalness: 0.9 })), 0, 0.05, 0);
    lotoPadlock.position.set(0.16, -0.06, 0.06);
    lotoPadlock.visible = false;

    // OSHA Danger Tag
    const dangerTag = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.16), new THREE.MeshBasicMaterial({ color: 0xdc2626, side: THREE.DoubleSide }));
    dangerTag.position.set(0.16, -0.15, 0.06);
    dangerTag.visible = false;

    const lotoG = ob('lk', -3.5, 1.5, -6.35, g => {
      bx(g, 0.35, 0.55, 0.2, 0x334155);
      g.add(knifeHandle);
      g.add(lotoPadlock);
      g.add(dangerTag);
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
      bx(g, 0.14, 0.04, 0.1, 0x78716c, -0.1, -0.06, 0.1);
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

    // Interactive Proximity Reticle UI Element
    let reticleEl = document.getElementById('sim-reticle');
    if (!reticleEl && sw) {
      reticleEl = document.createElement('div');
      reticleEl.id = 'sim-reticle';
      reticleEl.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:15;display:flex;align-items:center;justify-content:center;';
      reticleEl.innerHTML = `
        <div id="ret-ring" style="width:24px;height:24px;border:2px solid rgba(56,189,248,0.7);border-radius:50%;transition:transform 0.15s ease, border-color 0.15s ease;"></div>
        <div id="ret-dot" style="position:absolute;width:4px;height:4px;background:#38bdf8;border-radius:50%;"></div>
        <div id="ret-badge" style="position:absolute;top:30px;background:rgba(15,23,42,0.92);border:1px solid #38bdf8;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;color:#fff;white-space:nowrap;display:none;"></div>
      `;
      sw.appendChild(reticleEl);
    }

    // ---------------------------------------------------------------------
    // REAL 3D ANIMATION SYSTEMS: GUARD HINGE, MOTOR INERTIA, SWARF SWEEP
    // ---------------------------------------------------------------------
    let currentRpm = 0, targetRpm = 0;
    let guardAngle = -1.45, targetGuardAngle = -1.45;

    me.toggleGuard = function() {
      if (st.gd) {
        targetGuardAngle = -1.45;
        st.gd = 0;
        interlockLED.material.color.setHex(0xef4444);
        AudioFX.latch();
        if (typeof tip === 'function') tip('🛡️ Chuck guard opened: Spindle interlock OPEN (circuit disabled).');
      } else {
        targetGuardAngle = 0.0;
        st.gd = 1;
        interlockLED.material.color.setHex(0x22c55e);
        mark(GuardG);
        AudioFX.latch();
        if (typeof tip === 'function') tip('🛡️ Interlock guard closed and latched over chuck (Circuit OK).');
      }
      afterM();
    };

    me.sweepBed = function() {
      if (!st.es) {
        if (typeof mist === 'function') mist('seq', '⚠️ Unsafe Sequence', 'Cleared bed before testing Emergency Stop mechanism.', 'Test Emergency Stop trip function first.');
        return;
      }
      AudioFX.brushSweep();
      // Animate sweeping motion
      hR.position.x = 0.1;
      setTimeout(() => {
        AudioFX.brushSweep();
        hR.position.x = 0.35;
      }, 250);
      setTimeout(() => {
        AudioFX.brushSweep();
        hR.position.x = 0.2;
        // Swarf slides into collection drawer
        swarfGroup.position.y = 0.55;
        swarfGroup.position.z = 0.35;
        st.clr = 1;
        mark(brushG);
        if (typeof tip === 'function') tip('🧹 Bed and slideways swept clean of sharp turnings using bench brush.');
        afterM();
      }, 500);
    };

    me.slapEstop = function() {
      eStopHead.position.y = 0.02; // Button depressed 20mm
      AudioFX.estop();
      AudioFX.dynamicBrake();
      targetRpm = 0;
      st.running = 0;
      st.es = 1;
      mark(eStopG);
      beaconLight.intensity = 2.5;

      if (st.phase === 'em') {
        const E = st.em = st.em || { estop: 0, disc: 0, out: 0, t0: Date.now() };
        E.estop = 1;
        if (typeof tip === 'function') tip('🛑 EMERGENCY STOP SLAPPED: Spindle dynamic injection brake engaged!');
        hudM();
      } else {
        if (typeof tip === 'function') tip('🛑 E-Stop tested and verified functional. Trip circuit verified.');
        afterM();
      }
    };

    me.feedStock = function() {
      if (!st.go) {
        if (typeof tip === 'function') tip('Start the spindle first before advancing material.');
        return;
      }
      AudioFX.sparkSpray(0.6);
      cutSparkPoints.visible = true;

      // Animate push stick forward stroke
      heldPushStick.position.z = -0.25;
      setTimeout(() => {
        heldPushStick.position.z = -0.1;
        cutSparkPoints.visible = false;
        cutGroove.visible = true; // Shoulder groove formed
        st.fd = 1;
        mark(pushStickG);
        if (typeof tip === 'function') tip('🪵 Material fed safely with push stick — hands kept 200mm clear of cutter.');
        afterM();
      }, 600);
    };

    // Interaction Click Handler
    const P = id => {
      if (st.phase === 'em') {
        const E = st.em = st.em || { estop: 0, disc: 0, out: 0, t0: Date.now() };
        if (id === 'es') {
          me.slapEstop();
        } else if (id === 'lk') {
          E.disc = 1;
          knifeHandle.rotation.z = -0.8;
          lotoPadlock.visible = true;
          dangerTag.visible = true;
          AudioFX.padlock();
          if (typeof tip === 'function') tip('Main disconnect opened & locked out with danger padlock.');
        }
        return hudM();
      }

      if (st.phase !== 'basic') return;
      const g = objs.find(o => o.userData.id === id);

      if (id === 'sign1' || id === 'sign2') {
        st.haz.add(id);
        AudioFX.tone(440, 0.15);
        if (typeof tip === 'function') tip(id === 'sign1' ? 'ROTATING PARTS: Entanglement risk — tie back hair, no loose clothing.' : 'PINCH POINTS: Crush risk — keep hands outside cutter zone.');
        return afterM();
      }

      if (['glasses', 'ear', 'boots'].includes(id)) {
        if (st.worn) return tip && tip('PPE already equipped.');
        st.pick.add(id);
        mark(g);
        AudioFX.tone(520, 0.1);
        if (typeof tip === 'function') tip(NM[id] + ' ready (' + st.pick.size + '/3).');
        return afterM();
      }

      if (!st.worn) {
        if (typeof mist === 'function') mist('ppe', '⚠️ Safety Violation', 'Machine controls operated without eye and ear protection.', 'Pick up glasses, ear defenders and boots, click Wear PPE, then proceed.');
        return;
      }

      if (id === 'gd') {
        me.toggleGuard();
      } else if (id === 'es') {
        me.slapEstop();
      } else if (id === 'clr') {
        me.sweepBed();
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
        targetRpm = 1250;
        mark(g);
        heldPushStick.visible = true;
        AudioFX.tone(740, 0.25);
        if (typeof tip === 'function') tip('⚡ Spindle active: VFD accelerating to 1250 RPM. Acoustic vibration nominal.');
        afterM();
      } else if (id === 'fd') {
        me.feedStock();
      } else if (id === 'sp') {
        if (!st.fd) {
          if (typeof tip === 'function') tip('Perform feed pass before completing cycle.');
          return;
        }
        st.running = 0;
        st.sp = 1;
        targetRpm = 0;
        mark(g);
        heldPushStick.visible = false;
        AudioFX.tone(600, 0.2);
        if (typeof tip === 'function') tip('⏹️ Stop pressed: Spindle coasting down to 0 RPM.');
        afterM();
      } else if (id === 'lk') {
        if (!st.sp || currentRpm > 20) {
          if (typeof mist === 'function') mist('iso', '⚠️ Moving Parts Danger', 'Attempted to lock out equipment while spindle was still spinning.', 'Press STOP and wait for zero RPM before isolating power.');
          return;
        }
        st.lk = 1;
        mark(g);
        knifeHandle.rotation.z = -0.8;
        lotoPadlock.visible = true;
        dangerTag.visible = true;
        AudioFX.padlock();
        if (typeof tip === 'function') tip('🔒 LOTO Verified: Lockout hasp & danger padlock attached to main disconnect (OSHA 1910.147).');
        afterM();
      }
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
      AudioFX.tone(880, 0.2);
      if (typeof tip === 'function') tip('🥽 PPE Equipped: Impact eye protection, hearing protection fitted.');
      afterM();
    };

    me.em = () => {
      const md = document.getElementById('md'); if (md) md.style.display = 'none';
      st.phase = 'em';
      st.em = { estop: 0, disc: 0, out: 0, t0: Date.now() };
      const emv = document.getElementById('emv'); if (emv) emv.classList.add('on');
      AudioFX.tone(900, 0.35);
      beaconLight.intensity = 3.0;
      if (typeof tip === 'function') tip('🚨 MACHINE RUNAWAY! Spindle chatter and jam detected. Smash the E-Stop!');
      hudM();
    };

    // Pointer Events & Camera Look
    let yaw = 0, pit = 0, dn = null, hov = null;
    let walkDist = 0;

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

    // Keyboard Shortcuts: G = guard, E = feed
    const keyHandler = e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'g' && me.run) {
        me.toggleGuard();
      }
    };
    window.addEventListener('keydown', keyHandler);

    // Responsive Canvas
    const rs = () => {
      if (!sw.clientWidth) return;
      R.setSize(sw.clientWidth, sw.clientHeight, false);
      cam.aspect = sw.clientWidth / sw.clientHeight;
      cam.updateProjectionMatrix();
    };
    rs();
    window.onresize = () => { if (me.run) rs(); };

    // ---------------------------------------------------------------------
    // MAIN 3D SIMULATION ANIMATION LOOP: MOTOR INERTIA & INTERLOCK GUARD
    // ---------------------------------------------------------------------
    let fl = 0;
    const loop = () => {
      if (!me.run) {
        R.setAnimationLoop(null);
        window.removeEventListener('keydown', keyHandler);
        return;
      }
      fl++;
      const kk = window.K || {};
      const f = (kk.w || kk.arrowup ? 1 : 0) - (kk.s || kk.arrowdown ? 1 : 0);
      const r = (kk.d || kk.arrowright ? 1 : 0) - (kk.a || kk.arrowleft ? 1 : 0);
      const sp = 0.08;

      if (f !== 0 || r !== 0) {
        const dx = (-Math.sin(yaw) * f + Math.cos(yaw) * r) * sp;
        const dz = (-Math.cos(yaw) * f - Math.sin(yaw) * r) * sp;
        cam.position.x = Math.max(-7, Math.min(7, cam.position.x + dx));
        cam.position.z = Math.max(-6, Math.min(6, cam.position.z + dz));

        walkDist += Math.hypot(dx, dz);
        if (walkDist > 0.65) {
          walkDist = 0;
          AudioFX.step('concrete');
        }
        cam.position.y = 1.6 + Math.sin(fl * 0.3) * 0.02;
      }

      cam.rotation.set(pit, yaw, 0);

      // -------------------------------------------------------------------
      // VFD MOTOR ACCELERATION & SPINDLE INERTIA
      // -------------------------------------------------------------------
      currentRpm += (targetRpm - currentRpm) * 0.055;
      if (currentRpm > 5) {
        ChuckGroup.rotation.x += (currentRpm / 1250) * 0.45;
      }

      // Update 7-Segment Digital Tachometer Display
      if (fl % 4 === 0) {
        const displayedRpm = currentRpm > 10 ? currentRpm + (rnd() - 0.5) * 4 : 0;
        updateTach(displayedRpm);
        tachTex.needsUpdate = true;
      }

      // Smooth Interlock Guard Pivot Swing
      guardAngle += (targetGuardAngle - guardAngle) * 0.18;
      GuardPivot.rotation.x = guardAngle;

      // -------------------------------------------------------------------
      // CUTTING SPARK PARTICLES
      // -------------------------------------------------------------------
      if (cutSparkPoints.visible) {
        const sArr = cutSparkGeom.attributes.position.array;
        for (let i = 0; i < cutSparkCount; i++) {
          const v = cutSparkVel[i];
          if (v && v.life > 0) {
            v.life -= 0.05;
            sArr[i * 3] += v.x;
            sArr[i * 3 + 1] += v.y;
            sArr[i * 3 + 2] += v.z;
            v.y -= 0.004;
          } else {
            sArr[i * 3] = -0.1 + (rnd() - 0.5) * 0.05;
            sArr[i * 3 + 1] = 1.2 + (rnd() - 0.5) * 0.05;
            sArr[i * 3 + 2] = -3.0;
            v.x = (rnd() - 0.5) * 0.03;
            v.y = rnd() * 0.04 + 0.01;
            v.z = rnd() * 0.04;
            v.life = 1.0;
          }
        }
        cutSparkGeom.attributes.position.needsUpdate = true;
      }

      // Emergency Evacuation & Strobe Sweep
      const s = (typeof st !== 'undefined' && st ? st : window.st);
      if (s && s.phase === 'em') {
        beaconLight.intensity = Math.sin(fl * 0.3) > 0 ? 3.0 : 0.4;
        beaconDome.material.color.setHex(Math.sin(fl * 0.3) > 0 ? 0xf59e0b : 0x78350f);

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

      // -------------------------------------------------------------------
      // IN-WORLD PROXIMITY RETICLE & FLOATING PROMPTS
      // -------------------------------------------------------------------
      if (reticleEl) {
        const badge = document.getElementById('ret-badge');
        const ring = document.getElementById('ret-ring');
        let closestObj = null, minDist = 999;
        objs.forEach(o => {
          const d = cam.position.distanceTo(o.position);
          if (d < minDist) { minDist = d; closestObj = o; }
        });

        if (closestObj && minDist < 3.0) {
          if (ring) { ring.style.transform = 'scale(1.35)'; ring.style.borderColor = '#22c55e'; }
          if (badge) {
            badge.style.display = 'block';
            const actionPrompt = closestObj.userData.id === 'fd' ? '[E] Push Stock' :
                                 closestObj.userData.id === 'gd' ? '[G] Toggle Guard' :
                                 `[E] ${NM[closestObj.userData.id] || closestObj.userData.id}`;
            badge.textContent = `${actionPrompt} (${minDist.toFixed(1)}m)`;
          }
        } else {
          if (ring) { ring.style.transform = 'scale(1)'; ring.style.borderColor = 'rgba(56,189,248,0.7)'; }
          if (badge) badge.style.display = 'none';
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

  console.log("[SkillSafe VR] 3D Workshops Extension (Construction Safety & Machine Operation) v7.0 loaded.");
})();
