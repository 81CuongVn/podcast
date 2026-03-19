'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LikeButtonProps {
  podcastId?: string
  episodeId?: string
  initialIsLiked?: boolean
  initialCount?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export function LikeButton({
  podcastId,
  episodeId,
  initialIsLiked = false,
  initialCount = 0,
  className,
  size = 'md',
  showCount = true
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('likes').select('id').eq('user_id', user.id)
      if (episodeId) query = query.eq('episode_id', episodeId)
      else if (podcastId) query = query.eq('podcast_id', podcastId)

      const { data } = await query.single()
      if (data) setIsLiked(true)
    }

    const fetchLikeCount = async () => {
      let query = supabase.from('likes').select('id', { count: 'exact', head: true })
      if (episodeId) query = query.eq('episode_id', episodeId)
      else if (podcastId) query = query.eq('podcast_id', podcastId)

      const { count: exactCount } = await query
      if (exactCount !== null) setCount(exactCount)
    }

    checkLikeStatus()
    fetchLikeCount()
  }, [supabase, podcastId, episodeId])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please sign in to like!')
      return
    }

    setLoading(true)
    try {
      if (isLiked) {
        // Unlike
        let query = supabase.from('likes').delete().eq('user_id', user.id)
        if (episodeId) query = query.eq('episode_id', episodeId)
        else if (podcastId) query = query.eq('podcast_id', podcastId)

        const { error } = await query
        if (error) throw error
        
        setIsLiked(false)
        setCount(prev => Math.max(0, prev - 1))
        toast.success('Unliked!')
      } else {
        // Like
        const { error } = await supabase.from('likes').insert({
          user_id: user.id,
          podcast_id: podcastId || null,
          episode_id: episodeId || null
        })
        if (error) throw error
        
        setIsLiked(true)
        setCount(prev => prev + 1)
        toast.success('Liked!')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5 mr-1.5',
    md: 'h-4 w-4 mr-2',
    lg: 'h-5 w-5 mr-2'
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleLike}
      className={cn(
        "rounded-full font-bold border-border/50 transition-all active:scale-95",
        isLiked && "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100 hover:text-rose-600",
        className
      )}
    >
      <Heart className={cn(iconSizes[size], isLiked && "fill-current")} />
      {isLiked ? 'Liked' : 'Like'}
      {showCount && count > 0 && (
        <span className="ml-1.5 opacity-60">({count})</span>
      )}
    </Button>
  )
}
