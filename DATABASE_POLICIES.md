# Database RLS Policies Setup

## Fix "Failed to save story" Error

The error occurs because Supabase tables have Row Level Security (RLS) enabled. You need to create policies to allow operations.

### For `stories` Table:

1. Go to **Supabase Dashboard** → **Table Editor** → **stories** table
2. Click the **"Policies"** tab
3. Click **"New Policy"** and create these 4 policies:

**Policy 1 - Allow Reads:**
- Name: `Allow public reads`
- Operation: `SELECT`
- Policy: `true`

**Policy 2 - Allow Creates:**
- Name: `Allow public inserts`
- Operation: `INSERT`
- Policy: `true`

**Policy 3 - Allow Updates:**
- Name: `Allow public updates`
- Operation: `UPDATE`
- Policy: `true`

**Policy 4 - Allow Deletes:**
- Name: `Allow public deletes`
- Operation: `DELETE`
- Policy: `true`

### For `episodes` Table:

Repeat the same 4 policies for the `episodes` table:
1. Go to **Table Editor** → **episodes** table
2. Click **"Policies"** tab
3. Create the same 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Alternative: Disable RLS (Development Only)

If you want to disable RLS temporarily for development:
1. Go to **Table Editor** → **stories** table
2. Click **"Settings"** tab
3. Toggle OFF **"Enable Row Level Security"**
4. Repeat for **episodes** table

**Warning:** Only disable RLS for development. Always use policies in production!
