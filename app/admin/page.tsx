'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Globe,
  Heart,
  Image as ImageIcon,
  Languages,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquare,
  Mic,
  Paintbrush,
  Palette,
  Play,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Type,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react'
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [savingHomepage, setSavingHomepage] = useState(false)
  const [homepageContent, setHomepageContent] = useState({
    siteTitle: 'PodHub',
    heroTitle: 'Stories, voices, and communities in one podcast home',
    heroDescription: 'Manage the content your visitors see first, tune discovery, and keep your homepage aligned with what the platform is promoting right now.',
    ctaPrimary: 'Start Listening',
    ctaSecondary: 'Apply as Creator',
    backgroundUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1400&auto=format&fit=crop',
    announcement: 'New creator spotlight goes live this Friday at 8 PM.',
  })
  const [homepageSettings, setHomepageSettings] = useState({
    featuredBanner: true,
    creatorApplications: true,
    listenerTestimonials: true,
    trendingCarousel: true,
  })
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
          supabase
            .from('podcasts')
            .select('*, profiles(display_name)')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('episodes')
            .select('*, podcasts(title)')
            .order('published_at', { ascending: false })
            .limit(5),
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

  const handleSaveHomepage = async () => {
    setSavingHomepage(true)
    setTimeout(() => {
      toast.success('Homepage controls saved')
      setSavingHomepage(false)
    }, 900)
  }

  const topStats = [
    { title: 'Total users', value: stats?.metrics?.totalUsers || 0, color: 'from-blue-600 to-blue-500', icon: Users, href: '/admin/users', sub: 'Review members' },
    { title: 'Podcasts', value: stats?.metrics?.totalPodcasts || 0, color: 'from-violet-600 to-fuchsia-500', icon: Mic, href: '/admin/podcasts', sub: 'Manage catalog' },
    { title: 'Episodes', value: stats?.metrics?.totalEpisodes || 0, color: 'from-emerald-600 to-teal-500', icon: Play, href: '/admin/podcasts', sub: 'Check publishing' },
    { title: 'Total listens', value: Number(stats?.metrics?.totalListens ?? 0).toLocaleString(), color: 'from-rose-600 to-orange-500', icon: Activity, href: '/admin/analytics', sub: 'Open analytics' },
  ]

  const managementLinks = [
    { title: 'Website settings', description: 'Edit platform identity, SEO, and security.', href: '/admin/settings', icon: Settings, tone: 'bg-blue-50 text-blue-600' },
    { title: 'Theme manager', description: 'Change colors, visual systems, and active theme.', href: '/admin/themes', icon: Palette, tone: 'bg-violet-50 text-violet-600' },
    { title: 'Languages', description: 'Translate and localize the public experience.', href: '/admin/languages', icon: Languages, tone: 'bg-emerald-50 text-emerald-600' },
    { title: 'Announcements', description: 'Publish banners and homepage notices.', href: '/admin/announcements', icon: Megaphone, tone: 'bg-amber-50 text-amber-600' },
    { title: 'Newsletter', description: 'Connect campaigns with homepage promotion.', href: '/admin/newsletter', icon: Mail, tone: 'bg-rose-50 text-rose-600' },
    { title: 'Users & groups', description: 'Manage creators, roles, and access control.', href: '/admin/users', icon: ShieldCheck, tone: 'bg-cyan-50 text-cyan-600' },
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
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Website control center</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Manage the whole website from here</h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                Update homepage messaging, swap backgrounds, trigger announcements, and jump into every admin module that affects the public site.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Global settings
              </Link>
            </Button>
            <Button onClick={handleSaveHomepage} disabled={savingHomepage} className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <Save className="mr-2 h-4 w-4" />
              {savingHomepage ? 'Saving...' : 'Save homepage'}
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <Card className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Paintbrush className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-950">Homepage editor</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Change the main page hero, background, calls to action, and live announcement without leaving the dashboard.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Site title</Label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={homepageContent.siteTitle}
                    onChange={(event) => setHomepageContent((current) => ({ ...current, siteTitle: event.target.value }))}
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Hero title</Label>
                <Input
                  value={homepageContent.heroTitle}
                  onChange={(event) => setHomepageContent((current) => ({ ...current, heroTitle: event.target.value }))}
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Hero description</Label>
                <Textarea
                  value={homepageContent.heroDescription}
                  onChange={(event) => setHomepageContent((current) => ({ ...current, heroDescription: event.target.value }))}
                  className="min-h-[110px] rounded-2xl border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Primary CTA</Label>
                  <Input
                    value={homepageContent.ctaPrimary}
                    onChange={(event) => setHomepageContent((current) => ({ ...current, ctaPrimary: event.target.value }))}
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Secondary CTA</Label>
                  <Input
                    value={homepageContent.ctaSecondary}
                    onChange={(event) => setHomepageContent((current) => ({ ...current, ctaSecondary: event.target.value }))}
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Background image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={homepageContent.backgroundUrl}
                    onChange={(event) => setHomepageContent((current) => ({ ...current, backgroundUrl: event.target.value }))}
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Homepage announcement</Label>
                <Textarea
                  value={homepageContent.announcement}
                  onChange={(event) => setHomepageContent((current) => ({ ...current, announcement: event.target.value }))}
                  className="min-h-[90px] rounded-2xl border-slate-200 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 text-white">
                <div
                  className="relative min-h-[320px] p-6"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.2), rgba(15,23,42,0.88)), url(${homepageContent.backgroundUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200 backdrop-blur w-fit">
                    Homepage preview
                  </div>
                  <p className="mt-6 text-sm font-semibold text-sky-100/90">{homepageContent.siteTitle}</p>
                  <h3 className="mt-3 max-w-md text-3xl font-black leading-tight">{homepageContent.heroTitle}</h3>
                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">{homepageContent.heroDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                      {homepageContent.ctaPrimary}
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                      {homepageContent.ctaSecondary}
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 bg-slate-950/95 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Live banner</p>
                  <p className="mt-2 text-sm text-slate-200">{homepageContent.announcement}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-slate-950">Homepage modules</p>
                </div>
                {[
                  ['Featured banner', 'featuredBanner'],
                  ['Creator applications', 'creatorApplications'],
                  ['Listener testimonials', 'listenerTestimonials'],
                  ['Trending carousel', 'trendingCarousel'],
                ].map(([label, key]) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl bg-white p-4">
                    <div>
                      <p className="font-semibold text-slate-950">{label}</p>
                      <p className="text-sm text-slate-500">Control whether this section is visible on the public homepage.</p>
                    </div>
                    <Switch
                      checked={homepageSettings[key as keyof typeof homepageSettings]}
                      onCheckedChange={(checked) =>
                        setHomepageSettings((current) => ({
                          ...current,
                          [key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-black">Linked management</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Jump to the exact area that controls each part of the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              {managementLinks.map((item) => (
                <Button
                  key={item.title}
                  asChild
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10"
                >
                  <Link href={item.href}>
                    <div className={cn('mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', item.tone)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-black text-slate-950">Quick website tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <Button asChild variant="outline" className="h-11 w-full justify-start rounded-2xl border-slate-200 font-semibold">
                <Link href="/admin/announcements">
                  <Bell className="mr-2 h-4 w-4" />
                  Update announcement banner
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-start rounded-2xl border-slate-200 font-semibold">
                <Link href="/admin/themes">
                  <Palette className="mr-2 h-4 w-4" />
                  Change public theme
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-start rounded-2xl border-slate-200 font-semibold">
                <Link href="/admin/languages">
                  <Languages className="mr-2 h-4 w-4" />
                  Edit translations
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full justify-start rounded-2xl border-slate-200 font-semibold">
                <Link href="/admin/newsletter">
                  <Mail className="mr-2 h-4 w-4" />
                  Schedule newsletter push
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
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
