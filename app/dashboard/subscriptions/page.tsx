'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Heart } from 'lucide-react'

interface SubscribedPodcast {
  id: string
  title: string
  description: string
  creator: {
    display_name: string
  }
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscribedPodcast[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from('podcast_subscriptions')
          .select(
            `
            podcasts (
              id,
              title,
              description,
              profiles (
                display_name
              )
            )
          `
          )
          .eq('user_id', user.id)

        if (error) throw error

        if (data) {
          const formatted = data
            .map((sub: any) => ({
              id: sub.podcasts.id,
              title: sub.podcasts.title,
              description: sub.podcasts.description,
              creator: {
                display_name: sub.podcasts.profiles?.display_name || 'Unknown',
              },
            }))
          setSubscriptions(formatted)
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading subscriptions...</p>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">You haven't subscribed to any podcasts yet</p>
        <Link href="/browse">
          <Button>Explore Podcasts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Subscriptions ({subscriptions.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((podcast) => (
          <Link key={podcast.id} href={`/podcast/${podcast.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer p-4 h-full">
              <h3 className="font-semibold line-clamp-2">{podcast.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                by {podcast.creator.display_name}
              </p>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {podcast.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
