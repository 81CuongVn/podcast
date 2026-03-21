'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, CheckCircle2, Layers, Sparkles, Zap, Monitor, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

const initialThemes = [
  { id: '1', name: 'PodHub Default', author: 'Official', status: 'Active', version: '2.1.0', type: 'System', color: 'bg-primary' },
  { id: '2', name: 'Midnight Wave', author: 'Official', status: 'Installed', version: '1.0.5', type: 'Dark', color: 'bg-slate-900' },
  { id: '3', name: 'Vibrant Pulse', author: 'CreativeLabs', status: 'Installed', version: '1.2.0', type: 'Colorful', color: 'bg-rose-500' },
  { id: '4', name: 'Minimal Studio', author: 'CleanDesign', status: 'Installed', version: '0.9.8', type: 'Minimal', color: 'bg-slate-200' },
]

export default function AdminThemesPage() {
  const [themes, setThemes] = useState(initialThemes)
  const [query, setQuery] = useState('')

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => `${theme.name} ${theme.author} ${theme.type}`.toLowerCase().includes(query.toLowerCase()))
  }, [query, themes])

  const handleActivate = (id: string) => {
    setThemes((current) =>
      current.map((theme) => ({
        ...theme,
        status: theme.id === id ? 'Active' : 'Installed',
      }))
    )
    toast.success('Theme activated successfully')
  }

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-3 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Visual system
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Theme management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Compare installed themes, activate safely, and keep the appearance tooling focused on operational tasks.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Layers className="mr-2 h-4 w-4" />
              Theme editor
            </Button>
            <Button className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Install theme
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1 lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search themes..." className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium" />
          </div>
          <p className="text-sm text-slate-500">Showing {filteredThemes.length} available themes</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredThemes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
            <div className={cn('relative flex h-40 items-center justify-center overflow-hidden', theme.color)}>
              <div className="h-24 w-44 rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur">
                <div className="h-2 w-1/2 rounded-full bg-white/60" />
                <div className="mt-3 h-2 rounded-full bg-white/25" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-white/25" />
                <div className="mt-6 flex gap-2">
                  <div className="h-8 flex-1 rounded-xl bg-white/25" />
                  <div className="h-8 w-10 rounded-xl bg-white/35" />
                </div>
              </div>
              {theme.status === 'Active' && (
                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </div>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline" className="rounded-full border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {theme.type}
                </Badge>
                <span className="text-xs font-semibold text-slate-400">v{theme.version}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">{theme.name}</h2>
                <p className="mt-1 text-sm text-slate-500">by {theme.author}</p>
              </div>
              <div className="flex items-center gap-2">
                {theme.status === 'Active' ? (
                  <Button disabled className="h-11 flex-1 rounded-2xl bg-slate-100 text-slate-500">
                    Active theme
                  </Button>
                ) : (
                  <Button onClick={() => handleActivate(theme.id)} className="h-11 flex-1 rounded-2xl font-semibold">
                    Activate
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-slate-200">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <button className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-primary/40 hover:bg-primary/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <Plus className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Browse marketplace</p>
            <p className="mt-1 text-sm text-slate-500">Install a new theme when you are ready to expand the catalog.</p>
          </div>
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-[1.75rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Auto-dark mode</p>
              <p className="text-sm text-slate-400">Scheduled theme switching</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.75rem] border border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">Performance check</p>
              <p className="text-sm text-slate-500">Review theme impact on speed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.75rem] border border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">Responsive test</p>
              <p className="text-sm text-slate-500">Check layout fit before publishing</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
