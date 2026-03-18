import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch metrics
    const [
      { count: usersCount },
      { count: podcastsCount },
      { count: episodesCount },
      { count: listensCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('podcasts').select('*', { count: 'exact', head: true }),
      supabase.from('episodes').select('*', { count: 'exact', head: true }),
      supabase.from('listens').select('*', { count: 'exact', head: true })
    ])

    // Fetch growth data (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentListens } = await supabase
      .from('listens')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())

    // Group listens by day
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateString = date.toISOString().split('T')[0]
      const count = recentListens?.filter(l => l.created_at.startsWith(dateString)).length || 0
      return { name: date.toLocaleDateString('en-US', { weekday: 'short' }), listens: count }
    })

    return NextResponse.json({
      metrics: {
        totalUsers: usersCount || 0,
        totalPodcasts: podcastsCount || 0,
        totalEpisodes: episodesCount || 0,
        totalListens: listensCount || 0,
      },
      chartData
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
