'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, Calendar } from 'lucide-react'
import type { Episode } from '@/lib/types/database'
import { formatDistanceToNow } from 'date-fns'

interface EpisodeCardProps {
  episode: Episode
  onPlay?: () => void
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

export function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            {episode.podcast?.cover_image_url ? (
              <Image
                src={episode.podcast.cover_image_url}
                alt={episode.podcast.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-xl font-bold text-primary/40">
                  {episode.podcast?.title?.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Link href={`/episode/${episode.id}`}>
                <h3 className="line-clamp-1 font-semibold text-foreground hover:text-primary">
                  {episode.title}
                </h3>
              </Link>
              {episode.podcast && (
                <Link href={`/podcast/${episode.podcast.id}`}>
                  <p className="line-clamp-1 text-sm text-muted-foreground hover:text-foreground">
                    {episode.podcast.title}
                  </p>
                </Link>
              )}
              {episode.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {episode.description}
                </p>
              )}
            </div>
            
            <div className="mt-2 flex items-center gap-4">
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1.5"
                onClick={(e) => {
                  e.preventDefault()
                  onPlay?.()
                }}
              >
                <Play className="h-3.5 w-3.5" />
                Play
              </Button>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(episode.duration_seconds)}
                </span>
                {episode.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(episode.published_at), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
