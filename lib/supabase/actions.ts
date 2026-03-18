'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleFollowUser(followingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Check if already following
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', followingId)
    .single()

  if (existing) {
    // Unfollow
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', followingId)

    if (error) throw error
    return { action: 'unfollowed' }
  } else {
    // Follow
    const { error } = await supabase.from('follows').insert([
      {
        follower_id: user.id,
        following_id: followingId,
      },
    ])

    if (error) throw error
    return { action: 'followed' }
  }
}

export async function toggleSubscribePodcast(podcastId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('podcast_id', podcastId)
    .single()

  if (existing) {
    // Unsubscribe
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('podcast_id', podcastId)

    if (error) throw error
    return { action: 'unsubscribed' }
  } else {
    // Subscribe
    const { error } = await supabase.from('subscriptions').insert([
      {
        user_id: user.id,
        podcast_id: podcastId,
      },
    ])

    if (error) throw error
    return { action: 'subscribed' }
  }
}

export async function recordListen(podcastId: string, episodeId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase.from('listens').insert([
    {
      user_id: user.id,
      podcast_id: podcastId,
      episode_id: episodeId,
    },
  ])

  if (error) console.error('Error recording listen:', error)
}

export async function createPodcast(podcastData: {
  title: string
  description: string
  categoryId: string
  coverImageUrl?: string
  isPublished?: boolean
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('podcasts')
    .insert([
      {
        user_id: user.id,
        title: podcastData.title,
        description: podcastData.description,
        category: podcastData.categoryId,
        cover_image_url: podcastData.coverImageUrl,
        is_published: podcastData.isPublished ?? true,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePodcast(
  podcastId: string,
  updates: Partial<{
    title: string
    description: string
    categoryId: string
    coverImageUrl: string
    isPublished: boolean
  }>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('podcasts')
    .update({
      title: updates.title,
      description: updates.description,
      category: updates.categoryId,
      cover_image_url: updates.coverImageUrl,
      is_published: updates.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq('id', podcastId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createEpisode(episodeData: {
  podcastId: string
  title: string
  description: string
  audioPathname: string
  durationSeconds: number
  publishedAt?: Date
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('episodes')
    .insert([
      {
        podcast_id: episodeData.podcastId,
        title: episodeData.title,
        description: episodeData.description,
        audio_pathname: episodeData.audioPathname,
        duration_seconds: episodeData.durationSeconds,
        published_at: episodeData.publishedAt || new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}
