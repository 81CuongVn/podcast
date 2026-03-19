'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [siteTitle, setSiteTitle] = useState('PodHub')
  const [siteDomain, setSiteDomain] = useState('podhub.com')
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1590602847861-f357a9332bbc')
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    // Simulate saving to a global config table or local storage for now
    // In a real app, you'd have a 'system_settings' table
    setTimeout(() => {
      toast.success('System settings updated successfully!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">General Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your platform identity and appearance, just like WordPress.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-2xl shadow-primary/30">
          <Save className="h-5 w-5 mr-2" /> {loading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Site Identity Section */}
        <Card className="rounded-[3rem] border-none shadow-xl shadow-muted/50 p-8">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">Site Identity</CardTitle>
              <CardDescription>Global branding and accessibility.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Website Title</Label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={siteTitle} 
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="rounded-xl h-12 pl-12 bg-muted/50 border-none font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Custom Domain</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={siteDomain} 
                  onChange={(e) => setSiteDomain(e.target.value)}
                  className="rounded-xl h-12 pl-12 bg-muted/50 border-none font-bold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="rounded-[3rem] border-none shadow-xl shadow-muted/50 p-8">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-8">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <ImageIcon className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">Appearance</CardTitle>
              <CardDescription>Visual styles and theme assets.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Background Image Link</Label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={bgImage} 
                  onChange={(e) => setBgImage(e.target.value)}
                  className="rounded-xl h-12 pl-12 bg-muted/50 border-none font-bold"
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">Link to a high-resolution Unsplash or direct image URL.</p>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/50 p-6">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Platform Security</CardTitle>
              <CardDescription>Manage user access and content moderation.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Public Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to create accounts.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Content Review</Label>
                <p className="text-sm text-muted-foreground">Manual approval for new podcasts.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Section */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/50 p-6">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Infrastructure</CardTitle>
              <CardDescription>Storage and server configuration.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Supabase Sync</Label>
                <p className="text-sm text-muted-foreground">Real-time database replication.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Auto-optimization</Label>
                <p className="text-sm text-muted-foreground">Optimize audio files on upload.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
