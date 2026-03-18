import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DeletePodcastButton } from '@/components/delete-podcast-button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit2, Play } from 'lucide-react'

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
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

export default async function PodcastsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const podcasts = await getUserPodcasts(user.id)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Podcasts</h1>
          <p className="text-muted-foreground mt-2">Manage all your podcasts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create-podcast">
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
                {podcast.cover_image_url ? (
                  <Image
                    src={podcast.cover_image_url}
                    alt={podcast.title}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{podcast.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {podcast.description || 'No description'}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/dashboard/podcast/${podcast.id}`}>
                      <Play className="h-4 w-4 mr-1" />
                      Listen
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="flex-1">
                    <Link href={`/dashboard/podcast/${podcast.id}/episodes`}>
                      <Edit2 className="h-4 w-4 mr-1" />
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
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No podcasts yet</p>
          <Button asChild>
            <Link href="/dashboard/create-podcast">Create your first podcast</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
