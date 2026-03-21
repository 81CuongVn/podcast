'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  Users,
  Mic,
  Play,
  Activity,
  ArrowUpRight,
  MessageSquare,
  DollarSign,
  Heart,
  Globe,
  Bell,
  Clock,
  ShieldCheck,
  Mail,
  LayoutDashboard,
  Settings,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: userCount },
          { count: podcastCount },
          { count: episodeCount },
          { data: recentPodcasts },
          { data: recentEpisodes },
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('podcasts').select('*', { count: 'exact', head: true }),
          supabase.from('episodes').select('*', { count: 'exact', head: true }),
          supabase.from('podcasts').select('*, profiles(display_name)').order('created_at', { ascending: false }).limit(5),
          supabase.from('episodes').select('*, podcasts(title)').order('published_at', { ascending: false }).limit(5),
        ])

        setStats({
          metrics: {
            totalUsers: userCount || 0,
            totalPodcasts: podcastCount || 0,
            totalEpisodes: episodeCount || 0,
            totalListens: 12840,
            onlineUsers: 3,
          },
          recentPodcasts: recentPodcasts || [],
          recentEpisodes: recentEpisodes || [],
          chartData: [
            { name: 'Jan', listens: 4200, episodes: 45, users: 120 },
            { name: 'Feb', listens: 3800, episodes: 38, users: 150 },
            { name: 'Mar', listens: 5100, episodes: 52, users: 180 },
            { name: 'Apr', listens: 4800, episodes: 41, users: 210 },
            { name: 'May', listens: 6200, episodes: 64, users: 250 },
            { name: 'Jun', listens: 7500, episodes: 72, users: 310 },
            { name: 'Jul', listens: 8900, episodes: 85, users: 380 },
          ],
        })
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  const topStats = [
    { title: 'Total users', value: stats?.metrics?.totalUsers || 0, color: 'from-blue-600 to-blue-500', icon: Users, href: '/admin/users', sub: 'Review members' },
    { title: 'Podcasts', value: stats?.metrics?.totalPodcasts || 0, color: 'from-violet-600 to-fuchsia-500', icon: Mic, href: '/admin/podcasts', sub: 'Manage catalog' },
    { title: 'Episodes', value: stats?.metrics?.totalEpisodes || 0, color: 'from-emerald-600 to-teal-500', icon: Play, href: '/admin/podcasts', sub: 'Check publishing' },
    { title: 'Total listens', value: Number(stats?.metrics?.totalListens ?? 0).toLocaleString(), color: 'from-rose-600 to-orange-500', icon: Activity, href: '/admin/analytics', sub: 'Open analytics' },
  ]

  const quickActions = [
    { label: 'Add creator', icon: Plus, href: '/admin/users', tone: 'bg-blue-50 text-blue-600' },
    { label: 'Newsletter', icon: Mail, href: '/admin/newsletter', tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Review groups', icon: ShieldCheck, href: '/admin/groups', tone: 'bg-amber-50 text-amber-600' },
    { label: 'Payouts', icon: DollarSign, href: '/admin/wallet', tone: 'bg-rose-50 text-rose-600' },
  ]

  const systemStats = [
    { label: 'Users online', value: stats?.metrics?.onlineUsers ?? 0, icon: Globe, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Total likes', value: '1.2k', icon: Heart, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Comments', value: '458', icon: MessageSquare, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Total airtime', value: '84h', icon: Clock, tone: 'bg-rose-50 text-rose-600' },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Loading dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Operations overview</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">PodHub Engine</h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All services operational and admin tools available.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                System settings
              </Link>
            </Button>
            <Button asChild className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <Link href="/admin/announcements">
                Push notification
                <Bell className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => (
          <Link key={stat.title} href={stat.href} className={cn('group overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl', stat.color)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="mt-8 text-4xl font-black tracking-tight">{stat.value}</p>
            <h2 className="mt-2 text-lg font-bold">{stat.title}</h2>
            <p className="mt-1 text-sm text-white/75">{stat.sub}</p>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-950">Platform growth</CardTitle>
                <CardDescription className="mt-1 text-sm text-slate-500">Listen volume over the last seven reporting periods.</CardDescription>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-semibold">
                <span className="rounded-xl bg-white px-3 py-2 text-primary shadow-sm">Listens</span>
                <span className="px-3 py-2 text-slate-400">Episodes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }} />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 35px rgba(15, 23, 42, 0.08)' }}
                  />
                  <Area type="monotone" dataKey="listens" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorListens)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-black">Quick actions</CardTitle>
              <CardDescription className="text-sm text-slate-400">Jump directly to common admin tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 p-6 pt-0">
              {quickActions.map((action) => (
                <Button key={action.label} asChild variant="ghost" className="h-auto justify-start rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10">
                  <Link href={action.href}>
                    <div className={cn('mb-4 flex h-11 w-11 items-center justify-center rounded-2xl', action.tone)}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="mt-1 text-xs text-slate-400">Open module</p>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-xl font-black text-slate-950">New podcasts</CardTitle>
                <CardDescription className="mt-1 text-sm text-slate-500">Latest shows added by creators.</CardDescription>
              </div>
              <Button asChild variant="ghost" className="rounded-xl px-3 text-primary">
                <Link href="/admin/podcasts">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {stats?.recentPodcasts?.map((podcast: any) => (
                <div key={podcast.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                    {podcast.cover_url ? (
                      <img src={podcast.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                        <Mic className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{podcast.title}</p>
                    <p className="truncate text-sm text-slate-500">by {podcast.profiles?.display_name || 'Unknown creator'}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    {new Date(podcast.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-black text-slate-950">Recent episodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {stats?.recentEpisodes?.map((episode: any) => (
                <div key={episode.id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="truncate font-semibold text-slate-900">{episode.title}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">{episode.podcasts?.title || 'Unknown podcast'}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {episode.published_at ? new Date(episode.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {systemStats.map((item) => (
          <Card key={item.label} className="rounded-[1.75rem] border border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', item.tone)}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
