'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Layout,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Layers,
  Sparkles,
  Zap,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const themes = [
  { id: '1', name: 'PodHub Default', author: 'Official', status: 'Active', version: '2.1.0', type: 'System', color: 'bg-primary' },
  { id: '2', name: 'Midnight Wave', author: 'Official', status: 'Installed', version: '1.0.5', type: 'Dark', color: 'bg-slate-900' },
  { id: '3', name: 'Vibrant Pulse', author: 'CreativeLabs', status: 'Installed', version: '1.2.0', type: 'Colorful', color: 'bg-rose-500' },
  { id: '4', name: 'Minimal Studio', author: 'CleanDesign', status: 'Installed', version: '0.9.8', type: 'Minimal', color: 'bg-slate-100' },
]

export default function AdminThemesPage() {
  const [loading, setLoading] = useState(false)

  const handleActivate = (id: string) => {
    toast.success('Theme activated successfully!')
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Palette className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Visual Engine
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Theme Management</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Customize the entire platform appearance with themes and custom styling.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Layers className="mr-2 h-5 w-5" /> Theme Editor
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> Install Theme
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {themes.map((theme) => (
          <Card key={theme.id} className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className={cn("h-48 w-full relative overflow-hidden flex items-center justify-center", theme.color)}>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 scale-90 group-hover:scale-110 transition-transform duration-500">
                <div className="h-24 w-40 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl p-4 flex flex-col gap-2">
                  <div className="h-2 w-1/2 bg-white/40 rounded-full" />
                  <div className="h-2 w-full bg-white/20 rounded-full" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                  <div className="mt-auto flex justify-between">
                    <div className="h-4 w-4 rounded-full bg-white/40" />
                    <div className="h-4 w-4 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
              {theme.status === 'Active' && (
                <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center text-primary animate-in zoom-in-50 duration-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              )}
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-widest border-slate-100 text-slate-400">
                  {theme.type}
                </Badge>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v{theme.version}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{theme.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">by {theme.author}</p>
              
              <div className="flex items-center gap-2">
                {theme.status === 'Active' ? (
                  <Button disabled className="flex-1 h-12 rounded-xl font-black bg-slate-100 text-slate-400 border-none">
                    Active Theme
                  </Button>
                ) : (
                  <Button onClick={() => handleActivate(theme.id)} className="flex-1 h-12 rounded-xl font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                    Activate
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2 hover:bg-slate-50 transition-all">
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Theme Card */}
        <button className="rounded-[3rem] border-4 border-dashed border-slate-100 p-8 flex flex-col items-center justify-center gap-6 group hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 min-h-[400px]">
          <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
            <Plus className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="font-black text-xl text-slate-400 group-hover:text-primary transition-colors">Browse Marketplace</p>
            <p className="text-sm font-bold text-slate-300 mt-2">Discover 500+ premium themes</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="p-8 rounded-[3rem] border-none shadow-xl bg-slate-900 text-white flex items-center gap-6 relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary relative z-10 group-hover:scale-110 transition-transform">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="relative z-10">
            <h4 className="font-black text-lg">Auto-Dark Mode</h4>
            <p className="text-white/50 text-xs font-bold mt-1">Scheduled theme switching</p>
          </div>
        </Card>
        <Card className="p-8 rounded-[3rem] border-none shadow-xl bg-white flex items-center gap-6 relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-primary/10 transition-all">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Zap className="h-7 w-7" />
          </div>
          <div>
            <h4 className="font-black text-lg text-slate-900">Performance Check</h4>
            <p className="text-slate-400 text-xs font-bold mt-1">Theme impact on speed</p>
          </div>
        </Card>
        <Card className="p-8 rounded-[3rem] border-none shadow-xl bg-white flex items-center gap-6 relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-primary/10 transition-all">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Monitor className="h-7 w-7" />
          </div>
          <div>
            <h4 className="font-black text-lg text-slate-900">Responsive Test</h4>
            <p className="text-slate-400 text-xs font-bold mt-1">Preview on 24 devices</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
