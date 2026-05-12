require('dotenv').config();
const { query } = require('./src/db');

async function seed() {
  try {
    // 1. Get first user (likely admin)
    const users = await query('SELECT id FROM users LIMIT 2');
    if (users.rows.length === 0) {
      console.log('No users found. Please sign up first.');
      return;
    }
    const adminId = users.rows[0].id;
    const memberId = users.rows[1]?.id || adminId;

    // 2. Create Projects
    const p1 = await query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      ['Dockit v1.0 Launch', 'Main product launch for the 2026 suite.', adminId]
    );
    const p2 = await query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      ['AI Integration Phase 2', 'LLM-powered task automation features.', adminId]
    );

    // 3. Assign Members
    await query('INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)', [p1.rows[0].id, adminId]);
    await query('INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)', [p1.rows[0].id, memberId]);
    await query('INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)', [p2.rows[0].id, adminId]);

    // 4. Create Tasks
    await query(
      'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      ['Design onboarding flow', 'Finalize glassmorphism UI.', 'done', 'High', '2026-05-24', p1.rows[0].id, memberId, adminId]
    );
    await query(
      'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      ['API performance audit', 'Optimize postgres queries.', 'in_progress', 'Critical', '2026-06-12', p2.rows[0].id, adminId, adminId]
    );

    console.log('✅ Seeded DB successfully.');
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
