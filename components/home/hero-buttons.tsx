'use client'

import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Link from 'next/link'
import { usePlayer } from '@/lib/player-context'
import type { Episode } from '@/lib/types/database'

interface HeroButtonsProps {
  profile: any
  latestEpisode: Episode | null
  publicRegistration: boolean
}

export function HeroButtons({ profile, latestEpisode, publicRegistration }: HeroButtonsProps) {
  const { setCurrentEpisode, setIsPlayerVisible } = usePlayer()

  const handlePlayLatest = (e: React.MouseEvent) => {
    if (latestEpisode) {
      e.preventDefault()
      setCurrentEpisode(latestEpisode)
      setIsPlayerVisible(true)
    }
  }

  if (!profile) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6">
        {publicRegistration && (
          <Button asChild size="lg" className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl shadow-primary/30 transition-all hover:scale-105">
            <Link href="/auth/sign-up">
              Start Free Trial
            </Link>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handlePlayLatest}
          className="h-14 px-10 text-lg font-bold rounded-full backdrop-blur-sm transition-all hover:scale-105"
        >
          <Play className="mr-3 h-5 w-5 fill-current" />
          Listen Now
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Button asChild size="lg" className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl shadow-primary/30 transition-all hover:scale-105">
        <Link href="/dashboard/create">
          Create Episode
        </Link>
      </Button>
      <Button 
        variant="outline" 
        size="lg" 
        onClick={handlePlayLatest}
        className="h-14 px-10 text-lg font-bold rounded-full backdrop-blur-sm transition-all hover:scale-105"
      >
        <Play className="mr-3 h-5 w-5 fill-current" />
        Play Latest
      </Button>
    </div>
  )
}
