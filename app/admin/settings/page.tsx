'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings, 
  ShieldCheck, 
  Server, 
  Bell, 
  Database, 
  CloudUpload,
  Save,
  Globe,
  Type,
  Image as ImageIcon,
  Share2,
  Mail,
  Zap,
  Code,
  Layout,
  Search,
  Lock,
  Eye,
  Smartphone,
  CheckCircle2,
  Activity,
  Trash2,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [siteTitle, setSiteTitle] = useState('PodHub')
  const [siteDescription, setSiteDescription] = useState('The professional podcast platform for creators and listeners.')
  const [siteDomain, setSiteDomain] = useState('podhub.com')
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1590602847861-f357a9332bbc')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    // Simulate saving to a global config table or local storage for now
    setTimeout(() => {
      toast.success('System settings updated successfully!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Settings className="h-40 w-40 rotate-12" />
        </div>
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Engine Configuration
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">System Settings</h1>
          <p className="text-slate-500 mt-2 font-bold max-w-lg">Fine-tune your platform's identity, security, and global appearance.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-2 hover:bg-slate-50 transition-all">
            <Activity className="mr-2 h-5 w-5" /> View Logs
          </Button>
          <Button onClick={handleSave} disabled={loading} className="rounded-2xl h-14 px-10 font-black bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            <Save className="mr-2 h-5 w-5" /> {loading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white p-2 rounded-[2rem] h-auto shadow-sm border border-border/40 mb-10 gap-2 flex-wrap sm:flex-nowrap">
          <TabsTrigger value="general" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            <Globe className="h-4 w-4 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            <Layout className="h-4 w-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            <Lock className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            <Search className="h-4 w-4 mr-2" /> SEO & Analytics
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
            <Code className="h-4 w-4 mr-2" /> Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <Globe className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Site Identity</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Global platform naming and accessibility.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Website Title</Label>
                  <div className="relative">
                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      value={siteTitle} 
                      onChange={(e) => setSiteTitle(e.target.value)}
                      className="rounded-2xl h-14 pl-14 bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Site Description</Label>
                  <Textarea 
                    value={siteDescription} 
                    onChange={(e) => setSiteDescription(e.target.value)}
                    className="rounded-2xl bg-slate-50 border-none font-bold min-h-[120px] p-6 focus:ring-2 focus:ring-primary/20 transition-all text-base leading-relaxed"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Domain</Label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      value={siteDomain} 
                      onChange={(e) => setSiteDomain(e.target.value)}
                      className="rounded-2xl h-14 pl-14 bg-slate-50 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Share2 className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Social Connections</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Link your platform to external services.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Twitter / X Profile</Label>
                  <Input 
                    placeholder="https://x.com/your-handle"
                    className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Instagram Profile</Label>
                  <Input 
                    placeholder="https://instagram.com/your-handle"
                    className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Email</Label>
                  <Input 
                    type="email"
                    placeholder="hello@podhub.com"
                    className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="animate-in slide-in-from-bottom-5 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <ImageIcon className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Visual Branding</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Customize the look and feel of the platform.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Global Background Image</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      value={bgImage} 
                      onChange={(e) => setBgImage(e.target.value)}
                      className="rounded-2xl h-14 pl-14 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="h-32 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 mt-4">
                    <img src={bgImage} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Theme Color</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-14 w-24 rounded-2xl p-2 bg-slate-50 border-none cursor-pointer"
                    />
                    <div className="flex-1 font-black text-slate-500 uppercase tracking-widest">{primaryColor}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Layout Options</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Control UI components and responsiveness.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Glassmorphism UI</Label>
                    <p className="text-sm font-bold text-slate-400">Enable frosted glass effects on navigation.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Dark Mode Support</Label>
                    <p className="text-sm font-bold text-slate-400">Allow users to switch to night theme.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Mobile Navigation Bar</Label>
                    <p className="text-sm font-bold text-slate-400">Show bottom navigation on small screens.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Access Control</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Manage user authentication and permissions.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Public Registration</Label>
                    <p className="text-sm font-bold text-slate-400">Allow new users to create accounts freely.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Email Verification</Label>
                    <p className="text-sm font-bold text-slate-400">Require users to verify email before use.</p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Moderator Dashboard</Label>
                    <p className="text-sm font-bold text-slate-400">Allow non-admin mods to access limited panel.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10">
              <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <Database className="h-7 w-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">Maintenance</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Critical system tools and state.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-8">
                <div className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <Label className="text-lg font-black text-slate-900">Maintenance Mode</Label>
                    <p className="text-sm font-bold text-slate-400">Lock site and show under construction page.</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
                <div className="pt-4 space-y-4">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all">
                    <Trash2 className="mr-2 h-5 w-5" /> Clear System Cache
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black text-slate-400 hover:bg-slate-50 transition-all">
                    <CloudUpload className="mr-2 h-5 w-5" /> Export Full Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="animate-in fade-in duration-500">
          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10 max-w-4xl">
            <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Search className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Search Engine Optimization</CardTitle>
                <CardDescription className="font-bold text-slate-400">Optimize how your platform appears in search engines.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Google Analytics ID</Label>
                  <Input 
                    placeholder="UA-XXXXX-Y"
                    className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Facebook Pixel ID</Label>
                  <Input 
                    placeholder="1234567890"
                    className="rounded-2xl h-14 px-6 bg-slate-50 border-none font-bold text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SEO Keywords (Comma separated)</Label>
                <Textarea 
                  placeholder="podcast, audio, creator, streaming, music..."
                  className="rounded-2xl bg-slate-50 border-none font-bold min-h-[100px] p-6 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="animate-in slide-in-from-top-5 duration-500">
          <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10 max-w-4xl">
            <CardHeader className="p-0 pb-10 flex flex-row items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                <Code className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Developer Options</CardTitle>
                <CardDescription className="font-bold text-slate-400">Inject custom scripts and manage API keys.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Custom CSS (Header)</Label>
                <Textarea 
                  placeholder="/* Add your custom styles here */"
                  className="rounded-2xl bg-slate-900 text-emerald-400 font-mono text-sm min-h-[200px] p-8 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Custom JS (Footer)</Label>
                <Textarea 
                  placeholder="// Add your custom scripts here"
                  className="rounded-2xl bg-slate-900 text-blue-400 font-mono text-sm min-h-[200px] p-8 border-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="pt-6 flex items-center justify-between p-8 rounded-[2rem] bg-amber-50 border border-amber-100">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-700">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">API Access</h4>
                    <p className="text-sm font-bold text-amber-700/70">Your platform's public API is currently active.</p>
                  </div>
                </div>
                <Button className="rounded-xl font-black bg-amber-500 hover:bg-amber-600 border-none">Rotate API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
