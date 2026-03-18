import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Browse Podcasts - PodStream',
  description: 'Discover amazing podcasts from creators around the world',
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'news', label: 'News' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'true-crime', label: 'True Crime' },
  { value: 'science', label: 'Science' },
  { value: 'society', label: 'Society' },
]

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
  const params = await searchParams
  const category = params.category || 'all'
  const sort = params.sort || 'recent'
  const query = params.q || ''

  const supabase = await createClient()

  let podcastQuery = supabase
    .from('podcasts')
    .select('*, profiles(*)')
    .eq('is_published', true)

  if (category !== 'all') {
    podcastQuery = podcastQuery.eq('category', category)
  }

  if (query) {
    podcastQuery = podcastQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (sort === 'recent') {
    podcastQuery = podcastQuery.order('created_at', { ascending: false })
  } else if (sort === 'popular') {
    podcastQuery = podcastQuery.order('created_at', { ascending: false })
  }

  const { data: podcasts } = await podcastQuery.limit(24)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Browse Podcasts</h1>
            <p className="mt-2 text-muted-foreground">
              Discover amazing podcasts from creators around the world
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <form className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search podcasts..."
                  defaultValue={query}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Categories:</span>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/browse?category=${cat.value}${sort ? `&sort=${sort}` : ''}${query ? `&q=${query}` : ''}`}
                >
                  <Badge
                    variant={category === cat.value ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors hover:bg-primary/10"
                  >
                    {cat.label}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-1">
                <Link href={`/browse?category=${category}&sort=recent${query ? `&q=${query}` : ''}`}>
                  <Button variant={sort === 'recent' ? 'secondary' : 'ghost'} size="sm">
                    Recent
                  </Button>
                </Link>
                <Link href={`/browse?category=${category}&sort=popular${query ? `&q=${query}` : ''}`}>
                  <Button variant={sort === 'popular' ? 'secondary' : 'ghost'} size="sm">
                    Popular
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Results */}
          {podcasts && podcasts.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                Showing {podcasts.length} podcasts
                {category !== 'all' && ` in ${CATEGORIES.find(c => c.value === category)?.label}`}
                {query && ` matching "${query}"`}
              </p>
              <PodcastGrid podcasts={podcasts} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No podcasts found</h3>
              <p className="mb-4 text-muted-foreground">
                {query
                  ? `No results for "${query}". Try a different search term.`
                  : 'No podcasts available in this category yet.'}
              </p>
              <Button variant="outline" asChild>
                <Link href="/browse">Clear filters</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
