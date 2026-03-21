import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeletePodcastButton } from '@/components/delete-podcast-button'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Music,
  Play,
  Settings,
  Users,
  BarChart3,
  Radio,
  Mic,
  User,
  CreditCard,
  ArrowRight,
  Clock,
  TrendingUp,
  Headphones,
  Podcast,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

async function getUserPodcasts(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('podcasts')
    .select('*, episodes(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const [profile, podcasts] = await Promise.all([
    getUserProfile(),
    getUserPodcasts(user.id),
  ])

  const totalEpisodes = podcasts.reduce(
    (sum: number, p: any) => sum + (p.episodes?.[0]?.count || 0),
    0
  )

  const quickActions = [
    {
      title: 'New Podcast',
      description: 'Launch a new show',
      href: '/dashboard/podcast/new',
      icon: Plus,
      color: 'bg-primary/10 text-primary',
      accent: 'shadow-primary/10',
    },
    {
      title: 'Analytics',
      description: 'Track your performance',
      href: '/dashboard/analytics',
      icon: BarChart3,
      color: 'bg-emerald-50 text-emerald-600',
      accent: 'shadow-emerald-500/10',
    },
    {
      title: 'Profile',
      description: 'Edit your public profile',
      href: '/dashboard/profile',
      icon: User,
      color: 'bg-violet-50 text-violet-600',
      accent: 'shadow-violet-500/10',
    },
    {
      title: 'Subscriptions',
      description: 'Manage your subs',
      href: '/dashboard/subscriptions',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600',
      accent: 'shadow-amber-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
              <Headphones className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Creator Studio
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Welcome back
                {profile?.display_name ? `, ${profile.display_name}` : ''}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your shows, track performance, and grow your audience.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="h-12 rounded-2xl px-6 font-bold shadow-lg shadow-primary/20"
          >
            <Link href="/dashboard/podcast/new">
              <Plus className="mr-2 h-5 w-5" />
              New Podcast
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Total Shows',
            value: podcasts.length,
            icon: Radio,
            color: 'from-blue-600 to-blue-500',
          },
          {
            label: 'Total Episodes',
            value: totalEpisodes,
            icon: Podcast,
            color: 'from-violet-600 to-fuchsia-500',
          },
          {
            label: 'Newest Show',
            value: podcasts.length > 0
              ? new Date(podcasts[0].created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
              : '—',
            icon: Clock,
            color: 'from-amber-500 to-orange-500',
          },
          {
            label: 'Growth',
            value: podcasts.length > 0 ? 'Active' : 'Get started',
            icon: TrendingUp,
            color: 'from-emerald-600 to-teal-500',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`group overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-5 text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${stat.color}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/80">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-black text-slate-950">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${action.accent}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.color}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-bold text-slate-950 group-hover:text-primary transition-colors">
                {action.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Podcast List */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-950">Your Podcasts</h2>
          {podcasts.length > 0 && (
            <Button
              asChild
              variant="ghost"
              className="rounded-xl px-3 text-primary font-semibold"
            >
              <Link href="/dashboard/podcasts">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {podcasts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {podcasts.map((podcast: any) => (
              <Card
                key={podcast.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  {podcast.cover_image_url &&
                    !podcast.cover_image_url.includes('undefined') ? (
                    <Image
                      src={podcast.cover_image_url}
                      alt={podcast.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-violet-500/10">
                      <Music className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {podcast.episodes?.[0]?.count || 0} episodes
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-950 group-hover:text-primary transition-colors line-clamp-1">
                    {podcast.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {podcast.description ||
                      'No description provided for this show.'}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      asChild
                      className="flex-1 rounded-xl h-10 font-semibold text-xs"
                    >
                      <Link href={`/dashboard/podcast/${podcast.id}`}>
                        <Settings className="h-4 w-4 mr-1.5" />
                        Manage
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 rounded-xl h-10 font-semibold text-xs border-slate-200"
                    >
                      <Link
                        href={`/dashboard/podcast/${podcast.id}/episodes`}
                      >
                        <Play className="h-4 w-4 mr-1.5 fill-current" />
                        Episodes
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      Created{' '}
                      {new Date(podcast.created_at).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </span>
                    <DeletePodcastButton
                      podcastId={podcast.id}
                      title={podcast.title}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-[2.5rem] border border-slate-200 p-12 text-center bg-white shadow-sm sm:p-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Radio className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
              Launch your first podcast
            </h3>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              You haven't created any podcasts yet. Start broadcasting your
              voice to the world today.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-14 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20"
            >
              <Link href="/dashboard/podcast/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Podcast
              </Link>
            </Button>
          </Card>
        )}
      </section>
    </div>
  )
}
