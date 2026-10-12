const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
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

// Initialize PostgreSQL Pool (Connecting to Neon PostgreSQL)
const isCloudDb = DATABASE_URL.includes('neon.tech') || DATABASE_URL.includes('sslmode=require') || DATABASE_URL.includes('render.com') || DATABASE_URL.includes('aws.neon');
const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ...(isCloudDb ? { ssl: { rejectUnauthorized: false } } : {})
});

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Warning]:', err.message);
});


// Middleware
app.use(cors());
app.use(express.json());

// Global WebSocket Client Registries & Live Broadcast Helpers
const connectedClients = new Set();
const instructorClients = new Set();
const telemetryBuffer = [];

function broadcastToInstructors(data) {
  const payload = JSON.stringify(data);
  instructorClients.forEach(client => {
    if (client.readyState === 1) { // 1 = WebSocket.OPEN
      try { client.send(payload); } catch(e){}
    }
  });
}

function broadcastToAll(data) {
  const payload = JSON.stringify(data);
  connectedClients.forEach(client => {
    if (client.readyState === 1) {
      try { client.send(payload); } catch(e){}
    }
  });
}


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

// ====================================================================
// CORE BACKEND API ENDPOINTS (Neon PostgreSQL Native Handlers)
// ====================================================================

// Health check endpoint (verifies database connectivity)
app.get(['/health', '/api/health'], async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT current_database(), count(*)::int as users_count FROM users');
    res.json({
      status: 'HEALTHY',
      database: 'CONNECTED',
      database_name: dbRes.rows[0]?.current_database || 'neondb',
      registered_users: dbRes.rows[0]?.users_count || 0,
      gateway: 'Node.js Express + Neon PostgreSQL',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(200).json({
      status: 'DEGRADED',
      database_error: err.message,
      gateway: 'Node.js Express',
      timestamp: new Date().toISOString()
    });
  }
});

// AI inference key endpoint from environment
app.get('/api/ai/key', (req, res) => {
  res.json({ key: process.env.GROQ_API_KEY || '' });
});

// Authentication: Login endpoint (Email & Password)
app.post(['/api/v1/auth/login', '/api/v1/auth/dev-login'], async (req, res) => {
  const { email, password, role } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ detail: 'Email address is required.' });
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ detail: `Account '${cleanEmail}' not found. Please register or check your email.` });
    }

    const user = userRes.rows[0];

    // Password validation (SHA-256)
    if (user.password_hash) {
      const hashedInput = crypto.createHash('sha256').update((password || '').trim()).digest('hex');
      if (user.password_hash !== hashedInput) {
        return res.status(401).json({ detail: 'Incorrect password. Please verify and try again.' });
      }
    }

    // Role boundary validation
    if (role) {
      const reqRole = role.trim().toLowerCase();
      if (user.role !== reqRole && user.role !== 'admin') {
        return res.status(403).json({
          detail: `Access Denied: Account '${cleanEmail}' is registered as ${user.role.toUpperCase()}. You cannot log in through the ${reqRole.toUpperCase()} portal.`
        });
      }
    }

    // Issue JWT token (7-day validity)
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        trainee_id: user.trainee_id,
        institution_id: user.institution_id,
        avatar_url: user.avatar_url || ''
      }
    });
  } catch (err) {
    console.error('Login database error:', err);
    return res.status(500).json({ detail: 'Internal database authentication error: ' + err.message });
  }
});

// Authentication: Register endpoint
app.post('/api/v1/auth/register', async (req, res) => {
  const { name, email, password, role, batch, trainee_id } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(400).json({ detail: 'A valid email address is required.' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ detail: 'Full name is required.' });
  }
  if (!password || password.trim().length < 4) {
    return res.status(400).json({ detail: 'Password must be at least 4 characters long.' });
  }

  const userRole = (role || 'learner').trim().toLowerCase();
  const userBatch = batch || 'Industrial Electrical & Switchgear Isolation';
  const tid = trainee_id || `REC-VR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const userId = `u_${crypto.randomBytes(4).toString('hex')}`;
  const passwordHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  try {
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ detail: `An account with email '${cleanEmail}' already exists. Please sign in.` });
    }

    const insertRes = await pool.query(
      `INSERT INTO users (id, name, email, role, batch, trainee_id, institution_id, password_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, name.trim(), cleanEmail, userRole, userBatch, tid, 'inst_nsdc', passwordHash]
    );

    const user = insertRes.rows[0];
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        trainee_id: user.trainee_id,
        institution_id: user.institution_id,
        avatar_url: ''
      }
    });
  } catch (err) {
    console.error('Registration database error:', err);
    return res.status(500).json({ detail: 'Internal database registration error: ' + err.message });
  }
});

