import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ episodeId: string }> },
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { episodeId } = await params
    const { duration_seconds, position_seconds } = await request.json()

    const { error } = await supabase.from('listens').insert([
      {
        user_id: user.id,
        episode_id: episodeId,
        duration_seconds,
        position_seconds,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Listen tracking error:', error)
    return NextResponse.json({ error: 'Failed to track listen' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ episodeId: string }> },
) {
  try {
    const { episodeId } = await params
    const supabase = await createClient()

    const { data: listens, error } = await supabase
      .from('listens')
      .select('*')
      .eq('episode_id', episodeId)

    if (error) throw error

    const stats = {
      totalListens: listens?.length || 0,
      averagePosition: listens && listens.length > 0
        ? listens.reduce((sum: number, l: any) => sum + (l.position_seconds || 0), 0) / listens.length
        : 0,
      completionRate: listens && listens.length > 0
        ? (listens.filter((l: any) => l.position_seconds && l.duration_seconds && l.position_seconds >= l.duration_seconds * 0.9).length / listens.length) * 100
        : 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching listen stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
