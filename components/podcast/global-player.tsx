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
  Repeat,
  Shuffle,
  Heart,
  Maximize2,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Turntable } from './turntable'
import { LikeButton } from './like-button'
import { cn } from '@/lib/utils'

export function GlobalPlayer() {
  const { 
    currentEpisode, 
    setCurrentEpisode, 
    isPlayerVisible, 
    setIsPlayerVisible,
    isPlaying,
    setIsPlaying,
    isLoop,
    setIsLoop,
    isShuffle,
    setIsShuffle,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    seekToValue,
    setSeekTo
  } = usePlayer()
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const audioUrl = currentEpisode?.audio_url || ''
  const isYouTube = audioUrl?.includes('youtube.com') || audioUrl?.includes('youtu.be')

  useEffect(() => {
    if (currentEpisode && audioRef.current && !isYouTube) {
      audioRef.current.play().catch((e) => console.error('Play error:', e))
      setIsPlaying(true)
    }
  }, [currentEpisode, isYouTube, setIsPlaying])

  // Sync seekTo requests from other components
  useEffect(() => {
    if (seekToValue !== null && audioRef.current) {
      audioRef.current.currentTime = seekToValue
      setSeekTo(null) // Reset seek request
    }
  }, [seekToValue, setSeekTo])

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
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out",
          isExpanded ? "h-[80vh] rounded-t-[3rem]" : "h-24"
        )}
      >
        {!isYouTube && (
          <audio
            ref={audioRef}
            src={audioUrl}
            loop={isLoop}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => !isLoop && setIsPlaying(false)}
          />
        )}

        <div className="container mx-auto h-full px-6 flex flex-col">
          {/* Expanded View */}
          {isExpanded && (
            <div className="flex-1 flex flex-col items-center justify-center gap-12 py-12 overflow-hidden">
              <Turntable 
                isPlaying={isPlaying} 
                imageUrl={currentEpisode.podcast?.cover_image_url} 
                size="lg"
              />
              
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight truncate max-w-2xl mx-auto">
                  {currentEpisode.title}
                </h2>
                <p className="text-lg font-bold text-primary">
                  {currentEpisode.podcast?.title || 'Playing now'}
                </p>
              </div>

              <div className="w-full max-w-3xl space-y-4">
                <div className="flex items-center gap-4 text-sm font-black text-muted-foreground/60">
                  <span className="w-12">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={cn("h-12 w-12 rounded-full", isShuffle && "text-primary bg-primary/10")}
                  >
                    <Shuffle className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(-15)}
                    className="h-12 w-12 rounded-full hover:bg-muted"
                  >
                    <SkipBack className="h-7 w-7" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="h-20 w-20 rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-10 w-10" />
                    ) : (
                      <Play className="h-10 w-10 ml-1.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(15)}
                    className="h-12 w-12 rounded-full hover:bg-muted"
                  >
                    <SkipForward className="h-7 w-7" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLoop(!isLoop)}
                    className={cn("h-12 w-12 rounded-full", isLoop && "text-primary bg-primary/10")}
                  >
                    <Repeat className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mini Player / Bottom Bar */}
          <div className={cn(
            "flex items-center gap-6 h-24",
            isExpanded ? "border-t border-border/50" : ""
          )}>
            {/* Info */}
            <div className="flex items-center gap-4 w-1/4 min-w-0">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg border border-border/50">
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
                <h4 className="font-black text-sm truncate leading-tight">{currentEpisode.title}</h4>
                <p className="text-xs font-bold text-muted-foreground truncate uppercase tracking-widest mt-1">
                  {currentEpisode.podcast?.title || 'Playing now'}
                </p>
              </div>
              <LikeButton 
                episodeId={currentEpisode.id} 
                showCount={false} 
                size="sm" 
                className="h-8 w-8 p-0 bg-transparent border-none hover:bg-muted"
              />
            </div>

            {/* Main Controls (Compact) */}
            <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
              {!isYouTube ? (
                <>
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(-15)}
                      className="h-8 w-8 rounded-full hover:bg-muted"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={togglePlayPause}
                      className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => skip(15)}
                      className="h-8 w-8 rounded-full hover:bg-muted"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 w-full text-[10px] font-black text-muted-foreground/50 tracking-widest">
                    <span className="w-8">{formatTime(currentTime)}</span>
                    {!isExpanded && (
                      <Slider
                        value={[currentTime]}
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="flex-1"
                      />
                    )}
                    <span className="w-8 text-right">{formatTime(duration)}</span>
                  </div>
                </>
              ) : (
                <Button asChild size="sm" className="rounded-full px-6 font-black bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  <Link href={`/podcast/${currentEpisode.podcast_id}`}>
                    Open in Full Player
                  </Link>
                </Button>
              )}
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center justify-end gap-3 w-1/4">
              <div className="hidden lg:flex items-center gap-2 w-28 mr-4">
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
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-10 w-10 rounded-full hover:bg-muted"
              >
                {isExpanded ? <ChevronDown className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlayerVisible(false)}
                className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

