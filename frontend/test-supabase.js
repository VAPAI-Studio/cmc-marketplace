// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lrojxsaxgddodrswzuhb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyb2p4c2F4Z2Rkb2Ryc3d6dWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTAwNTQsImV4cCI6MjA4NjgyNjA1NH0.NrlBgLkwchu8jfTfeMaDERx_oemImtmqMvgykDLjtaY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test 1: Check auth
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log('Session check:', { sessionData, sessionError });

  // Test 2: Try to query users table
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  console.log('Users table query:', { usersData, usersError });

  // Test 3: Try to sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'test@test.com',
    password: 'testpassword123'
  });

  console.log('Sign up test:', { signUpData, signUpError });
}

testConnection();
