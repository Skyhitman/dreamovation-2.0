const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const STANDARD_COMPETENCIES = [
  {
    code: 'ELE-VR-01',
    title: 'Live Voltage Isolation & LOTO Verification',
    standard: 'OSHA 1910.147 / IS 5216',
    level: 'Level 4 (Autonomous Operator)',
    status: 'IN_TRAINING',
    evidence: 'Requires 3D Switchgear isolation run with zero arc flash infractions.'
  },
  {
    code: 'ELE-VR-02',
    title: 'Arc Flash PPE Category IV Deployment',
    standard: 'NFPA 70E Standard 2024',
    level: 'Level 4 (Autonomous Operator)',
    status: 'IN_TRAINING',
    evidence: 'Requires full 40 cal/cm² suit donning and face shield sequence in VR.'
  },
  {
    code: 'WLD-VR-01',
    title: 'GMAW Multi-Pass Groove Weld in 3G Position',
    standard: 'AWS D1.1 Structural Welding Code',
    level: 'Level 3 (Supervised Specialist)',
    status: 'IN_TRAINING',
    evidence: 'Requires 15 deg electrode angle and bead width compliance in welding bay.'
  },
  {
    code: 'WLD-VR-02',
    title: 'Shielding Gas Pre-Flow & Cylinder Safety',
    standard: 'ISO 3834-2 / OSHA 1926.350',
    level: 'Level 4 (Autonomous Operator)',
    status: 'IN_TRAINING',
    evidence: 'Requires pre-flow timer calibration and zero-leak cylinder valve verification.'
  },
  {
    code: 'EMR-VR-01',
    title: 'Electrical Shock Emergency Response & CPR',
    standard: 'Red Cross Industrial First Aid 2025',
    level: 'Level 3 (Practitioner)',
    status: 'IN_TRAINING',
    evidence: 'Requires emergency stop procedure & simulated shock response drill.'
  }
];

async function seed() {
  try {
    console.log('--- Seeding Live Database Tables ---');

    // 1. Ensure all learners have a Skill Passport and Competencies
    const learners = await pool.query("SELECT * FROM users WHERE role = 'learner'");
    console.log(`Found ${learners.rows.length} real learners in users table.`);

    for (const l of learners.rows) {
      const passportId = `sp_${l.id}`;
      const hash = '0x' + crypto.createHash('sha256').update(`${l.id}-${l.trainee_id}-${l.name}-REC-2026`).digest('hex').substring(0, 24).toUpperCase();
      
      const existingSp = await pool.query("SELECT id FROM skill_passports WHERE trainee_id = $1", [l.trainee_id || l.id]);
      if (existingSp.rows.length === 0) {
        await pool.query(`
          INSERT INTO skill_passports (id, trainee_id, full_name, institution, batch, council, issued_date, verified_by, verification_hash, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          passportId,
          l.trainee_id || l.id,
          l.name,
          'Rajalakshmi Engineering College (REC)',
          l.batch || 'Vocational Engineering Batch 2024-25',
          'Autonomous Institution · Affiliated to Anna University',
          '2026-03-15',
          'Saurav K (Lic #REC-TR-2024)',
          hash,
          'IN_TRAINING'
        ]);
        console.log(`Created skill passport for ${l.name} (${l.trainee_id})`);

        // Insert competencies
        for (const c of STANDARD_COMPETENCIES) {
          const compId = `comp_${l.id}_${c.code.replace(/-/g, '_')}`;
          await pool.query(`
            INSERT INTO competencies (id, passport_id, code, title, standard, level, status, evidence)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            compId,
            passportId,
            c.code,
            c.title,
            c.standard,
            c.level,
            c.status,
            c.evidence
          ]);
        }
        console.log(`Created 5 competencies for ${l.name}`);
      }
    }

    // 2. Ensure AI Scenario Queue has proposals
    const queueCheck = await pool.query("SELECT count(*)::int FROM ai_scenario_queue");
    if (queueCheck.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO ai_scenario_queue (id, title, source, prompt, submitted_date, status, hazards, mandatory_steps, policy_check, reviewer_notes)
        VALUES 
        (
          'scen-ai-901',
          'Automotive Garage Hydraulic Lift Failure & 12V Battery Spark',
          'Groq AI Scenario Planner',
          'Automotive garage with oily floor spill, car on hydraulic lift, fire extinguisher, and disconnect 12V battery',
          '2026-10-11',
          'pending',
          '["Hydraulic collapse under load", "Oil slip and trip hazard", "12V lead-acid battery short circuit spark"]'::json,
          '["Don nitrile gloves and safety eye protection", "Place wheel chocks around rear tires", "Position mechanical jack stands under frame", "Disconnect 12V battery negative ground terminal", "Deploy chemical absorbent pads on oil spill"]'::json,
          'PASSED (OSHA 1910.303 / ISO 45001 Compliant)',
          ''
        ),
        (
          'scen-ai-902',
          'Rooftop Solar PV Inverter Arc Hazard & Safety Harness Anchor',
          'Photo-to-Workplace Vision AI',
          'Solar PV rooftop installation with loose harness and sparking DC isolator switch',
          '2026-10-11',
          'approved',
          '["600V DC string arc flash", "Catastrophic fall from roof edge (> 8m)", "Absence of static lifeline anchor"]'::json,
          '["Inspect full body fall arrest harness", "Clip dual lanyards to certified roof static line", "Isolate DC string disconnect switch with arc-rated gloves", "Verify zero DC voltage with high-voltage probe"]'::json,
          'PASSED (NEC 690 / OSHA 1926.502 Compliant)',
          'Approved by Saurav K for Rajalakshmi Engineering College curriculum.'
        )
      `);
      console.log('Seeded AI scenario queue proposals.');
    }

    // 3. Check training_sessions
    const sessCheck = await pool.query("SELECT count(*)::int FROM training_sessions");
    console.log(`Current training_sessions count: ${sessCheck.rows[0].count}`);

    console.log('--- Seeding Complete Successfully ---');
  } catch(e) {
    console.error('Seed error:', e);
  } finally {
    await pool.end();
  }
}

seed();
