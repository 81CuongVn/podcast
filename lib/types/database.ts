export type Profile = {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  address: string | null
  city: string | null
  country: string | null
  is_admin?: boolean
  created_at: string
  updated_at: string
}

export type Podcast = {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_image_url: string | null
  category: string | null
  language: string
  is_explicit: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined fields
  profile?: Profile
  episodes?: Episode[]
  subscriber_count?: number
}

export type Episode = {
  id: string
  podcast_id: string
  title: string
  description: string | null
  audio_url: string
  audio_pathname: string | null
  duration_seconds: number | null
  episode_number: number | null
  season_number: number | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  podcast?: Podcast
  listen_count?: number
}

export type Follow = {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  podcast_id: string
  created_at: string
}

export type Listen = {
  id: string
  user_id: string | null
  episode_id: string
  progress_seconds: number
  completed: boolean
  created_at: string
  updated_at: string
}

export type PodcastCategory = 
  | 'arts'
  | 'business'
  | 'comedy'
  | 'education'
  | 'fiction'
  | 'government'
  | 'health'
  | 'history'
  | 'kids'
  | 'leisure'
  | 'music'
  | 'news'
  | 'religion'
  | 'science'
  | 'society'
  | 'sports'
  | 'technology'
  | 'true-crime'

export const PODCAST_CATEGORIES: { value: PodcastCategory; label: string }[] = [
  { value: 'arts', label: 'Arts' },
  { value: 'business', label: 'Business' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'education', label: 'Education' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'government', label: 'Government' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'history', label: 'History' },
  { value: 'kids', label: 'Kids & Family' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'music', label: 'Music' },
  { value: 'news', label: 'News' },
  { value: 'religion', label: 'Religion & Spirituality' },
  { value: 'science', label: 'Science' },
  { value: 'society', label: 'Society & Culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'true-crime', label: 'True Crime' },
]
