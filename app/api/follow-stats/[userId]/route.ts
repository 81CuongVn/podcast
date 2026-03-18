import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const supabase = await createClient()

    const [followers, following] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', userId),
      supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', userId),
    ])

    return NextResponse.json({
      followers: followers.count || 0,
      following: following.count || 0,
    })
  } catch (error) {
    console.error('Error fetching follow stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follow stats' },
      { status: 500 }
    )
  }
}
