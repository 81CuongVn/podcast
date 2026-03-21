'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Users, 
  Mic, 
  Play, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
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
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
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
          { data: recentEpisodes }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('podcasts').select('*', { count: 'exact', head: true }),
          supabase.from('episodes').select('*', { count: 'exact', head: true }),
          supabase.from('podcasts').select('*, profiles(display_name)').order('created_at', { ascending: false }).limit(5),
          supabase.from('episodes').select('*, podcasts(title)').order('published_at', { ascending: false }).limit(5)
        ])

        setStats({
          metrics: {
            totalUsers: userCount || 0,
            totalPodcasts: podcastCount || 0,
            totalEpisodes: episodeCount || 0,
            totalListens: 12840, // Mocked until listens table is fully implemented
            onlineUsers: 3,
            bannedUsers: 0,
            notActivated: 2
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
          ]
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
    { title: 'Total Listeners', value: stats?.metrics?.totalUsers || 0, color: 'bg-gradient-to-br from-blue-600 to-blue-400', icon: Users, sub: 'View all users' },
    { title: 'Total Podcasts', value: stats?.metrics?.totalPodcasts || 0, color: 'bg-gradient-to-br from-purple-600 to-purple-400', icon: Mic, sub: 'Manage podcasts' },
    { title: 'Total Episodes', value: stats?.metrics?.totalEpisodes || 0, color: 'bg-gradient-to-br from-emerald-600 to-emerald-400', icon: Play, sub: 'Latest episodes' },
    { title: 'Total Listens', value: stats?.metrics?.totalListens.toLocaleString() || '0', color: 'bg-gradient-to-br from-rose-600 to-rose-400', icon: Activity, sub: 'Analytics report' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-primary animate-pulse uppercase tracking-widest">Initialising Engine...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-border/40">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <LayoutDashboard className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">PodHub Engine</h1>
            <p className="text-muted-foreground text-sm font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              System Status: <span className="text-emerald-600">All Services Operational</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl font-bold border-2 h-12 px-6 hover:bg-slate-50">
            <Settings className="mr-2 h-4 w-4" /> System Settings
          </Button>
          <Button className="rounded-2xl font-black shadow-xl shadow-primary/20 h-12 px-8 bg-primary hover:bg-primary/90">
            Push Notification <Bell className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topStats.map((stat) => (
          <div key={stat.title} className={cn(
            "p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer",
            stat.color
          )}>
            <div className="absolute -right-4 -bottom-4 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
              <stat.icon className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-5xl font-black mb-1 tracking-tighter">{stat.value}</p>
              <h3 className="text-lg font-bold opacity-90 mb-4">{stat.title}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-black/20 transition-colors">
                {stat.sub} <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="xl:col-span-2 rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Platform Growth</CardTitle>
                <CardDescription className="font-bold text-slate-500">Total listens and engagement across all podcasts</CardDescription>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm text-xs font-black uppercase tracking-wider text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Listens
                </div>
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  Episodes
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: '700' }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: '700' }}
                    dx={-15}
                  />
                  <Tooltip 
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ 
                      borderRadius: '2rem', 
                      border: 'none', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                      padding: '1.5rem',
                      fontWeight: '800'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="listens" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorListens)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System & Recent Activity */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white p-8">
            <h3 className="text-xl font-black mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Add Creator</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Newsletter</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Review Mods</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-70">Payouts</span>
              </button>
            </div>
          </Card>

          {/* Newest Podcasts */}
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">New Podcasts</h3>
              <Link href="/admin/podcasts" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {stats?.recentPodcasts?.map((podcast: any) => (
                <div key={podcast.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {podcast.cover_url ? (
                      <img src={podcast.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                        <Mic className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-900 truncate group-hover:text-primary transition-colors">{podcast.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">by {podcast.profiles?.display_name || 'Unknown'}</p>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                    {new Date(podcast.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Globe className="h-7 w-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{stats?.metrics?.onlineUsers}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Users Online</p>
          </div>
        </Card>
        <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">1.2k</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Likes</p>
          </div>
        </Card>
        <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <MessageSquare className="h-7 w-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">458</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comments</p>
          </div>
        </Card>
        <Card className="p-8 rounded-[2.5rem] border-none bg-white shadow-sm flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">84h</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Airtime</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

