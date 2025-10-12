// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_CONFIG = {
  url: 'https://exjzakrzclrlxkiqdcyh.supabase.co/', // e.g., 'https://your-project.supabase.co'
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4anpha3J6Y2xybHhraXFkY3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNzEzMDUsImV4cCI6MjA3NTY0NzMwNX0.nyyO7j9UqUHZOQONwy4YAZ5zt37fuX9O8I6nU1UaHe0' // Your anon public key
};

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Export for use in other files
window.supabaseClient = supabaseClient;
