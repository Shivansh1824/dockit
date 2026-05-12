require('dotenv').config({ path: '/Users/shivanshrana/Desktop/ethara_project/server/.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function alterTable() {
  try {
    console.log('Adding job_id column...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS job_id VARCHAR(50) UNIQUE;
    `);
    console.log('Successfully added job_id column to users table.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

alterTable();
