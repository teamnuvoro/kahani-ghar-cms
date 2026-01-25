# Supabase Storage Setup Guide

## Quick Fix for "Row-level security policy" Error

### Option 1: Create Bucket and Set Policies (Recommended)

1. **Create the bucket:**
   - Go to Supabase Dashboard > Storage
   - Click "New bucket"
   - Name: `stories`
   - Make it **Public** (toggle ON)
   - Click "Create bucket"

2. **Add RLS Policies:**
   - Open the `stories` bucket
   - Go to "Policies" tab
   - Click "New Policy"
   
   **Policy 1 - Allow Uploads:**
   - Name: `Allow public uploads`
   - Operation: `INSERT`
   - Policy: `true`
   
   **Policy 2 - Allow Reads:**
   - Name: `Allow public reads`
   - Operation: `SELECT`
   - Policy: `true`
   
   **Policy 3 - Allow Updates (optional):**
   - Name: `Allow public updates`
   - Operation: `UPDATE`
   - Policy: `true`
   
   **Policy 4 - Allow Deletes (optional):**
   - Name: `Allow public deletes`
   - Operation: `DELETE`
   - Policy: `true`

### Option 2: Disable RLS (Development Only)

1. Go to Storage > `stories` bucket
2. In bucket settings, toggle OFF "Enable RLS"
3. **Warning:** Only use this for development!

### Folder Structure

The bucket will automatically organize files into:
- `stories/covers/` - Cover images
- `stories/audio/` - Audio files
- `stories/slides/` - Slide images

No need to create these folders manually - they're created automatically when files are uploaded.
