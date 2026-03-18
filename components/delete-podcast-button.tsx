'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeletePodcastButtonProps {
  podcastId: string
  title: string
}

export function DeletePodcastButton({
  podcastId,
  title,
}: DeletePodcastButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return

    const confirmed = window.confirm(
      `Delete "${title}" and all of its episodes? This action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/podcasts/${podcastId}`, {
        method: 'DELETE',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete podcast')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting podcast:', error)
      window.alert(
        error instanceof Error ? error.message : 'Failed to delete podcast'
      )
      setIsDeleting(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      className="w-full"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
