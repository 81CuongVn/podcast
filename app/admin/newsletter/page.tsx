'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  Send, 
  Users, 
  History, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye, 
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const campaigns = [
  { id: '1', title: 'Weekly Podcast Highlights', sentTo: 1240, opens: '65%', clicks: '12%', status: 'Sent', date: 'Mar 15, 2024' },
  { id: '2', title: 'New Feature: Waveform Player', sentTo: 1240, opens: '72%', clicks: '24%', status: 'Sent', date: 'Mar 10, 2024' },
  { id: '3', title: 'Upcoming Creator Workshop', sentTo: 0, opens: '0%', clicks: '0%', status: 'Draft', date: 'Last edited 2 days ago' },
]

export default function AdminNewsletterPage() {
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('Newsletter campaign queued for delivery!')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Mail className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Audience Reach
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Newsletter Engine</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Connect with your listeners directly through automated and manual email campaigns.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <History className="mr-2 h-5 w-5" /> History
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Composer */}
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white p-10">
          <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Send className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">Quick Campaign</CardTitle>
              <CardDescription className="font-bold text-slate-400">Send a quick update to all your subscribers.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Subject</Label>
              <Input 
                placeholder="Exciting news from PodHub..."
                className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Message Content</Label>
              <Textarea 
                placeholder="Write your message here..."
                className="rounded-2xl bg-slate-50 border-none font-bold min-h-[300px] p-8 focus:ring-2 focus:ring-primary/20 transition-all text-lg leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-400" />
                <span className="font-black text-slate-500 text-sm">Target: 1,240 active subscribers</span>
              </div>
              <Button onClick={handleSend} disabled={loading} className="rounded-2xl h-14 px-10 font-black bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">
                {loading ? 'Processing...' : 'Blast Newsletter'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8">Recent Campaigns</h3>
            <div className="space-y-8">
              {campaigns.map((c) => (
                <div key={c.id} className="space-y-4 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors">{c.title}</p>
                    {c.status === 'Sent' ? (
                      <Badge className="bg-emerald-50 text-emerald-500 border-none font-black text-[9px] px-2 py-0">SENT</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] px-2 py-0">DRAFT</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Opens</p>
                      <p className="font-black text-sm text-slate-700">{c.opens}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Clicks</p>
                      <p className="font-black text-sm text-slate-700">{c.clicks}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Recipients</p>
                      <p className="font-black text-sm text-slate-700">{c.sentTo}</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{c.date}</p>
                  <div className="h-px bg-slate-50 w-full" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-primary">
              View Analytics <BarChart3 className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl bg-gradient-to-br from-primary to-purple-600 p-10 text-white">
            <h3 className="text-xl font-black mb-4">Subscriber Growth</h3>
            <p className="text-white/70 font-bold text-sm mb-8">You've gained 120 new subscribers this month!</p>
            <div className="flex items-end gap-2 h-20">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div 
                  key={i} 
                  className="bg-white/20 hover:bg-white/40 transition-colors w-full rounded-t-lg" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
