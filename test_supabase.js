// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dswegujgkgcbszblpmcl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzd2VndWpna2djYnN6YmxwbWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTczMzQsImV4cCI6MjA2ODA5MzMzNH0.yYPHxPkDRAWFUmlogrWfkZk-zbp_s3hshNcu_JvdUYM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('Connection test result:', error.message);
      if (error.message.includes('relation "users" does not exist')) {
        console.log('✅ Supabase connection successful! Database schema needs to be created.');
      } else {
        console.log('❌ Supabase connection failed:', error.message);
      }
    } else {
      console.log('✅ Supabase connection successful!');
    }
    
  } catch (err) {
    console.log('❌ Connection error:', err.message);
  }
}

testConnection();
