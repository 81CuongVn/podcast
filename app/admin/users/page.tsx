'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  UserCog, 
  Mail, 
  Calendar, 
  Shield, 
  MoreVertical, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  UserPlus,
  Filter,
  Download,
  Activity,
  Users as UsersIcon,
  Mic,
  ArrowUpRight
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { cn } from '@/lib/utils'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setUsers(data)
    setLoading(false)
  }

  const toggleAdmin = async (id: string, currentIsAdmin: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentIsAdmin })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update admin status')
    } else {
      toast.success(`User is ${!currentIsAdmin ? 'now an admin' : 'no longer an admin'}`)
      fetchUsers()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete user')
    } else {
      toast.success('User deleted successfully')
      fetchUsers()
    }
  }

  const filteredUsers = users.filter(user => 
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = [
    { label: 'Total Members', value: users.length, icon: UsersIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Administrators', value: users.filter(u => u.is_admin).length, icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'New Creators', value: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <UsersIcon className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            User Engine
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Manage platform access, roles, and community moderation for all members.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Download className="mr-2 h-5 w-5" /> Export List
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <UserPlus className="mr-2 h-5 w-5" /> Add Member
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
            placeholder="Search by name, username, or email..." 
            className="pl-14 h-14 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-primary/20 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 flex-1 md:flex-none">
            <Filter className="mr-2 h-5 w-5" /> Filters
          </Button>
          <Button onClick={fetchUsers} variant="ghost" className="rounded-2xl h-14 w-14 p-0 text-slate-400 hover:text-primary transition-colors">
            <Activity className={cn("h-6 w-6", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-border/40">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-border/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px]">Member Details</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Role</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Joined Date</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Status</TableHead>
              <TableHead className="px-8 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-slate-300 uppercase tracking-widest text-sm">Syncing Community...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                      <Search className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No Members Found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl shadow-inner border-2 border-white">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 font-black text-slate-400">
                          {user.display_name?.[0] || user.username?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors truncate">
                          {user.display_name || user.username}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                        <ShieldCheck className="h-3 w-3" /> ADMIN
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-black text-[10px] px-3 py-1 rounded-full w-fit">
                        MEMBER
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                        <Link href={`/user/${user.username}`}>
                          <ArrowUpRight className="h-5 w-5" />
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-none">
                          <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400 p-3">Member Control</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-xl p-3 font-bold flex items-center gap-3 cursor-pointer">
                            <UserCog className="h-4 w-4 text-blue-500" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleAdmin(user.id, user.is_admin)}
                            className="rounded-xl p-3 font-bold flex items-center gap-3 cursor-pointer"
                          >
                            {user.is_admin ? (
                              <><ShieldAlert className="h-4 w-4 text-amber-500" /> Revoke Admin Access</>
                            ) : (
                              <><ShieldCheck className="h-4 w-4 text-purple-500" /> Grant Admin Access</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl p-3 font-bold flex items-center gap-3 cursor-pointer">
                            <Mail className="h-4 w-4 text-emerald-500" /> Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 bg-slate-50" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user.id)}
                            className="rounded-xl p-3 font-bold flex items-center gap-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" /> Terminate Account
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
