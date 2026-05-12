require('dotenv').config();
const { query } = require('./src/db');

async function seed() {
  try {
    // 1. Get available users
    // 1. Create Mock Users first
    const mockUsers = [
      { name: 'Sarah Kraft', email: 'sarah@dockit.com', role: 'member', job_id: 'DES-01' },
      { name: 'Alex Rivera', email: 'alex@dockit.com', role: 'admin', job_id: 'ADM-01' },
      { name: 'Mike Dixon', email: 'mike@dockit.com', role: 'member', job_id: 'ENG-04' },
      { name: 'Lisa Wong', email: 'lisa@dockit.com', role: 'member', job_id: 'PRD-02' },
      { name: 'John Burke', email: 'john@dockit.com', role: 'member', job_id: 'GRW-09' },
      { name: 'David Chen', email: 'david@dockit.com', role: 'member', job_id: 'ENG-05' },
      { name: 'Emma Wilson', email: 'emma@dockit.com', role: 'member', job_id: 'DES-02' },
      { name: 'James Miller', email: 'james@dockit.com', role: 'member', job_id: 'ENG-06' },
      { name: 'Sophia Garcia', email: 'sophia@dockit.com', role: 'member', job_id: 'MKT-01' },
      { name: 'Daniel Lee', email: 'daniel@dockit.com', role: 'member', job_id: 'PRD-03' },
      { name: 'Olivia Taylor', email: 'olivia@dockit.com', role: 'member', job_id: 'HR-01' },
      { name: 'William Brown', email: 'william@dockit.com', role: 'member', job_id: 'ENG-07' },
      { name: 'Isabella Martinez', email: 'isabella@dockit.com', role: 'member', job_id: 'DES-03' },
      { name: 'Lucas Anderson', email: 'lucas@dockit.com', role: 'member', job_id: 'GRW-10' },
      { name: 'Mia White', email: 'mia@dockit.com', role: 'member', job_id: 'PRD-04' }
    ];

    for (const u of mockUsers) {
      const exists = await query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (exists.rows.length === 0) {
        await query(
          'INSERT INTO users (name, email, password, role, job_id) VALUES ($1, $2, $3, $4, $5)',
          [u.name, u.email, '$2b$10$YourHashedPasswordHere', u.role, u.job_id] 
        );
        console.log(`👤 Created Mock User: ${u.name}`);
      }
    }

    const usersRes = await query('SELECT id, name FROM users ORDER BY created_at ASC');
    const users = usersRes.rows;
    const adminId = users[0].id;
    const memberId = users[1]?.id || adminId;

    console.log(`🌱 Seeding data using ${users.length} available users...`);

    const sampleProjects = [
      { name: 'Dockit v2.0 (Mobile App)', desc: 'Development of the iOS and Android companion apps.', status: 'on_track' },
      { name: 'Q2 Marketing Campaign', desc: 'Global rollout for summer 2026 features.', status: 'on_track' },
      { name: 'Security Hardening 2026', desc: 'Infrastructure-wide security audit and patch cycle.', status: 'at_risk' },
      { name: 'Customer Success Portal', desc: 'Building a self-service dashboard for enterprise clients.', status: 'on_track' },
      { name: 'Infrastructure Scaling', desc: 'Migrating to multi-region clusters for high availability.', status: 'delayed' },
      { name: 'Internal Tooling Redesign', desc: 'Modernizing the internal admin panel and CLI tools.', status: 'on_track' },
      { name: 'Design System v3', desc: 'Transitioning to a token-based design system with Tailwind 4.0.', status: 'completed' },
      { name: 'AI Integration Phase 3', desc: 'Implementing predictive task assignment and smart scheduling.', status: 'on_track' }
    ];

    for (const proj of sampleProjects) {
      // Check if project already exists
      const existing = await query('SELECT id FROM projects WHERE name = $1', [proj.name]);
      let projectId;

      if (existing.rows.length > 0) {
        projectId = existing.rows[0].id;
        await query('UPDATE projects SET status = $1 WHERE id = $2', [proj.status, projectId]);
        console.log(`⏩ Project "${proj.name}" updated with status.`);
      } else {
        const res = await query(
          'INSERT INTO projects (name, description, status, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
          [proj.name, proj.desc, proj.status, adminId]
        );
        projectId = res.rows[0].id;
        console.log(`✅ Created Project: ${proj.name}`);

        // Assign members to the new project
        await query('INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [projectId, adminId]);
        if (memberId !== adminId) {
          await query('INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [projectId, memberId]);
        }
      }

      // Create 3-5 tasks for each project
      const taskCount = Math.floor(Math.random() * 3) + 3;
      const priorities = ['low', 'medium', 'high'];
      const statuses = ['todo', 'in_progress', 'done'];

      for (let i = 1; i <= taskCount; i++) {
        const title = `Task ${i} for ${proj.name}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        // Ensure first user gets tasks so dashboard isn't empty
        const assignee = (i <= 2) ? users[0].id : users[Math.floor(Math.random() * users.length)].id;
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 20) - 5)); 

        const taskExists = await query('SELECT id FROM tasks WHERE title = $1 AND project_id = $2', [title, projectId]);
        if (taskExists.rows.length === 0) {
          await query(
            'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [title, `Auto-generated description for ${title}`, status, priority, dueDate, projectId, assignee, adminId]
          );
        } else {
          // Update assignee to ensure it shows up for user 0
          await query('UPDATE tasks SET assignee_id = $1 WHERE id = $2', [assignee, taskExists.rows[0].id]);
        }
      }
      console.log(`   └─ Added/Updated ${taskCount} tasks.`);
    }

    // Set some users as inactive for the "Past Members" view
    if (users.length > 4) {
      await query('UPDATE users SET is_active = false WHERE id = $1', [users[users.length - 1].id]);
      await query('UPDATE users SET is_active = false WHERE id = $1', [users[users.length - 2].id]);
      console.log('📉 Set 2 users as inactive.');
    }

    console.log('\n🚀 Database seeding complete! Your workspace is now populated with professional sample data.');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
