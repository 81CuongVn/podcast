import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: podcasts, error } = await supabase
      .from('podcasts')
      .select(
        `
        id,
        title,
        description,
        cover_image_url,
        category,
        created_at,
        profiles (
          id,
          display_name,
          avatar_url
        )
      `,
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json(podcasts)
  } catch (error) {
    console.error('Error fetching podcasts:', error)
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, language, is_published } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('podcasts')
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        category: category || null,
        language: language || 'en',
        is_published: is_published ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error('Podcast creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating podcast:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
