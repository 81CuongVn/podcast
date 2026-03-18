'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Podcast, Profile } from '@/lib/types'
import { Play, Lock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PodcastCardProps {
  podcast: Podcast & { profiles: Profile }
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  const isPremium = podcast.is_monetized && podcast.preview_mode === 'paid-only'
  
  return (
    <Link href={`/podcast/${podcast.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-shadow">
        {podcast.cover_image_url && !podcast.cover_image_url.includes('undefined') ? (
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
            {/* Premium Badge */}
            {isPremium && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
            )}
            {/* Free Preview Badge */}
            {podcast.is_monetized && podcast.preview_mode === 'preview-only' && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Preview
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/15 transition-colors relative">
            <Play className="h-12 w-12 text-muted-foreground" />
            {isPremium && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors flex items-start gap-2">
            {podcast.title}
            {podcast.is_monetized && <Star className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            by {podcast.profiles.display_name || podcast.profiles.username}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {podcast.category && (
              <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                {podcast.category}
              </span>
            )}
            {podcast.is_monetized && !isPremium && (
              <span className="inline-block px-2 py-1 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded">
                Monetized
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
