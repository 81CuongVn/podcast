'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  ShieldCheck, 
  Server, 
  Bell, 
  Database, 
  CloudUpload,
  Save
} from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const handleSave = () => {
    toast.success('System settings updated successfully!')
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-2">Global configuration for the platform infrastructure and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {/* Notifications Section */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/50 p-6">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Alerts & System</CardTitle>
              <CardDescription>Global notification settings.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Set platform to read-only.</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">Admin Notifications</Label>
                <p className="text-sm text-muted-foreground">Alerts for critical system events.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/50 p-6 bg-primary text-primary-foreground">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold">Database Health</CardTitle>
            <CardDescription className="text-primary-foreground/70">Last backup: 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="secondary" className="w-full font-bold rounded-xl h-12">
              <Database className="h-4 w-4 mr-2" /> Trigger Manual Backup
            </Button>
            <Button variant="secondary" className="w-full font-bold rounded-xl h-12">
              <CloudUpload className="h-4 w-4 mr-2" /> Sync CDN Cache
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-10">
        <Button onClick={handleSave} size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-2xl shadow-primary/30">
          <Save className="h-5 w-5 mr-2" /> Save All Changes
        </Button>
      </div>
    </div>
  )
}
