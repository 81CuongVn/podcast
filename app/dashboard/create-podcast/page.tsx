'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { ImageIcon, Link as LinkIcon } from 'lucide-react'

export default function CreatePodcastPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    cover_image_url: '',
    is_published: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create podcast')
      }

      const data = await response.json()
      toast.success('Podcast created successfully!')
      router.push(`/dashboard/podcast/${data.id}`)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while creating the podcast')
    } finally {
      setIsLoading(false)
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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            PodHub
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Podcast</h1>
          <p className="text-muted-foreground">
            Start your podcast journey by filling out these details
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Podcast Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Podcast"
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
                placeholder="Tell us about your podcast..."
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Podcast'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
