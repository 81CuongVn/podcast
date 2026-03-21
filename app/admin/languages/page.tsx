'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Languages, 
  Plus, 
  Search, 
  MoreVertical, 
  CheckCircle2,
  Clock,
  Globe,
  FileText,
  Sparkles,
  Type,
  Download,
  Filter
} from 'lucide-react'
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
  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Languages className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Linguistic Engine
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Language Management</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Localize your platform and manage translations for a global audience.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Globe className="mr-2 h-5 w-5" /> Geo-Targeting
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Plus className="mr-2 h-5 w-5" /> Add Language
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main List */}
        <Card className="xl:col-span-2 rounded-[3rem] border-none shadow-xl bg-white overflow-hidden flex flex-col">
          <CardHeader className="p-10 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Installed Packs</CardTitle>
                <CardDescription className="font-bold text-slate-400">Manage translation strings and language states.</CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search packs..." 
                    className="pl-10 h-10 rounded-xl bg-white border-none font-bold text-xs w-[150px]"
                  />
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px]">Language Name</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">ISO Code</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Completeness</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[11px]">Status</TableHead>
                  <TableHead className="px-10 py-6 font-black text-slate-400 uppercase tracking-widest text-[11px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {languages.map((lang) => (
                  <TableRow key={lang.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors">{lang.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.direction}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-slate-50 px-2 py-1 rounded-md font-mono text-[11px] font-black text-slate-500">{lang.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              parseInt(lang.completeness) > 90 ? 'bg-emerald-500' : 
                              parseInt(lang.completeness) > 70 ? 'bg-amber-500' : 'bg-rose-500'
                            )} 
                            style={{ width: lang.completeness }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{lang.completeness}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lang.status === 'Active' ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                          <CheckCircle2 className="h-3.5 w-3.5" /> LIVE
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-300 font-black text-[10px] uppercase tracking-widest">
                          <Clock className="h-3.5 w-3.5" /> INACTIVE
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400 hover:text-primary hover:bg-slate-100 transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Translation Hub */}
        <div className="space-y-8">
          <Card className="rounded-[3rem] border-none shadow-xl bg-slate-900 text-white p-10 relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
              <Sparkles className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-black mb-4">AI Translation Hub</h3>
            <p className="text-white/60 font-bold text-sm mb-8">Automatically translate your entire platform using PodHub AI Engine.</p>
            <Button className="w-full rounded-2xl h-14 font-black bg-white text-slate-900 hover:bg-white/90 transition-all shadow-xl shadow-white/5 border-none">
              Initialize Auto-Translate
            </Button>
          </Card>

          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Type className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">String Overrides</h3>
            <p className="text-sm font-bold text-slate-400 mb-8">Override specific UI strings without changing language files.</p>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Original String</p>
                <p className="font-black text-sm text-slate-900">Sign Up</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Override</p>
                <p className="font-black text-sm text-primary">Join the Hub</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6 h-12 rounded-xl font-black border-2 text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
              Add New Override
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
