'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'

interface Subscriber {
  id: string
  user_id: string
  podcast_id: string
  status: 'active' | 'canceled' | 'expired'
  subscribed_at: string
  expires_at: string | null
  profile?: {
    display_name: string
    email: string
    avatar_url: string | null
  }
}

interface PodcastStats {
  id: string
  title: string
  total_subscribers: number
  active_subscribers: number
  monthly_revenue: number
  subscriber_list: Subscriber[]
}

export function SubscriptionManager() {
  const [stats, setStats] = useState<PodcastStats[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's podcasts
      const { data: podcasts } = await supabase
        .from('podcasts')
        .select('*')
        .eq('user_id', user.id)

      if (!podcasts) return

      // Get subscriptions for each podcast
      const podcastStats: PodcastStats[] = []
      for (const podcast of podcasts) {
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*, profiles!user_id(*)')
          .eq('podcast_id', podcast.id)

        const active = subscriptions?.filter(s => s.status === 'active').length || 0
        const monthlyRevenue = active * (podcast.price_usd || 0)

        podcastStats.push({
          id: podcast.id,
          title: podcast.title,
          total_subscribers: subscriptions?.length || 0,
          active_subscribers: active,
          monthly_revenue: monthlyRevenue,
          subscriber_list: subscriptions || [],
        })
      }

      setStats(podcastStats)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalActiveSubscribers = stats.reduce((sum, stat) => sum + stat.active_subscribers, 0)
  const totalMonthlyRevenue = stats.reduce((sum, stat) => sum + stat.monthly_revenue, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading subscription data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalActiveSubscribers}</p>
            <p className="text-sm text-muted-foreground mt-1">Across all podcasts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalMonthlyRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">Estimated revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.reduce((sum, stat) => sum + stat.total_subscribers, 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Including inactive</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Details by Podcast */}
      {stats.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subscription Details</h3>
          {stats.map((podcast) => (
            <Card key={podcast.id}>
              <CardHeader>
                <CardTitle className="text-lg">{podcast.title}</CardTitle>
                <CardDescription>
                  {podcast.active_subscribers} active subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {podcast.subscriber_list.length > 0 ? (
                  <div className="space-y-3">
                    {podcast.subscriber_list.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {subscriber.profile?.display_name || 'Unknown'}
                            </p>
                            {subscriber.status === 'active' && (
                              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                Active
                              </Badge>
                            )}
                            {subscriber.status === 'canceled' && (
                              <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
                                Canceled
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {subscriber.profile?.email}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          {subscriber.status === 'active' && subscriber.expires_at && (
                            <p className="text-muted-foreground">
                              Expires {format(new Date(subscriber.expires_at), 'MMM dd, yyyy')}
                            </p>
                          )}
                          {subscriber.status !== 'active' && (
                            <p className="text-muted-foreground">
                              Subscribed {format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground">No subscriptions yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enable monetization to accept subscriptions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No podcasts with monetization enabled</p>
            <Button asChild className="mt-4">
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
