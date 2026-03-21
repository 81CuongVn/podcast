'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Megaphone, 
  Send, 
  History, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  AlertTriangle,
  Info,
  Activity,
  Calendar,
  Filter,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const announcements = [
  { id: '1', title: 'System Maintenance: March 25th', type: 'System', status: 'Scheduled', date: 'Mar 25, 2024 • 02:00 AM', priority: 'High' },
  { id: '2', title: 'PodHub v2.1.0 Released!', type: 'Update', status: 'Active', date: 'Active now', priority: 'Medium' },
  { id: '3', title: 'Creator Rewards Program 2024', type: 'Marketing', status: 'Draft', date: 'Mar 15, 2024', priority: 'Low' },
]

export default function AdminAnnouncementsPage() {
  const [loading, setLoading] = useState(false)

  const handlePost = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success('Announcement published successfully!')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Megaphone className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Platform Broadcast
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Announcements</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Create and manage sitewide notifications, alerts, and system updates.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Activity className="mr-2 h-5 w-5" /> Analytics
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> New Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Creator */}
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white p-10">
          <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Bell className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">New Announcement</CardTitle>
              <CardDescription className="font-bold text-slate-400">Broadcast a message to all active platform users.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Announcement Title</Label>
              <Input 
                placeholder="Important: System Maintenance Scheduled"
                className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</Label>
                <select className="w-full h-14 rounded-2xl px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all appearance-none outline-none">
                  <option>System Update</option>
                  <option>New Feature</option>
                  <option>Security Alert</option>
                  <option>General News</option>
                </select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Priority Level</Label>
                <select className="w-full h-14 rounded-2xl px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all appearance-none outline-none">
                  <option>Low Priority</option>
                  <option>Medium Priority</option>
                  <option>High Priority</option>
                  <option>Critical (Sitewide Alert)</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Announcement Body</Label>
              <Textarea 
                placeholder="Write your announcement details here..."
                className="rounded-2xl bg-slate-50 border-none font-bold min-h-[200px] p-8 focus:ring-2 focus:ring-primary/20 transition-all text-lg leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-slate-400" />
                <span className="font-black text-slate-500 text-sm">Visible to all registered members</span>
              </div>
              <Button onClick={handlePost} disabled={loading} className="rounded-2xl h-14 px-10 font-black bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">
                {loading ? 'Publishing...' : 'Push Announcement'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8">Active & History</h3>
            <div className="space-y-8">
              {announcements.map((a) => (
                <div key={a.id} className="space-y-4 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        a.priority === 'High' ? 'bg-rose-50 text-rose-500' : 
                        a.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                      )}>
                        {a.priority === 'High' ? <AlertTriangle className="h-5 w-5" /> : 
                         a.priority === 'Medium' ? <Info className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors">{a.title}</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{a.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.date}</span>
                    </div>
                    {a.status === 'Active' ? (
                      <Badge className="bg-emerald-50 text-emerald-500 border-none font-black text-[9px] px-2 py-0">ACTIVE</Badge>
                    ) : a.status === 'Scheduled' ? (
                      <Badge className="bg-blue-50 text-blue-500 border-none font-black text-[9px] px-2 py-0">SCHEDULED</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] px-2 py-0">DRAFT</Badge>
                    )}
                  </div>
                  <div className="h-px bg-slate-50 w-full" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-primary">
              View All History <History className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 p-4 opacity-10">
              <Megaphone className="h-24 w-24 -rotate-12" />
            </div>
            <h3 className="text-xl font-black mb-4">Sitewide Alert</h3>
            <p className="text-white/60 font-bold text-sm mb-8">Force an alert to appear on every page for all users.</p>
            <Button className="w-full rounded-2xl h-14 font-black bg-rose-500 hover:bg-rose-600 transition-colors shadow-xl shadow-rose-500/20">
              Enable Emergency Alert
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
