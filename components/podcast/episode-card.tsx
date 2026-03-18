'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Episode } from '@/lib/types'

interface EpisodeCardProps {
  episode: Episode & { podcasts?: { title: string; id: string } }
  showPodcast?: boolean
}

export function EpisodeCard({ episode, showPodcast = true }: EpisodeCardProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Link href={`/episode/${episode.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="line-clamp-2 text-base">
                {episode.title}
              </CardTitle>
              {showPodcast && episode.podcasts && (
                <CardDescription className="mt-1">
                  {episode.podcasts.title}
                </CardDescription>
              )}
            </div>
            <Play className="w-5 h-5 text-primary shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {episode.description && (
            <CardDescription className="line-clamp-2">
              {episode.description}
            </CardDescription>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {new Date(episode.created_at).toLocaleDateString()}
            </span>
            {episode.duration && (
              <span>{formatDuration(episode.duration)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
