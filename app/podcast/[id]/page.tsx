'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { SubscribeButton } from '@/components/subscribe-button'
import { FollowButton } from '@/components/follow-button'
import Image from 'next/image'
import { Music, Users, Share2, Play, Heart, MessageSquare, Repeat, ListMusic, Pause, Link as LinkMusic } from 'lucide-react'
import { WaveformPlayer } from '@/components/podcast/waveform-player'
import { LikeButton } from '@/components/podcast/like-button'
import { usePlayer } from '@/lib/player-context'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PodcastDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PodcastDetailPage({ params }: PodcastDetailPageProps) {
  const [podcast, setPodcast] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { setCurrentEpisode, isPlaying, setIsPlaying, currentEpisode } = usePlayer()
  const supabase = createClient()

  // Stats state to prevent numbers changing on re-render
  const [stats, setStats] = useState({
    plays: 0,
    likes: 0,
    followers: '0',
    trackPlays: {} as Record<string, number>,
    trackComments: {} as Record<string, number>
  })

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
        // Initialize stable stats
        setStats({
          plays: Math.floor(Math.random() * 10000) + 1000,
          likes: Math.floor(Math.random() * 500) + 50,
          followers: (Math.random() * 5 + 1).toFixed(1) + 'K',
          trackPlays: {},
          trackComments: {}
        })
      }

      // Fetch episodes
      const { data: episodesData } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast_id', id)
        .order('published_at', { ascending: false })

      if (episodesData) {
        setEpisodes(episodesData)
        
        // Initialize stable stats for each episode
        const trackPlays: Record<string, number> = {}
        const trackComments: Record<string, number> = {}
        episodesData.forEach(ep => {
          trackPlays[ep.id] = Math.floor(Math.random() * 1000) + 100
          trackComments[ep.id] = Math.floor(Math.random() * 50) + 5
        })
        setStats(prev => ({ ...prev, trackPlays, trackComments }))
      }

      // Check if subscribed
      if (currentUser) {
        const { data: subscription } = await supabase
          .from('podcast_subscriptions')
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

  const handlePlayEpisode = (episode: any) => {
    if (currentEpisode?.id === episode.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentEpisode({
        ...episode,
        podcast: podcast
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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

  const latestEpisode = episodes[0]
  // Deduplicate episodes based on ID to prevent duplicate broadcasts
  const uniqueEpisodes = episodes.filter((episode, index, self) =>
    index === self.findIndex((e) => e.id === episode.id)
  )

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* SoundCloud Style Hero Banner */}
      <div className="relative w-full bg-[#333] overflow-hidden group">
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
          {podcast.cover_image_url && (
            <Image 
              src={podcast.cover_image_url} 
              alt="blur" 
              fill 
              className="object-cover blur-3xl opacity-30 scale-110" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            {/* Play Button & Info */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <Button 
                  onClick={() => latestEpisode && handlePlayEpisode(latestEpisode)}
                  size="icon" 
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[#f50] hover:bg-[#ff4500] shadow-2xl transition-all hover:scale-110 shrink-0"
                >
                  {isPlaying && currentEpisode?.id === latestEpisode?.id ? (
                    <div className="flex gap-1 items-end h-8">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, 24, 12, 28, 8] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 bg-white rounded-full"
                        />
                      ))}
                    </div>
                  ) : (
                    <Play className="h-8 w-8 md:h-10 md:w-10 fill-current ml-1" />
                  )}
                </Button>
                <div>
                  <div className="inline-block bg-black/80 text-white px-3 py-1 text-sm font-bold mb-2">
                    {podcast.title}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                    {latestEpisode?.title || podcast.title}
                  </h1>
                  <Link 
                    href={`/profile/${podcast.user_id}`}
                    className="text-lg md:text-xl font-bold text-white/70 hover:text-[#f50] transition-colors mt-2 block"
                  >
                    {podcast.profiles?.display_name || 'Unknown Creator'}
                  </Link>
                </div>
              </div>

              {/* Waveform Area */}
              {latestEpisode && (
                <div className="mt-8">
                  <WaveformPlayer 
                    audioUrl={latestEpisode.audio_url} 
                    height={120}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              )}
            </div>

            {/* Large Cover Art */}
            <div className="w-full md:w-80 aspect-square relative shadow-2xl rounded-sm overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              {podcast.cover_image_url ? (
                <Image
                  src={podcast.cover_image_url}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#444] to-[#222]">
                  <Music className="w-20 h-20 text-white/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LikeButton podcastId={podcast.id} initialCount={stats.likes} />
            <Button variant="outline" size="sm" className="font-bold border-border/50">
              <Repeat className="h-4 w-4 mr-2" /> Repost
            </Button>
            <Button variant="outline" size="sm" className="font-bold border-border/50">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="font-bold border-border/50">
              <LinkMusic className="h-4 w-4 mr-2" /> Copy Link
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4" /> {stats.plays}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content (Episodes List) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <ListMusic className="h-6 w-6 text-[#f50]" />
                Episodes
              </h2>
            </div>

            {uniqueEpisodes.length > 0 ? (
              <div className="space-y-4">
                {uniqueEpisodes.map((episode, idx) => (
                  <div 
                    key={episode.id} 
                    className={cn(
                      "group flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50",
                      currentEpisode?.id === episode.id && "bg-muted border-border"
                    )}
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0 shadow-sm">
                      {podcast.cover_image_url ? (
                        <Image src={podcast.cover_image_url} alt={episode.title} fill className="object-cover" />
                      ) : (
                        <Music className="h-6 w-6 text-muted-foreground absolute center" />
                      )}
                      <button 
                        onClick={() => handlePlayEpisode(episode)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        {isPlaying && currentEpisode?.id === episode.id ? (
                          <Pause className="h-6 w-6 text-white fill-current" />
                        ) : (
                          <Play className="h-6 w-6 text-white fill-current ml-1" />
                        )}
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">
                        <span>{podcast.profiles?.display_name}</span>
                        <span>•</span>
                        <span>{new Date(episode.published_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-lg truncate group-hover:text-[#f50] transition-colors">
                        {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {episode.description || 'No description provided'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60">
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3" /> {stats.trackPlays[episode.id] || 0}
                      </div>
                      <LikeButton 
                        episodeId={episode.id} 
                        showCount={true} 
                        size="sm" 
                        className="h-6 px-2 text-[10px] bg-transparent border-none hover:bg-muted"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center text-muted-foreground border-dashed">
                No episodes available yet
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Creator Info Card */}
            <Card className="p-6 rounded-2xl border-none shadow-xl bg-card/50 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-background shadow-2xl">
                  {podcast.profiles?.avatar_url ? (
                    <Image
                      src={podcast.profiles.avatar_url}
                      alt={podcast.profiles.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-black text-xl mb-1">{podcast.profiles?.display_name}</h3>
                <p className="text-sm font-bold text-muted-foreground mb-6">@{podcast.profiles?.username}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Followers</p>
                    <p className="text-xl font-black">{stats.followers}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tracks</p>
                    <p className="text-xl font-black">{episodes.length}</p>
                  </div>
                </div>

                {user && user.id !== podcast.user_id ? (
                  <FollowButton userId={podcast.user_id} isFollowing={false} />
                ) : (
                  <Button variant="secondary" className="w-full rounded-full font-black">
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card>

            {/* Description Card */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">About this podcast</h3>
              <p className="text-sm leading-relaxed font-medium text-muted-foreground/80 px-1">
                {podcast.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

