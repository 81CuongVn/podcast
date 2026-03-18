import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function subscribeToPodcast(podcastId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase.from('subscriptions').insert([
    {
      user_id: user.id,
      podcast_id: podcastId,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }
}

export async function unsubscribeFromPodcast(podcastId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('podcast_id', podcastId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function followUser(userId: string) {
  const supabase = await createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/auth/login')
  }

  const { error } = await supabase.from('follows').insert([
    {
      follower_id: currentUser.id,
      following_id: userId,
    },
  ])

  if (error) {
    throw new Error(error.message)
  }
}

export async function unfollowUser(userId: string) {
  const supabase = await createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    redirect('/auth/login')
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', currentUser.id)
    .eq('following_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export async function trackListen(episodeId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  // Check if already tracked
  const { data: existing } = await supabase
    .from('listens')
    .select('id')
    .eq('episode_id', episodeId)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    await supabase.from('listens').insert([
      {
        episode_id: episodeId,
        user_id: user.id,
      },
    ])
  }
}
