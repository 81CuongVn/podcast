import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { EpisodeCard } from '@/components/podcast/episode-card'
import { HeroButtons } from '@/components/home/hero-buttons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Users, BarChart3, Headphones, Play, TrendingUp, Flame, Share2, Mail, CheckCircle2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

// Revalidate every 5 minutes to show fresh content
export const revalidate = 300

export const metadata = {
  title: 'PodStream - Discover & Create Podcasts',
  description: 'Discover amazing podcasts and create your own shows. Connect with creators worldwide.',
}

async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return profile
}

async function getFeaturedPodcasts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

async function getRecentEpisodes() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('episodes')
    .select('*, podcasts(*, profiles(*))')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)
  return data || []
}

async function getTrendingPodcasts() {
  const supabase = await createClient()
  // Get podcasts with most listens in the last 30 days
  const { data } = await supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

async function getPopularCreators() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*, podcasts!user_id(count)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function HomePage() {
  const [profile, podcasts, recentEpisodes, trendingPodcasts, popularCreators] = await Promise.all([
    getUserProfile(),
    getFeaturedPodcasts(),
    getRecentEpisodes(),
    getTrendingPodcasts(),
    getPopularCreators(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-2 text-sm font-bold text-primary shadow-sm border border-primary/20 backdrop-blur-sm">
                <Headphones className="h-4 w-4" />
                Trusted by 10,000+ Creators
              </div>
              <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-balance md:text-8xl lg:leading-[1.1]">
                Your Voice, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Amplified</span>
              </h1>
              <p className="mb-12 text-xl text-muted-foreground text-balance md:text-2xl max-w-2xl mx-auto leading-relaxed">
                The all-in-one platform to record, distribute, and monetize your podcast. Professional tools for modern storytellers.
              </p>

              <HeroButtons 
                profile={profile} 
                latestEpisode={recentEpisodes.length > 0 ? recentEpisodes[0] : null} 
              />
            </div>
          </div>
        </section>

        {/* Dynamic Grid Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Sidebar Info - Modern Layout */}
              <div className="lg:col-span-4 space-y-12">
                <div>
                  <h2 className="text-4xl font-bold mb-6">Built for the <span className="text-primary">Creator Economy</span></h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We provide the infrastructure so you can focus on what matters: your content.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="group p-6 rounded-2xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Zap className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Publishing</h3>
                    <p className="text-muted-foreground">Distribute to all major platforms with one click.</p>
                  </div>

                  <div className="group p-6 rounded-2xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Users className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Listener Engagement</h3>
                    <p className="text-muted-foreground">Deep insights into how your audience listens.</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-8">
                <div className="mb-10 flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
                  <Button variant="link" asChild className="text-primary font-bold">
                    <Link href="/browse?sort=popular">View All Podcasts →</Link>
                  </Button>
                </div>

                {podcasts.length > 0 ? (
                  <PodcastGrid podcasts={podcasts.slice(0, 6)} />
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center bg-muted/20">
                    <Headphones className="mb-6 h-16 w-16 text-muted-foreground/30 mx-auto" />
                    <p className="text-xl font-medium text-muted-foreground mb-6">Start your journey today.</p>
                    {profile && (
                      <Button asChild size="lg" className="rounded-full px-10">
                        <Link href="/dashboard/create">Launch Your Podcast</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Episodes Section - Immediate Playback */}
        {recentEpisodes.length > 0 && (
          <section className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                    <Flame className="h-3 w-3" />
                    FRESH CONTENT
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Listen Now</h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Click play to start listening to the latest episodes right here. No redirection needed.
                  </p>
                </div>
                <Button variant="outline" asChild className="rounded-full font-bold border-2">
                  <Link href="/browse">Explore All Episodes</Link>
                </Button>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {recentEpisodes.map((episode: any) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Creators Section */}
        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Top Creators</h2>
              <p className="text-muted-foreground/80 text-lg">The voices shaping the future of audio.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {popularCreators.map((creator: any) => (
                <div key={creator.id} className="flex flex-col items-center text-center space-y-4 group">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-background/10 group-hover:border-primary transition-all duration-500">
                    {creator.avatar_url ? (
                      <Image src={creator.avatar_url} alt={creator.display_name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                        {creator.display_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{creator.display_name}</h3>
                    <p className="text-sm text-muted-foreground/60">@{creator.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Premium Look */}
        {!profile && (
          <section className="py-32 relative">
            <div className="container mx-auto px-4">
              <div className="relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-24 text-center">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/40 to-transparent" />
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to broadcast?</h2>
                  <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of creators who chose PodHub to host their shows. Get all features free for 14 days.
                  </p>
                  <Button asChild size="lg" variant="secondary" className="h-16 px-12 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all">
                    <Link href="/auth/sign-up">Get Started Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content / Features Section */}
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black mb-6">Why Choose PodHub?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to grow your audience and professionalize your audio content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">One-Click Distribution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automatically push your episodes to Apple Podcasts, Spotify, and Google Podcasts with a single click.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Advanced Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Understand your listeners with detailed demographic data, retention rates, and geographic insights.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Professional Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enterprise-grade security for your audio assets and sensitive user data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-[3rem] bg-card border border-border/50 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-black leading-tight">Stay ahead of the curve</h2>
                <p className="text-muted-foreground">
                  Subscribe to our newsletter for the latest podcasting tips, industry news, and platform updates.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Weekly podcasting tips
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Exclusive creator interviews
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Enter your email" className="h-14 pl-12 rounded-2xl bg-background border-border/50" />
                </div>
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">
                  Join Newsletter
                </Button>
                <p className="text-[10px] text-center text-muted-foreground px-4">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
