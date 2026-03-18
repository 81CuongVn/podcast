'use client'

import { Podcast, Profile } from '@/lib/types'
import { PodcastCard } from './podcast-card'

interface PodcastGridProps {
  podcasts: (Podcast & { profiles: Profile })[]
  title?: string
}

export function PodcastGrid({ podcasts, title }: PodcastGridProps) {
  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No podcasts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {podcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>
    </div>
  )
}
