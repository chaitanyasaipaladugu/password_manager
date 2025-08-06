import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pggbmoudurybpoobqlyr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ2Jtb3VkdXJ5YnBvb2JxbHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDc1MDUsImV4cCI6MjA2OTg4MzUwNX0.fdzQAPox05CEYjMEOLJNHOQELzuIZM0sUbvbsoMIwY4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
