const { createClient } = require('@supabase/supabase-js');

// Fix for Node.js < 22 not having native WebSocket support required by Supabase Realtime
if (typeof WebSocket === 'undefined') {
  global.WebSocket = require('ws');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabase };
