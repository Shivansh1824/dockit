const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');
const { supabase } = require('../supabase');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role = 'member', jobId } = req.body;

  if (!name || !email || !password || !jobId) {
    return res.status(400).json({ message: 'All fields (including Job ID) are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // Check if email already registered
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (name, email, password, role, job_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, job_id`,
      [name.trim(), email.trim().toLowerCase(), hashedPassword, role, jobId.trim()]
    );

    res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, jobId: user.job_id },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/google-sync
router.post('/google-sync', async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'Access token is required.' });
  }

  try {
    // 1. Verify token with Supabase
    const { data: { user: sbUser }, error } = await supabase.auth.getUser(accessToken);
    if (error || !sbUser) {
      return res.status(401).json({ message: 'Invalid Supabase token.' });
    }

    const email = sbUser.email.toLowerCase();
    const name = sbUser.user_metadata.full_name || sbUser.user_metadata.name || 'Google User';

    // 2. Check if user exists in our DB
    let result = await query(
      'SELECT id, name, email, role, job_id FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (result.rows.length === 0) {
      // 3. Create user if they don't exist
      // Since it's a Google user, we use a placeholder password and a generated jobId
      const placeholderPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const generatedJobId = 'G-' + Math.floor(1000 + Math.random() * 9000);
      
      const insertResult = await query(
        `INSERT INTO users (name, email, password, role, job_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, job_id`,
        [name, email, placeholderPassword, 'member', generatedJobId]
      );
      user = insertResult.rows[0];
    } else {
      user = result.rows[0];
    }

    // 4. Generate local JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, jobId: user.job_id },
    });
  } catch (err) {
    console.error('Google sync error:', err);
    res.status(500).json({ message: 'Server error during sync.' });
  }
});

module.exports = router;
