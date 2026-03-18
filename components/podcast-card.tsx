import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Podcast } from '@/lib/types/database'

interface PodcastCardProps {
  podcast: Podcast
  showAuthor?: boolean
}

export function PodcastCard({ podcast, showAuthor = true }: PodcastCardProps) {
  return (
    <Link href={`/podcast/${podcast.id}`}>
      <Card className="group overflow-hidden border-0 bg-transparent transition-all hover:bg-muted/50">
        <CardContent className="p-3">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {podcast.cover_image_url ? (
              <Image
                src={podcast.cover_image_url}
                alt={podcast.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-4xl font-bold text-primary/40">
                  {podcast.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {podcast.is_explicit && (
              <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                E
              </Badge>
            )}
          </div>
          <div className="mt-3 space-y-1">
            <h3 className="line-clamp-1 font-semibold text-foreground group-hover:text-primary">
              {podcast.title}
            </h3>
            {showAuthor && podcast.profile && (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {podcast.profile.display_name || 'Unknown Creator'}
              </p>
            )}
            {podcast.category && (
              <p className="text-xs capitalize text-muted-foreground">
                {podcast.category.replace('-', ' ')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
