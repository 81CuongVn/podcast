import { createClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function getPodcasts(limit = 12, offset = 0) {
  const supabase = await createClient()
  const { data, count } = await supabase
    .from('podcasts')
    .select('*, profiles(username, display_name, avatar_url)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { podcasts: data || [], total: count || 0 }
}

export async function getPodcastById(id: string) {
  const supabase = await createClient()
  const { data: podcast } = await supabase
    .from('podcasts')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('id', id)
    .single()

  return podcast
}

export async function getEpisodesByPodcast(podcastId: string) {
  const supabase = await createClient()
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('podcast_id', podcastId)
    .order('published_at', { ascending: false })

  return episodes || []
}

export async function getUserPodcasts() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: podcasts } = await supabase
    .from('podcasts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return podcasts || []
}

export async function getFollowStats(userId: string) {
  const supabase = await createClient()

  const [followers, following] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', userId),
    supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', userId),
  ])

  return {
    followers: followers.count || 0,
    following: following.count || 0,
  }
}

export async function isFollowing(followerId: string, followingId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  return !!data
}

export async function getPodcastStats(podcastId: string) {
  const supabase = await createClient()

  const [subscribers, totalListens] = await Promise.all([
    supabase.from('subscriptions').select('*', { count: 'exact' }).eq('podcast_id', podcastId),
    supabase.from('listens').select('*', { count: 'exact' }).eq('podcast_id', podcastId),
  ])

  return {
    subscribers: subscribers.count || 0,
    totalListens: totalListens.count || 0,
  }
}
