# Kahani Ghar CMS

A full-stack Content Management System for managing story-based audio content for the Kahani Ghar kids app. Built with Next.js, Supabase, and Tailwind CSS.

## Features

### Story Management
- Create and edit stories with title, description, cover image, and language selection
- Archive/unarchive stories without deleting them
- Sort stories by rank for display order
- Support for multiple languages (English, Hindi, Tamil)

### Episode Management
- Create and edit episodes within stories
- Upload audio files for each episode
- Manage slides with images and timestamps
- Publish/unpublish episodes
- Episode numbering for organization

### Authentication
- Secure email/password authentication via Supabase
- Protected routes - only authenticated users can access the CMS
- Session management with automatic redirects

### File Uploads
- Direct upload to Supabase Storage
- Support for cover images, episode audio, and slide images
- Progress indicators and error handling
- Automatic file organization in storage buckets

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **TypeScript**: Full type safety

## Project Structure

```
/app
  /(auth)
    /login          # Login page
  /(dashboard)
    /dashboard      # Story list view
    /stories
      /[id]         # Story detail + episodes list
      /[id]/new-episode  # Create new episode
      /new          # Create new story
      /[id]/edit    # Edit story
      /[id]/episodes/[episodeId]/edit  # Edit episode
/components
  /ui              # shadcn/ui components
  /story           # Story-related components
  /episode         # Episode-related components
  /slide           # Slide editor component
  /upload          # File upload components
  /auth            # Authentication components
  /layout          # Layout components
/lib
  /supabase        # Supabase client setup
  /types           # TypeScript types
  /utils           # Helper functions
  /store           # Zustand stores
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file (already configured with your Supabase credentials):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The CMS connects to existing Supabase tables:

### `stories` table
- `id` (UUID, primary key)
- `title` (TEXT, required)
- `description` (TEXT, nullable)
- `cover_image_url` (TEXT, required)
- `language` (TEXT, required: 'en' | 'hi' | 'ta')
- `release_date` (DATE, nullable)
- `is_published` (BOOLEAN, default false)
- `created_at` (TIMESTAMPTZ)

### `episodes` table
- `id` (UUID, primary key)
- `story_id` (UUID, foreign key to stories)
- `title` (TEXT, required)
- `description` (TEXT, nullable)
- `audio_url` (TEXT, required)
- `episode_number` (INTEGER, nullable)
- `is_published` (BOOLEAN, default false)
- `slides` (JSONB, array of {image_url, start_time})
- `created_at` (TIMESTAMPTZ)

## Storage Buckets

The CMS uses Supabase Storage with the following structure:
- `stories/covers/` - Story cover images
- `stories/audio/` - Episode audio files
- `stories/slides/` - Slide images

Make sure these buckets exist in your Supabase project and are configured as public.

## Usage

1. **Login**: Use your Supabase email/password credentials
2. **Create a Story**: Click "Add New Story" on the dashboard
3. **Add Episodes**: Navigate to a story and click "Add Episode"
4. **Manage Slides**: In the episode form, use the slide editor to add images with timestamps
5. **Publish Content**: Toggle the publish status to control visibility in the app

## Development

- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Notes

- All images are served with `unoptimized` flag for Supabase Storage compatibility
- The CMS assumes tables already exist in Supabase (they are not created automatically)
- File uploads are limited to 10MB for images and 100MB for audio files
- Authentication is required for all dashboard routes
