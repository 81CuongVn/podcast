'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Shield,
  Mic,
  Megaphone,
  Plus,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'

const groups = [
  {
    id: 'admins',
    name: 'Administrators',
    members: 3,
    description: 'Full platform access, billing control, and system settings.',
    icon: Shield,
    tone: 'bg-rose-50 text-rose-500',
    permissions: ['Manage users', 'Edit settings', 'Review reports'],
  },
  {
    id: 'creators',
    name: 'Creators',
    members: 42,
    description: 'Hosts and teams producing podcasts and episodes.',
    icon: Mic,
    tone: 'bg-blue-50 text-blue-500',
    permissions: ['Publish content', 'View creator analytics', 'Manage episodes'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    members: 6,
    description: 'Campaign and audience teams handling newsletters and announcements.',
    icon: Megaphone,
    tone: 'bg-amber-50 text-amber-500',
    permissions: ['Send newsletters', 'Launch announcements', 'Review open rates'],
  },
]

export default function AdminGroupsPage() {
  const totalMembers = useMemo(
    () => groups.reduce((sum, group) => sum + group.members, 0),
    []
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Users className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Team Access
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">User Groups</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-xl">Organize members by responsibility so admin permissions stay clear and manageable.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button asChild variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Link href="/admin/users">
              Review Members <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> New Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
          <CardContent className="p-0">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Active Groups</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{groups.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
          <CardContent className="p-0">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Assigned Members</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{totalMembers}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
          <CardContent className="p-0">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Permission Model</p>
            <p className="text-4xl font-black text-slate-900 mt-2">Role Based</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Card key={group.id} className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <CardHeader className="p-0 pb-8">
              <div className="flex items-center justify-between">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${group.tone}`}>
                  <group.icon className="h-7 w-7" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-black text-[10px] px-3 py-1 rounded-full">
                  {group.members} members
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-6">{group.name}</CardTitle>
              <CardDescription className="font-bold text-slate-400">{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {group.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-sm text-slate-700">{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
