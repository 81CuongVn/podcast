'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PodcastGrid } from '@/components/podcast/podcast-grid'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, Mic } from 'lucide-react'

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPodcasts = async () => {
      const { data } = await supabase
        .from('podcasts')
        .select('*, profiles(display_name, avatar_url)')
        .ilike('category', `%${category}%`)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (data) setPodcasts(data)
      setLoading(false)
    }

    if (category) fetchPodcasts()
  }, [category, supabase])

  const formatCategory = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 container mx-auto px-6">
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary font-bold">
            <Link href="/categories">
              <ChevronLeft className="h-4 w-4 mr-1" />
              All Categories
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mic className="h-6 w-6" />
            </div>
            <h1 className="text-5xl font-black tracking-tight uppercase">
              {category ? formatCategory(category) : 'Category'}
            </h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl font-medium opacity-70">
            Discover the best podcasts in {category ? formatCategory(category) : 'this category'}.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] rounded-[3rem] bg-muted animate-pulse" />
            ))}
          </div>
        ) : podcasts.length > 0 ? (
          <PodcastGrid podcasts={podcasts} />
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-[3rem] border-2 border-dashed border-border">
            <p className="text-muted-foreground text-lg font-bold">No podcasts found in this category yet.</p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/browse">Browse All Podcasts</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
