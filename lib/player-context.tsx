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
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const handleSetCurrentEpisode = (episode: Episode | null) => {
    setCurrentEpisode(episode)
    setIsPlayerVisible(episode !== null)
    if (episode) setIsPlaying(true)
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
