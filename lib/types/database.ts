export type Language = "en" | "hi" | "ta";

export interface Slide {
  image_url: string;
  start_time: number;
}

export interface Story {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string;
  language: Language;
  release_date: string | null;
  is_published: boolean;
  rank: number | null;
  created_at: string;
}

export interface Episode {
  id: string;
  story_id: string;
  title: string;
  description: string | null;
  audio_url: string;
  episode_number: number | null;
  is_published: boolean;
  slides: Slide[] | null;
  created_at: string;
}

export interface StoryInsert {
  title: string;
  description?: string | null;
  cover_image_url: string;
  language: Language;
  release_date?: string | null;
  is_published?: boolean;
  rank?: number | null;
}

export interface StoryUpdate {
  title?: string;
  description?: string | null;
  cover_image_url?: string;
  language?: Language;
  release_date?: string | null;
  is_published?: boolean;
  rank?: number | null;
}

export interface EpisodeInsert {
  story_id: string;
  title: string;
  description?: string | null;
  audio_url: string;
  episode_number?: number | null;
  is_published?: boolean;
  slides?: Slide[] | null;
}

export interface EpisodeUpdate {
  title?: string;
  description?: string | null;
  audio_url?: string;
  episode_number?: number | null;
  is_published?: boolean;
  slides?: Slide[] | null;
}
