require('dotenv').config();
const { pool } = require('./src/db');

async function checkProjectMembers() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'project_members';
    `);
    console.log('Project Members Columns:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkProjectMembers();
