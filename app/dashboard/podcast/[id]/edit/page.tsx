'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Image from 'next/image'
import { ImageIcon, Link as LinkIcon } from 'lucide-react'

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
    category: 'technology',
    cover_image_url: '',
    is_published: true,
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
          category: data.category || 'technology',
          cover_image_url: data.cover_image_url || '',
          is_published: data.is_published ?? true,
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
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          cover_image_url: formData.cover_image_url,
          is_published: formData.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', podcastId)

      if (error) throw error

      toast.success('Podcast updated successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating podcast:', error)
      toast.error(error.message || 'Failed to update podcast')
    } finally {
      setIsSaving(false)
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
            <div className="grid gap-2">
              <Label htmlFor="title">Podcast Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="cover_image_url">Thumbnail Image URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cover_image_url"
                    placeholder="https://example.com/image.jpg"
                    className="pl-10"
                    value={formData.cover_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_image_url: e.target.value })
                    }
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Paste a direct link to an image (JPG, PNG, or WebP).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Preview</Label>
                <div className="relative aspect-square w-32 overflow-hidden rounded-xl border bg-muted group">
                  {formData.cover_image_url ? (
                    <Image
                      src={formData.cover_image_url}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                      onError={() => {
                        toast.error('Invalid image URL');
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
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
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_published: checked === true })
                }
              />
              <Label htmlFor="is_published">Publish podcast (visible to everyone)</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? 'Saving...' : 'Save Changes'}
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
      </div>
    </div>
  )
}
