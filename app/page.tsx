import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Users, BarChart3, Headphones, Play, TrendingUp, Flame } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Headphones className="h-4 w-4" />
                Over 10,000 podcasts available
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl">
                Discover Your Next Favorite Podcast
              </h1>
              <p className="mb-8 text-lg text-muted-foreground text-balance md:text-xl">
                Explore thousands of podcasts from creators worldwide. Find new voices, stories, and ideas that inspire you.
              </p>

              {!profile && (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/auth/sign-up">
                      Get Started Free
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/browse">
                      <Play className="mr-2 h-4 w-4" />
                      Browse Podcasts
                    </Link>
                  </Button>
                </div>
              )}
              {profile && (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/dashboard/create">
                      Start Creating
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/browse">
                      Explore Podcasts
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="flex gap-4 p-0">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Fresh Episodes Daily</h3>
                    <p className="text-sm text-muted-foreground">
                      New content from creators you follow, updated every day
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="flex gap-4 p-0">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Connect & Follow</h3>
                    <p className="text-sm text-muted-foreground">
                      Build your community and follow your favorite creators
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="flex gap-4 p-0">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Detailed Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your podcast performance and audience growth
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Podcasts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Featured Podcasts</h2>
                <p className="mt-1 text-muted-foreground">Latest shows from our community</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/browse">View All</Link>
              </Button>
            </div>

            {podcasts.length > 0 ? (
              <PodcastGrid podcasts={podcasts} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Headphones className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="mb-4 text-muted-foreground">No podcasts yet. Be the first creator!</p>
                  {profile && (
                    <Button asChild>
                      <Link href="/dashboard/create">Create Podcast</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Recent Episodes */}
        {recentEpisodes.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold md:text-3xl">Recent Episodes</h2>
                  <p className="mt-1 text-muted-foreground">Fresh content just published</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentEpisodes.map((episode: any) => (
                  <Card key={episode.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <CardContent className="flex gap-4 p-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {episode.podcasts?.cover_image_url ? (
                          <Image
                            src={episode.podcasts.cover_image_url}
                            alt={episode.podcasts.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <Play className="h-8 w-8 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <Link href={`/podcast/${episode.podcast_id}`}>
                          <h3 className="line-clamp-1 font-semibold hover:text-primary">
                            {episode.title}
                          </h3>
                        </Link>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {episode.podcasts?.title}
                        </p>
                        {episode.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {episode.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Podcasts */}
        {trendingPodcasts.length > 0 && (
          <section className="border-t border-border py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">Trending Now</h2>
                    <p className="mt-1 text-muted-foreground">Most popular podcasts this week</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/browse?sort=popular">View All</Link>
                </Button>
              </div>

              <PodcastGrid podcasts={trendingPodcasts} />
            </div>
          </section>
        )}

        {/* CTA Section */}
        {!profile && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <Card className="overflow-hidden bg-gradient-to-r from-primary to-accent">
                <CardContent className="flex flex-col items-center py-16 text-center text-primary-foreground">
                  <TrendingUp className="mb-4 h-12 w-12" />
                  <h2 className="mb-4 text-3xl font-bold">Ready to Start Creating?</h2>
                  <p className="mb-8 max-w-md text-lg opacity-90">
                    Launch your podcast and reach listeners worldwide. It&apos;s free to get started.
                  </p>
                  <Button asChild size="lg" variant="secondary" className="font-semibold">
                    <Link href="/auth/sign-up">Start Your Podcast</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
