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
    const { episode_id } = body

    if (!episode_id) {
      return NextResponse.json(
        { error: 'Missing episode_id' },
        { status: 400 }
      )
    }

    // Get episode to find podcast_id
    const { data: episode } = await supabase
      .from('episodes')
      .select('podcast_id')
      .eq('id', episode_id)
      .single()

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('listens')
      .insert({
        user_id: user.id,
        episode_id,
        podcast_id: episode.podcast_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error logging listen:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
