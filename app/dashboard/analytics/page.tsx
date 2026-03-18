import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { getUserProfile, getPodcastStats } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'

async function getUserPodcasts(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('podcasts')
    .select('id, title, description')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

async function getPodcastAnalytics(podcastId: string) {
  const supabase = await createClient()

  // Get episodes with listen counts
  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, title')
    .eq('podcast_id', podcastId)

  const episodeIds = episodes?.map((e) => e.id) || []

  if (episodeIds.length === 0) {
    return { episodes: [], totalListens: 0 }
  }

  const { data: listens } = await supabase
    .from('listens')
    .select('*')
    .in('episode_id', episodeIds)

  const episodeAnalytics = episodes?.map((episode: any) => {
    const episodeListens = listens?.filter((l: any) => l.episode_id === episode.id) || []
    return {
      title: episode.title,
      listens: episodeListens.length,
    }
  })

  return {
    episodes: episodeAnalytics,
    totalListens: listens?.length || 0,
  }
}

export default async function AnalyticsPage() {
  const profile = await getUserProfile()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !profile) redirect('/auth/login')

  const podcasts = await getUserPodcasts(user.id)
  const selectedPodcast = podcasts[0]
  const analytics = selectedPodcast ? await getPodcastAnalytics(selectedPodcast.id) : null
  const podcastStats = selectedPodcast ? await getPodcastStats(selectedPodcast.id) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={profile} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Track your podcast performance and growth</p>
        </div>

        {podcasts.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground mb-4">No podcasts to analyze yet</p>
            <a
              href="/dashboard/podcast/new"
              className="inline-block rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Podcast
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Podcast Selector */}
            {podcasts.length > 1 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <label className="block text-sm font-medium mb-3">Select Podcast</label>
                <select className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2">
                  {podcasts.map((podcast: any) => (
                    <option key={podcast.id} value={podcast.id}>
                      {podcast.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {analytics && podcastStats && (
              <>
                {/* Overview Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-6">
                    <div className="text-sm font-medium text-muted-foreground">Total Listens</div>
                    <div className="mt-2 text-4xl font-bold">{analytics.totalListens}</div>
                    <p className="mt-2 text-xs text-muted-foreground">across all episodes</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6">
                    <div className="text-sm font-medium text-muted-foreground">Subscribers</div>
                    <div className="mt-2 text-4xl font-bold">{podcastStats.subscribers}</div>
                    <p className="mt-2 text-xs text-muted-foreground">active subscriptions</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6">
                    <div className="text-sm font-medium text-muted-foreground">Episodes</div>
                    <div className="mt-2 text-4xl font-bold">{analytics.episodes?.length || 0}</div>
                    <p className="mt-2 text-xs text-muted-foreground">published</p>
                  </div>
                </div>

                {/* Episode Performance */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h2 className="text-2xl font-bold mb-6">Episode Performance</h2>
                  {analytics.episodes && analytics.episodes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">Episode Title</th>
                            <th className="text-left py-3 px-4 font-semibold">Listens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.episodes.map((episode: any, idx: number) => (
                            <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4">{episode.title}</td>
                              <td className="py-3 px-4 font-semibold">{episode.listens}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No episodes published yet</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
