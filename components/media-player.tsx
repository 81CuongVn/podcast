'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, Download, Share2, Settings } from 'lucide-react'

interface MediaPlayerProps {
  episode: {
    id: string
    title: string
    description?: string
    audio_url?: string
    media_url?: string
    media_type?: 'audio' | 'video' | 'document' | 'transcript'
    duration?: number
  }
}

export function MediaPlayer({ episode }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(episode.duration || 0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null)

  const mediaUrl = episode.media_url || episode.audio_url
  const mediaType = episode.media_type || 'audio'

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const updateTime = () => setCurrentTime(media.currentTime)
    const updateDuration = () => setDuration(media.duration)
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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (mediaRef.current) {
      mediaRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'video':
        return '▶ Video'
      case 'document':
        return '📄 Document'
      case 'transcript':
        return '📝 Transcript'
      default:
        return '🎙 Audio'
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-4">
        {/* Media Type Badge */}
        <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
          {getMediaIcon()}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold">{episode.title}</h2>
          {episode.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {episode.description}
            </p>
          )}
        </div>

        {/* Media Element */}
        <div className="bg-black rounded-lg overflow-hidden">
          {mediaType === 'video' ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={mediaUrl}
              className="w-full h-auto max-h-96 bg-black"
              controls={false}
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={mediaUrl}
                className="hidden"
              />
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🎙</div>
                <p className="text-sm">Audio Episode</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <Button
              size="lg"
              className="rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="px-2 py-1 text-sm border border-border rounded-md bg-background"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            {/* Action Buttons */}
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
