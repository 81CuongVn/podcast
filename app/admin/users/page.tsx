'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Search,
  UserCog,
  Mail,
  Calendar,
  MoreVertical,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Filter,
  Download,
  Activity,
  Users as UsersIcon,
  ArrowUpRight,
  Copy,
  Check,
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
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  // Edit profile dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    website_url: '',
    address: '',
    city: '',
    country: '',
  })
  const [savingEdit, setSavingEdit] = useState(false)

  // Send message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageUser, setMessageUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  // Add member dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    display_name: '',
    username: '',
    email: '',
  })
  const [savingAdd, setSavingAdd] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

    if (!error) setUsers(data || [])
    setLoading(false)
  }

  const toggleAdmin = async (id: string, currentIsAdmin: boolean) => {
    const { error } = await supabase.from('profiles').update({ is_admin: !currentIsAdmin }).eq('id', id)

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

  // ─── Edit Profile ───────────────────────────────────────────────
  const openEditDialog = (user: any) => {
    setEditingUser(user)
    setEditForm({
      display_name: user.display_name || '',
      bio: user.bio || '',
      website_url: user.website_url || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
    })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    setSavingEdit(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: editForm.display_name,
        bio: editForm.bio,
        website_url: editForm.website_url,
        address: editForm.address,
        city: editForm.city,
        country: editForm.country,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingUser.id)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated successfully')
      setEditDialogOpen(false)
      fetchUsers()
    }
    setSavingEdit(false)
  }

  // ─── Send Message ───────────────────────────────────────────────
  const openMessageDialog = (user: any) => {
    setMessageUser(user)
    setCopied(false)
    setMessageDialogOpen(true)
  }

  const handleCopyEmail = async () => {
    if (messageUser?.email) {
      await navigator.clipboard.writeText(messageUser.email)
      setCopied(true)
      toast.success('Email copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ─── Export List ────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error('No users to export')
      return
    }

    const headers = ['Display Name', 'Username', 'Email', 'Role', 'Joined']
    const rows = users.map((user) => [
      user.display_name || '',
      user.username || '',
      user.email || '',
      user.is_admin ? 'Admin' : 'Member',
      new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`Exported ${users.length} users to CSV`)
  }

  // ─── Add Member ─────────────────────────────────────────────────
  const handleAddMember = async () => {
    if (!addForm.display_name.trim() || !addForm.username.trim()) {
      toast.error('Display name and username are required')
      return
    }
    setSavingAdd(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create member')
      }

      toast.success('Member added successfully')
      setAddDialogOpen(false)
      setAddForm({ display_name: '', username: '', email: '' })
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member')
    } finally {
      setSavingAdd(false)
    }
  }

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) =>
      [user.display_name, user.username, user.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [searchQuery, users])

  const stats = [
    { label: 'Total members', value: users.length, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Administrators', value: users.filter((u) => u.is_admin).length, icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'New this week', value: users.filter((u) => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-3 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              User operations
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">User management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Search members, review account roles, and take moderation actions without leaving the table.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleExportCSV} variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Download className="mr-2 h-4 w-4" />
              Export list
            </Button>
            <Button onClick={() => setAddDialogOpen(true)} className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <UserPlus className="mr-2 h-4 w-4" />
              Add member
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-[1.75rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 p-5">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, username, or email..."
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 px-4 font-semibold">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button onClick={fetchUsers} variant="ghost" className="h-11 rounded-2xl px-4 text-slate-500 hover:text-primary">
              <Activity className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Showing {filteredUsers.length} of {users.length} members
        </p>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[840px]">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Member</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Role</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Joined</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Status</TableHead>
                <TableHead className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-56">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-sm font-semibold text-slate-500">Loading members...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-56">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                        <Search className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-slate-700">No matching members</p>
                      <p className="text-sm text-slate-500">Try a different name, username, or email.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/70">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-2xl">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="rounded-2xl bg-slate-100 font-bold text-slate-500">
                            {user.display_name?.[0] || user.username?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">{user.display_name || user.username || 'Unnamed user'}</p>
                          <p className="truncate text-sm text-slate-500">@{user.username || 'no-username'}</p>
                          {user.email && <p className="truncate text-sm text-slate-400">{user.email}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                          Member
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild className="rounded-xl">
                          <Link href={`/user/${user.username}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                              Member actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(user)} className="rounded-xl px-3 py-2.5 font-medium">
                              <UserCog className="mr-2 h-4 w-4 text-blue-500" />
                              Edit profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleAdmin(user.id, user.is_admin)} className="rounded-xl px-3 py-2.5 font-medium">
                              {user.is_admin ? (
                                <>
                                  <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />
                                  Revoke admin access
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4 text-violet-500" />
                                  Grant admin access
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openMessageDialog(user)} className="rounded-xl px-3 py-2.5 font-medium">
                              <Mail className="mr-2 h-4 w-4 text-emerald-500" />
                              Send message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="rounded-xl px-3 py-2.5 font-medium text-rose-600 focus:text-rose-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete account
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
      </section>

      {/* ─── Edit Profile Dialog ──────────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-950">Edit profile</DialogTitle>
            <DialogDescription>
              Update profile information for <span className="font-semibold text-slate-700">{editingUser?.display_name || editingUser?.username}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Display name</Label>
              <Input
                value={editForm.display_name}
                onChange={(e) => setEditForm((f) => ({ ...f, display_name: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 font-medium"
                placeholder="Display name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                className="min-h-[80px] rounded-xl border-slate-200 font-medium"
                placeholder="Short bio..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Website</Label>
              <Input
                value={editForm.website_url}
                onChange={(e) => setEditForm((f) => ({ ...f, website_url: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 font-medium"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Address</Label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  className="h-11 rounded-xl border-slate-200 font-medium"
                  placeholder="Street"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">City</Label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                  className="h-11 rounded-xl border-slate-200 font-medium"
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Country</Label>
                <Input
                  value={editForm.country}
                  onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))}
                  className="h-11 rounded-xl border-slate-200 font-medium"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={savingEdit} className="rounded-xl font-semibold shadow-lg shadow-primary/20">
              {savingEdit ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Send Message Dialog ──────────────────────────────────── */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-950">Send message</DialogTitle>
            <DialogDescription>
              Contact <span className="font-semibold text-slate-700">{messageUser?.display_name || messageUser?.username}</span> via email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {messageUser?.email ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span className="flex-1 font-medium text-slate-700">{messageUser.email}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyEmail} className="rounded-xl">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="rounded-xl">
                    Close
                  </Button>
                  <Button asChild className="rounded-xl font-semibold shadow-lg shadow-primary/20">
                    <a href={`mailto:${messageUser.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Open email client
                    </a>
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-700">No email address</p>
                <p className="text-sm text-slate-500">This user hasn't set an email address on their profile.</p>
                <DialogFooter className="mt-2 w-full">
                  <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="w-full rounded-xl">
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Add Member Dialog ────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-950">Add member</DialogTitle>
            <DialogDescription>Create a new member profile. They can sign up later to claim their account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Display name *</Label>
              <Input
                value={addForm.display_name}
                onChange={(e) => setAddForm((f) => ({ ...f, display_name: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 font-medium"
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Username *</Label>
              <Input
                value={addForm.username}
                onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 font-medium"
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Email (optional)</Label>
              <Input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 font-medium"
                placeholder="user@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={savingAdd} className="rounded-xl font-semibold shadow-lg shadow-primary/20">
              {savingAdd ? 'Adding...' : 'Add member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
