'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsPageProps {
  params: Promise<{ id: string }>
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const [podcastId, setPodcastId] = useState<string>('')
  const [podcast, setPodcast] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListens: 0,
    subscribers: 0,
    episodes: 0,
    averageListensPerEpisode: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const supabase = createClient()

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  useEffect(() => {
    const loadAnalytics = async () => {
      const { id } = await params
      setPodcastId(id)

      // Fetch podcast
      const { data: podcastData } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single()

      if (podcastData) {
        setPodcast(podcastData)
      }

      // Fetch episodes
      const { data: episodes } = await supabase
        .from('episodes')
        .select('id, title, duration_seconds, released_at')
        .eq('podcast_id', id)

      if (episodes && episodes.length > 0) {
        // Fetch listens for each episode
        const episodeIds = episodes.map((e) => e.id)
        const { data: listens } = await supabase
          .from('listens')
          .select('episode_id')
          .in('episode_id', episodeIds)

        const listensByEpisode: { [key: string]: number } = {}
        let totalListens = 0
        episodes.forEach((e) => {
          listensByEpisode[e.id] = 0
        })
        listens?.forEach((l) => {
          listensByEpisode[l.episode_id]++
          totalListens++
        })

        // Prepare chart data
        const data = episodes.map((e) => ({
          name: e.title,
          listens: listensByEpisode[e.id] || 0,
          duration: Math.round(e.duration_seconds / 60),
        }))

        setChartData(data)

        // Fetch subscribers
        const { data: subscribers } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('podcast_id', id)

        setStats({
          totalListens,
          subscribers: subscribers?.length || 0,
          episodes: episodes.length,
          averageListensPerEpisode: episodes.length > 0 ? Math.round(totalListens / episodes.length) : 0,
        })
      }

      setLoading(false)
    }

    loadAnalytics()
  }, [params, supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{podcast?.title}</h1>
          <p className="mt-2 text-muted-foreground">Analytics & Performance</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">
              Total Listens
            </div>
            <div className="mt-2 text-3xl font-bold">{stats.totalListens}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">
              Subscribers
            </div>
            <div className="mt-2 text-3xl font-bold">{stats.subscribers}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">
              Episodes
            </div>
            <div className="mt-2 text-3xl font-bold">{stats.episodes}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">
              Avg Listens/Episode
            </div>
            <div className="mt-2 text-3xl font-bold">
              {stats.averageListensPerEpisode}
            </div>
          </Card>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Listens by Episode */}
            <Card className="p-6">
              <h2 className="mb-4 font-semibold">Listens by Episode</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="listens" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Episode Duration */}
            <Card className="p-6">
              <h2 className="mb-4 font-semibold">Episode Duration</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {chartData.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No episode data available yet
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
