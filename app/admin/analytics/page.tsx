'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Mic,
  Play,
  ArrowUpRight,
  RefreshCw,
  CalendarRange,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AnalyticsStats = {
  users: number
  podcasts: number
  episodes: number
}

const growthSeries = [
  { label: 'Mon', listens: 220, creators: 4 },
  { label: 'Tue', listens: 310, creators: 6 },
  { label: 'Wed', listens: 280, creators: 5 },
  { label: 'Thu', listens: 420, creators: 7 },
  { label: 'Fri', listens: 510, creators: 9 },
  { label: 'Sat', listens: 470, creators: 8 },
  { label: 'Sun', listens: 560, creators: 11 },
]

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AnalyticsStats>({ users: 0, podcasts: 0, episodes: 0 })
  const supabase = createClient()

  useEffect(() => {
    void fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)

    const [
      { count: users },
      { count: podcasts },
      { count: episodes },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('podcasts').select('*', { count: 'exact', head: true }),
      supabase.from('episodes').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      users: users ?? 0,
      podcasts: podcasts ?? 0,
      episodes: episodes ?? 0,
    })
    setLoading(false)
  }

  const metricCards = [
    { label: 'Total Users', value: stats.users, icon: Users, tone: 'from-blue-500/20 to-blue-100', text: 'text-blue-600' },
    { label: 'Published Podcasts', value: stats.podcasts, icon: Mic, tone: 'from-violet-500/20 to-violet-100', text: 'text-violet-600' },
    { label: 'Episodes Indexed', value: stats.episodes, icon: Play, tone: 'from-emerald-500/20 to-emerald-100', text: 'text-emerald-600' },
  ]

  const maxListens = Math.max(...growthSeries.map((item) => item.listens))

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <BarChart3 className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Platform Insights
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Analytics Overview</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-xl">Track creator growth, content volume, and platform momentum from one admin dashboard.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <CalendarRange className="mr-2 h-5 w-5" /> Last 7 Days
          </Button>
          <Button onClick={fetchAnalytics} className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <RefreshCw className={cn('mr-2 h-5 w-5', loading && 'animate-spin')} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((card) => (
          <Card key={card.label} className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
            <CardContent className="p-0 flex items-center gap-5">
              <div className={cn('h-16 w-16 rounded-3xl flex items-center justify-center bg-gradient-to-br', card.tone, card.text)}>
                <card.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">{card.label}</p>
                <p className="text-4xl font-black text-slate-900 mt-1">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white p-10">
          <CardHeader className="p-0 pb-8">
            <CardTitle className="text-2xl font-black text-slate-900">Weekly Activity Trend</CardTitle>
            <CardDescription className="font-bold text-slate-400">A lightweight view of platform activity while we wire deeper reporting.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-4 items-end h-72">
              {growthSeries.map((point) => (
                <div key={point.label} className="flex flex-col items-center gap-3">
                  <div className="w-full rounded-[1.5rem] bg-slate-50 flex items-end p-2 h-56">
                    <div
                      className="w-full rounded-[1rem] bg-gradient-to-t from-primary to-sky-400 transition-all duration-500"
                      style={{ height: `${Math.max((point.listens / maxListens) * 100, 12)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-900">{point.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{point.listens} listens</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-xl bg-slate-900 text-white p-10">
            <h3 className="text-xl font-black mb-4">What’s Next</h3>
            <p className="text-white/65 font-bold text-sm mb-8">Use this area to branch into moderation and catalog health tasks.</p>
            <div className="space-y-3">
              <Button asChild className="w-full justify-between rounded-2xl h-14 font-black bg-white text-slate-900 hover:bg-white/90">
                <Link href="/admin/podcasts">
                  Review Podcasts <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-2xl h-14 font-black border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link href="/admin/users">
                  Audit Users <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <h3 className="text-xl font-black text-slate-900 mb-6">Live Summary</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span className="font-black text-slate-700">Growth pulse</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="font-black text-slate-700">Sync status</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{loading ? 'Refreshing' : 'Ready'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
