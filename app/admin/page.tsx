'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Mic, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  ArrowUpRight
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-3xl bg-muted" />)}
    </div>
    <div className="h-[400px] rounded-3xl bg-muted" />
  </div>

  const metrics = [
    { title: 'Total Users', value: stats?.metrics?.totalUsers || 0, icon: Users, change: '+12%', trend: 'up' },
    { title: 'Total Podcasts', value: stats?.metrics?.totalPodcasts || 0, icon: Mic, change: '+5%', trend: 'up' },
    { title: 'Total Listens', value: stats?.metrics?.totalListens || 0, icon: Play, change: '+24%', trend: 'up' },
    { title: 'Active Creators', value: '84', icon: Activity, change: '+8%', trend: 'up' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium opacity-70">Real-time metrics and system health monitoring.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-full h-12 px-6 font-bold border-2">
            Maintenance Mode
          </Button>
          <Button className="rounded-full h-12 px-8 shadow-xl shadow-primary/20 font-black">
            Export Report <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="rounded-[3rem] border-none shadow-2xl shadow-muted/30 p-8 group hover:scale-[1.02] transition-all duration-500 bg-card/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div className="h-16 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Icon className="h-8 w-8" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                  metric.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {metric.trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-1 opacity-60">{metric.title}</h3>
              <p className="text-4xl font-black tracking-tight">{metric.value.toLocaleString()}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Card className="lg:col-span-8 rounded-[3.5rem] border-none shadow-2xl shadow-muted/30 p-10 bg-card/40 backdrop-blur-md">
          <CardHeader className="p-0 mb-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-black flex items-center gap-4">
                Platform Growth
                <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-primary/10">Live Activity</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {['Day', 'Week', 'Month'].map(t => (
                  <Button key={t} variant="ghost" size="sm" className={cn("rounded-full px-4 font-black text-[10px] uppercase tracking-widest", t === 'Week' && "bg-muted")}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 800 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '2rem', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontWeight: '900',
                    padding: '1.5rem'
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
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-2xl shadow-muted/30 p-10 bg-foreground text-background relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader className="p-0 mb-8 relative z-10">
              <CardTitle className="text-2xl font-black">Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-4 relative z-10">
              <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                Review New Podcasts
              </Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-background/20 hover:bg-background/10 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">
                Manage User Reports
              </Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-background/20 hover:bg-background/10 font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">
                System Audit Log
              </Button>
              <div className="mt-8 p-6 rounded-[2rem] bg-background/5 border border-background/10">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 opacity-60">System Status</h4>
                <div className="flex items-center gap-3 text-sm text-emerald-400 font-black">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  OPERATIONAL
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl shadow-muted/30 p-8 bg-card/40 backdrop-blur-md">
            <h4 className="font-black text-lg mb-4">Latest Signups</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-muted rounded animate-pulse mb-1" />
                    <div className="h-2 w-16 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


