// User & Profile Types
export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  address: string | null
  city: string | null
  country: string | null
  is_admin?: boolean
  created_at: string
  updated_at: string
}

// Podcast Types
export type Podcast = {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_image_url: string | null
  category: string | null
  language: string
  is_published: boolean
  created_at: string
  updated_at: string
  // Monetization fields
  is_monetized?: boolean
  preview_mode?: 'free' | 'preview-only' | 'paid-only'
  price_usd?: number
  allow_free_preview?: boolean
  preview_episode_count?: number
}

export type PodcastWithUser = Podcast & {
  profiles: Profile
}

// Episode Types
export type Episode = {
  id: string
  podcast_id: string
  title: string
  description: string | null
  audio_url: string
  audio_pathname: string
  duration: number | null
  episode_number: number | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  // Premium content fields
  is_premium?: boolean
  preview_duration_seconds?: number
  requires_subscription?: boolean
  media_url?: string
}

export type EpisodeWithPodcast = Episode & {
  podcasts: Podcast
}

// Social Types
export type Follow = {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export type PodcastSubscription = {
  id: string
  user_id: string
  podcast_id: string
  created_at: string
}

// Analytics Types
export type Listen = {
  id: string
  episode_id: string
  user_id: string | null
  listened_at: string
  duration_listened: number | null
  completed: boolean
}

export type ListenStats = {
  total_listens: number
  total_subscribers: number
  completed_listens: number
  average_listen_duration: number | null
}

// Form Types
export type PodcastFormData = {
  title: string
  description?: string
  category?: string
  language?: string
}

export type EpisodeFormData = {
  title: string
  description?: string
  episode_number?: number
  duration?: number
}

export type ProfileFormData = {
  display_name?: string
  bio?: string
  website_url?: string
}
