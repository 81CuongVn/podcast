'use client'

import { useEffect, useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Upload, Trash2, Play, Youtube, Link as LinkIcon } from 'lucide-react'

type MediaType = 'audio' | 'video' | 'document' | 'transcript'

interface EpisodesPageProps {
  params: Promise<{ id: string }>
}

export default function EpisodesPage({ params }: EpisodesPageProps) {
  const [podcastId, setPodcastId] = useState<string>('')
  const [podcast, setPodcast] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [mediaType, setMediaType] = useState<MediaType>('audio')
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [videoUrl, setVideoUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      setPodcastId(id)

      // Fetch podcast
      const { data: podcastData } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single()

      if (podcastData) {
        setPodcast(podcastData)
      }

      // Fetch episodes
      const { data: episodesData } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast_id', id)
        .order('created_at', { ascending: false })

      if (episodesData) {
        setEpisodes(episodesData)
      }

      setLoading(false)
    }

    loadData()
  }, [params, supabase])

  const getAcceptedFormats = (type: MediaType) => {
    switch (type) {
      case 'video':
        return 'video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.mov,.avi,.mkv'
      case 'document':
        return 'application/pdf,.pdf,.epub,.mobi'
      case 'transcript':
        return 'text/plain,text/markdown,.txt,.md'
      default:
        return 'audio/mpeg,audio/wav,audio/ogg,audio/aac,.mp3,.wav,.ogg,.aac,.m4a'
    }
  }

  const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks
  const MAX_FILE_SIZE_MB = 1000 // Keep in sync with API limit (1GB)

  async function uploadInChunks(file: File): Promise<{ pathname: string; url: string }> {
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const encodedFileName = encodeURIComponent(file.name)

    console.log(
      `Uploading ${file.name} in ${totalChunks} chunks (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    )

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)

      console.log(`Uploading chunk ${i + 1}/${totalChunks}...`)

      // Send chunk as raw binary data with metadata in headers
      const buffer = await chunk.arrayBuffer()
      const chunkRes = await fetch('/api/upload-chunk', {
        method: 'POST',
        headers: {
          'X-Chunk-Index': String(i),
          'X-Total-Chunks': String(totalChunks),
          'X-File-Name': encodedFileName,
          'X-Upload-Id': uploadId,
        },
        body: buffer,
      })

      if (!chunkRes.ok) {
        const errorData = await chunkRes.json().catch(() => ({}))
        throw new Error(
          errorData.error || `Chunk ${i + 1} upload failed`
        )
      }

      const chunkData = await chunkRes.json()
      if (chunkData.complete) {
        console.log('All chunks uploaded successfully')
        return {
          pathname: chunkData.pathname,
          url: chunkData.url,
        }
      }
    }

    throw new Error('Chunk upload did not complete')
  }

  async function uploadFile(file: File): Promise<{ pathname: string; url: string }> {
    // Always use chunked upload to avoid Next.js body size limits
    return uploadInChunks(file)
  }

  async function handleAddEpisode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const mediaFile = formData.get('media') as File | null

      if (uploadMethod === 'file' && !mediaFile) {
        alert('Please select a media file')
        setUploading(false)
        return
      }

      let pathname = ''
      let url = ''
      let duration = undefined
      let fileSize = 0

      if (uploadMethod === 'file' && mediaFile) {
        const fileSizeMB = mediaFile.size / (1024 * 1024)
        console.log(`Starting upload: ${mediaFile.name} (${fileSizeMB.toFixed(2)}MB)`)

        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          alert(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`)
          setUploading(false)
          return
        }

        // Upload media file
        const uploadResult = await uploadFile(mediaFile)
        pathname = uploadResult.pathname
        url = uploadResult.url
        fileSize = mediaFile.size

        // Get duration
        if (['audio', 'video'].includes(mediaType)) {
          const element = mediaType === 'video'
            ? document.createElement('video')
            : document.createElement('audio')
          element.src = URL.createObjectURL(mediaFile)
          duration = await new Promise<number>((resolve) => {
            element.onloadedmetadata = () => {
              resolve(Math.round(element.duration))
            }
          })
        }
      } else if (uploadMethod === 'url') {
        if (!videoUrl) {
          alert('Please enter a valid video URL')
          setUploading(false)
          return
        }
        // For URLs, we use the URL as the media_url and pathname
        url = videoUrl
        pathname = videoUrl
        // We can't easily get duration or size for external URLs without extra backend processing
      }

      // Create episode via API
      const episodeRes = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podcast_id: podcastId,
          title,
          description,
          audio_pathname: pathname,
          media_url: url,
          duration,
          media_type: mediaType,
          media_size: fileSize,
        }),
      })

      if (!episodeRes.ok) {
        const errorData = await episodeRes.json()
        throw new Error(errorData.error || 'Failed to create episode')
      }

      const newEpisode = await episodeRes.json()
      console.log('Episode created successfully:', newEpisode)
      setEpisodes([newEpisode, ...episodes])
      setSelectedEpisode(newEpisode)
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Error adding episode:', error)
      alert(`Failed to add episode: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  async function deleteEpisode(episodeId: string) {
    if (!confirm('Are you sure you want to delete this episode?')) return

    try {
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', episodeId)

      if (error) throw error

      setEpisodes(episodes.filter((ep) => ep.id !== episodeId))
    } catch (error) {
      console.error('Error deleting episode:', error)
      alert('Failed to delete episode')
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

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{podcast?.title}</h1>
          <p className="mt-2 text-muted-foreground">Manage your episodes</p>
        </div>

        {/* Add Episode Form */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Upload New Episode</h2>
          <form onSubmit={handleAddEpisode} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Episode Title</label>
              <Input
                name="title"
                placeholder="Episode title"
                required
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                placeholder="Episode description..."
                rows={3}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="audio">🎙 Audio</option>
                <option value="video">📹 Video</option>
                <option value="document">📄 Document (PDF, EPUB)</option>
                <option value="transcript">📝 Transcript (Text)</option>
              </select>
            </div>

            <div className="flex gap-4 p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  uploadMethod === 'file' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <Upload className="h-4 w-4" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('url');
                  setMediaType('video'); // Default to video when using URL
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  uploadMethod === 'url' ? 'bg-background shadow-sm' : 'text-muted-foreground'
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                Video URL
              </button>
            </div>

            {uploadMethod === 'file' ? (
              <div>
                <label className="text-sm font-medium">
                  {mediaType === 'video' ? 'Video File' : mediaType === 'document' ? 'Document File' : mediaType === 'transcript' ? 'Transcript File' : 'Audio File'}
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    name="media"
                    type="file"
                    accept={getAcceptedFormats(mediaType)}
                    required
                    className="flex-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium">Video URL (YouTube, Vimeo, etc.)</label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" disabled={uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Episode'}
            </Button>
          </form>
        </Card>

        {/* Episodes List */}
        <div>
          
          {episodes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Preview Player</h3>
              <Card className="p-4 mb-4">
                {selectedEpisode ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{selectedEpisode.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{selectedEpisode.description}</p>
                    </div>
                    <audio
                      src={selectedEpisode.audio_url || selectedEpisode.media_url}
                      controls
                      className="w-full"
                    />
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm">Select an episode to preview</p>
                )}
              </Card>
            </div>
          )}

          <div className="space-y-3">
            {episodes.length > 0 ? (
              episodes.map((episode) => (
                <Card 
                  key={episode.id} 
                  className={`p-4 cursor-pointer transition-all ${
                    selectedEpisode?.id === episode.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedEpisode(episode)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{episode.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground truncate">
                        {episode.description || 'No description'}
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(episode.created_at).toLocaleDateString()}</span>
                        {episode.duration && (
                          <>
                            <span>•</span>
                            <span>{Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}</span>
                          </>
                        )}
                        {episode.media_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">
                              {episode.media_type === 'audio' && '🎙 Audio'}
                              {episode.media_type === 'video' && '📹 Video'}
                              {episode.media_type === 'document' && '📄 Document'}
                              {episode.media_type === 'transcript' && '📝 Transcript'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEpisode(episode.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No episodes yet. Upload your first episode above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
