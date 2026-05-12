const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

module.exports = { pool, query: (text, params) => pool.query(text, params) };