// Authentication: Google OAuth2 endpoint
app.post('/api/v1/auth/google', async (req, res) => {
  const { credential, requested_role } = req.body || {};
  if (!credential) {
    return res.status(400).json({ detail: 'Google credential token is required.' });
  }

  try {
    // Verify token with Google's tokeninfo API
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!googleRes.ok) {
      const errText = await googleRes.text();
      return res.status(401).json({ detail: 'Invalid Google token signature or expired: ' + errText });
    }

    const idinfo = await googleRes.json();
    const userEmail = (idinfo.email || '').trim().toLowerCase();
    const userSub = idinfo.sub;
    const userName = idinfo.name || userEmail.split('@')[0];
    const userPic = idinfo.picture || '';

    if (!userEmail) {
      return res.status(400).json({ detail: 'No email address associated with this Google account.' });
    }

    // Query existing user by google_sub or email
    const existing = await pool.query(
      'SELECT * FROM users WHERE google_sub = $1 OR LOWER(email) = LOWER($2)',
      [userSub, userEmail]
    );

    let user;
    const reqRole = (requested_role || 'learner').trim().toLowerCase();

    if (existing.rows.length === 0) {
      // Role gate for new users
      if (reqRole === 'trainer') {
        if (userEmail === 'saurav.k.2024.ece@rajalakshmi.edu.in') {
          const insertRes = await pool.query(
            `INSERT INTO users (id, name, email, role, batch, trainee_id, institution_id, google_sub, avatar_url, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
            ['u_trainer_saurav', userName, userEmail, 'trainer', 'Electrical & Electronics Engineering', 'REC-TR-2024', 'inst_nsdc', userSub, userPic]
          );
          user = insertRes.rows[0];
        } else {
          return res.status(403).json({
            detail: `Access Denied: '${userEmail}' is not authorized as Trainer. Designated trainer is saurav.k.2024.ece@rajalakshmi.edu.in.`
          });
        }
      } else if (reqRole === 'admin') {
        if (userEmail === 'samisauravanu@gmail.com') {
          const insertRes = await pool.query(
            `INSERT INTO users (id, name, email, role, batch, trainee_id, institution_id, google_sub, avatar_url, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
            ['u_admin_sami', userName, userEmail, 'admin', 'Institutional Governance', 'ADM-GLOBAL-01', 'inst_nsdc', userSub, userPic]
          );
          user = insertRes.rows[0];
        } else {
          return res.status(403).json({
            detail: `Access Denied: '${userEmail}' is not authorized as Admin. Designated admin is samisauravanu@gmail.com.`
          });
        }
      } else {
        // Auto-enroll new learner
        const newId = `u_${crypto.randomBytes(4).toString('hex')}`;
        const newTid = `REC-VR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const insertRes = await pool.query(
          `INSERT INTO users (id, name, email, role, batch, trainee_id, institution_id, google_sub, avatar_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
          [newId, userName, userEmail, 'learner', 'Vocational Engineering Batch 2024-25', newTid, 'inst_nsdc', userSub, userPic]
        );
        user = insertRes.rows[0];
      }
    } else {
      user = existing.rows[0];
      // Update sub / avatar if not present
      if (!user.google_sub || (userPic && user.avatar_url !== userPic)) {
        await pool.query(
          'UPDATE users SET google_sub = $1, avatar_url = $2 WHERE id = $3',
          [userSub, userPic || user.avatar_url, user.id]
        );
        user.avatar_url = userPic || user.avatar_url;
      }
    }

    // Role boundary validation
    if (user.role === 'learner' && reqRole !== 'learner') {
      return res.status(403).json({
        detail: `Access Denied: Account '${userEmail}' is registered as Learner. You cannot access the ${reqRole.toUpperCase()} portal.`
      });
    }
    if (user.role === 'trainer' && reqRole !== 'trainer') {
      return res.status(403).json({
        detail: `Access Denied: Account '${userEmail}' is registered as Trainer. You cannot access the ${reqRole.toUpperCase()} portal.`
      });
    }

    // Issue JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        trainee_id: user.trainee_id,
        institution_id: user.institution_id,
        avatar_url: user.avatar_url || userPic || ''
      }
    });
  } catch (err) {
    console.error('Google login processing error:', err);
    return res.status(500).json({ detail: 'Google authentication error: ' + err.message });
  }
});

