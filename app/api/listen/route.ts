import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { episodeId } = await request.json()

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Missing episodeId' },
        { status: 400 }
      )
    }

    // Only track if user is authenticated
    if (!user) {
      return NextResponse.json({ tracked: false })
    }

    // Check if already tracked today
    const today = new Date().toISOString().split('T')[0]
    const { data: existing } = await supabase
      .from('listens')
      .select('id')
      .eq('episode_id', episodeId)
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .single()

    if (!existing) {
      // Track new listen
      await supabase.from('listens').insert([
        {
          episode_id: episodeId,
          user_id: user.id,
        },
      ])
    }

    return NextResponse.json({ tracked: true })
  } catch (error) {
    console.error('Listen tracking error:', error)
    return NextResponse.json({ tracked: false })
  }
}
