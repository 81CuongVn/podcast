'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, Maximize2, SkipBack, SkipForward } from 'lucide-react'
import Image from 'next/image'

interface AdvancedMediaPlayerProps {
  episode: {
    id: string
    title: string
    description?: string
    audio_url?: string
    media_url?: string
    media_type?: 'audio' | 'video' | 'document' | 'transcript'
    duration?: number
    podcast?: {
      cover_image_url?: string
      title?: string
    }
  }
}

export function AdvancedMediaPlayer({ episode }: AdvancedMediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(episode.duration || 0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mediaUrl = episode.media_url || episode.audio_url
  const mediaType = episode.media_type || 'audio'
  const isVideo = mediaType === 'video'

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const updateTime = () => setCurrentTime(media.currentTime)
    const updateDuration = () => setDuration(media.duration || 0)
    const handleEnded = () => setIsPlaying(false)

    media.addEventListener('timeupdate', updateTime)
    media.addEventListener('loadedmetadata', updateDuration)
    media.addEventListener('ended', handleEnded)

    return () => {
      media.removeEventListener('timeupdate', updateTime)
      media.removeEventListener('loadedmetadata', updateDuration)
      media.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    if (isPlaying) {
      media.play().catch((err) => console.error('Playback error:', err))
    } else {
      media.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = volume
      mediaRef.current.playbackRate = playbackRate
    }
  }, [volume, playbackRate])

  const togglePlayPause = () => setIsPlaying(!isPlaying)

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    setCurrentTime(newTime)
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (mediaRef.current) {
      mediaRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skip = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(0, Math.min(duration, mediaRef.current.currentTime + seconds))
    }
  }

  const toggleFullscreen = async () => {
    if (!isVideo || !containerRef.current) return
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <div className="w-full">
      {/* Video/Audio Display */}
      <div
        ref={containerRef}
        className={`w-full mb-6 rounded-lg overflow-hidden bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      >
        {isVideo ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={mediaUrl}
            className="w-full h-auto"
            poster={episode.podcast?.cover_image_url}
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent to-white"></div>
            </div>
            
            {/* Album art / Cover */}
            <div className="z-10 flex flex-col items-center gap-4">
              {episode.podcast?.cover_image_url ? (
                <div className="relative w-48 h-48 rounded-lg shadow-2xl overflow-hidden">
                  <Image
                    src={episode.podcast.cover_image_url}
                    alt={episode.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white text-6xl shadow-2xl">
                  🎙
                </div>
              )}
              <div className="text-center text-white z-10">
                <h3 className="text-xl font-bold">{episode.title}</h3>
                <p className="text-sm text-white/80 mt-1">{episode.podcast?.title}</p>
              </div>
            </div>

            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={mediaUrl}
            />
          </div>
        )}
      </div>

      {/* Controls Card */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <div className="space-y-6">
          {/* Episode Info */}
          <div>
            <h2 className="text-2xl font-bold text-white">{episode.title}</h2>
            {episode.description && (
              <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                {episode.description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            {/* Waveform-like progress bar */}
            <div
              onClick={handleSeek}
              className="group relative h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg overflow-hidden cursor-pointer hover:from-slate-600 hover:to-slate-500 transition-all"
            >
              {/* Filled progress */}
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover:to-pink-500"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Waveform visualization */}
              <div className="absolute inset-0 flex items-center justify-around opacity-30 group-hover:opacity-50 transition-opacity">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full flex items-center justify-center"
                  >
                    <div
                      className="w-0.5 bg-white transition-all"
                      style={{
                        height: `${30 + Math.random() * 50}%`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Scrubber circle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                style={{ left: `calc(${(currentTime / duration) * 100}% - 10px)` }}
              />
            </div>

            {/* Time display */}
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Skip Back */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => skip(-15)}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
              title="Skip back 15 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            {/* Play/Pause */}
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-16 h-16"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            {/* Skip Forward */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => skip(15)}
              className="text-slate-300 hover:text-white hover:bg-slate-700"
              title="Skip forward 15 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Volume Control */}
              <Volume2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
              />
              <span className="text-xs text-slate-400 w-8 text-right">{Math.round(volume * 100)}%</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600 transition-colors"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Fullscreen (for video) */}
              {isVideo && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
