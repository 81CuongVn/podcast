import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default async function DiscoverPage() {
  const supabase = await createClient()

  // Fetch featured podcasts
  const { data: podcasts } = await supabase
    .from('podcasts')
    .select(`
      id,
      title,
      description,
      cover_image_url,
      user_id,
      profiles!user_id (
        display_name,
        avatar_url
      )
    `)
    .order('subscriber_count', { ascending: false })
    .limit(12)

  const categories = [
    'Technology',
    'Business',
    'Comedy',
    'Education',
    'Sports',
    'Music',
    'True Crime',
    'News',
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Discover Podcasts</h1>
          <p className="mt-2 text-muted-foreground">
            Explore thousands of podcasts across all categories
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Input
            type="search"
            placeholder="Search podcasts..."
            className="max-w-md"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto overflow-x-auto px-4 py-4">
          <div className="flex gap-2">
            <Button variant="outline" className="shrink-0">
              All
            </Button>
            {categories.map((category) => (
              <Button key={category} variant="outline" className="shrink-0">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {podcasts && podcasts.length > 0 ? (
            podcasts.map((podcast: any) => (
              <Link
                key={podcast.id}
                href={`/podcast/${podcast.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  {podcast.cover_image_url && (
                    <img
                      src={podcast.cover_image_url}
                      alt={podcast.title}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">
                      {podcast.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {podcast.profiles?.display_name}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {podcast.description}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {podcast.subscriber_count || 0} subscribers
                    </p>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No podcasts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
