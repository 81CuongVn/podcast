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
      <div className="group cursor-pointer overflow-hidden rounded-[2.5rem] border-none bg-card shadow-xl shadow-muted/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="relative aspect-square overflow-hidden">
          {podcast.cover_image_url && !podcast.cover_image_url.includes('undefined') ? (
            <Image
              src={podcast.cover_image_url}
              alt={podcast.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent opacity-80 flex items-center justify-center">
              <Play className="h-16 w-16 text-white opacity-40" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {isPremium && (
              <Badge className="bg-amber-500/90 backdrop-blur-md border-none text-white font-black text-[10px] px-3 py-1 uppercase tracking-wider">
                <Lock className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
            {podcast.is_monetized && podcast.preview_mode === 'preview-only' && (
              <Badge className="bg-blue-500/90 backdrop-blur-md border-none text-white font-black text-[10px] px-3 py-1 uppercase tracking-wider">
                Preview
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="space-y-1">
            <h3 className="font-black line-clamp-1 text-lg group-hover:text-primary transition-colors flex items-center gap-2">
              {podcast.title}
              {podcast.is_monetized && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              By {podcast.profiles.display_name || podcast.profiles.username}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            {podcast.category && (
              <Badge variant="secondary" className="rounded-full font-bold text-[10px] px-3 py-0.5 bg-muted/50 text-muted-foreground uppercase tracking-wider">
                {podcast.category}
              </Badge>
            )}
            <span className="ml-auto text-[10px] font-black text-primary uppercase tracking-[0.2em]">View Show</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
