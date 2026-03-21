'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PieChart, 
  ArrowRight,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

const chartData = [
  { name: 'Mon', revenue: 4000, payouts: 2400 },
  { name: 'Tue', revenue: 3000, payouts: 1398 },
  { name: 'Wed', revenue: 2000, payouts: 9800 },
  { name: 'Thu', revenue: 2780, payouts: 3908 },
  { name: 'Fri', revenue: 1890, payouts: 4800 },
  { name: 'Sat', revenue: 2390, payouts: 3800 },
  { name: 'Sun', revenue: 3490, payouts: 4300 },
]

const recentTransactions = [
  { id: '1', user: 'Alex Rivera', amount: 120.50, type: 'Subscription', status: 'Completed', date: '2 hours ago' },
  { id: '2', user: 'Sarah Chen', amount: 45.00, type: 'Ad Revenue', status: 'Pending', date: '5 hours ago' },
  { id: '3', user: 'Mike Johnson', amount: 250.00, type: 'Payout', status: 'Completed', date: 'Yesterday' },
  { id: '4', user: 'Elena Rodriguez', amount: 89.99, type: 'Subscription', status: 'Completed', date: 'Yesterday' },
  { id: '5', user: 'David Kim', amount: 15.00, type: 'Donation', status: 'Failed', date: '2 days ago' },
]

export default function AdminEarningsPage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-200 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <DollarSign className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-emerald-500 text-white border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Financial Engine
          </Badge>
          <h1 className="text-4xl font-black tracking-tight">Earnings & Revenue</h1>
          <p className="text-slate-400 mt-2 font-bold max-w-lg">Monitor platform transactions, payouts, and revenue growth in real-time.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-slate-700 hover:bg-white/5 text-white transition-all">
            <Download className="mr-2 h-5 w-5" /> Export PDF
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all border-none">
            Process Payouts <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white group hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">$128,450</p>
          <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] mt-4 uppercase tracking-wider">
            <ArrowUpRight className="h-3 w-3" /> +12.5% vs last month
          </div>
        </Card>
        
        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white group hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
            <Wallet className="h-6 w-6" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Available Funds</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">$42,890</p>
          <div className="flex items-center gap-1.5 text-slate-400 font-black text-[10px] mt-4 uppercase tracking-wider">
            Ready for withdrawal
          </div>
        </Card>

        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white group hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
            <Clock className="h-6 w-6" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Payouts</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">$8,200</p>
          <div className="flex items-center gap-1.5 text-amber-500 font-black text-[10px] mt-4 uppercase tracking-wider">
            12 requests waiting
          </div>
        </Card>

        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white group hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
            <PieChart className="h-6 w-6" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Platform Fee (15%)</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">$19,267</p>
          <div className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] mt-4 uppercase tracking-wider">
            Net profit this year
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="p-10 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Revenue Stream</CardTitle>
                <CardDescription className="font-bold text-slate-400">Comparing gross revenue vs. creator payouts</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                <Button variant="ghost" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 h-10">7 Days</Button>
                <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 h-10 bg-white border-none shadow-sm text-primary">30 Days</Button>
                <Button variant="ghost" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 h-10">90 Days</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }}
                    dx={-15}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '1rem' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Recent Flow</h3>
            <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="space-y-8 flex-1">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 
                    tx.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'
                  )}>
                    {tx.status === 'Completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                     tx.status === 'Pending' ? <Clock className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-slate-900 truncate">{tx.user}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tx.type} • {tx.date}</p>
                  </div>
                </div>
                <p className={cn(
                  "font-black text-sm",
                  tx.type === 'Payout' ? 'text-rose-500' : 'text-emerald-500'
                )}>
                  {tx.type === 'Payout' ? '-' : '+'}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <Button className="w-full mt-10 h-14 rounded-2xl font-black bg-slate-900 hover:bg-slate-800 transition-colors shadow-xl shadow-slate-200">
            Manage Transactions
          </Button>
        </Card>
      </div>
    </div>
  )
}
