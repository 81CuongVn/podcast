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

    const { targetUserId } = await request.json()

    if (!targetUserId || targetUserId === user.id) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    if (existing) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)

      if (error) throw error
      return NextResponse.json({ action: 'unfollowed' })
    } else {
      // Follow
      const { error } = await supabase.from('follows').insert([
        {
          follower_id: user.id,
          following_id: targetUserId,
        },
      ])

      if (error) throw error
      return NextResponse.json({ action: 'followed' })
    }
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params
    const supabase = await createClient()

    const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId)

    const { data: following } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    return NextResponse.json({
      followersCount: followers?.length || 0,
      followingCount: following?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching follow stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
