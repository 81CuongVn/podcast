'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Pause, Download, Share2 } from 'lucide-react'
import type { Episode } from '@/lib/types'
import { usePlayer } from '@/lib/player-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface EpisodeCardProps {
  episode: Episode & { podcasts?: { title: string; id: string } }
  showPodcast?: boolean
}

export function EpisodeCard({ episode, showPodcast = true }: EpisodeCardProps) {
  const { currentEpisode, setCurrentEpisode, setIsPlayerVisible } = usePlayer()
  
  const isPlaying = currentEpisode?.id === episode.id

  const formatDuration = (seconds: number | null) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Recently'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (e) {
      return 'Recently'
    }
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Ensure media_url points to our local API for consistent streaming/inline display
    const playableEpisode = {
      ...episode,
      media_url: `/api/download-audio?path=${encodeURIComponent(episode.audio_pathname || '')}`
    }
    setCurrentEpisode(playableEpisode as any)
    setIsPlayerVisible(true)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = episode.media_url || episode.audio_url
    if (url) {
      window.open(`/api/download-audio?path=${encodeURIComponent(episode.audio_pathname || '')}`, '_blank')
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/podcast/${episode.podcast_id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <Card className="hover:shadow-2xl transition-all duration-500 group relative overflow-hidden border-none bg-card/50 backdrop-blur-sm hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg">
            {episode.podcasts?.cover_image_url ? (
              <Image 
                src={episode.podcasts.cover_image_url} 
                alt={episode.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <Play className="h-12 w-12 text-primary/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="icon"
                onClick={handlePlay}
                className={`rounded-full h-16 w-16 shadow-2xl transition-all duration-500 hover:scale-110 ${
                  isPlaying ? 'bg-primary text-primary-foreground' : 'bg-white text-black hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
              {formatDate(episode.published_at || episode.created_at)}
            </p>
            <Link href={`/podcast/${episode.podcast_id}`} className="hover:text-primary transition-colors">
              <CardTitle className="line-clamp-1 text-xl font-black leading-tight group-hover:text-primary transition-colors">
                {episode.title}
              </CardTitle>
            </Link>
            {showPodcast && episode.podcasts && (
              <CardDescription className="mt-1 font-bold text-sm text-muted-foreground/80">
                {episode.podcasts.title}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {episode.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed font-medium">
            {episode.description}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className="rounded-full font-black text-xs h-8 px-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {isPlaying ? 'PAUSE' : 'LISTEN'}
            </Button>
            {episode.duration && (
              <span className="text-[10px] font-black text-muted-foreground">
                {formatDuration(episode.duration)} MIN
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

