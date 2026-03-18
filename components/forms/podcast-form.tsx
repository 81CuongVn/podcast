'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPodcast, updatePodcast } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface PodcastFormProps {
  podcastId?: string
  initialData?: any
  onSuccess?: () => void
}

export function PodcastForm({ podcastId, initialData, onSuccess }: PodcastFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    categoryId: initialData?.category_id || '1',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (podcastId) {
        await updatePodcast(podcastId, {
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
        })
      } else {
        await createPodcast({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
        })
      }

      onSuccess?.()
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving podcast:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Business' },
    { id: '3', name: 'Education' },
    { id: '4', name: 'Entertainment' },
    { id: '5', name: 'Health' },
    { id: '6', name: 'News' },
    { id: '7', name: 'Sports' },
    { id: '8', name: 'Other' },
  ]

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Podcast Title</label>
          <Input
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My Awesome Podcast"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell listeners what your podcast is about"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Podcast'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
