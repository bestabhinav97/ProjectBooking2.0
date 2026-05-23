// supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Temporary debug line to see exactly what text is being loaded
console.log("DEBUG - Loaded URL is:", JSON.stringify(supabaseUrl));

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase };