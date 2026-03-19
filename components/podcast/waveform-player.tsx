'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { usePlayer } from '@/lib/player-context'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface WaveformPlayerProps {
  audioUrl: string
  height?: number
  waveColor?: string
  progressColor?: string
  barWidth?: number
  barGap?: number
  className?: string
  onReady?: () => void
}

export function WaveformPlayer({
  audioUrl,
  height = 80,
  waveColor = '#D1D5DB',
  progressColor = '#f50', // SoundCloud Orange
  barWidth = 2,
  barGap = 2,
  className,
  onReady
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const { isPlaying, setIsPlaying, currentEpisode, currentTime, duration, seekTo } = usePlayer()
  const [isReady, setIsReady] = useState(false)

  const isYouTube = audioUrl?.includes('youtube.com') || audioUrl?.includes('youtu.be')

  const initWaveSurfer = useCallback(() => {
    if (!containerRef.current || isYouTube) return

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor: 'transparent',
      barWidth,
      barGap,
      height,
      normalize: true,
      interact: true, // Allow seeking
    })

    // Mute the wavesurfer instance manually after creation if needed
    // wavesurfer.current.setMuted(true) 

    wavesurfer.current.load(audioUrl)

    wavesurfer.current.on('ready', () => {
      setIsReady(true)
      onReady?.()
    })

    // Sync WaveSurfer click/seek to global player
    wavesurfer.current.on('interaction', (newProgress) => {
      if (wavesurfer.current) {
        const time = newProgress * wavesurfer.current.getDuration()
        seekTo(time)
      }
    })

    return () => {
      wavesurfer.current?.destroy()
    }
  }, [audioUrl, waveColor, progressColor, barWidth, barGap, height, onReady, seekTo, isYouTube])

  useEffect(() => {
    initWaveSurfer()
  }, [initWaveSurfer])

  // Sync WaveSurfer position with global player's currentTime
  useEffect(() => {
    if (wavesurfer.current && isReady && !wavesurfer.current.isPlaying()) {
      const progress = currentTime / (duration || 1)
      wavesurfer.current.seekTo(progress)
    }
  }, [currentTime, duration, isReady])

  if (isYouTube) {
    return (
      <div className={cn("relative w-full h-[80px] bg-muted/20 rounded-xl flex items-center justify-center border border-border/50 overflow-hidden", className)}>
        <div className="flex gap-1.5 items-end h-10 opacity-30">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              animate={{ height: isPlaying ? [10, 40, 15, 35, 10] : 10 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="w-2 bg-primary rounded-full"
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
            YouTube Visualizer Active
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full group", className)}>
      <div ref={containerRef} className="w-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm rounded-lg">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-4 bg-primary animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
