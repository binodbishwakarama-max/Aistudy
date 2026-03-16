
const { createClient } = require('@supabase/supabase-js');

// These should be in your .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for backend operations to bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
