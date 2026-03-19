'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Pause, Download, Share2, Music, Heart, Clock, Calendar } from 'lucide-react'
import type { Episode } from '@/lib/types'
import { usePlayer } from '@/lib/player-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EpisodeCardProps {
  episode: Episode & { podcasts?: { title: string; id: string; cover_image_url?: string | null; profiles?: { display_name?: string; avatar_url?: string | null } } }
  showPodcast?: boolean
  className?: string
}

export function EpisodeCard({ episode, showPodcast = true, className }: EpisodeCardProps) {
  const { currentEpisode, setCurrentEpisode, isPlaying, setIsPlaying, setIsPlayerVisible } = usePlayer()
  
  const isCurrent = currentEpisode?.id === episode.id
  const active = isCurrent && isPlaying

  const formatDuration = (seconds: number | null) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
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
    
    if (isCurrent) {
      setIsPlaying(!isPlaying)
    } else {
      const playableEpisode = {
        ...episode,
        podcast: episode.podcasts // Ensure podcast context is passed
      }
      setCurrentEpisode(playableEpisode as any)
      setIsPlayerVisible(true)
      setIsPlaying(true)
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = episode.audio_url
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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("group relative", className)}
    >
      <Card className="overflow-hidden border-none shadow-xl shadow-muted/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:bg-card/60">
        {/* Cover Image Area */}
        <div className="relative aspect-square overflow-hidden">
          {episode.podcasts?.cover_image_url ? (
            <Image
              src={episode.podcasts.cover_image_url}
              alt={episode.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <Music className="h-12 w-12 text-primary/40" />
            </div>
          )}
          
          {/* Overlay & Play Button */}
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <Button
              size="icon"
              onClick={handlePlay}
              className={cn(
                "h-16 w-16 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border-none",
                active ? "bg-[#f50] text-white" : "bg-white/20 backdrop-blur-md text-white hover:bg-[#f50]"
              )}
            >
              {active ? (
                <div className="flex gap-1 items-end h-6">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 20, 10, 24, 8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-white rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <Play className="h-8 w-8 fill-current ml-1" />
              )}
            </Button>
          </div>

          {/* Podcast Title Badge */}
          {showPodcast && episode.podcasts && (
            <div className="absolute top-4 left-4 right-4">
              <Link 
                href={`/podcast/${episode.podcast_id}`}
                className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest hover:bg-[#f50] transition-colors max-w-full truncate"
              >
                {episode.podcasts.title}
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border/50 bg-muted shrink-0">
              {episode.podcasts?.profiles?.avatar_url ? (
                <Image src={episode.podcasts.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-primary/10 text-[10px] font-black text-primary">
                  {episode.podcasts?.profiles?.display_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">
              {episode.podcasts?.profiles?.display_name || 'Creator'}
            </span>
          </div>

          <h3 className="text-lg font-black leading-tight mb-2 group-hover:text-[#f50] transition-colors line-clamp-2">
            {episode.title}
          </h3>
          
          {episode.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 font-medium opacity-80 leading-relaxed">
              {episode.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatDate(episode.published_at || episode.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDuration(episode.duration_seconds || (episode as any).duration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="hover:text-[#f50] transition-colors"><Share2 className="h-3.5 w-3.5" /></button>
              <button onClick={handleDownload} className="hover:text-[#f50] transition-colors"><Download className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}


