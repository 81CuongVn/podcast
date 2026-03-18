import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Sparkles, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Discover Podcasts - PodStream',
  description: 'Explore trending and featured podcasts',
}

const CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'news', label: 'News' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
]

export default async function DiscoverPage() {
  const supabase = await createClient()

  // Fetch featured podcasts (recent published)
  const { data: featuredPodcasts } = await supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch trending podcasts (random for now as a placeholder)
  const { data: trendingPodcasts } = await supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('is_published', true)
    .limit(4)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero / Search */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-12 text-center md:py-20">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Discover Your Next Favorite Podcast
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Explore thousands of podcasts across all categories from creators worldwide
            </p>
            
            <form action="/browse" className="mx-auto flex max-w-2xl gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search podcasts, creators, or topics..."
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">Search</Button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Categories Quick Links */}
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Browse by Category</h2>
              <Button variant="ghost" asChild>
                <Link href="/categories">View all categories</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <Link key={cat.value} href={`/browse?category=${cat.value}`}>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary/10 hover:border-primary/50"
                  >
                    {cat.label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Podcasts */}
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">Featured Podcasts</h2>
            </div>
            {featuredPodcasts && featuredPodcasts.length > 0 ? (
              <PodcastGrid podcasts={featuredPodcasts} />
            ) : (
              <div className="rounded-xl border border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground">No featured podcasts found yet.</p>
              </div>
            )}
          </div>

          {/* Trending Now */}
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingPodcasts?.map((podcast) => (
                <Link key={podcast.id} href={`/podcast/${podcast.id}`}>
                  <div className="group flex items-center gap-4 rounded-lg border border-transparent p-2 transition-colors hover:bg-muted/50 hover:border-border">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {podcast.cover_image_url && (
                        <img 
                          src={podcast.cover_image_url} 
                          alt={podcast.title} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium group-hover:text-primary">{podcast.title}</h3>
                      <p className="truncate text-xs text-muted-foreground">{podcast.profiles?.display_name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
