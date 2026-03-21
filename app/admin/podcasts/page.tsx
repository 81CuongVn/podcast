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
import { 
  Search, 
  Podcast, 
  Play, 
  Globe, 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Mic
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from '@/components/ui/card'

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast? All episodes will also be deleted.')) return

    const { error } = await supabase.from('podcasts').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete podcast')
    } else {
      toast.success('Podcast deleted successfully')
      fetchPodcasts()
    }
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('podcasts')
      .update({ is_published: !currentStatus })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Podcast ${!currentStatus ? 'published' : 'unpublished'} successfully`)
      fetchPodcasts()
    }
  }

  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    podcast.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { label: 'Active Podcasts', value: podcasts.filter(p => p.is_published).length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Draft Podcasts', value: podcasts.filter(p => !p.is_published).length, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'New This Week', value: podcasts.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Mic className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Content Engine
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Podcast Directory</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Manage, moderate and monitor all podcast content on the PodHub platform.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Download className="mr-2 h-5 w-5" /> Export Data
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> Add Podcast
          </Button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-8 rounded-[2.5rem] border-none shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
            <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110", s.bg, s.color)}>
              <s.icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-border/40">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search by title, creator, or category..." 
            className="pl-14 h-14 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 flex-1 md:flex-none">
            <Filter className="mr-2 h-5 w-5" /> Filters
          </Button>
          <Button onClick={fetchPodcasts} variant="ghost" className="rounded-2xl h-14 w-14 p-0 text-slate-400 hover:text-primary transition-colors">
            <Activity className={cn("h-6 w-6", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-border/40">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-border/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px]">Podcast Details</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Creator</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Status</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Created</TableHead>
              <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-slate-300 uppercase tracking-widest text-sm">Synchronizing Data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPodcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                      <Search className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No Podcasts Found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPodcasts.map((podcast) => (
                <TableRow key={podcast.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative h-16 w-16 rounded-[1.25rem] overflow-hidden bg-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {podcast.cover_url ? (
                          <Image 
                            src={podcast.cover_url} 
                            alt={podcast.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-slate-300">
                            <Podcast className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors truncate">{podcast.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[10px] px-2 py-0">
                            {podcast.category || 'Podcast'}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            {podcast.language || 'English'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-[10px] font-black">
                        {podcast.profiles?.display_name?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-700 truncate">{podcast.profiles?.display_name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">@{podcast.profiles?.username || 'user'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {podcast.is_published ? (
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300 font-black text-xs uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                        Draft
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      {new Date(podcast.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                        <Link href={`/podcast/${podcast.id}`} target="_blank">
                          <Eye className="h-5 w-5" />
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-none">
                          <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400 p-3">Management</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => togglePublish(podcast.id, podcast.is_published)}
                            className="rounded-xl p-3 font-bold flex items-center gap-3 cursor-pointer"
                          >
                            {podcast.is_published ? (
                              <><XCircle className="h-4 w-4 text-amber-500" /> Unpublish Podcast</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 text-emerald-500" /> Publish Podcast</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl p-3 font-bold flex items-center gap-3 cursor-pointer">
                            <TrendingUp className="h-4 w-4 text-blue-500" /> View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 bg-slate-50" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(podcast.id)}
                            className="rounded-xl p-3 font-bold flex items-center gap-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
