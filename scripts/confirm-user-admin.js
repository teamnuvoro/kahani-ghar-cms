/**
 * Script to confirm user email using Supabase Admin API
 * NOTE: This requires the SERVICE_ROLE_KEY (not the anon key)
 * You can find it in: Supabase Dashboard > Settings > API > service_role key
 * 
 * Usage: SERVICE_ROLE_KEY=your_service_role_key node scripts/confirm-user-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nTo use this script:');
  console.error('1. Get your service role key from: Supabase Dashboard > Settings > API');
  console.error('2. Run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/confirm-user-admin.js');
  console.error('\nOr add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key');
  process.exit(1);
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function confirmUser() {
  const email = 'tibdewalsiddhant@gmail.com';

  console.log('Finding user...');
  
  // Get user by email
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const user = users.users.find(u => u.email === email);

  if (!user) {
    console.error(`User with email ${email} not found`);
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (ID: ${user.id})`);
  console.log(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

  if (user.email_confirmed_at) {
    console.log('✅ User email is already confirmed!');
    return;
  }

  console.log('Confirming user email...');

  // Confirm the user
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );

  if (error) {
    console.error('Error confirming user:', error.message);
    process.exit(1);
  }

  console.log('✅ User email confirmed successfully!');
  console.log('You can now log in at http://localhost:3000/login');
}

confirmUser();
