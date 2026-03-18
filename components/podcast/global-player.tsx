'use client'

import { useRef, useState, useEffect } from 'react'
import { usePlayer } from '@/lib/player-context'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  X,
  Music,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function GlobalPlayer() {
  const { currentEpisode, setCurrentEpisode, isPlayerVisible, setIsPlayerVisible } = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const audioUrl = currentEpisode?.audio_url || ''
  const isYouTube = audioUrl?.includes('youtube.com') || audioUrl?.includes('youtu.be')

  useEffect(() => {
    if (currentEpisode && audioRef.current && !isYouTube) {
      audioRef.current.play().catch((e) => console.error('Play error:', e))
      setIsPlaying(true)
    }
  }, [currentEpisode, isYouTube])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.error('Play error:', e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    const time = value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
    }
  }

  if (!currentEpisode || !isPlayerVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
      {!isYouTube && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* Episode Info */}
        <div className="flex items-center gap-4 w-full md:w-1/4">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            {currentEpisode.podcast?.cover_image_url ? (
              <Image
                src={currentEpisode.podcast.cover_image_url}
                alt={currentEpisode.title}
                fill
                className="object-cover"
              />
            ) : (
              <Music className="h-6 w-6 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm truncate">{currentEpisode.title}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {currentEpisode.podcast?.title || 'Playing now'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 w-full">
          {isYouTube ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <p className="text-sm font-bold text-primary animate-pulse">YouTube Video Detected</p>
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                <Link href={`/podcast/${currentEpisode.podcast_id}`}>
                  Watch Video in Full Player
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(-15)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlayPause}
                  className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skip(15)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 w-full text-xs font-mono text-muted-foreground">
                <span className="w-10 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="w-10">{formatTime(duration)}</span>
              </div>
            </>
          )}
        </div>

        {/* Volume & Close */}
        <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
          {!isYouTube && (
            <div className="flex items-center gap-2 w-32">
              <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(val) => {
                  setVolume(val[0])
                  if (audioRef.current) audioRef.current.volume = val[0]
                }}
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlayerVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
