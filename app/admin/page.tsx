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
    { title: 'Active Sessions', value: '142', icon: Activity, change: '-2%', trend: 'down' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-2">Real-time metrics and system health monitoring.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          Export Report <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="rounded-[2.5rem] border-none shadow-xl shadow-muted/50 p-6 group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-7 w-7" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full",
                  metric.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-muted-foreground font-semibold text-sm mb-1">{metric.title}</h3>
              <p className="text-3xl font-black">{metric.value.toLocaleString()}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-xl shadow-muted/50 p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              Platform Growth
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
            </CardTitle>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="colorListens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="listens" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorListens)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-xl shadow-muted/50 p-8 bg-foreground text-background">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-2xl font-black">Quick Actions</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-transform">
              Review New Podcasts
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-background/20 hover:bg-background/10 font-bold hover:scale-[1.02] transition-transform">
              Manage User Reports
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-background/20 hover:bg-background/10 font-bold hover:scale-[1.02] transition-transform">
              System Audit Log
            </Button>
            <div className="mt-8 p-6 rounded-[2rem] bg-background/5 border border-background/10">
              <h4 className="font-bold mb-2">System Status</h4>
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                All Systems Operational
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}


