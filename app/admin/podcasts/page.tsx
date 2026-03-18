'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Podcast, Play, Globe, MoreVertical, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchPodcasts()
  }, [])

  const fetchPodcasts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('podcasts')
      .select('*, profiles(display_name, username)')
      .order('created_at', { ascending: false })

    if (!error) setPodcasts(data)
    setLoading(false)
  }

  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Podcast Directory</h1>
          <p className="text-muted-foreground mt-2">Monitor and moderate all podcasts on the platform.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or creator..." 
            className="pl-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={fetchPodcasts} variant="outline" className="rounded-xl">
          Refresh
        </Button>
      </div>

      <div className="bg-card rounded-[2rem] overflow-hidden shadow-xl shadow-muted/50 border-none">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Podcast</TableHead>
              <TableHead className="font-bold">Creator</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground animate-pulse">
                  Loading podcasts...
                </TableCell>
              </TableRow>
            ) : filteredPodcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No podcasts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPodcasts.map((podcast) => (
                <TableRow key={podcast.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {podcast.cover_image_url ? (
                          <Image 
                            src={podcast.cover_image_url} 
                            alt={podcast.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <Podcast className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{podcast.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                          {podcast.language || 'EN'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">
                      {podcast.profiles?.display_name || podcast.profiles?.username}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize font-bold">
                      {podcast.category || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {podcast.is_published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground font-bold">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild className="rounded-lg">
                        <Link href={`/podcast/${podcast.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
