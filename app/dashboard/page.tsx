import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeletePodcastButton } from '@/components/delete-podcast-button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Music, Play, Settings, Users, BarChart3, Radio } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Creator Studio
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Your <span className="text-primary italic font-serif">Podcasts</span></h1>
            <p className="text-muted-foreground font-medium text-lg opacity-70">Manage your shows and track performance.</p>
          </div>
          <Button asChild size="lg" className="rounded-full h-14 px-10 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
            <Link href="/dashboard/podcast/new">
              <Plus className="h-5 w-5 mr-2" />
              New Podcast
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Shows', value: podcasts.length, icon: Radio, color: 'text-blue-500' },
            { label: 'Listeners', value: '12.4K', icon: Users, color: 'text-emerald-500' },
            { label: 'Total Time', value: '142h', icon: Play, color: 'text-amber-500' },
            { label: 'Growth', value: '+12%', icon: BarChart3, color: 'text-purple-500' },
          ].map((stat) => (
            <Card key={stat.label} className="p-6 rounded-[2rem] border-none shadow-xl shadow-muted/20 bg-card/40 backdrop-blur-md flex items-center gap-4 group hover:bg-card/60 transition-colors">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {podcasts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {podcasts.map((podcast: any) => (
              <Card
                key={podcast.id}
                className="group rounded-[3rem] border-none bg-card/40 backdrop-blur-md shadow-2xl shadow-muted/20 overflow-hidden transition-all duration-500 hover:shadow-primary/10 hover:-translate-y-2"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  {podcast.cover_image_url && !podcast.cover_image_url.includes('undefined') ? (
                    <Image
                      src={podcast.cover_image_url}
                      alt={podcast.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Music className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-6 right-6">
                    <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      {podcast.episodes?.[0]?.count || 0} Episodes
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-black text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{podcast.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium opacity-70 line-clamp-2 mb-8 leading-relaxed">
                    {podcast.description || 'No description provided for this show.'}
                  </p>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                      <Link href={`/dashboard/podcast/${podcast.id}`}>
                        <Play className="h-4 w-4 mr-2 fill-current" />
                        Listen
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-2">
                      <Link href={`/dashboard/podcast/${podcast.id}/episodes`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
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
          <Card className="rounded-[4rem] border-none p-24 text-center bg-card/40 backdrop-blur-md shadow-2xl shadow-muted/20">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Radio className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">Launch your creative journey</h3>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto font-medium text-lg">You haven't created any podcasts yet. Start broadcasting your voice to the world today.</p>
            <Button asChild size="lg" className="rounded-full h-16 px-12 font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30">
              <Link href="/dashboard/podcast/new">
                <Plus className="h-6 w-6 mr-2" />
                Create Your First Podcast
              </Link>
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
