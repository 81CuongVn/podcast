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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Header />

      <main className="flex-1 pb-20">
        {/* Page Header */}
        <section className="relative py-20 overflow-hidden bg-muted/30 border-b border-border/50">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">Discovery Hub</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Browse <span className="text-primary underline underline-offset-8 decoration-primary/20">Podcasts</span></h1>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Explore thousands of stories from independent creators and global networks.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 space-y-10">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Search</h3>
                <form className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    name="q"
                    placeholder="Find a show..."
                    defaultValue={query}
                    className="h-14 pl-12 rounded-2xl bg-card border-none shadow-xl shadow-muted/50 font-bold focus-visible:ring-primary transition-all"
                  />
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/browse?category=${cat.value}${sort ? `&sort=${sort}` : ''}${query ? `&q=${query}` : ''}`}
                    >
                      <Badge
                        variant={category === cat.value ? 'default' : 'outline'}
                        className={`cursor-pointer rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider transition-all hover:scale-105 ${
                          category === cat.value 
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                            : 'bg-card border-none shadow-sm hover:bg-muted'
                        }`}
                      >
                        {cat.label}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Sort By</h3>
                <div className="flex gap-2 p-1 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50">
                  <Link 
                    href={`/browse?category=${category}&sort=recent${query ? `&q=${query}` : ''}`}
                    className="flex-1"
                  >
                    <Button 
                      variant={sort === 'recent' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className={`w-full rounded-xl font-black text-[10px] uppercase tracking-widest h-10 ${sort === 'recent' ? 'bg-card shadow-lg shadow-muted/50' : ''}`}
                    >
                      Recent
                    </Button>
                  </Link>
                  <Link 
                    href={`/browse?category=${category}&sort=popular${query ? `&q=${query}` : ''}`}
                    className="flex-1"
                  >
                    <Button 
                      variant={sort === 'popular' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className={`w-full rounded-xl font-black text-[10px] uppercase tracking-widest h-10 ${sort === 'popular' ? 'bg-card shadow-lg shadow-muted/50' : ''}`}
                    >
                      Popular
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-9 space-y-8">
              {podcasts && podcasts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                      {podcasts.length} Results {category !== 'all' && `in ${CATEGORIES.find(c => c.value === category)?.label}`}
                    </p>
                  </div>
                  <PodcastGrid podcasts={podcasts} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-[3rem] shadow-2xl shadow-muted/50 border-none">
                  <div className="mb-8 rounded-full bg-primary/10 p-10 animate-pulse">
                    <Search className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">No podcasts found</h3>
                  <p className="text-muted-foreground font-medium mb-10 max-w-md">
                    {query
                      ? `We couldn't find anything matching "${query}". Try different keywords.`
                      : 'No podcasts available in this category yet. Be the first to create one!'}
                  </p>
                  <Button variant="outline" asChild className="rounded-full px-10 h-12 font-black border-2">
                    <Link href="/browse">Clear all filters</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
