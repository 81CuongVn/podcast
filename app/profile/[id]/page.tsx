'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FollowButton } from '@/components/follow-button'
import Link from 'next/link'
import Image from 'next/image'
import { Music } from 'lucide-react'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [stats, setStats] = useState({ followers: 0, following: 0 })
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { id } = await params

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      setIsOwnProfile(currentUser?.id === id)

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch follow stats
      try {
        const response = await fetch(`/api/follow-stats/${id}`)
        if (response.ok) {
          const followStats = await response.json()
          setStats(followStats)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }

      // Fetch user's podcasts
      const { data: podcastsData } = await supabase
        .from('podcasts')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

      if (podcastsData) {
        setPodcasts(podcastsData)
      }

      setLoading(false)
    }

    loadProfile()
  }, [params, supabase])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Profile not found</p>
          <Button asChild>
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href="/">← Back</Link>
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex flex-col items-center text-center">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              width={128}
              height={128}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Music className="h-16 w-16 text-white opacity-30" />
            </div>
          )}

          <h1 className="mt-6 text-4xl font-bold">{profile.display_name}</h1>
          <p className="mt-2 text-muted-foreground">@{profile.username}</p>
          {profile.bio && <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{profile.bio}</p>}

          {profile.website_url && (
            <a href={profile.website_url} className="mt-2 text-primary hover:underline">
              {profile.website_url}
            </a>
          )}

          <div className="mt-6 flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">{podcasts.length}</div>
              <div className="text-sm text-muted-foreground">Podcasts</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="mt-6">
              <FollowButton userId={profile.id} isFollowing={false} />
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-6 flex gap-2">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Podcasts */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Podcasts</h2>
          {podcasts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {podcasts.map((podcast) => (
                <Link key={podcast.id} href={`/podcast/${podcast.id}`} className="group">
                  <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card h-full flex flex-col">
                    <div className="relative w-full aspect-square bg-gradient-to-br from-blue-400 to-purple-500">
                      {podcast.cover_image_url ? (
                        <Image
                          src={podcast.cover_image_url}
                          alt={podcast.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-8 h-8 text-white opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold line-clamp-2 mb-2">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {podcast.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 10000) + 100} subscribers
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">No podcasts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
