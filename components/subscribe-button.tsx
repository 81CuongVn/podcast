'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubscribeButtonProps {
  podcastId: string
  isSubscribed?: boolean
  onSubscribeChange?: (subscribed: boolean) => void
}

export function SubscribeButton({ podcastId, isSubscribed: initialSubscribed = false, onSubscribeChange }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podcastId }),
      })

      if (response.ok) {
        const data = await response.json()
        const newSubscribed = data.action === 'subscribed'
        setIsSubscribed(newSubscribed)
        onSubscribeChange?.(newSubscribed)
      }
    } catch (error) {
      console.error('Subscribe error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition-colors disabled:opacity-50',
        isSubscribed
          ? 'border border-border bg-background hover:bg-muted'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
      )}
    >
      <Bell className={cn('h-4 w-4', isSubscribed && 'fill-current')} />
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  )
}
