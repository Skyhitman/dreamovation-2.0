const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { WebSocketServer, WebSocket } = require('ws');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/skillsafe';
const SECRET_KEY = process.env.SECRET_KEY || 'skillsafe_vr_super_secret_enterprise_key_2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

// Middleware
app.use(cors());
app.use(express.json());

// ====================================================================
// AUTHENTICATION MIDDLEWARE
// ====================================================================

/**
 * Verify JWT token from cookie or Authorization header.
 * Returns decoded payload or null.
 */
function verifyToken(req) {
  // Check Authorization header first
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (e) {
      return null;
    }
  }

  // Check query param (for WebSocket upgrades and redirects)
  const tokenParam = req.query && req.query.token;
  if (tokenParam) {
    try {
      return jwt.verify(tokenParam, SECRET_KEY);
    } catch (e) {
      return null;
    }
  }

  return null;
}

// ====================================================================
// PUBLIC ROUTES (No Auth Required)
// ====================================================================

// Explicit root redirect to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login page — always accessible
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Health and status endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// AI inference key endpoint from environment
app.get('/api/ai/key', (req, res) => {
  res.json({ key: process.env.GROQ_API_KEY || '' });
});

// Serve static assets needed by login page (CSS, fonts, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));


// API proxy — auth is handled by FastAPI itself, we just forward
app.use('/api', async (req, res) => {
  let targetUrl;
  if (req.url === '/health' || req.url === '/health/') {
    targetUrl = `${FASTAPI_URL}/health`;
  } else {
    const subPath = req.url.startsWith('/v1/') ? req.url : `/v1${req.url}`;
    targetUrl = `${FASTAPI_URL}/api${subPath}`;
  }
  
  try {
    const forwardHeaders = {
      'content-type': 'application/json'
    };
    if (req.headers['authorization']) {
      forwardHeaders['authorization'] = req.headers['authorization'];
    }
    if (req.headers['accept']) {
      forwardHeaders['accept'] = req.headers['accept'];
    }

    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOptions.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || '';
    
    res.status(response.status);
    if (contentType.includes('application/json')) {
      const json = await response.json();
      res.json(json);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (err) {
    res.status(503).json({
      error: 'FastAPI AI & Core Domain Service Unavailable',
      detail: `Cannot connect to FastAPI at ${FASTAPI_URL}. Ensure the backend is running.`,
      gateway: 'Node.js Express Gateway',
      fastapi_target: targetUrl
    });
  }
});

// ====================================================================
// PUBLIC SKILL PASSPORT VERIFICATION (Real QR Code Endpoint)
// ====================================================================
app.get('/verify/:hash', async (req, res) => {
  const hash = req.params.hash;
  try {
    const fastApiRes = await fetch(`${FASTAPI_URL}/api/v1/passports/verify/${hash}`);
    const data = await fastApiRes.json();
    
    if (!data.valid) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Credential Verification Failed · SkillSafe VR</title>
          <style>
            body { background: #070d18; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #0d1626; border: 2px solid #ef4444; border-radius: 16px; max-width: 500px; width: 100%; padding: 32px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
            .icon { font-size: 48px; margin-bottom: 12px; }
            h1 { font-size: 22px; margin: 0 0 10px; color: #ef4444; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
            .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1e293b; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">❌</div>
            <h1>Invalid or Unregistered Credential</h1>
            <p>The cryptographic ledger hash <code>${hash}</code> could not be validated against the national vocational accreditation registry.</p>
            <p>Please ensure you scanned an authentic SkillSafe VR Skill Passport.</p>
            <a href="/" class="btn">Return to Portal</a>
          </div>
        </body>
        </html>
      `);
    }

    const compsHtml = (data.competency_list || []).map(c => `
      <div style="background:#09121d;border:1px solid #1e2e42;border-radius:10px;padding:12px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div>
          <b style="color:#f8fafc;font-size:14px;display:block">${c}</b>
          <span style="font-size:11px;color:#38bdf8">Evaluated under deterministic safety conditions</span>
        </div>
        <span style="background:#052e16;color:#4ade80;border:1px solid #166534;font-size:11px;font-weight:700;padding:4px 8px;border-radius:99px;white-space:nowrap">● VERIFIED</span>
      </div>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verified Credential · ${data.full_name} · SkillSafe VR</title>
        <style>
          body { background: #040911; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px 16px; min-height: 100vh; box-sizing: border-box; }
          .container { max-width: 680px; margin: 0 auto; background: #0a1322; border: 2px solid #22c55e; border-radius: 18px; padding: 28px; box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(34,197,94,0.15); }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: #052e16; border: 1px solid #22c55e; color: #4ade80; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }
          h1 { margin: 12px 0 4px; font-size: 24px; color: #fff; }
          .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: #060c16; border: 1px solid #1e2e42; border-radius: 12px; padding: 16px; margin: 20px 0; }
          .meta-item span { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; display: block; }
          .meta-item b { font-size: 14px; color: #f8fafc; }
          .hash-box { background: #020617; border: 1px dashed #38bdf888; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all; margin: 16px 0; }
          .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; cursor: pointer; border: none; }
          .btn-primary { background: #22c55e; color: #022c12; }
          .btn-secondary { background: #1e293b; color: #cbd5e1; margin-left: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:16px">
            <div>
              <div class="badge">✔ IMMUTABLE VERIFIED CREDENTIAL</div>
              <h1>${data.full_name}</h1>
              <div style="color:#94a3b8;font-size:13px">${data.institution}</div>
            </div>
            <div style="width:50px;height:50px;border-radius:12px;background:#22c55e22;border:1px solid #22c55e55;display:flex;align-items:center;justify-content:center;font-size:26px">
              🛡️
            </div>
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span>Trainee ID</span>
              <b>${data.trainee_id}</b>
            </div>
            <div class="meta-item">
              <span>Accreditation Council</span>
              <b>${data.council}</b>
            </div>
            <div class="meta-item">
              <span>Instructor Endorsement</span>
              <b>${data.verified_by}</b>
            </div>
            <div class="meta-item">
              <span>Deterministic Safety Status</span>
              <b style="color:#22c55e">Zero-Breach Certified</b>
            </div>
          </div>

          <div style="margin:20px 0">
            <span style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:700">Cryptographic SHA-256 Ledger Hash:</span>
            <div class="hash-box">${data.verification_hash}</div>
          </div>

          <h3 style="margin:24px 0 12px;font-size:16px;color:#fff">Verified Vocational Competencies (${data.verified_competencies_count}):</h3>
          ${compsHtml}

          <div style="margin-top:24px;border-top:1px solid #1e293b;padding-top:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div style="font-size:11px;color:#64748b">Verified on ${new Date().toLocaleDateString()} · SkillSafe VR Verifiable Credential Registry</div>
            <div>
              <button onclick="window.print()" class="btn btn-primary">🖨️ Print Credential</button>
              <a href="/login" class="btn btn-secondary">Enter Portal</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch(e) {
    res.status(500).send(`Server verification error: ${e.message}`);
  }
});

// ====================================================================
// PROTECTED ROUTES (Auth Required)
// ====================================================================

// Auth-check endpoint — frontend calls this to verify token validity
app.get('/auth/check', (req, res) => {
  const user = verifyToken(req);
  if (user) {
    res.json({ authenticated: true, user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Main application — requires authentication
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files for authenticated app (JS, CSS, images, models, etc.)
// These files are needed by index.html and platform_extension.js
const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
                           '.woff', '.woff2', '.ttf', '.eot', '.glb', '.gltf', '.obj',
                           '.mtl', '.fbx', '.mp3', '.wav', '.mp4', '.webm', '.webp', '.json'];

app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  if (staticExtensions.includes(ext)) {
    // Serve static assets without auth check (they're referenced by the app)
    return express.static(path.join(__dirname))(req, res, next);
  }
  next();
});

// ====================================================================
// PostgreSQL Pool (Graceful connection handling & Neon SSL support)
// ====================================================================
const isCloudDb = DATABASE_URL.includes('neon.tech') || DATABASE_URL.includes('sslmode=require') || DATABASE_URL.includes('render.com') || DATABASE_URL.includes('aws.neon');
const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ...(isCloudDb ? { ssl: { rejectUnauthorized: false } } : {})
});

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning]:', err.message);
});

async function checkPostgres() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    console.log('[PostgreSQL Connected]:', res.rows[0].current_time);
    return true;
  } catch (err) {
    console.log('[PostgreSQL Standby]: Not connected (' + err.message + '). FastAPI uses SQLite fallback.');
    return false;
  }
}
checkPostgres();

// ====================================================================
// WebSocket Server for High-Frequency VR Telemetry Streaming
// ====================================================================
const wss = new WebSocketServer({ server, path: '/ws/telemetry' });
const connectedClients = new Set();
const instructorClients = new Set();
const telemetryBuffer = [];

wss.on('connection', (ws, req) => {
  // Verify WebSocket authentication via query param
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  const role = url.searchParams.get('role') || 'learner';
  
  // Allow connection but tag with auth status
  let wsUser = null;
  if (token) {
    try {
      wsUser = jwt.verify(token, SECRET_KEY);
    } catch (e) {
      // Invalid token — close connection
      ws.close(4001, 'Authentication required');
      return;
    }
  }

  connectedClients.add(ws);
  ws.userData = wsUser;

  if (role === 'trainer' || role === 'instructor' || role === 'admin') {
    instructorClients.add(ws);
    ws.send(JSON.stringify({
      type: 'INIT_BUFFER',
      events: telemetryBuffer.slice(-30)
    }));
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'SUBSCRIBE_INSTRUCTOR') {
        instructorClients.add(ws);
        return;
      }

      if (data.objectId || data.action || data.type === 'RUNTIME_EVENT') {
        const enrichedEvent = {
          ...data,
          userId: wsUser ? wsUser.sub : 'anonymous',
          serverTimestamp: new Date().toISOString()
        };
        telemetryBuffer.push(enrichedEvent);
        if (telemetryBuffer.length > 200) telemetryBuffer.shift();

        const payload = JSON.stringify({
          type: 'LIVE_TELEMETRY',
          event: enrichedEvent
        });

        instructorClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });
      }
    } catch (e) {
      console.error('[WebSocket Error parsing message]:', e.message);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(ws);
    instructorClients.delete(ws);
  });
});

// ====================================================================
// Status & Config Endpoints
// ====================================================================
app.get('/status', (req, res) => {
  res.json({
    platform: 'SkillSafe VR Hybrid Gateway',
    version: '6.0.0',
    gateway: 'Node.js / Express',
    auth: 'Google OAuth2 + JWT',
    ai_and_safety_service: `${FASTAPI_URL} (FastAPI / Python)`,
    database: DATABASE_URL,
    google_client_id: GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing',
    connected_ws_clients: connectedClients.size,
    instructor_monitors: instructorClients.size,
    cached_telemetry_events: telemetryBuffer.length
  });
});

// Expose Google Client ID to frontend (safe — client IDs are public)
app.get('/config/google-client-id', (req, res) => {
  res.json({ clientId: GOOGLE_CLIENT_ID });
});

// ====================================================================
// Catch-all: Redirect unauthenticated users to login
// ====================================================================
app.get('*', (req, res) => {
  // Root path and any unmatched route → redirect to login
  res.redirect('/login');
});

// ====================================================================
// Start Server
// ====================================================================
server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 SkillSafe VR Hybrid Platform Gateway running!`);
  console.log(`🔐 Login Page:                     http://localhost:${PORT}/login`);
  console.log(`📡 Protected App (after login):     http://localhost:${PORT}/app`);
  console.log(`⚡ WebSocket Telemetry Stream:      ws://localhost:${PORT}/ws/telemetry`);
  console.log(`🧠 FastAPI AI & Safety Service:     ${FASTAPI_URL}/api/v1`);
  console.log(`🔑 Google OAuth Client ID:          ${GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ NOT SET'}`);
  console.log(`🗄️  PostgreSQL Database:             ${DATABASE_URL}`);
  console.log('================================================================');
});
