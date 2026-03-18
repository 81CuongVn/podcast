import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeletePodcastButton } from '@/components/delete-podcast-button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Music, Play } from 'lucide-react'

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}

async function getUserPodcasts(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('podcasts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const [profile, podcasts] = await Promise.all([
    getUserProfile(),
    getUserPodcasts(user.id),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={profile} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Podcasts</h1>
            <p className="text-muted-foreground mt-2">Create and manage your podcasts</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/podcast/new">
              <Plus className="h-5 w-5 mr-2" />
              New Podcast
            </Link>
          </Button>
        </div>

        {podcasts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {podcasts.map((podcast: any) => (
              <div
                key={podcast.id}
                className="rounded-lg border border-border bg-card hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative w-full aspect-square bg-gradient-to-br from-blue-400 to-purple-500">
                  {podcast.cover_image_url && !podcast.cover_image_url.includes('undefined') ? (
                    <Image
                      src={podcast.cover_image_url}
                      alt={podcast.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-white opacity-30" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-1 mb-1">{podcast.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {podcast.description}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/dashboard/podcast/${podcast.id}`}>
                        <Play className="h-4 w-4 mr-1" />
                        Listen
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/dashboard/podcast/${podcast.id}/episodes`}>
                        <Plus className="h-4 w-4 mr-1" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-2">
                    <DeletePodcastButton
                      podcastId={podcast.id}
                      title={podcast.title}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">You haven't created any podcasts yet</p>
            <Button asChild>
              <Link href="/dashboard/podcast/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Podcast
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
