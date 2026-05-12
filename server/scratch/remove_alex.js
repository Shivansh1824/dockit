require('dotenv').config();
const { query } = require('./src/db');

async function removeAlex() {
  try {
    const res = await query('DELETE FROM users WHERE email = $1 RETURNING *', ['alex@dockit.com']);
    if (res.rows.length > 0) {
      console.log(`✅ Removed User: ${res.rows[0].name} (${res.rows[0].email})`);
    } else {
      console.log('❌ User not found or already removed.');
    }
  } catch (err) {
    console.error('Error removing user:', err);
  } finally {
    process.exit(0);
  }
}

removeAlex();
