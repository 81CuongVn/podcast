'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPodcast, updatePodcast } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

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
    categoryId: initialData?.category || 'technology',
    isPublished: initialData?.is_published ?? true,
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
          isPublished: formData.isPublished,
        })
        toast.success('Podcast updated successfully!')
      } else {
        await createPodcast({
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          isPublished: formData.isPublished,
        })
        toast.success('Podcast created successfully!')
      }

      onSuccess?.()
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Error saving podcast:', error)
      toast.error(error.message || 'Failed to save podcast. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'news', label: 'News' },
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'true-crime', label: 'True Crime' },
    { value: 'science', label: 'Science' },
    { value: 'society', label: 'Society & Culture' },
    { value: 'arts', label: 'Arts' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'tv-film', label: 'TV & Film' },
    { value: 'interview', label: 'Interviews' },
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
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublished"
            checked={formData.isPublished}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, isPublished: checked === true })
            }
          />
          <Label htmlFor="isPublished">Publish podcast (visible to everyone)</Label>
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
