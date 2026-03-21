'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, MoreVertical, CheckCircle2, Clock, Globe, FileText, Sparkles, Type, Download, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const languages = [
  { id: '1', name: 'English (US)', code: 'en-US', status: 'Active', completeness: '100%', type: 'Native', direction: 'LTR' },
  { id: '2', name: 'Spanish (ES)', code: 'es-ES', status: 'Active', completeness: '92%', type: 'Official', direction: 'LTR' },
  { id: '3', name: 'French (FR)', code: 'fr-FR', status: 'Active', completeness: '88%', type: 'Official', direction: 'LTR' },
  { id: '4', name: 'German (DE)', code: 'de-DE', status: 'Inactive', completeness: '75%', type: 'Official', direction: 'LTR' },
  { id: '5', name: 'Arabic (SA)', code: 'ar-SA', status: 'Inactive', completeness: '64%', type: 'Official', direction: 'RTL' },
]

export default function AdminLanguagesPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) => {
      const matchesQuery = !query || `${language.name} ${language.code} ${language.type}`.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || language.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [query, statusFilter])

  const summary = [
    { label: 'Installed', value: languages.length },
    { label: 'Active', value: languages.filter((item) => item.status === 'Active').length },
    { label: 'Needs work', value: languages.filter((item) => parseInt(item.completeness, 10) < 90).length },
  ]

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-3 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Localization
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Language management</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Manage installed packs, identify incomplete translations, and move quickly between localization tasks.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Globe className="mr-2 h-4 w-4" />
              Geo-targeting
            </Button>
            <Button className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              Add language
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="rounded-[1.75rem] border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-2xl font-black text-slate-950">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <Card className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-950">Installed packs</CardTitle>
                <CardDescription className="mt-1 text-sm text-slate-500">
                  Search by language name or ISO code and filter by publication state.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search packs..." className="h-11 min-w-[220px] rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={statusFilter === 'All' ? 'default' : 'outline'} className="h-11 rounded-2xl px-4 font-semibold" onClick={() => setStatusFilter('All')}>
                    All
                  </Button>
                  <Button variant={statusFilter === 'Active' ? 'default' : 'outline'} className="h-11 rounded-2xl px-4 font-semibold" onClick={() => setStatusFilter('Active')}>
                    Active
                  </Button>
                  <Button variant={statusFilter === 'Inactive' ? 'default' : 'outline'} className="h-11 rounded-2xl px-4 font-semibold" onClick={() => setStatusFilter('Inactive')}>
                    Inactive
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-slate-50">
                    <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Language</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">ISO code</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Completeness</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Status</TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLanguages.map((lang) => (
                    <TableRow key={lang.id} className="hover:bg-slate-50/60">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Globe className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950">{lang.name}</p>
                            <p className="text-sm text-slate-500">{lang.type} • {lang.direction}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{lang.code}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                parseInt(lang.completeness, 10) > 90 ? 'bg-emerald-500' : parseInt(lang.completeness, 10) > 70 ? 'bg-amber-500' : 'bg-rose-500'
                              )}
                              style={{ width: lang.completeness }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-600">{lang.completeness}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lang.status === 'Active' ? (
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Clock className="h-4 w-4" />
                            Inactive
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-xl">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-black">AI translation hub</CardTitle>
              <CardDescription className="text-sm text-slate-400">Kick off machine-assisted translation for incomplete packs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">2 packs below 90% completeness</p>
                <p className="mt-1 text-sm text-slate-400">German and Arabic are the best candidates for automation.</p>
              </div>
              <Button className="h-11 w-full rounded-2xl bg-white font-semibold text-slate-950 hover:bg-white/90">
                <Sparkles className="mr-2 h-4 w-4" />
                Initialize auto-translate
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Type className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-950">String overrides</CardTitle>
                  <CardDescription className="text-sm text-slate-500">Adjust high-visibility labels without changing source files.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Original</p>
                <p className="mt-1 font-semibold text-slate-950">Sign Up</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Override</p>
                <p className="mt-1 font-semibold text-primary">Join the Hub</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="h-11 flex-1 rounded-2xl border-slate-200 font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button className="h-11 flex-1 rounded-2xl font-semibold">
                  <Filter className="mr-2 h-4 w-4" />
                  Add override
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
