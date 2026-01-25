/**
 * Script to manually confirm a user's email in Supabase
 * Run with: node scripts/confirm-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Note: To confirm a user, we need the service role key, not the anon key
// For now, we'll provide instructions on how to do this via Supabase dashboard

console.log('To confirm the user email, you have two options:');
console.log('\nOption 1: Via Supabase Dashboard (Recommended)');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Authentication > Users');
console.log('4. Find the user: tibdewalsiddhant@gmail.com');
console.log('5. Click the three dots menu and select "Confirm user"');
console.log('\nOption 2: Disable Email Confirmation (For Development)');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Authentication > Settings');
console.log('4. Under "Email Auth", disable "Enable email confirmations"');
console.log('5. Save the changes');
console.log('\nAfter either option, you can log in at http://localhost:3000/login');
