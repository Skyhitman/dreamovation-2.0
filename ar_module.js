// =========================================================================
// ⚡ SKILLSAFE VR: AR ELECTRICAL PANEL SAFETY MODULE (PHASE 1)
// - Real AR.js + A-Frame 1.3.0 marker tracking using standard HIRO marker
// - Procedural 3D Electrical Switchgear Panel (A-Frame primitives, zero external 3D models)
// - 4 Anchored Safety Components:
//     1. Circuit Breaker (MCCB / LOTO Isolator)
//     2. Status Indicator Light
//     3. Emergency Stop (E-Stop)
//     4. High-Voltage / Arc Flash Warning Placard
// - Printable A4 HIRO marker sheet with calibration and positioning instructions
// - Full-screen digital marker display for laptop/tablet backup testing
// - Clean camera lifecycle management: camera starts ONLY on user gesture,
//   stops all tracks completely on exit, never records or uploads video.
// =========================================================================

(function() {
  window.V = window.V || {};
  window.I = window.I || {};

  // State tracker for AR Session
  window.SkillSafeAR = window.SkillSafeAR || {
    active: false,
    trackingState: 'idle', // 'idle' | 'requesting' | 'searching' | 'detected' | 'lost' | 'error'
    componentsExplored: new Set(),
    stream: null,
    aframeLoaded: false,
    arjsLoaded: false,
    lastAttempt: null
  };

  const AR_STATE = window.SkillSafeAR;

  // Pinned CDN library URLs
  const AFRAME_CDN = "https://aframe.io/releases/1.3.0/aframe.min.js";
  const ARJS_CDN = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js";

  // -----------------------------------------------------------------------
  // Core Styles: Guarantees video feed is visible behind transparent A-Frame canvas
  // -----------------------------------------------------------------------
  function injectARStyles() {
    let style = document.getElementById('skillsafe-ar-core-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'skillsafe-ar-core-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      /* Hide all standard web app containers while AR is running */
      body.in-ar-session {
        margin: 0 !important;
        padding: 0 !important;
        padding-top: 0 !important;
        overflow: hidden !important;
        background: #000000 !important;
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
      }
      body.in-ar-session #app,
      body.in-ar-session nav,
      body.in-ar-session #main-nav,
      body.in-ar-session header,
      body.in-ar-session #cwrap,
      body.in-ar-session #mobile-nav-drawer,
      body.in-ar-session #mobile-nav-backdrop,
      body.in-ar-session #google_translate_element,
      body.in-ar-session .sb {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* Camera video from AR.js webcam: forced 100% full bleed on phone & desktop */
      body.in-ar-session video#arjs-video,
      body.in-ar-session .arjs-video,
      body.in-ar-session video,
      video#arjs-video {
        position: fixed !important;
        top: 0px !important;
        left: 0px !important;
        right: 0px !important;
        bottom: 0px !important;
        width: 100vw !important;
        height: 100vh !important;
        min-width: 100vw !important;
        min-height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        margin: 0px !important;
        margin-left: 0px !important;
        margin-top: 0px !important;
        padding: 0px !important;
        object-fit: cover !important;
        z-index: 10 !important;
        pointer-events: none !important;
        display: block !important;
        background: #000000 !important;
      }

      /* Transparent A-Frame scene container overlay */
      body.in-ar-session #skillsafe-ar-scene-container {
        position: fixed !important;
        inset: 0px !important;
        top: 0px !important;
        left: 0px !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0px !important;
        padding: 0px !important;
        z-index: 20 !important;
        background: transparent !important;
        pointer-events: none !important;
        overflow: hidden !important;
      }
      body.in-ar-session #skillsafe-ar-scene-container a-scene {
        position: fixed !important;
        top: 0px !important;
        left: 0px !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0px !important;
        padding: 0px !important;
        background: transparent !important;
      }
      body.in-ar-session #skillsafe-ar-scene-container canvas.a-canvas {
        position: fixed !important;
        top: 0px !important;
        left: 0px !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0px !important;
        margin-left: 0px !important;
        margin-top: 0px !important;
        padding: 0px !important;
        background: transparent !important;
        pointer-events: auto !important;
      }

      /* Top & Bottom HUD Layer */
      body.in-ar-session #skillsafe-ar-hud-overlay {
        position: fixed !important;
        inset: 0px !important;
        top: 0px !important;
        left: 0px !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0px !important;
        z-index: 30 !important;
        pointer-events: none !important;
        box-sizing: border-box !important;
      }
    `;
  }

  // -----------------------------------------------------------------------
  // Helper: Verify / Load A-Frame & AR.js Libraries
  // -----------------------------------------------------------------------
  function loadARLibraries(callback) {
    if (window.AFRAME && (window.ARjs || (window.THREEx && window.THREEx.ArToolkitContext))) {
      AR_STATE.aframeLoaded = true;
      AR_STATE.arjsLoaded = true;
      return callback(null);
    }

    function loadScript(src, cb) {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return cb();
        existing.addEventListener('load', () => cb());
        existing.addEventListener('error', (e) => cb(e));
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => {
        s.dataset.loaded = 'true';
        cb();
      };
      s.onerror = (err) => cb(err);
      document.head.appendChild(s);
    }

    loadScript(AFRAME_CDN, (err) => {
      if (err) return callback(new Error("Failed to load A-Frame 1.3.0 from CDN"));
      AR_STATE.aframeLoaded = true;
      loadScript(ARJS_CDN, (err2) => {
        if (err2) return callback(new Error("Failed to load AR.js 3.4.5 from CDN"));
        AR_STATE.arjsLoaded = true;
        callback(null);
      });
    });
  }

  // -----------------------------------------------------------------------
  // Clean Camera & AR Session Termination
  // -----------------------------------------------------------------------
  window.exitARSession = function() {
    console.log("[SkillSafe AR] Terminating AR Session & cleaning up hardware...");

    if (window._arWatchdogTimer) {
      clearInterval(window._arWatchdogTimer);
      window._arWatchdogTimer = null;
    }

    // 1. Stop all video streams from all sources
    if (AR_STATE.stream) {
      try {
        AR_STATE.stream.getTracks().forEach(t => {
          t.stop();
          console.log("[SkillSafe AR] Stopped camera track:", t.label);
        });
      } catch(e) {}
      AR_STATE.stream = null;
    }

    if (window._ms) {
      try {
        window._ms.getTracks().forEach(t => t.stop());
      } catch(e) {}
      window._ms = null;
    }

    // 2. Remove all AR.js video elements
    const videos = document.querySelectorAll('video#arjs-video, .arjs-video, video');
    videos.forEach(v => {
      try {
        if (v.srcObject) {
          v.srcObject.getTracks().forEach(t => t.stop());
          v.srcObject = null;
        }
        v.pause();
        v.remove();
      } catch(e) {}
    });

    // 3. Remove AR scene container
    const sceneContainer = document.getElementById('skillsafe-ar-scene-container');
    if (sceneContainer) {
      try {
        const sc = sceneContainer.querySelector('a-scene');
        if (sc && sc.pause) sc.pause();
      } catch(e) {}
      sceneContainer.remove();
    }

    // 4. Remove HUD Overlay & Styles
    const hud = document.getElementById('skillsafe-ar-hud-overlay');
    if (hud) hud.remove();

    const st = document.getElementById('skillsafe-ar-core-style');
    if (st) st.remove();

    // 5. Restore body & document styles
    document.body.classList.remove('in-ar-session');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    const htmlEl = document.querySelector('html');
    if (htmlEl) htmlEl.classList.remove('a-fullscreen');

    // Restore standard UI containers
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.style.display = '';
      appEl.style.visibility = '';
    }
    const navEl = document.getElementById('main-nav');
    if (navEl) {
      navEl.style.display = '';
      navEl.style.visibility = '';
    }
    const cwrapEl = document.getElementById('cwrap');
    if (cwrapEl) {
      cwrapEl.style.display = '';
    }

    AR_STATE.active = false;
    AR_STATE.trackingState = 'idle';

    // Return to AR home module view
    if (typeof window.go === 'function') {
      window.go('ar');
    }
  };

  // -----------------------------------------------------------------------
  // Launch Real WebAR Tracking Camera Experience
  // -----------------------------------------------------------------------
  window.startARCameraExperience = function() {
    const launchBtn = document.getElementById('btn-start-ar-training');
    if (launchBtn) {
      launchBtn.disabled = true;
      launchBtn.innerHTML = `⏳ Starting Camera...`;
    }

    // Check getUserMedia support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera API (getUserMedia) is not supported in this browser. Please use Chrome, Edge, or Safari on an HTTPS connection.");
      if (launchBtn) {
        launchBtn.disabled = false;
        launchBtn.innerHTML = `🚀 Start AR Training`;
      }
      return;
    }

    // Ensure libraries are available, then mount scene directly inside user gesture
    if (window.AFRAME && (window.ARjs || window.THREEx)) {
      mountARScene();
    } else {
      loadARLibraries((err) => {
        if (err) {
          console.error("[SkillSafe AR] Library load error:", err);
          showCameraErrorModal(err);
          if (launchBtn) {
            launchBtn.disabled = false;
            launchBtn.innerHTML = `🚀 Start AR Training`;
          }
          return;
        }
        mountARScene();
      });
    }
  };

  // -----------------------------------------------------------------------
  // Camera Error Modal (Never leave user with a blank screen)
  // -----------------------------------------------------------------------
  function showCameraErrorModal(err) {
    const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
    const modal = document.createElement('div');
    modal.id = 'ar-camera-error-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,12,0.92);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px';
    modal.innerHTML = `
      <div style="background:#0f172a;border:2px solid ${isDenied ? '#ef4444' : '#f59e0b'};border-radius:18px;max-width:520px;width:100%;padding:28px;color:#f8fafc;box-shadow:0 20px 60px rgba(0,0,0,0.6)">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:12px;background:${isDenied ? '#ef444422' : '#f59e0b22'};display:flex;align-items:center;justify-content:center;font-size:24px">
            ${isDenied ? '🚫' : '⚠️'}
          </div>
          <div>
            <h3 style="margin:0;font-size:18px;color:#fff">${isDenied ? 'Camera Access Denied' : 'Camera Initialization Error'}</h3>
            <small style="color:#94a3b8">${err.name || 'Device Access Exception'}</small>
          </div>
        </div>
        <p style="font-size:14px;color:#cbd5e1;line-height:1.6;margin:0 0 16px">
          ${isDenied
            ? 'SkillSafe VR requires camera access to track the physical HIRO marker and project the 3D electrical panel. Please allow camera permissions in your browser address bar (lock icon) and tap Try Again.'
            : 'Could not access the device camera (' + (err.message || 'unknown error') + '). Ensure your camera is not used by another app and you are on HTTPS.'}
        </p>
        <div style="background:#1e293b;padding:12px;border-radius:10px;font-size:12.5px;color:#94a3b8;margin-bottom:20px">
          💡 <b>Troubleshooting:</b><br>
          • <b>Mobile (Chrome/Safari):</b> Tap the tune/lock icon in the URL bar &gt; Permissions &gt; Camera &gt; Allow.<br>
          • <b>Laptop / PC:</b> Ensure webcam is plugged in and allowed for this site.
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button class="b o" onclick="document.getElementById('ar-camera-error-modal').remove()">Dismiss</button>
          <button class="b" onclick="document.getElementById('ar-camera-error-modal').remove();startARCameraExperience()">🔄 Try Again</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // -----------------------------------------------------------------------
  // Mount A-Frame & AR.js Scene with Procedural 3D Electrical Panel
  // -----------------------------------------------------------------------
  function mountARScene() {
    AR_STATE.active = true;
    AR_STATE.trackingState = 'searching';

    injectARStyles();
    document.body.classList.add('in-ar-session');

    // Programmatically hide standard app views to guarantee zero split-screen or overlay leakage
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.style.display = 'none';
      appEl.style.visibility = 'hidden';
    }
    const navEl = document.getElementById('main-nav');
    if (navEl) {
      navEl.style.display = 'none';
      navEl.style.visibility = 'hidden';
    }
    const cwrapEl = document.getElementById('cwrap');
    if (cwrapEl) {
      cwrapEl.style.display = 'none';
    }
    const mDrawer = document.getElementById('mobile-nav-drawer');
    if (mDrawer) mDrawer.style.display = 'none';
    const mBackdrop = document.getElementById('mobile-nav-backdrop');
    if (mBackdrop) mBackdrop.style.display = 'none';

    const container = document.createElement('div');
    container.id = 'skillsafe-ar-scene-container';
    container.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:20;background:transparent;overflow:hidden;pointer-events:none';

    container.innerHTML = `
      <a-scene embedded
               arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best;"
               vr-mode-ui="enabled: false"
               renderer="alpha: true; antialias: true;"
               style="width: 100vw; height: 100vh; background: transparent;">

        <!-- 3D Lighting for Industrial Switchgear Material Visibility -->
        <a-entity light="type: ambient; color: #ffffff; intensity: 1.2;"></a-entity>
        <a-entity light="type: directional; color: #ffffff; intensity: 1.4; position: 1 3 2;"></a-entity>

        <!-- Standard HIRO Marker Anchor -->
        <a-marker preset="hiro" id="hiro-ar-marker" emitevents="true" smooth="true" smoothCount="5">

          <!-- 3D ELECTRICAL SWITCHGEAR ENCLOSURE (A-Frame Primitives) -->
          <a-entity id="ar-electrical-panel" position="0 0 0" scale="0.9 0.9 0.9">

            <!-- Main Enclosure Outer Box -->
            <a-box position="0 0.08 0" width="1.6" height="0.16" depth="2.0" color="#1e293b" material="roughness: 0.6; metalness: 0.3"></a-box>

            <!-- Recessed Inner Steel Panel -->
            <a-box position="0 0.17 0" width="1.46" height="0.04" depth="1.86" color="#090d16" material="roughness: 0.8; metalness: 0.1"></a-box>

            <!-- Yellow Safety Header Banner -->
            <a-box position="0 0.20 -0.80" width="1.4" height="0.03" depth="0.18" color="#eab308"></a-box>
            <a-text value="MAIN 415V SWITCHGEAR - BAY 03" align="center" position="0 0.23 -0.80" rotation="-90 0 0" width="2.4" color="#000" font="roboto" wrap-count="32"></a-text>

            <!-- COMPONENT 1: Main Molded-Case Circuit Breaker (LOTO Isolator) -->
            <a-entity id="comp-breaker" position="-0.40 0.20 -0.22" class="ar-interactable" data-comp="breaker">
              <!-- Breaker Housing -->
              <a-box position="0 0.08 0" width="0.42" height="0.18" depth="0.52" color="#334155" material="roughness: 0.5"></a-box>
              <!-- Breaker Handle / Toggle Switch -->
              <a-box position="0 0.19 0" width="0.12" height="0.10" depth="0.18" color="#dc2626" material="roughness: 0.3"></a-box>
              <!-- Padlock / LOTO Hasp Attachment -->
              <a-cylinder position="0.14 0.19 0" radius="0.04" height="0.09" color="#f59e0b"></a-cylinder>
              <!-- Terminal Busbars -->
              <a-box position="0 0.08 -0.28" width="0.30" height="0.06" depth="0.06" color="#d97706"></a-box>
              <a-box position="0 0.08 0.28" width="0.30" height="0.06" depth="0.06" color="#d97706"></a-box>
              <!-- Component Text Label -->
              <a-text value="1. CIRCUIT BREAKER (LOTO)" align="center" position="0 0.30 0" rotation="-90 0 0" width="1.6" color="#38bdf8"></a-text>
            </a-entity>

            <!-- COMPONENT 2: Tri-Color Status Indicator Light -->
            <a-entity id="comp-indicator" position="0.42 0.20 -0.32" class="ar-interactable" data-comp="indicator">
              <!-- Chrome Mounting Bezel -->
              <a-cylinder position="0 0.05 0" radius="0.13" height="0.10" color="#94a3b8" material="metalness: 0.8; roughness: 0.2"></a-cylinder>
              <!-- Amber Indicator Dome -->
              <a-cylinder position="0 0.12 0" radius="0.09" height="0.08" color="#f59e0b" material="emissive: #d97706; emissiveIntensity: 0.8; roughness: 0.1"></a-cylinder>
              <a-sphere position="0 0.16 0" radius="0.09" color="#fbbf24" material="emissive: #f59e0b; emissiveIntensity: 0.9;"></a-sphere>
              <!-- Component Text Label -->
              <a-text value="2. INDICATOR LIGHT" align="center" position="0 0.28 0" rotation="-90 0 0" width="1.6" color="#fbbf24"></a-text>
            </a-entity>

            <!-- COMPONENT 3: Emergency Stop Button (E-Stop) -->
            <a-entity id="comp-estop" position="0.42 0.20 0.35" class="ar-interactable" data-comp="estop">
              <!-- Yellow Caution Collar -->
              <a-cylinder position="0 0.05 0" radius="0.17" height="0.10" color="#facc15" material="roughness: 0.4"></a-cylinder>
              <!-- Red Mushroom Palm Head -->
              <a-cylinder position="0 0.13 0" radius="0.14" height="0.10" color="#dc2626" material="roughness: 0.3"></a-cylinder>
              <!-- Twist-To-Reset Arrow Ring Indicator -->
              <a-ring position="0 0.19 0" rotation="-90 0 0" radius-inner="0.08" radius-outer="0.13" color="#ffffff"></a-ring>
              <!-- Component Text Label -->
              <a-text value="3. EMERGENCY STOP (E-STOP)" align="center" position="0 0.30 0" rotation="-90 0 0" width="1.6" color="#f87171"></a-text>
            </a-entity>

            <!-- COMPONENT 4: High-Voltage / Arc Flash Warning Label -->
            <a-entity id="comp-warning" position="-0.40 0.20 0.42" class="ar-interactable" data-comp="warning">
              <!-- Placard Base Plate -->
              <a-box position="0 0.02 0" width="0.46" height="0.03" depth="0.36" color="#eab308" material="roughness: 0.5"></a-box>
              <!-- Black Caution Stripe Board -->
              <a-box position="0 0.04 0" width="0.42" height="0.02" depth="0.32" color="#000000"></a-box>
              <!-- Warning Text -->
              <a-text value="WARNING: 415V\nARC FLASH HAZARD\nISOLATE & LOCKOUT" align="center" position="0 0.06 0" rotation="-90 0 0" width="1.2" color="#facc15" font="roboto"></a-text>
              <!-- Component Text Label -->
              <a-text value="4. WARNING PLACARD" align="center" position="0 0.22 0" rotation="-90 0 0" width="1.6" color="#eab308"></a-text>
            </a-entity>

            <!-- Bottom Perimeter Striping -->
            <a-box position="0 0.20 0.85" width="1.4" height="0.03" depth="0.10" color="#eab308"></a-box>
            <a-text value="NFPA 70E / OSHA 1910.303 COMPLIANT TRAINING ANCHOR" align="center" position="0 0.23 0.85" rotation="-90 0 0" width="1.7" color="#000000"></a-text>

          </a-entity>
        </a-marker>

        <!-- Camera Entity -->
        <a-entity camera></a-entity>
      </a-scene>
    `;

    document.body.appendChild(container);

    // Camera Video Watchdog: enforce full-bleed 100vw x 100vh camera feed, overriding AR.js margin offsets on mobile portrait
    let watchdogCount = 0;
    if (window._arWatchdogTimer) clearInterval(window._arWatchdogTimer);
    window._arWatchdogTimer = setInterval(() => {
      watchdogCount++;
      const v = document.querySelector('video#arjs-video, .arjs-video, video');
      if (v) {
        v.setAttribute('autoplay', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('muted', '');
        v.style.setProperty('position', 'fixed', 'important');
        v.style.setProperty('top', '0px', 'important');
        v.style.setProperty('left', '0px', 'important');
        v.style.setProperty('right', '0px', 'important');
        v.style.setProperty('bottom', '0px', 'important');
        v.style.setProperty('width', '100vw', 'important');
        v.style.setProperty('height', '100vh', 'important');
        v.style.setProperty('min-width', '100vw', 'important');
        v.style.setProperty('min-height', '100vh', 'important');
        v.style.setProperty('margin', '0px', 'important');
        v.style.setProperty('margin-left', '0px', 'important');
        v.style.setProperty('margin-top', '0px', 'important');
        v.style.setProperty('padding', '0px', 'important');
        v.style.setProperty('object-fit', 'cover', 'important');
        v.style.setProperty('z-index', '10', 'important');
        v.style.setProperty('display', 'block', 'important');
        v.style.setProperty('pointer-events', 'none', 'important');
        if (v.paused) {
          v.play().catch(e => console.warn("[SkillSafe AR] Auto-play retry:", e));
        }
      }

      // Also enforce full bleed on A-Frame canvas
      const c = document.querySelector('#skillsafe-ar-scene-container canvas.a-canvas');
      if (c) {
        c.style.setProperty('margin', '0px', 'important');
        c.style.setProperty('margin-left', '0px', 'important');
        c.style.setProperty('margin-top', '0px', 'important');
        c.style.setProperty('top', '0px', 'important');
        c.style.setProperty('left', '0px', 'important');
        c.style.setProperty('width', '100vw', 'important');
        c.style.setProperty('height', '100vh', 'important');
      }

      // Also ensure #app remains completely hidden while AR session is active
      const curApp = document.getElementById('app');
      if (curApp && curApp.style.display !== 'none') {
        curApp.style.display = 'none';
        curApp.style.visibility = 'hidden';
      }

      if (watchdogCount > 40 && !AR_STATE.active) {
        clearInterval(window._arWatchdogTimer);
      }
    }, 150);

    mountARHUD();
    wireMarkerTrackingEvents();
  }

  // -----------------------------------------------------------------------
  // Floating 2D HUD Overlay (Tracking State, Instructions, Exit)
  // -----------------------------------------------------------------------
  function mountARHUD() {
    const hud = document.createElement('div');
    hud.id = 'skillsafe-ar-hud-overlay';
    hud.style.cssText = 'position:fixed;inset:0;z-index:95000;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;padding:16px;box-sizing:border-box';

    hud.innerHTML = `
      <!-- Top Navigation & Tracking Status Bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;pointer-events:auto;gap:10px;flex-wrap:wrap">
        <div style="background:rgba(15,23,42,0.88);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);padding:8px 14px;border-radius:12px;display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">⚡</span>
          <div>
            <div style="font-size:12px;font-weight:800;color:#f8fafc;letter-spacing:0.5px">AR ELECTRICAL PANEL SAFETY</div>
            <div id="ar-tracking-badge" style="display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:#facc15">
              <span class="ar-status-dot" style="width:8px;height:8px;border-radius:50%;background:#facc15;display:inline-block"></span>
              <span id="ar-tracking-status-text">Looking for HIRO marker...</span>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:8px;align-items:center">
          <button onclick="window.openMarkerScreenModal()" style="background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid #38bdf8;color:#38bdf8;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700" title="Open digital marker display">
            💻 Digital Marker
          </button>
          <button onclick="window.exitARSession()" style="background:#ef4444;border:none;color:#fff;padding:8px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:800;box-shadow:0 4px 15px rgba(239,68,68,0.4)" title="Exit AR Session">
            ✕ Exit AR
          </button>
        </div>
      </div>

      <!-- Center Target Lost Guidance (Shown when marker lost) -->
      <div id="ar-target-lost-banner" style="display:none;align-self:center;background:rgba(239,68,68,0.92);backdrop-filter:blur(8px);color:#fff;padding:12px 20px;border-radius:12px;font-weight:700;font-size:13.5px;text-align:center;max-width:380px;box-shadow:0 10px 30px rgba(0,0,0,0.5)">
        <span style="font-size:20px;display:block;margin-bottom:4px">⚠️ Target Lost</span>
        Reposition your camera towards the HIRO marker to re-anchor the 3D panel.
      </div>

      <!-- Bottom Guidance & Progress Bar -->
      <div style="background:rgba(15,23,42,0.88);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.12);padding:12px 16px;border-radius:14px;color:#f8fafc;pointer-events:auto;max-width:480px;align-self:center;width:100%">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:11px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:1px">Inspection Target</span>
          <span id="ar-components-progress-label" style="font-size:11.5px;font-weight:700;color:#94a3b8">Ready · 4 Components Anchored</span>
        </div>
        <p style="margin:0;font-size:12.5px;color:#cbd5e1;line-height:1.4">
          Point camera at the printed or on-screen <b>HIRO marker</b>. Keep device 30–50 cm away at a 45°–90° angle.
        </p>
      </div>
    `;

    document.body.appendChild(hud);
  }

  // -----------------------------------------------------------------------
  // Wire Marker Tracking Events (Detected vs Lost)
  // -----------------------------------------------------------------------
  function wireMarkerTrackingEvents() {
    const marker = document.getElementById('hiro-ar-marker');
    const panel = document.getElementById('ar-electrical-panel');
    const statusText = document.getElementById('ar-tracking-status-text');
    const statusBadge = document.getElementById('ar-tracking-badge');
    const lostBanner = document.getElementById('ar-target-lost-banner');

    if (!marker) {
      setTimeout(wireMarkerTrackingEvents, 300);
      return;
    }

    // 1. Target Detected
    marker.addEventListener('markerFound', () => {
      console.log("[SkillSafe AR] HIRO Marker Detected!");
      AR_STATE.trackingState = 'detected';

      if (panel) panel.setAttribute('visible', 'true');
      if (lostBanner) lostBanner.style.display = 'none';

      if (statusText) statusText.textContent = 'Target Detected · 415V Panel Anchored';
      if (statusBadge) {
        statusBadge.style.color = '#10b981';
        const dot = statusBadge.querySelector('.ar-status-dot');
        if (dot) dot.style.background = '#10b981';
      }

      if (window.haptic) window.haptic('medium');
    });

    // 2. Target Lost
    marker.addEventListener('markerLost', () => {
      console.log("[SkillSafe AR] HIRO Marker Lost.");
      AR_STATE.trackingState = 'lost';

      if (panel) panel.setAttribute('visible', 'false');
      if (lostBanner) lostBanner.style.display = 'block';

      if (statusText) statusText.textContent = 'Target Lost · Reposition Camera';
      if (statusBadge) {
        statusBadge.style.color = '#ef4444';
        const dot = statusBadge.querySelector('.ar-status-dot');
        if (dot) dot.style.background = '#ef4444';
      }
    });
  }

  // -----------------------------------------------------------------------
  // Helper Modal: Full-Screen Digital Target (for Laptop / Secondary Device)
  // -----------------------------------------------------------------------
  window.openMarkerScreenModal = function() {
    const existing = document.getElementById('ar-digital-marker-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'ar-digital-marker-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,12,0.95);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999999;padding:16px;box-sizing:border-box';

    modal.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:20px;display:flex;flex-direction:column;align-items:center;max-width:440px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.8);text-align:center">
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center;margin-bottom:8px">
          <div style="font-size:12px;font-weight:800;color:#0f172a;letter-spacing:1px;text-transform:uppercase">HIRO TRACKING TARGET</div>
          <button onclick="document.getElementById('ar-digital-marker-modal').remove()" style="background:#f1f5f9;border:none;font-size:20px;line-height:1;border-radius:50%;width:32px;height:32px;cursor:pointer;color:#475569">&times;</button>
        </div>

        <div style="background:#fff;padding:16px;border:3px solid #0f172a;border-radius:12px;display:inline-block;margin:6px auto 12px">
          <img src="/hiro_marker.png" alt="HIRO AR Tracking Marker" style="width:min(240px, 36vh);height:min(240px, 36vh);display:block;image-rendering:pixelated">
        </div>

        <p style="font-size:12.5px;color:#334155;line-height:1.45;margin:0 0 14px">
          📱 <b>Point your mobile camera directly at this target.</b><br>
          Keep screen brightness high (&gt;80%) and hold phone 30–50 cm away.
        </p>

        <div style="display:flex;gap:8px;width:100%">
          <button class="b" onclick="document.getElementById('ar-digital-marker-modal').remove();window.toggleHiroFullscreen()" style="flex:1;background:#0284c7;font-size:12px;padding:8px">⛶ Fullscreen</button>
          <button class="b o" onclick="window.printHIROSheet()" style="flex:1;color:#0284c7;border-color:#0284c7;font-size:12px;padding:8px">🖨️ Print Sheet</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  window.printHIROSheet = function() {
    if (typeof window.go === 'function') {
      window.go('ar-print');
    }
  };

  // -----------------------------------------------------------------------
  // VIEW: 📱 AR Module Main Landing Card (`V.ar`)
  // -----------------------------------------------------------------------
  V.ar = function() {
    return `
      <div class="w" style="max-width:880px;margin:0 auto;padding:24px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
          <button class="b o" onclick="go('dash')" style="font-size:13px;padding:6px 14px">
            ⬅ Return to Dashboard
          </button>
          <div style="display:flex;gap:6px">
            <span class="tag a" style="font-size:11px">AR.JS + A-FRAME 1.3.0</span>
            <span class="tag ok" style="font-size:11px">HIRO MARKER TRACKED</span>
          </div>
        </div>

        <!-- Hero Card -->
        <div class="c" style="border:1.5px solid #38bdf8;box-shadow:0 12px 40px rgba(56,189,248,0.12);padding:28px 24px;border-radius:16px;background:linear-gradient(135deg,#0d1829 0%,#08101a 100%)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:18px">
            <div>
              <span class="tag" style="background:#0284c7;color:#fff;font-weight:700;letter-spacing:1px;font-size:10.5px">PRACTICAL VOCATIONAL INSPECTION</span>
              <h1 style="margin:8px 0 6px;font-size:clamp(24px,4vw,34px);color:#f8fafc">AR Electrical Panel Safety</h1>
              <p class="m" style="margin:0;font-size:15px;color:#94a3b8">
                Marker-based augmented reality inspection of an industrial 415V switchgear cabinet with real camera tracking and interactive spatial components.
              </p>
            </div>
            <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:10px 16px;text-align:center;min-width:110px">
              <span style="font-size:24px">⏱️</span>
              <div style="font-weight:800;font-size:14px;color:#38bdf8">3–5 Mins</div>
              <small style="color:#64748b;font-size:11px">Learner Estimate</small>
            </div>
          </div>

          <!-- Training Objectives Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:20px 0 24px">
            <div style="background:#0f172a;border:1px solid #1e293b;padding:12px 14px;border-radius:10px">
              <span style="font-size:20px">🎯</span>
              <h4 style="margin:6px 0 2px;color:#f8fafc;font-size:13.5px">Real Marker Tracking</h4>
              <p class="m" style="margin:0;font-size:12px">Lock onto standard HIRO training marker anchor via device camera feed.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:12px 14px;border-radius:10px">
              <span style="font-size:20px">🔬</span>
              <h4 style="margin:6px 0 2px;color:#f8fafc;font-size:13.5px">4 Key Components</h4>
              <p class="m" style="margin:0;font-size:12px">Inspect Circuit Breaker, Indicator Light, Emergency Stop, and Warning Placard.</p>
            </div>
            <div style="background:#0f172a;border:1px solid #1e293b;padding:12px 14px;border-radius:10px">
              <span style="font-size:20px">⚠️</span>
              <h4 style="margin:6px 0 2px;color:#f8fafc;font-size:13.5px">Hazard Challenge</h4>
              <p class="m" style="margin:0;font-size:12px">Detect non-compliant hazard communications and test safety knowledge.</p>
            </div>
          </div>

          <!-- Primary Launch Actions -->
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;padding:16px 0;border-top:1px solid #1e293b;border-bottom:1px solid #1e293b">
            <button id="btn-start-ar-training" class="b" onclick="window.startARCameraExperience()" style="font-size:15px;padding:12px 28px;box-shadow:0 0 25px rgba(56,189,248,0.4)">
              🚀 Start AR Training
            </button>
            <button class="b bw" onclick="go('ar-print')" style="font-size:14px;padding:11px 18px">
              🖨️ Printable HIRO Marker (A4 Sheet)
            </button>
            <button class="b o" onclick="go('ar-screen')" style="font-size:14px;padding:11px 18px">
              💻 Digital Target (Display on Laptop)
            </button>
          </div>

          <!-- Device & Camera Compatibility Note -->
          <div style="display:flex;align-items:flex-start;gap:12px;margin-top:20px;background:#09121d;border:1px solid #1e293b;padding:14px;border-radius:12px">
            <span style="font-size:24px">📷</span>
            <div style="font-size:12.5px;color:#94a3b8;line-height:1.5">
              <b style="color:#e2e8f0">Camera &amp; Device Compatibility Note:</b><br>
              • <b>HTTPS / Secure Context:</b> Camera access strictly requires HTTPS (live URL) or localhost.<br>
              • <b>Rear Camera:</b> On mobile devices, the environment-facing camera is automatically selected.<br>
              • <b>Privacy First:</b> No camera feed is ever recorded or uploaded to a server; computer vision tracking runs 100% locally on your device.<br>
              • <b>Tracking Anchor:</b> Hold your camera 30–50 cm from the HIRO marker in a well-lit area.
            </div>
          </div>
        </div>

        <!-- Educational Disclaimer Alert -->
        <div style="margin-top:20px;background:#172554;border:1px solid #1d4ed8;padding:14px 18px;border-radius:12px;display:flex;gap:12px;align-items:center">
          <span style="font-size:26px">🛡️</span>
          <div style="font-size:12.5px;color:#93c5fd;line-height:1.5">
            <b>Safety Notice:</b> This augmented reality module is a standardized educational training simulation. It is not an authorization to operate live electrical equipment or a substitute for qualified Lockout/Tagout procedures.
          </div>
        </div>
      </div>
    `;
  };

  // -----------------------------------------------------------------------
  // VIEW: 🖨️ Printable A4 HIRO Marker Sheet (`V['ar-print']`)
  // -----------------------------------------------------------------------
  V['ar-print'] = function() {
    return `
      <div class="w" style="max-width:820px;margin:0 auto;padding:20px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px" class="no-print">
          <button class="b o" onclick="go('ar')" style="font-size:13px;padding:6px 14px">
            ⬅ Return to AR Module
          </button>
          <button class="b" onclick="window.print()" style="font-size:13px;padding:8px 18px">
            🖨️ Print Marker Sheet (A4)
          </button>
        </div>

        <!-- A4 Printable Sheet Container -->
        <div id="printable-a4-sheet" style="background:#ffffff;color:#000000;padding:40px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.4);border:1px solid #cbd5e1;text-align:center">
          <div style="border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end">
            <div style="text-align:left">
              <h2 style="margin:0;font-size:22px;color:#000">SKILLSAFE VR · AR TRAINING TARGET</h2>
              <p style="margin:2px 0 0;font-size:12px;color:#475569">Module: AR Electrical Panel Safety · Standard HIRO Anchor</p>
            </div>
            <div style="text-align:right;font-size:11px;color:#64748b">
              <b>Format:</b> A4 Standard (100% Scale)<br>
              <b>Tracking:</b> AR.js / A-Frame 1.3.0
            </div>
          </div>

          <!-- The Official HIRO Marker Image (15cm x 15cm) -->
          <div style="display:inline-block;padding:16px;border:1px dashed #94a3b8;margin:10px auto">
            <img src="/hiro_marker.png" alt="Official HIRO Marker" style="width:260px;height:260px;display:block;image-rendering:pixelated">
            <div style="font-size:11px;color:#64748b;margin-top:8px">▲ TOP (ALIGN PANEL UPWARDS) ▲</div>
          </div>

          <!-- Printable Calibration & Usage Instructions -->
          <div style="text-align:left;max-width:540px;margin:20px auto 0;background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;font-size:12px;line-height:1.6;color:#334155">
            <b style="color:#0f172a;font-size:13px">📋 Printing &amp; Setup Instructions:</b>
            <ol style="margin:6px 0 0;padding-left:20px">
              <li><b>Print Scale:</b> In print settings, select <b>100% Scale</b> or <b>Actual Size</b> (Do NOT scale to fit).</li>
              <li><b>Placement:</b> Place on a flat, non-reflective horizontal surface (e.g. workshop bench or desk).</li>
              <li><b>Lighting:</b> Ensure even, bright room lighting. Avoid casting hard shadows across the black border.</li>
              <li><b>Camera Distance:</b> Hold phone camera <b>30 cm to 50 cm</b> from the marker.</li>
            </ol>
          </div>

          <div style="margin-top:24px;border-top:1px solid #e2e8f0;padding-top:10px;font-size:10.5px;color:#94a3b8">
            SkillSafe VR Vocational Training Platform · Educational Assessment Tool · Not an official equipment certification.
          </div>
        </div>
      </div>
    `;
  };

  // -----------------------------------------------------------------------
  // Helper: Fullscreen Pure-White Target Overlay
  // -----------------------------------------------------------------------
  window.toggleHiroFullscreen = function() {
    let fsOverlay = document.getElementById('hiro-fullscreen-overlay');
    if (fsOverlay) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(()=>{});
      }
      fsOverlay.remove();
      return;
    }

    fsOverlay = document.createElement('div');
    fsOverlay.id = 'hiro-fullscreen-overlay';
    fsOverlay.style.cssText = 'position:fixed;inset:0;background:#ffffff;z-index:99999999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;box-sizing:border-box';
    fsOverlay.innerHTML = `
      <div style="position:absolute;top:16px;right:16px;display:flex;gap:12px;align-items:center">
        <span style="font-size:12px;color:#64748b;font-weight:700">ESC to exit</span>
        <button onclick="window.toggleHiroFullscreen()" style="background:#0f172a;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.3)">
          ✕ Exit Fullscreen
        </button>
      </div>

      <div style="padding:28px;background:#ffffff;border:5px solid #000000;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,0.12)">
        <img src="/hiro_marker.png" alt="Official HIRO Marker" style="width:min(68vh, 68vw);height:min(68vh, 68vw);max-width:550px;max-height:550px;display:block;image-rendering:pixelated">
        <div style="text-align:center;font-size:13px;font-weight:800;color:#0f172a;margin-top:12px;letter-spacing:1px">▲ TOP ▲</div>
      </div>

      <div style="margin-top:16px;font-size:13px;color:#475569;font-weight:600">
        📱 Aim your phone camera directly at this target (30–50 cm distance)
      </div>
    `;

    document.body.appendChild(fsOverlay);

    if (fsOverlay.requestFullscreen) {
      fsOverlay.requestFullscreen().catch(()=>{});
    }

    const escListener = (e) => {
      if (e.key === 'Escape') {
        window.toggleHiroFullscreen();
        document.removeEventListener('keydown', escListener);
      }
    };
    document.addEventListener('keydown', escListener);
  };

  // -----------------------------------------------------------------------
  // VIEW: 💻 Full-Screen Digital Target for Laptop/Tablet (`V['ar-screen']`)
  // -----------------------------------------------------------------------
  V['ar-screen'] = function() {
    return `
      <div class="w" style="max-width:760px;margin:0 auto;padding:12px 16px;text-align:center">
        <!-- Compact Header Controls -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <button class="b o" onclick="go('ar')" style="font-size:12.5px;padding:6px 14px">
            ⬅ Return to AR Module
          </button>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="b" onclick="window.toggleHiroFullscreen()" style="font-size:12.5px;padding:6px 14px;background:#0284c7">
              ⛶ Fullscreen Target
            </button>
            <button class="b bw" onclick="go('ar-print')" style="font-size:12.5px;padding:6px 14px">
              🖨️ Print Sheet
            </button>
          </div>
        </div>

        <!-- Fully Visible Target Card (Fits completely in standard laptop viewport) -->
        <div id="hiro-digital-card" style="background:#ffffff;color:#000000;padding:20px;border-radius:16px;box-shadow:0 15px 50px rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center">
          <div style="margin-bottom:8px">
            <h3 style="margin:0;color:#0f172a;font-size:18px;font-weight:800;letter-spacing:0.5px">HIRO AR TRACKING TARGET</h3>
            <span style="font-size:12px;color:#64748b">Keep this open on your laptop/tablet and point your phone camera at it</span>
          </div>

          <!-- The Marker: Scaled responsively with generous quiet zone so it never clips -->
          <div style="display:inline-block;padding:20px;background:#ffffff;border:4px solid #0f172a;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,0.12);margin:4px auto 12px">
            <img id="hiro-display-img" src="/hiro_marker.png" alt="Official HIRO Marker" style="width:min(44vh, 65vw, 300px);height:min(44vh, 65vw, 300px);display:block;image-rendering:pixelated">
            <div style="font-size:11px;font-weight:700;color:#64748b;margin-top:6px">▲ TOP (ALIGN PANEL UPWARDS) ▲</div>
          </div>

          <!-- Quick Tip Bar -->
          <div style="max-width:440px;width:100%;font-size:12px;color:#475569;line-height:1.45;text-align:left;background:#f8fafc;border:1px solid #e2e8f0;padding:10px 14px;border-radius:8px">
            💡 <b>Tracking Tips:</b> Screen brightness <b>&gt;80%</b>. Hold phone steady <b>30–50 cm away</b> at a 45°–90° angle. Click <b>Fullscreen Target</b> for a glare-free full-screen display.
          </div>
        </div>
      </div>
    `;
  };

  // Initializers for AR Module views (prevents old mock camera from auto-launching)
  I.ar = function() {
    console.log("[SkillSafe AR] Initialized AR Electrical Panel Safety landing view.");
    if (window._ms) {
      try { window._ms.getTracks().forEach(t => t.stop()); } catch(e){}
      window._ms = null;
    }
    AR_STATE.active = false;
    AR_STATE.trackingState = 'idle';
  };
  I['ar-print'] = function() {
    console.log("[SkillSafe AR] Initialized printable HIRO sheet view.");
  };
  I['ar-screen'] = function() {
    console.log("[SkillSafe AR] Initialized digital screen target view.");
  };

  console.log("[SkillSafe VR] AR Electrical Panel Safety Module (Phase 1) loaded.");
})();