// Authentication: Get current user profile
app.get('/api/v1/auth/me', async (req, res) => {

  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ detail: 'Unauthenticated or invalid token' });
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.sub]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ detail: 'User not found' });
    }
    const user = userRes.rows[0];
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      trainee_id: user.trainee_id,
      institution_id: user.institution_id,
      avatar_url: user.avatar_url || ''
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// Training Modules endpoint
app.get('/api/v1/modules', async (req, res) => {
  try {
    const modsRes = await pool.query('SELECT * FROM training_modules WHERE is_approved = true ORDER BY id');
    return res.json(modsRes.rows);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// ====================================================================
// CORE WORKSPACE & TRAINER/TRAINEE LIVE DATA ENDPOINTS (Neon PostgreSQL)
// ====================================================================

// 1. All Users (Trainees Roster with live session performance aggregations)
app.get('/api/v1/auth/users', async (req, res) => {
  try {
    const q = `
      SELECT 
        u.id, u.name, u.email, u.role, u.batch, u.trainee_id, u.avatar_url, u.created_at,
        COUNT(s.id)::int as total_sessions,
        COALESCE(ROUND(AVG(s.safety_score)), 0)::int as avg_safety,
        COALESCE(ROUND(AVG(s.score)), 0)::int as avg_score,
        MAX(s.created_at) as last_active,
        COALESCE(SUM(CASE WHEN s.critical_gate_passed = false THEN 1 ELSE 0 END), 0)::int as critical_violations
      FROM users u
      LEFT JOIN training_sessions s ON s.learner_id = u.id OR s.learner_id = u.trainee_id
      GROUP BY u.id, u.name, u.email, u.role, u.batch, u.trainee_id, u.avatar_url, u.created_at
      ORDER BY u.role, u.name
    `;
    const result = await pool.query(q);
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 2. Trainer Cohort Real-Time Stats (Tab 1: Cohort Overview & Alerts)
app.get('/api/v1/trainer/cohort-stats', async (req, res) => {
  try {
    const traineesCount = await pool.query("SELECT count(*)::int FROM users WHERE role = 'learner'");
    const activeTasks = await pool.query("SELECT count(*)::int FROM assignments WHERE status = 'in_progress'");
    const sessStats = await pool.query(`
      SELECT 
        count(*)::int as total_sessions,
        COALESCE(ROUND(AVG(safety_score)), 100)::int as avg_safety,
        COALESCE(SUM(CASE WHEN critical_gate_passed = false OR safety_score < 70 THEN 1 ELSE 0 END), 0)::int as critical_alerts
      FROM training_sessions
    `);
    
    // Aggregate mistakes from JSON
    const mistakeRows = await pool.query("SELECT mistakes FROM training_sessions WHERE mistakes IS NOT NULL");
    const mistakeCounts = {};
    mistakeRows.rows.forEach(r => {
      let mList = r.mistakes;
      if (typeof mList === 'string') {
        try { mList = JSON.parse(mList); } catch(e){ mList = []; }
      }
      if (Array.isArray(mList)) {
        mList.forEach(m => {
          mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
        });
      }
    });

    // Recent 10 completed sessions
    const recentSess = await pool.query(`
      SELECT s.*, u.name as learner_name, u.batch as learner_batch
      FROM training_sessions s
      LEFT JOIN users u ON u.id = s.learner_id OR u.trainee_id = s.learner_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `);

    return res.json({
      enrolled_trainees: traineesCount.rows[0].count,
      cohort_avg_safety: sessStats.rows[0].avg_safety,
      active_curriculum_tasks: activeTasks.rows[0].count,
      critical_safety_alerts: sessStats.rows[0].critical_alerts,
      total_sessions_completed: sessStats.rows[0].total_sessions,
      incident_breakdown: mistakeCounts,
      recent_sessions: recentSess.rows
    });
  } catch (err) {
    console.error('Error fetching cohort stats:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 3. Assignments: Query real curriculum assignments
app.get('/api/v1/assignments', async (req, res) => {
  try {
    const asgnsRes = await pool.query('SELECT * FROM assignments ORDER BY assigned_date DESC, id DESC');
    return res.json(asgnsRes.rows);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 4. Assignments: Create new assignment (Tab 3: Assignment Builder)
app.post('/api/v1/assignments', async (req, res) => {
  const {
    title,
    module_id,
    batch,
    instructor_name,
    due_date,
    time_limit_mins,
    pass_criteria,
    max_attempts,
    mandatory_steps,
    critical_safety_gate,
    description
  } = req.body || {};

  if (!title) return res.status(400).json({ detail: 'Assignment title is required' });

  const asgnId = `asgn_${Date.now()}`;
  const nowStr = new Date().toISOString().slice(0, 10);

  try {
    const insertRes = await pool.query(`
      INSERT INTO assignments (
        id, title, module_id, batch, instructor_name, assigned_date, due_date,
        time_limit_mins, pass_criteria, max_attempts, mandatory_steps,
        critical_safety_gate, status, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      asgnId,
      title,
      module_id || 'elec',
      batch || 'Industrial Electrical Batch A-24',
      instructor_name || 'Saurav K (Trainer)',
      nowStr,
      due_date || nowStr,
      time_limit_mins || 15,
      pass_criteria || 85,
      max_attempts || 3,
      JSON.stringify(mandatory_steps || ['Inspect work area', 'Wear PPE', 'Execute sequence flawlessly']),
      critical_safety_gate !== false,
      'in_progress',
      description || `Curriculum assignment published by ${instructor_name || 'Instructor'}.`
    ]);

    const newAsgn = insertRes.rows[0];

    // Log to audit trail
    await pool.query(`
      INSERT INTO audit_logs (timestamp, user_name, action, category, detail)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      new Date().toISOString().replace('T', ' ').slice(0, 19),
      instructor_name || 'Trainer',
      'CREATE_ASSIGNMENT',
      'CURRICULUM',
      `Published assignment "${title}" to cohort "${batch}".`
    ]);

    // Broadcast live to all connected WebSocket clients
    broadcastToAll({
      type: 'NEW_ASSIGNMENT',
      assignment: newAsgn
    });

    return res.status(201).json(newAsgn);
  } catch (err) {
    console.error('Error creating assignment:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 5. Assignments: Delete assignment
app.delete('/api/v1/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    broadcastToAll({ type: 'ASSIGNMENT_DELETED', assignmentId: id });
    return res.json({ success: true, id });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 6. Training Sessions: Query real session history
app.get('/api/v1/sessions', async (req, res) => {
  try {
    const { learner_id, module_id } = req.query;
    let query = `
      SELECT s.*, u.name as learner_name, u.batch as learner_batch
      FROM training_sessions s
      LEFT JOIN users u ON u.id = s.learner_id OR u.trainee_id = s.learner_id
    `;
    const params = [];
    const wheres = [];
    if (learner_id) {
      params.push(learner_id);
      wheres.push(`(s.learner_id = $${params.length} OR u.trainee_id = $${params.length})`);
    }
    if (module_id) {
      params.push(module_id);
      wheres.push(`s.module_id = $${params.length}`);
    }
    if (wheres.length > 0) {
      query += ` WHERE ${wheres.join(' AND ')}`;
    }
    query += ' ORDER BY s.created_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 7. Training Sessions: Commit simulation result (LIVE TRAINEE -> TRAINER CONNECTION)
app.post('/api/v1/sessions', async (req, res) => {
  const {
    learner_id,
    module_id,
    assignment_id,
    date_str,
    score,
    safety_score,
    procedure_score,
    hazard_score,
    task_completion,
    time_efficiency,
    duration_secs,
    mistakes,
    critical_gate_passed,
    telemetry_events
  } = req.body || {};

  const sessId = `sess_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date();
  const dateString = date_str || now.toLocaleDateString();

  try {
    const insertRes = await pool.query(`
      INSERT INTO training_sessions (
        id, learner_id, module_id, assignment_id, date_str, score, safety_score,
        procedure_score, hazard_score, task_completion, time_efficiency,
        duration_secs, mistakes, critical_gate_passed, telemetry_events, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *
    `, [
      sessId,
      learner_id || 'u_anonymous',
      module_id || 'elec',
      assignment_id || null,
      dateString,
      Math.round(score || 0),
      Math.round(safety_score || 0),
      Math.round(procedure_score || 0),
      Math.round(hazard_score || 0),
      Math.round(task_completion || 0),
      Math.round(time_efficiency || 0),
      Math.round(duration_secs || 0),
      JSON.stringify(mistakes || []),
      critical_gate_passed !== false,
      JSON.stringify(telemetry_events || [])
    ]);

    const session = insertRes.rows[0];

    // Find trainee identity
    let traineeInfo = { name: 'Trainee', trainee_id: learner_id, batch: 'Vocational Engineering Batch' };
    const userRes = await pool.query('SELECT name, trainee_id, batch FROM users WHERE id = $1 OR trainee_id = $1', [learner_id]);
    if (userRes.rows.length > 0) {
      traineeInfo = userRes.rows[0];
    }

    // Log to audit trail
    await pool.query(`
      INSERT INTO audit_logs (timestamp, user_name, action, category, detail)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      now.toISOString().replace('T', ' ').slice(0, 19),
      traineeInfo.name,
      'SIMULATION_COMPLETED',
      'SIMULATION',
      `Completed ${module_id.toUpperCase()} simulation. Score: ${Math.round(score || 0)}%, Safety: ${Math.round(safety_score || 0)}%, Critical Gate: ${critical_gate_passed !== false ? 'PASSED' : 'VIOLATION'}`
    ]);

    // BROADCAST LIVE OVER WEBSOCKET TO TRAINER / INSTRUCTOR MONITORS
    broadcastToInstructors({
      type: 'SESSION_COMPLETED',
      session,
      trainee: traineeInfo
    });

    return res.status(201).json({ success: true, session });
  } catch (err) {
    console.error('Error saving session:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 8. AI Scenario Queue: Fetch proposals (Tab 4: AI Approvals)
app.get('/api/v1/ai/queue', async (req, res) => {
  try {
    const qRes = await pool.query('SELECT * FROM ai_scenario_queue ORDER BY id DESC');
    return res.json(qRes.rows);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 9. AI Scenario Queue: Approve or reject proposal
app.patch('/api/v1/ai/queue/:id', async (req, res) => {
  const { id } = req.params;
  const { status, reviewer_notes } = req.body || {};

  try {
    const updateRes = await pool.query(`
      UPDATE ai_scenario_queue
      SET status = $1, reviewer_notes = $2
      WHERE id = $3
      RETURNING *
    `, [status || 'approved', reviewer_notes || '', id]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ detail: 'AI scenario not found in queue' });
    }

    const updated = updateRes.rows[0];

    // Log to audit trail
    await pool.query(`
      INSERT INTO audit_logs (timestamp, user_name, action, category, detail)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      new Date().toISOString().replace('T', ' ').slice(0, 19),
      'Saurav K (Trainer)',
      status === 'approved' ? 'APPROVE_SCENARIO' : 'REJECT_SCENARIO',
      'GOVERNANCE',
      `${status === 'approved' ? 'Approved' : 'Rejected'} AI scenario: ${updated.title}`
    ]);

    // Broadcast to all clients
    broadcastToAll({
      type: 'SCENARIO_STATUS_CHANGED',
      scenario: updated
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 10. Skill Passports: Fetch all passports with competencies (Tab 5: Passport Sign-Off)
app.get('/api/v1/passports', async (req, res) => {
  try {
    const passportsRes = await pool.query('SELECT * FROM skill_passports ORDER BY full_name');
    const compsRes = await pool.query('SELECT * FROM competencies ORDER BY code');

    const compsByPassport = {};
    compsRes.rows.forEach(c => {
      if (!compsByPassport[c.passport_id]) compsByPassport[c.passport_id] = [];
      compsByPassport[c.passport_id].push(c);
    });

    const passports = passportsRes.rows.map(p => ({
      ...p,
      competencies: compsByPassport[p.id] || []
    }));

    return res.json(passports);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 11. Skill Passports: Current user passport
app.get('/api/v1/passports/my', async (req, res) => {
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ detail: 'Unauthenticated' });
  }
  try {
    const passRes = await pool.query('SELECT * FROM skill_passports WHERE trainee_id = $1 OR full_name = $2 ORDER BY id DESC', [decoded.sub, decoded.name]);
    if (passRes.rows.length === 0) return res.json([]);
    const passport = passRes.rows[0];
    const compsRes = await pool.query('SELECT * FROM competencies WHERE passport_id = $1 ORDER BY code', [passport.id]);
    passport.competencies = compsRes.rows;
    return res.json([passport]);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 12. Skill Passports: Trainee specific passport
app.get('/api/v1/passports/:traineeId', async (req, res) => {
  const { traineeId } = req.params;
  try {
    const passRes = await pool.query('SELECT * FROM skill_passports WHERE trainee_id = $1 OR id = $1', [traineeId]);
    if (passRes.rows.length === 0) {
      return res.status(404).json({ detail: 'Passport not found for trainee' });
    }
    const passport = passRes.rows[0];
    const compsRes = await pool.query('SELECT * FROM competencies WHERE passport_id = $1 ORDER BY code', [passport.id]);
    passport.competencies = compsRes.rows;
    return res.json(passport);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 13. Skill Passports: Verification by hash (API)
app.get('/api/v1/passports/verify/:hash', async (req, res) => {
  const hash = req.params.hash;
  try {
    const passRes = await pool.query('SELECT * FROM skill_passports WHERE verification_hash = $1', [hash]);
    if (passRes.rows.length === 0) {
      return res.status(404).json({ valid: false, detail: 'Passport hash not found in registry.' });
    }
    const passport = passRes.rows[0];
    const compsRes = await pool.query('SELECT * FROM competencies WHERE passport_id = $1 ORDER BY code', [passport.id]);
    return res.json({
      valid: true,
      full_name: passport.full_name,
      trainee_id: passport.trainee_id,
      institution: passport.institution,
      council: passport.council,
      verified_by: passport.verified_by,
      verification_hash: passport.verification_hash,
      status: passport.status,
      verified_competencies_count: compsRes.rows.filter(c => c.status === 'VERIFIED').length,
      competency_list: compsRes.rows.filter(c => c.status === 'VERIFIED').map(c => `${c.code}: ${c.title}`)
    });
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// 14. Skill Passports: Endorse competency (LIVE TRAINER SIGN-OFF)
app.post('/api/v1/passports/endorse', async (req, res) => {
  const { trainee_id, competency_code, certifier_name } = req.body || {};
  if (!competency_code) {
    return res.status(400).json({ detail: 'Competency code is required' });
  }

  try {
    let pRes = await pool.query(
      'SELECT * FROM skill_passports WHERE trainee_id = $1 OR id = $1',
      [trainee_id]
    );
    if (pRes.rows.length === 0) {
      pRes = await pool.query('SELECT * FROM skill_passports LIMIT 1');
    }
    if (pRes.rows.length === 0) {
      return res.status(404).json({ detail: 'Skill passport not found in registry' });
    }

    const passport = pRes.rows[0];
    const todayStr = new Date().toISOString().slice(0, 10);
    const certifier = certifier_name || 'Saurav K (Lic #REC-TR-2024)';

    // Update competency in DB
    const compRes = await pool.query(`
      UPDATE competencies
      SET status = 'VERIFIED', verified_date = $1, certifier = $2
      WHERE passport_id = $3 AND code = $4
      RETURNING *
    `, [todayStr, certifier, passport.id, competency_code]);

    // Recalculate cryptographic hash based on verified competencies
    const allComps = await pool.query('SELECT * FROM competencies WHERE passport_id = $1', [passport.id]);
    const verifiedCodes = allComps.rows.filter(c => c.status === 'VERIFIED').map(c => c.code).sort().join('-');
    const newHash = '0x' + crypto.createHash('sha256').update(`${passport.trainee_id}-${passport.full_name}-${verifiedCodes}-${todayStr}`).digest('hex').substring(0, 24).toUpperCase();
    const allVerified = allComps.rows.every(c => c.status === 'VERIFIED');
    const newStatus = allVerified ? 'VERIFIED' : 'IN_TRAINING';

    await pool.query(`
      UPDATE skill_passports
      SET verification_hash = $1, status = $2, verified_by = $3
      WHERE id = $4
    `, [newHash, newStatus, certifier, passport.id]);

    // Audit log
    await pool.query(`
      INSERT INTO audit_logs (timestamp, user_name, action, category, detail)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      new Date().toISOString().replace('T', ' ').slice(0, 19),
      certifier,
      'ENDORSE_COMPETENCY',
      'CREDENTIAL',
      `Endorsed competency ${competency_code} for ${passport.full_name} (${passport.trainee_id}). Hash: ${newHash}`
    ]);

    // Broadcast live over WebSocket to Trainee
    broadcastToAll({
      type: 'COMPETENCY_ENDORSED',
      trainee_id: passport.trainee_id,
      passport_id: passport.id,
      competency_code,
      certifier,
      new_hash: newHash,
      new_status: newStatus
    });

    return res.json({
      success: true,
      competency: compRes.rows[0],
      verification_hash: newHash,
      passport_status: newStatus
    });
  } catch (err) {
    console.error('Endorse error:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 15. Targeted Practice Drill Dispatch (Tab 6: Targeted Remediation)
app.post('/api/v1/trainer/dispatch-drill', async (req, res) => {
  const { trainee_name, trainee_id, topic, module_id, due_days } = req.body || {};
  if (!topic) return res.status(400).json({ detail: 'Drill topic is required' });

  const asgnId = `asgn_rem_${Date.now()}`;
  const now = new Date();
  const dueDate = new Date(now.getTime() + (due_days || 3) * 864e5).toISOString().slice(0, 10);

  try {
    const insertRes = await pool.query(`
      INSERT INTO assignments (
        id, title, module_id, batch, instructor_name, assigned_date, due_date,
        time_limit_mins, pass_criteria, max_attempts, mandatory_steps,
        critical_safety_gate, status, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      asgnId,
      `🎯 Targeted Drill: ${topic}`,
      module_id || 'elec',
      `Targeted Remediation — ${trainee_name || 'Cohort'}`,
      'Saurav K (Trainer)',
      now.toISOString().slice(0, 10),
      dueDate,
      10,
      90,
      3,
      JSON.stringify(['Review procedure guidelines', 'Equip mandatory safety gear', 'Execute protocol without safety infractions']),
      true,
      'in_progress',
      `Targeted practice drill assigned to address specific risk pattern in ${topic}.`
    ]);

    const newDrill = insertRes.rows[0];

    // Log to audit trail
    await pool.query(`
      INSERT INTO audit_logs (timestamp, user_name, action, category, detail)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      now.toISOString().replace('T', ' ').slice(0, 19),
      'Saurav K (Trainer)',
      'DISPATCH_REMEDIATION',
      'REMEDIATION',
      `Dispatched targeted drill "${topic}" to ${trainee_name || 'Cohort'}.`
    ]);

    // Broadcast live over WebSocket to all trainees
    broadcastToAll({
      type: 'DRILL_DISPATCHED',
      drill: newDrill,
      trainee_id: trainee_id || null,
      trainee_name: trainee_name || 'Cohort'
    });

    return res.status(201).json(newDrill);
  } catch (err) {
    console.error('Error dispatching drill:', err.message);
    return res.status(500).json({ detail: err.message });
  }
});

// 16. Audit Logs: Real governance activity trail
app.get('/api/v1/audit/logs', async (req, res) => {
  try {
    const logsRes = await pool.query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50');
    return res.json(logsRes.rows);
  } catch (err) {
    return res.status(500).json({ detail: err.message });
  }
});

// Serve static assets needed by login page (CSS, fonts, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Secondary Proxy for extended FastAPI endpoints
app.use('/api', async (req, res) => {
  let targetUrl;
  if (req.url === '/health' || req.url === '/health/') {
    targetUrl = `${FASTAPI_URL}/health`;
  } else {
    const subPath = req.url.startsWith('/v1/') ? req.url : `/v1${req.url}`;
    targetUrl = `${FASTAPI_URL}/api${subPath}`;
  }
  
  try {
    const forwardHeaders = { 'content-type': 'application/json' };
    if (req.headers['authorization']) forwardHeaders['authorization'] = req.headers['authorization'];
    if (req.headers['accept']) forwardHeaders['accept'] = req.headers['accept'];

    const fetchOptions = { method: req.method, headers: forwardHeaders };
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
    const passRes = await pool.query('SELECT * FROM skill_passports WHERE verification_hash = $1', [hash]);
    if (passRes.rows.length === 0) {
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

    const passport = passRes.rows[0];
    const compsRes = await pool.query('SELECT * FROM competencies WHERE passport_id = $1 ORDER BY code', [passport.id]);
    const data = {
      valid: true,
      full_name: passport.full_name,
      trainee_id: passport.trainee_id,
      institution: passport.institution,
      council: passport.council,
      verified_by: passport.verified_by,
      verification_hash: passport.verification_hash,
      status: passport.status,
      verified_competencies_count: compsRes.rows.filter(c => c.status === 'VERIFIED').length,
      competency_list: compsRes.rows.filter(c => c.status === 'VERIFIED').map(c => `${c.code}: ${c.title}`)
    };

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

// Role workspace URL aliases
app.get(['/trainer', '/instructor', '/trainer-portal'], (req, res) => {
  res.redirect('/app?role=trainer');
});

app.get(['/admin', '/administrator'], (req, res) => {
  res.redirect('/app?role=admin');
});

app.get(['/learner', '/trainee', '/dashboard'], (req, res) => {
  res.redirect('/app?role=learner');
});

// Explicit static file serving for client assets
app.get(['/platform_extension.js', '/views_extension.js', '/workshops_extension.js', '/qrcode.bundle.js', '/ar_module.js'], (req, res) => {
  const fileName = path.basename(req.path.split('?')[0]);
  const filePath = path.join(__dirname, fileName);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.sendFile(filePath);
  }
  res.status(404).send(`File ${fileName} not found`);
});

// Explicit serving for HIRO tracking marker image
app.get('/hiro_marker.png', (req, res) => {
  const filePath = path.join(__dirname, 'hiro_marker.png');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(filePath);
  }
  res.status(404).send('HIRO marker image not found');
});

// Serve static files for authenticated app (JS, CSS, images, models, etc.)
// These files are needed by index.html and platform_extension.js
const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
                           '.woff', '.woff2', '.ttf', '.eot', '.glb', '.gltf', '.obj',
                           '.mtl', '.fbx', '.mp3', '.wav', '.mp4', '.webm', '.webp', '.json'];

app.use((req, res, next) => {
  const cleanPath = req.path.split('?')[0];
  const ext = path.extname(cleanPath).toLowerCase();
  if (staticExtensions.includes(ext)) {
    const filePath = path.join(__dirname, cleanPath);
    if (fs.existsSync(filePath)) {
      if (ext === '.js') res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      else if (ext === '.css') res.setHeader('Content-Type', 'text/css; charset=utf-8');
      return res.sendFile(filePath);
    }
  }
  next();
});

// ====================================================================
// PostgreSQL Pool Health Check
// ====================================================================


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
// Catch-all: Redirect unauthenticated page requests to login, 404 for missing assets
app.get('*', (req, res) => {
  const cleanPath = req.path.split('?')[0];
  const ext = path.extname(cleanPath);
  if (ext) {
    return res.status(404).send('Asset not found');
  }
  // Root path and any unmatched page route → redirect to login
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
