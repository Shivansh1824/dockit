require('dotenv').config();
const { query } = require('./src/db');

async function seed() {
  try {
    // 1. Get available users
    const usersRes = await query('SELECT id, name FROM users ORDER BY created_at ASC');
    if (usersRes.rows.length === 0) {
      console.log('❌ No users found. Please sign up in the app first.');
      return;
    }

    const users = usersRes.rows;
    const adminId = users[0].id;
    const memberId = users[1]?.id || adminId;

    console.log(`🌱 Seeding data using ${users.length} available users...`);

    const sampleProjects = [
      { name: 'Dockit v2.0 (Mobile App)', desc: 'Development of the iOS and Android companion apps.' },
      { name: 'Q2 Marketing Campaign', desc: 'Global rollout for summer 2026 features.' },
      { name: 'Security Hardening 2026', desc: 'Infrastructure-wide security audit and patch cycle.' },
      { name: 'Customer Success Portal', desc: 'Building a self-service dashboard for enterprise clients.' },
      { name: 'Infrastructure Scaling', desc: 'Migrating to multi-region clusters for high availability.' },
      { name: 'Internal Tooling Redesign', desc: 'Modernizing the internal admin panel and CLI tools.' },
      { name: 'Design System v3', desc: 'Transitioning to a token-based design system with Tailwind 4.0.' },
      { name: 'AI Integration Phase 3', desc: 'Implementing predictive task assignment and smart scheduling.' }
    ];

    for (const proj of sampleProjects) {
      // Check if project already exists
      const existing = await query('SELECT id FROM projects WHERE name = $1', [proj.name]);
      let projectId;

      if (existing.rows.length > 0) {
        projectId = existing.rows[0].id;
        console.log(`⏩ Project "${proj.name}" already exists, skipping creation.`);
      } else {
        const res = await query(
          'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
          [proj.name, proj.desc, adminId]
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
        const assignee = users[Math.floor(Math.random() * users.length)].id;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 20) - 5)); // Some overdue, some future

        // Check if task exists
        const taskExists = await query('SELECT id FROM tasks WHERE title = $1 AND project_id = $2', [title, projectId]);
        if (taskExists.rows.length === 0) {
          await query(
            'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [title, `Auto-generated description for ${title}`, status, priority, dueDate, projectId, assignee, adminId]
          );
        }
      }
      console.log(`   └─ Added ${taskCount} tasks.`);
    }

    console.log('\n🚀 Database seeding complete! Your workspace is now populated with professional sample data.');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
