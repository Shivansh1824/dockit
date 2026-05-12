const express = require('express');
const { query } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks
// Admin: all tasks
// Member: only assigned tasks OR tasks in assigned projects
router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await query(`
        SELECT t.*, p.name as project_name, u.name as assignee_name 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id 
        LEFT JOIN users u ON t.assignee_id = u.id 
        ORDER BY t.due_date ASC
      `);
    } else {
      result = await query(`
        SELECT t.*, p.name as project_name, u.name as assignee_name 
        FROM tasks t 
        INNER JOIN project_members pm ON t.project_id = pm.project_id 
        LEFT JOIN projects p ON t.project_id = p.id 
        LEFT JOIN users u ON t.assignee_id = u.id 
        WHERE pm.user_id = $1 OR t.assignee_id = $1
        ORDER BY t.due_date ASC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
});

// POST /api/tasks (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;
  if (!title || !project_id) return res.status(400).json({ message: 'Title and Project ID are required.' });

  try {
    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, status || 'todo', priority || 'Medium', due_date, project_id, assignee_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Error creating task.' });
  }
});

// PATCH /api/tasks/:id (Members can update their own tasks or tasks in their projects)
router.patch('/:id', authenticate, async (req, res) => {
  const { status, title, description } = req.body;
  const { id } = req.params;

  try {
    // Check permission: Admin or Member of the project
    const permission = await query(`
      SELECT t.id 
      FROM tasks t 
      LEFT JOIN project_members pm ON t.project_id = pm.project_id 
      WHERE t.id = $1 AND (pm.user_id = $2 OR t.assignee_id = $2 OR $3 = 'admin')
    `, [id, req.user.id, req.user.role]);

    if (permission.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied. You cannot edit this task.' });
    }

    // Dynamic update
    const result = await query(
      'UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title), description = COALESCE($3, description), updated_at = NOW() WHERE id = $4 RETURNING *',
      [status, title, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Error updating task.' });
  }
});

module.exports = router;
