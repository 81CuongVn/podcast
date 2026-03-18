'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Podcast, Profile } from '@/lib/types'
import { Play, Heart } from 'lucide-react'

interface PodcastCardProps {
  podcast: Podcast & { profiles: Profile }
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link href={`/podcast/${podcast.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-shadow">
        {podcast.cover_image_url ? (
          <div className="relative w-full aspect-square overflow-hidden bg-muted">
            <Image
              src={podcast.cover_image_url}
              alt={podcast.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Play className="h-12 w-12 text-white fill-white" />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/15 transition-colors">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors">
            {podcast.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            by {podcast.profiles.display_name || podcast.profiles.username}
          </p>
          {podcast.category && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
              {podcast.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
