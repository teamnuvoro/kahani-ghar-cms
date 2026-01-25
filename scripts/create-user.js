/**
 * One-time script to create a user account
 * Run with: node scripts/create-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  const email = 'tibdewalsiddhant@gmail.com';
  const password = 'Siddtibd@123';

  console.log('Creating user account...');
  console.log('Email:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error creating user:', error.message);
    if (error.message.includes('already registered')) {
      console.log('User already exists. You can use the login page to sign in.');
    }
    process.exit(1);
  }

  if (data.user) {
    console.log('✅ User created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('\nYou can now log in at http://localhost:3000/login');
  } else {
    console.log('User creation initiated. Please check your email to confirm the account.');
  }
}

createUser();
