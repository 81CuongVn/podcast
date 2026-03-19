'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Edit2, Trash2, Music, Pause } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePlayer } from '@/lib/player-context'

export default function PodcastPage() {
  const params = useParams()
  const router = useRouter()
  const podcastId = params.id as string
  const [podcast, setPodcast] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const { setCurrentEpisode, isPlaying, setIsPlaying, currentEpisode, setIsPlayerVisible } = usePlayer()

  const handlePlayEpisode = (episode: any) => {
    if (currentEpisode?.id === episode.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentEpisode({
        ...episode,
        podcast: podcast
      })
      setIsPlayerVisible(true)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!podcastId) return

      // Fetch podcast
      const { data: podcastData } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', podcastId)
        .single()

      if (podcastData) {
        setPodcast(podcastData)
      }

      // Fetch episodes
      const { data: episodesData } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast_id', podcastId)
        .order('created_at', { ascending: false })

      if (episodesData && episodesData.length > 0) {
        setEpisodes(episodesData)
        setSelectedEpisode(episodesData[0])
      }

      setLoading(false)
    }

    loadData()
  }, [podcastId, supabase])

  const handleDeletePodcast = async () => {
    if (deleting) return

    const confirmed = window.confirm(
      'Delete this podcast and all of its episodes? This action cannot be undone.'
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/podcasts/${podcastId}`, {
        method: 'DELETE',
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete podcast')
      }

      router.push('/dashboard/podcasts')
      router.refresh()
    } catch (error) {
      console.error('Error deleting podcast:', error)
      window.alert(
        error instanceof Error ? error.message : 'Failed to delete podcast'
      )
      setDeleting(false)
    }
  }

  if (loading || !podcast) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Podcast Header */}
      <div className="space-y-4">
        <Link href="/dashboard/podcasts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Podcasts
        </Link>
        
        <div className="flex items-start gap-6">
          {podcast.cover_image_url ? (
            <img
              src={podcast.cover_image_url}
              alt={podcast.title}
              className="h-40 w-40 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl shadow-lg">
              🎙
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{podcast.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{podcast.description}</p>
            <div className="flex gap-2 mt-4">
              {podcast.category && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  {podcast.category}
                </span>
              )}
              {podcast.language && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary-foreground rounded-full">
                  {podcast.language.toUpperCase()}
                </span>
              )}
              <span className="inline-block px-3 py-1 text-sm font-medium bg-accent/10 text-accent-foreground rounded-full">
                {episodes.length} Episode{episodes.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2 mt-6">
              <Button asChild>
                <Link href={`/dashboard/podcast/${podcastId}/episodes`}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Manage Episodes
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/podcast/${podcastId}/edit`}>
                  Edit Podcast
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePodcast}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Podcast'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Player */}
      {selectedEpisode ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
          <Card className="p-6 bg-card/40 backdrop-blur-md border-none shadow-xl flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                {podcast.cover_image_url ? (
                  <Image src={podcast.cover_image_url} alt={selectedEpisode.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                    <Music className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-black truncate">{selectedEpisode.title}</h3>
                <p className="text-muted-foreground line-clamp-1">{selectedEpisode.description || 'No description'}</p>
              </div>
            </div>
            <Button 
              size="icon" 
              onClick={() => handlePlayEpisode(selectedEpisode)}
              className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying && currentEpisode?.id === selectedEpisode.id ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No episodes uploaded yet</p>
          <Button asChild>
            <Link href={`/dashboard/podcast/${podcastId}/episodes`}>
              Upload Your First Episode
            </Link>
          </Button>
        </Card>
      )}

      {/* Episodes List */}
      {episodes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">All Episodes</h2>
          <div className="space-y-3">
            {episodes.map((episode) => (
              <Card
                key={episode.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedEpisode?.id === episode.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedEpisode(episode)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{episode.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {episode.description || 'No description'}
                    </p>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                      {episode.duration && (
                        <span>{Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}</span>
                      )}
                      {episode.media_type && (
                        <span>•</span>
                      )}
                      {episode.media_type && (
                        <span className="capitalize">
                          {episode.media_type === 'audio' && '🎙 Audio'}
                          {episode.media_type === 'video' && '📹 Video'}
                          {episode.media_type === 'document' && '📄 Document'}
                          {episode.media_type === 'transcript' && '📝 Transcript'}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEpisode(episode)
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
