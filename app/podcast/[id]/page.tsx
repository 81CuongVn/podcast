'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { SubscribeButton } from '@/components/subscribe-button'
import { FollowButton } from '@/components/follow-button'
import Image from 'next/image'
import { Music, Users, Share2 } from 'lucide-react'

interface PodcastDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PodcastDetailPage({ params }: PodcastDetailPageProps) {
  const [podcast, setPodcast] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      // Fetch podcast details
      const { data: podcastData } = await supabase
        .from('podcasts')
        .select('*, profiles(username, display_name, avatar_url)')
        .eq('id', id)
        .single()

      if (podcastData) {
        setPodcast(podcastData)
      }

      // Fetch episodes
      const { data: episodesData } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast_id', id)
        .order('published_at', { ascending: false })

      if (episodesData) {
        setEpisodes(episodesData)
      }

      // Check if subscribed
      if (currentUser) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', currentUser.id)
          .eq('podcast_id', id)
          .single()

        setIsSubscribed(!!subscription)
      }

      setLoading(false)
    }

    loadData()
  }, [params, supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!podcast) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Podcast not found</p>
          <Button asChild className="mt-4">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">← Back</Link>
          </Button>
        </div>
      </div>

      {/* Podcast Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Cover and Actions */}
          <div className="flex flex-col">
            <div className="relative w-full aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden">
              {podcast.cover_image_url && !podcast.cover_image_url.includes('undefined') ? (
                <Image
                  src={podcast.cover_image_url}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-16 h-16 text-white opacity-30" />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {user ? (
                <>
                  <SubscribeButton podcastId={podcast.id} isSubscribed={isSubscribed} className="w-full" />
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/auth/sign-up">Subscribe to Podcast</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{podcast.title}</h1>
            
            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-6">
              {podcast.profiles?.avatar_url && (
                <Image
                  src={podcast.profiles.avatar_url}
                  alt={podcast.profiles.display_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <Link
                  href={`/profile/${podcast.user_id}`}
                  className="font-semibold text-lg hover:text-primary transition-colors"
                >
                  {podcast.profiles?.display_name || 'Unknown Creator'}
                </Link>
                <p className="text-sm text-muted-foreground">
                  @{podcast.profiles?.username}
                </p>
              </div>
              {user && user.id !== podcast.user_id && (
                <div className="ml-auto">
                  <FollowButton userId={podcast.user_id} isFollowing={false} />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 5000) + 100}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Episodes</p>
                <p className="text-2xl font-bold">{episodes.length}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              {podcast.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Episodes</h2>
          
          {episodes.length > 0 ? (
            <div className="space-y-4">
              {episodes.map((episode) => (
                <Card key={episode.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{episode.title}</h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {episode.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(episode.published_at).toLocaleDateString()} •{' '}
                        {Math.round(episode.duration_seconds / 60)} min
                      </p>
                    </div>
                    {episode.audio_pathname && user && (
                      <Button asChild variant="outline">
                        <Link href={`/api/download-audio?pathname=${encodeURIComponent(episode.audio_pathname)}`}>
                          Play
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No episodes available yet
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
