'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ListenData {
  date: string
  listens: number
}

interface TopEpisode {
  id: string
  title: string
  listen_count: number
}

interface AnalyticsStats {
  total_listens: number
  completed_listens: number
  total_subscribers: number
  average_listen_duration: number
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [listenData, setListenData] = useState<ListenData[]>([])
  const [topEpisodes, setTopEpisodes] = useState<TopEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Fetch user's podcasts
        const { data: podcasts } = await supabase
          .from('podcasts')
          .select('id')
          .eq('user_id', user.id)

        if (!podcasts || podcasts.length === 0) {
          setLoading(false)
          return
        }

        const podcastIds = podcasts.map((p) => p.id)

        // Fetch listens for all user's podcasts
        const { data: episodes } = await supabase
          .from('episodes')
          .select('id')
          .in('podcast_id', podcastIds)

        if (!episodes || episodes.length === 0) {
          setLoading(false)
          return
        }

        const episodeIds = episodes.map((e) => e.id)

        // Fetch listen analytics
        const { data: listens } = await supabase
          .from('listens')
          .select('*')
          .in('episode_id', episodeIds)
          .order('listened_at', { ascending: true })

        // Calculate stats
        if (listens) {
          const total = listens.length
          const completed = listens.filter((l) => l.completed).length
          const avgDuration =
            listens.length > 0
              ? Math.round(
                  listens.reduce((sum, l) => sum + (l.duration_listened || 0), 0) /
                    listens.length
                )
              : 0

          setStats({
            total_listens: total,
            completed_listens: completed,
            total_subscribers: podcasts.length,
            average_listen_duration: avgDuration,
          })

          // Group listens by date
          const grouped: Record<string, number> = {}
          listens.forEach((l) => {
            const date = new Date(l.listened_at).toLocaleDateString()
            grouped[date] = (grouped[date] || 0) + 1
          })

          const chartData = Object.entries(grouped)
            .map(([date, count]) => ({ date, listens: count }))
            .slice(-30) // Last 30 days

          setListenData(chartData)

          // Get top episodes
          const episodeCounts: Record<string, { title: string; count: number }> = {}
          listens.forEach((l) => {
            episodeCounts[l.episode_id] = (episodeCounts[l.episode_id] || { title: '', count: 0 })
            episodeCounts[l.episode_id].count++
          })

          // Fetch episode details
          const { data: episodeDetails } = await supabase
            .from('episodes')
            .select('id, title')
            .in('id', Object.keys(episodeCounts))

          if (episodeDetails) {
            const top = episodeDetails
              .map((e) => ({
                id: e.id,
                title: e.title,
                listen_count: episodeCounts[e.id]?.count || 0,
              }))
              .sort((a, b) => b.listen_count - a.listen_count)
              .slice(0, 5)

            setTopEpisodes(top)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No analytics data yet</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Listens</h3>
          <p className="text-3xl font-bold">{stats.total_listens}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed Listens</h3>
          <p className="text-3xl font-bold">{stats.completed_listens}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Subscribers</h3>
          <p className="text-3xl font-bold">{stats.total_subscribers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Duration</h3>
          <p className="text-3xl font-bold">{stats.average_listen_duration}s</p>
        </Card>
      </div>

      {/* Listens Chart */}
      {listenData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Listens Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={listenData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="listens"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top Episodes */}
      {topEpisodes.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Episodes</h3>
          <div className="space-y-3">
            {topEpisodes.map((episode, index) => (
              <div key={episode.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">{index + 1}</span>
                  <span className="font-medium">{episode.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{episode.listen_count} listens</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
