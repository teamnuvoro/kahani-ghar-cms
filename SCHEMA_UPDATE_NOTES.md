# Schema Update Notes

## Changes Made

### Stories Table
- ✅ Removed: `audio_url`, `slides` (moved to episodes)
- ✅ Renamed: `long_description` → `description` (already using `description`)
- ✅ Updated: `is_archived` → `is_published`
- ✅ Updated: `rank` → `release_date` (date field)
- ✅ Added: `release_date` field for story release dates

### Episodes Table
- ✅ Episodes are now a separate table (already implemented)
- ✅ All episode fields match the schema:
  - `id` (UUID, primary key)
  - `story_id` (UUID, foreign key)
  - `title` (TEXT)
  - `description` (TEXT, nullable)
  - `audio_url` (TEXT)
  - `slides` (JSONB)
  - `episode_number` (INTEGER, nullable)
  - `is_published` (BOOLEAN)
  - `created_at` (TIMESTAMPTZ)

## Code Updates

### Updated Components
1. **StoryForm** - Now uses `is_published` and `release_date` instead of `is_archived` and `rank`
2. **StoryCard** - Shows "Draft" badge for unpublished stories, "Publish/Unpublish" button
3. **StoriesList** - Toggle publish status instead of archive
4. **Dashboard** - Removed rank-based sorting
5. **Types** - Updated `Story`, `StoryInsert`, and `StoryUpdate` interfaces

## RLS Policies

### Stories Table
✅ Policies set up: SELECT, INSERT, UPDATE, DELETE

### Episodes Table
⚠️ RLS is currently **disabled** (shown as "UNRESTRICTED" in Supabase)

**Recommendation:** For production, enable RLS and add the same 4 policies:
- SELECT: `true`
- INSERT: `true`
- UPDATE: `true`
- DELETE: `true`

This ensures proper security while maintaining functionality.

## Testing Checklist

- [ ] Create a new story with release date
- [ ] Publish/unpublish a story
- [ ] Edit story details
- [ ] Add multiple episodes to a story
- [ ] Edit episode details
- [ ] Upload cover images
- [ ] Upload audio files
- [ ] Manage slides in episodes
