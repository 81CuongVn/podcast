import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { podcast_id, title, description, episode_number, duration, audio_pathname, media_url, media_type = 'audio', media_size } = body

    if (!podcast_id || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user owns the podcast
    const { data: podcast } = await supabase
      .from('podcasts')
      .select('user_id')
      .eq('id', podcast_id)
      .single()

    if (!podcast || podcast.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!audio_pathname && !media_url) {
      return NextResponse.json(
        { error: 'audio_pathname or media_url is required' },
        { status: 400 }
      )
    }

    const audio_url = media_url || audio_pathname

    const { data, error } = await supabase
      .from('episodes')
      .insert({
        podcast_id,
        title,
        description: description || null,
        episode_number: episode_number || null,
        duration: duration || null,
        audio_pathname,
        audio_url,
        media_url: audio_url,
        media_type,
        media_size: media_size || null,
        is_published: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Episode creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating episode:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
