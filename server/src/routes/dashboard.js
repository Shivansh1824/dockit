const express = require('express');
const { query } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // 1. Project Stats
    let projectCount;
    if (isAdmin) {
      projectCount = await query('SELECT COUNT(*) FROM projects');
    } else {
      projectCount = await query('SELECT COUNT(*) FROM project_members WHERE user_id = $1', [userId]);
    }

    // 2. Task Stats
    let taskStats;
    if (isAdmin) {
      taskStats = await query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'done') as completed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress
        FROM tasks
      `);
    } else {
      taskStats = await query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'done') as completed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress
        FROM tasks 
        WHERE assignee_id = $1
      `, [userId]);
    }

    // 3. Recent Activity (Latest tasks/projects)
    const recentActivity = await query(`
      (SELECT 'task' as type, title as name, status as detail, updated_at as time 
       FROM tasks 
       WHERE (created_by = $1 OR assignee_id = $1 OR $2 = true)
       ORDER BY updated_at DESC LIMIT 3)
      UNION ALL
      (SELECT 'project' as type, name, 'New Project' as detail, created_at as time 
       FROM projects 
       WHERE (created_by = $1 OR $2 = true)
       ORDER BY created_at DESC LIMIT 2)
      ORDER BY time DESC LIMIT 5
    `, [userId, isAdmin]);

    // 4. Team Efficiency (Simple calculation)
    const stats = taskStats.rows[0];
    const efficiency = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    res.json({
      kpis: [
        { label: 'Active Projects', value: projectCount.rows[0].count, change: '+12%', trend: 'up' },
        { label: 'Tasks Completed', value: stats.completed, change: '+5%', trend: 'up' },
        { label: 'Team Efficiency', value: `${efficiency}%`, change: '+2%', trend: 'up' },
        { label: 'Avg. Response', value: '1.2h', change: '-15%', trend: 'down' }
      ],
      activity: recentActivity.rows.map(a => ({
        id: Math.random().toString(36).substr(2, 9),
        user: isAdmin ? 'System' : req.user.email.split('@')[0],
        action: a.type === 'task' ? `Updated task: ${a.name}` : `Created project: ${a.name}`,
        time: 'Just now', // Simplified for now
        type: a.type
      }))
    });

  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Error fetching dashboard stats.' });
  }
});

module.exports = router;
