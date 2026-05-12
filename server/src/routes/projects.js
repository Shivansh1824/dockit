const express = require('express');
const { query } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects
// Admin: all projects
// Member: only assigned projects
router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await query(`
        SELECT p.*, u.name as creator_name 
        FROM projects p 
        LEFT JOIN users u ON p.created_by = u.id 
        ORDER BY p.created_at DESC
      `);
    } else {
      result = await query(`
        SELECT p.*, u.name as creator_name 
        FROM projects p 
        INNER JOIN project_members pm ON p.id = pm.project_id 
        LEFT JOIN users u ON p.created_by = u.id 
        WHERE pm.user_id = $1 
        ORDER BY p.created_at DESC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ message: 'Error fetching projects.' });
  }
});

// POST /api/projects (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required.' });

  try {
    const result = await query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );
    
    // Auto-add creator to project_members
    await query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)',
      [result.rows[0].id, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Error creating project.' });
  }
});

module.exports = router;
