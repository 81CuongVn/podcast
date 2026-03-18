'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
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
      return date.toLocaleDateString()
    } catch (e) {
      return 'Recently'
    }
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if the pathname is an external URL (YouTube/Vimeo)
    const isExternal = episode.audio_pathname?.startsWith('http://') || episode.audio_pathname?.startsWith('https://')
    
    // Only proxy via API if it's an internal Supabase Storage path
    const playableEpisode = {
      ...episode,
      media_url: isExternal 
        ? (episode.media_url || episode.audio_url) 
        : `/api/download-audio?path=${encodeURIComponent(episode.audio_pathname || '')}`
    }
    setCurrentEpisode(playableEpisode as any)
    setIsPlayerVisible(true)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = episode.media_url || episode.audio_url
    if (url) {
      window.open(`/api/download-audio?path=${encodeURIComponent(episode.audio_pathname)}`, '_blank')
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
    <Card className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href={`/podcast/${episode.podcast_id}`} className="hover:text-primary transition-colors">
              <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors">
                {episode.title}
              </CardTitle>
            </Link>
            {showPodcast && episode.podcasts && (
              <CardDescription className="mt-1 font-medium flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {episode.podcasts.title}
              </CardDescription>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="rounded-full h-10 w-10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              className="rounded-full h-10 w-10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={handlePlay}
              className={`rounded-full h-12 w-12 shrink-0 shadow-lg transition-all duration-300 hover:scale-110 ${
                isPlaying ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {episode.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {episode.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border/50 pt-4">
          <div className="flex items-center gap-3">
            <span>{formatDate(episode.published_at || episode.created_at)}</span>
            {episode.duration && (
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                {formatDuration(episode.duration)}
              </span>
            )}
          </div>
          
          <Link 
            href={`/podcast/${episode.podcast_id}`} 
            className="text-primary hover:underline font-bold"
          >
            Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

