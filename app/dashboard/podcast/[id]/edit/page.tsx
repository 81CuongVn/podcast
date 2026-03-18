'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default function EditPodcastPage({ params }: EditPageProps) {
  const [podcastId, setPodcastId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cover_image_url: '',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadPodcast = async () => {
      const { id } = await params
      setPodcastId(id)

      const { data } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          cover_image_url: data.cover_image_url || '',
        })
      }

      setLoading(false)
    }

    loadPodcast()
  }, [params, supabase])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('podcasts')
        .update(formData)
        .eq('id', podcastId)

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating podcast:', error)
      alert('Failed to update podcast')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold">Edit Podcast</h1>

        <Card className="mt-8 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Podcast Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Comedy">Comedy</option>
                <option value="Education">Education</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="True Crime">True Crime</option>
                <option value="News">News</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Cover Image URL</label>
              <Input
                type="url"
                value={formData.cover_image_url}
                onChange={(e) =>
                  setFormData({ ...formData, cover_image_url: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
