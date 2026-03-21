'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Eye,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  Monitor,
  Search,
  Wand2,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

const initialThemes = [
  {
    id: '1',
    name: 'PodHub Default',
    author: 'Official',
    status: 'Active',
    version: '2.1.0',
    type: 'System',
    accent: 'from-blue-600 via-cyan-500 to-sky-400',
    surface: 'bg-slate-950',
    description: 'Balanced contrast, spacious cards, and the safest default for production.',
  },
  {
    id: '2',
    name: 'Midnight Wave',
    author: 'Official',
    status: 'Installed',
    version: '1.0.5',
    type: 'Dark',
    accent: 'from-slate-900 via-slate-700 to-slate-500',
    surface: 'bg-slate-900',
    description: 'A darker workspace tuned for long moderation and analytics sessions.',
  },
  {
    id: '3',
    name: 'Vibrant Pulse',
    author: 'CreativeLabs',
    status: 'Installed',
    version: '1.2.0',
    type: 'Colorful',
    accent: 'from-fuchsia-600 via-rose-500 to-orange-400',
    surface: 'bg-rose-500',
    description: 'High-energy presentation for brands that want a bolder visual identity.',
  },
  {
    id: '4',
    name: 'Minimal Studio',
    author: 'CleanDesign',
    status: 'Installed',
    version: '0.9.8',
    type: 'Minimal',
    accent: 'from-stone-300 via-slate-200 to-white',
    surface: 'bg-slate-200',
    description: 'Quiet, restrained styling focused on density and content clarity.',
  },
]

export default function AdminThemesPage() {
  const [themes, setThemes] = useState(initialThemes)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | 'Active' | 'Installed'>('All')
  const [selectedThemeId, setSelectedThemeId] = useState(initialThemes[0].id)

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const matchesQuery = `${theme.name} ${theme.author} ${theme.type}`.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || theme.status === filter
      return matchesQuery && matchesFilter
    })
  }, [filter, query, themes])

  const selectedTheme =
    themes.find((theme) => theme.id === selectedThemeId) ??
    filteredThemes[0] ??
    themes[0]

  const handleActivate = (id: string) => {
    setThemes((current) =>
      current.map((theme) => ({
        ...theme,
        status: theme.id === id ? 'Active' : 'Installed',
      }))
    )
    setSelectedThemeId(id)
    toast.success('Theme activated successfully')
  }

  const summaryCards = [
    { label: 'Installed themes', value: themes.length, icon: Layers, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Ready to use', value: themes.filter((theme) => theme.status === 'Installed').length, icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Customization depth', value: '24 vars', icon: SlidersHorizontal, tone: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <div className="p-6 sm:p-8">
            <Badge className="mb-4 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Theme studio
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Make themes feel managed, not decorative</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Review active styling, compare alternatives, and promote the right theme without bouncing through oversized mock cards.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
                <Wand2 className="mr-2 h-4 w-4" />
                Open theme editor
              </Button>
              <Button className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                Install theme
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-950 p-6 text-white lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Active preview</p>
            <div className={cn('mt-4 rounded-[1.75rem] bg-gradient-to-br p-5 shadow-2xl', selectedTheme.accent)}>
              <div className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded-full bg-white/60" />
                  <div className="h-8 w-8 rounded-2xl bg-white/30" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/20 p-4">
                    <div className="h-2 w-12 rounded-full bg-white/60" />
                    <div className="mt-4 h-8 w-16 rounded-xl bg-white/25" />
                  </div>
                  <div className="rounded-2xl bg-white/20 p-4">
                    <div className="h-2 w-12 rounded-full bg-white/60" />
                    <div className="mt-4 h-8 w-20 rounded-xl bg-white/25" />
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/18 p-4">
                  <div className="h-2 w-20 rounded-full bg-white/60" />
                  <div className="mt-3 h-2 rounded-full bg-white/30" />
                  <div className="mt-2 h-2 w-3/4 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-lg font-bold">{selectedTheme.name}</p>
            <p className="mt-1 text-sm text-slate-300">{selectedTheme.description}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((item) => (
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative min-w-0 flex-1 lg:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search themes..."
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Active', 'Installed'] as const).map((option) => (
                  <Button
                    key={option}
                    variant={filter === option ? 'default' : 'outline'}
                    className="h-11 rounded-2xl px-4 font-semibold"
                    onClick={() => setFilter(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">Showing {filteredThemes.length} theme options</p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredThemes.map((theme) => {
              const isSelected = theme.id === selectedTheme.id

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={cn(
                    'overflow-hidden rounded-[2rem] border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg',
                    isSelected ? 'border-primary ring-4 ring-primary/10' : 'border-slate-200'
                  )}
                >
                  <div className={cn('relative bg-gradient-to-br p-5', theme.accent)}>
                    <div className="absolute right-4 top-4">
                      {theme.status === 'Active' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-black/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          Installed
                        </div>
                      )}
                    </div>
                    <div className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-20 rounded-full bg-white/60" />
                        <div className="h-8 w-8 rounded-2xl bg-white/30" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/20 p-4">
                          <div className="h-2 w-10 rounded-full bg-white/60" />
                          <div className="mt-4 h-7 rounded-xl bg-white/25" />
                        </div>
                        <div className="rounded-2xl bg-white/20 p-4">
                          <div className="h-2 w-10 rounded-full bg-white/60" />
                          <div className="mt-4 h-7 rounded-xl bg-white/25" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className="rounded-full border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                        {theme.type}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-400">v{theme.version}</span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-950">{theme.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">by {theme.author}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-500">{theme.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {theme.status === 'Active' ? (
                        <Button disabled className="h-11 flex-1 rounded-2xl bg-slate-100 text-slate-500">
                          Active theme
                        </Button>
                      ) : (
                        <Button
                          onClick={(event) => {
                            event.stopPropagation()
                            handleActivate(theme.id)
                          }}
                          className="h-11 flex-1 rounded-2xl font-semibold"
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-2xl border-slate-200"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedThemeId(theme.id)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </button>
              )
            })}

            <button
              type="button"
              className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <Plus className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Browse marketplace</p>
                <p className="mt-1 text-sm text-slate-500">
                  Install a new theme when you are ready to expand the catalog.
                </p>
              </div>
            </button>
          </section>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-950">Selected theme</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Compare metadata before activating.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className={cn('rounded-[1.5rem] bg-gradient-to-br p-4 text-white', selectedTheme.accent)}>
                <p className="text-lg font-bold">{selectedTheme.name}</p>
                <p className="mt-1 text-sm text-white/80">{selectedTheme.type} theme</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Author</p>
                  <p className="mt-2 font-semibold text-slate-950">{selectedTheme.author}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Version</p>
                  <p className="mt-2 font-semibold text-slate-950">{selectedTheme.version}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Why use it</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTheme.description}</p>
              </div>
              {selectedTheme.status === 'Active' ? (
                <Button disabled className="h-11 w-full rounded-2xl bg-slate-100 text-slate-500">
                  Currently active
                </Button>
              ) : (
                <Button onClick={() => handleActivate(selectedTheme.id)} className="h-11 w-full rounded-2xl font-semibold">
                  Activate selected theme
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">Design operations</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Promote the active theme, validate performance, and keep visual changes reviewable for admins.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Zap className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-slate-200">Performance check ready</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Monitor className="h-4 w-4 text-sky-300" />
                  <span className="text-sm text-slate-200">Responsive preview available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
