import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { podcastId } = await request.json()

    if (!podcastId) {
      return NextResponse.json({ error: 'Podcast ID required' }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('podcast_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('podcast_id', podcastId)
      .maybeSingle()

    if (existing) {
      // Unsubscribe
      const { error } = await supabase
        .from('podcast_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('podcast_id', podcastId)

      if (error) throw error
      return NextResponse.json({ action: 'unsubscribed' })
    } else {
      // Subscribe
      const { error } = await supabase.from('podcast_subscriptions').insert([
        {
          user_id: user.id,
          podcast_id: podcastId,
        },
      ])

      if (error) throw error
      return NextResponse.json({ action: 'subscribed' })
    }
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
