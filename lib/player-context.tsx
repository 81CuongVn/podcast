'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Episode } from '@/lib/types/database'

interface PlayerContextType {
  currentEpisode: Episode | null
  setCurrentEpisode: (episode: Episode | null) => void
  isPlayerVisible: boolean
  setIsPlayerVisible: (visible: boolean) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  isLoop: boolean
  setIsLoop: (loop: boolean) => void
  isShuffle: boolean
  setIsShuffle: (shuffle: boolean) => void
  currentTime: number
  setCurrentTime: (time: number) => void
  duration: number
  setDuration: (duration: number) => void
  seekTo: (time: number) => void
  setSeekTo: (time: number | null) => void
  seekToValue: number | null
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seekToValue, setSeekToValue] = useState<number | null>(null)

  const handleSetCurrentEpisode = (episode: Episode | null) => {
    setCurrentEpisode(episode)
    setIsPlayerVisible(episode !== null)
    if (episode) {
      setIsPlaying(true)
      setCurrentTime(0)
    }
  }

  const seekTo = (time: number) => {
    setSeekToValue(time)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        setCurrentEpisode: handleSetCurrentEpisode,
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
        seekTo,
        setSeekTo: setSeekToValue,
        seekToValue
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
