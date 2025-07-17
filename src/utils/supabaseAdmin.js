const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ajxzmfrdbykxjqxybmar.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqeHptZnJkYnlreGpxeHlibWFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjEzMDc0NywiZXhwIjoyMDY3NzA2NzQ3fQ.xtkgMFBzcTaTRJTJ2qkaz8p9F6dXKHgRKz2AG9B9D34";

const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

module.exports = { supabaseAdmin };
