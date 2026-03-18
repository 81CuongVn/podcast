'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FollowButtonProps {
  userId: string
  isFollowing?: boolean
  onFollowChange?: (following: boolean) => void
}

export function FollowButton({ userId, isFollowing: initialFollowing = false, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        const newFollowing = data.action === 'followed'
        setIsFollowing(newFollowing)
        onFollowChange?.(newFollowing)
      }
    } catch (error) {
      console.error('Follow error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition-colors disabled:opacity-50',
        isFollowing
          ? 'border border-border bg-background hover:bg-muted'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
      )}
    >
      <Heart className={cn('h-4 w-4', isFollowing && 'fill-current')} />
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
