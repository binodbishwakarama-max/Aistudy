const { createClient } = require('@supabase/supabase-js');
const { serverConfig } = require('../config');

const supabase = createClient(
    serverConfig.supabase.url,
    serverConfig.supabase.serviceRoleKey
);

module.exports = supabase;
