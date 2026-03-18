'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Episode } from '@/lib/types/database'

interface PlayerContextType {
  currentEpisode: Episode | null
  setCurrentEpisode: (episode: Episode | null) => void
  isPlayerVisible: boolean
  setIsPlayerVisible: (visible: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  const handleSetCurrentEpisode = (episode: Episode | null) => {
    setCurrentEpisode(episode)
    setIsPlayerVisible(episode !== null)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        setCurrentEpisode: handleSetCurrentEpisode,
        isPlayerVisible,
        setIsPlayerVisible,
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
