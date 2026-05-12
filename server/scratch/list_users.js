require('dotenv').config();
const { query } = require('../src/db');

async function listUsers() {
  try {
    const res = await query('SELECT id, name, email, role FROM users ORDER BY created_at ASC');
    console.log('--- Current Users in Database ---');
    console.table(res.rows);
    console.log(`Total Count: ${res.rows.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

listUsers();
