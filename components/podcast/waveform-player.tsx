'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { usePlayer } from '@/lib/player-context'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const { isPlaying, setIsPlaying, currentEpisode } = usePlayer()
  const [isReady, setIsReady] = useState(false)

  const initWaveSurfer = useCallback(() => {
    if (!containerRef.current) return

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor: 'transparent',
      barWidth,
      barGap,
      height,
      normalize: true,
    })

    wavesurfer.current.load(audioUrl)

    wavesurfer.current.on('ready', () => {
      setIsReady(true)
      onReady?.()
    })

    wavesurfer.current.on('play', () => setIsPlaying(true))
    wavesurfer.current.on('pause', () => setIsPlaying(false))
    wavesurfer.current.on('finish', () => setIsPlaying(false))

    return () => {
      wavesurfer.current?.destroy()
    }
  }, [audioUrl, waveColor, progressColor, barWidth, barGap, height, onReady, setIsPlaying])

  useEffect(() => {
    initWaveSurfer()
  }, [initWaveSurfer])

  useEffect(() => {
    if (wavesurfer.current && isReady) {
      if (isPlaying) {
        wavesurfer.current.play()
      } else {
        wavesurfer.current.pause()
      }
    }
  }, [isPlaying, isReady])

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
