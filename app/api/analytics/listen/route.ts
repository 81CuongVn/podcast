import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const { episode_id, duration_listened, completed } = body

    if (!episode_id) {
      return NextResponse.json(
        { error: 'Missing episode_id' },
        { status: 400 }
      )
    }

    // Insert listen record
    const { error } = await supabase.from('listens').insert({
      episode_id,
      user_id: user?.id || null,
      duration_listened: duration_listened || null,
      completed: completed || false,
    })

    if (error) {
      console.error('Listen insert error:', error)
      return NextResponse.json(
        { error: 'Failed to track listen' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Listen tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track listen' },
      { status: 500 }
    )
  }
}
