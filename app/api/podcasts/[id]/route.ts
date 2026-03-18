import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: podcast, error } = await supabase
      .from('podcasts')
      .select(
        `
        id,
        title,
        description,
        cover_url,
        category,
        created_at,
        is_published,
        profiles!podcasts_owner_id_fkey (
          id,
          display_name,
          avatar_url
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error) throw error

    if (!podcast || !podcast.is_published) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || user.id !== podcast?.profiles?.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }

    return NextResponse.json(podcast)
  } catch (error) {
    console.error('Error fetching podcast:', error)
    return NextResponse.json({ error: 'Failed to fetch podcast' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: podcast, error: podcastError } = await supabase
      .from('podcasts')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (podcastError || !podcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 })
    }

    if (podcast.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: episodes, error: episodesError } = await supabase
      .from('episodes')
      .select('id, audio_pathname')
      .eq('podcast_id', id)

    if (episodesError) {
      console.error('Error fetching podcast episodes for delete:', episodesError)
      return NextResponse.json(
        { error: 'Failed to delete podcast' },
        { status: 500 },
      )
    }

    const mediaPaths = (episodes || [])
      .map((episode) => episode.audio_pathname)
      .filter((path): path is string => Boolean(path))

    if (mediaPaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('podcast-media')
        .remove(mediaPaths)

      if (storageError) {
        console.warn('Failed to remove podcast media during delete:', storageError)
      }
    }

    const { error: episodesDeleteError } = await supabase
      .from('episodes')
      .delete()
      .eq('podcast_id', id)

    if (episodesDeleteError) {
      console.error('Error deleting podcast episodes:', episodesDeleteError)
      return NextResponse.json(
        { error: 'Failed to delete podcast' },
        { status: 500 },
      )
    }

    const { error: podcastDeleteError } = await supabase
      .from('podcasts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (podcastDeleteError) {
      console.error('Error deleting podcast:', podcastDeleteError)
      return NextResponse.json(
        { error: 'Failed to delete podcast' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting podcast:', error)
    return NextResponse.json({ error: 'Failed to delete podcast' }, { status: 500 })
  }
}
