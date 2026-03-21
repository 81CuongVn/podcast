'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ShieldCheck, Database, CloudUpload, Save, Globe, Type, Image as ImageIcon, Share2, Zap, Code, Layout, Search, Lock, Smartphone, Activity, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DEFAULT_SITE_SETTINGS,
  mergeSiteSettings,
} from '@/lib/site-settings'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_SETTINGS.siteTitle)
  const [siteDescription, setSiteDescription] = useState(DEFAULT_SITE_SETTINGS.siteDescription)
  const [siteDomain, setSiteDomain] = useState(DEFAULT_SITE_SETTINGS.siteDomain)
  const [twitterUrl, setTwitterUrl] = useState(DEFAULT_SITE_SETTINGS.twitterUrl)
  const [instagramUrl, setInstagramUrl] = useState(DEFAULT_SITE_SETTINGS.instagramUrl)
  const [contactEmail, setContactEmail] = useState(DEFAULT_SITE_SETTINGS.contactEmail)
  const [bgImage, setBgImage] = useState(DEFAULT_SITE_SETTINGS.backgroundImage)
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_SITE_SETTINGS.primaryColor)
  const [appearance, setAppearance] = useState({
    glassmorphism: DEFAULT_SITE_SETTINGS.glassmorphism,
    darkMode: DEFAULT_SITE_SETTINGS.darkMode,
    mobileNav: DEFAULT_SITE_SETTINGS.mobileNav,
  })
  const [security, setSecurity] = useState({
    publicRegistration: DEFAULT_SITE_SETTINGS.publicRegistration,
    emailVerification: DEFAULT_SITE_SETTINGS.emailVerification,
    moderatorDashboard: DEFAULT_SITE_SETTINGS.moderatorDashboard,
    maintenanceMode: DEFAULT_SITE_SETTINGS.maintenanceMode,
  })
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(
    DEFAULT_SITE_SETTINGS.googleAnalyticsId
  )
  const [facebookPixelId, setFacebookPixelId] = useState(
    DEFAULT_SITE_SETTINGS.facebookPixelId
  )
  const [seoKeywords, setSeoKeywords] = useState(DEFAULT_SITE_SETTINGS.seoKeywords)
  const [customCss, setCustomCss] = useState(DEFAULT_SITE_SETTINGS.customCss)
  const [customJs, setCustomJs] = useState(DEFAULT_SITE_SETTINGS.customJs)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/site-settings', {
          method: 'GET',
          cache: 'no-store',
        })
        if (!response.ok) return
        const persisted = mergeSiteSettings(await response.json())
        setSiteTitle(persisted.siteTitle)
        setSiteDescription(persisted.siteDescription)
        setSiteDomain(persisted.siteDomain)
        setTwitterUrl(persisted.twitterUrl)
        setInstagramUrl(persisted.instagramUrl)
        setContactEmail(persisted.contactEmail)
        setBgImage(persisted.backgroundImage)
        setPrimaryColor(persisted.primaryColor)
        setAppearance({
          glassmorphism: persisted.glassmorphism,
          darkMode: persisted.darkMode,
          mobileNav: persisted.mobileNav,
        })
        setSecurity((current) => ({
          ...current,
          publicRegistration: persisted.publicRegistration,
          emailVerification: persisted.emailVerification,
          moderatorDashboard: persisted.moderatorDashboard,
          maintenanceMode: persisted.maintenanceMode,
        }))
        setGoogleAnalyticsId(persisted.googleAnalyticsId)
        setFacebookPixelId(persisted.facebookPixelId)
        setSeoKeywords(persisted.seoKeywords)
        setCustomCss(persisted.customCss)
        setCustomJs(persisted.customJs)
      } catch {
        // Keep defaults on transient failures.
      }
    }

    void loadSettings()
  }, [])

  const handleSave = async () => {
    setLoading(true)

    try {
      const nextSettings = mergeSiteSettings({
        siteTitle,
        siteDescription,
        siteDomain,
        twitterUrl,
        instagramUrl,
        contactEmail,
        backgroundImage: bgImage,
        primaryColor,
        glassmorphism: appearance.glassmorphism,
        darkMode: appearance.darkMode,
        mobileNav: appearance.mobileNav,
        publicRegistration: security.publicRegistration,
        emailVerification: security.emailVerification,
        moderatorDashboard: security.moderatorDashboard,
        maintenanceMode: security.maintenanceMode,
        googleAnalyticsId,
        facebookPixelId,
        seoKeywords,
        customCss,
        customJs,
      })

      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nextSettings),
      })

      if (!response.ok) {
        throw new Error('save_failed')
      }

      const savedSettings = mergeSiteSettings(await response.json())
      setSiteTitle(savedSettings.siteTitle)
      setSiteDescription(savedSettings.siteDescription)
      setSiteDomain(savedSettings.siteDomain)
      setTwitterUrl(savedSettings.twitterUrl)
      setInstagramUrl(savedSettings.instagramUrl)
      setContactEmail(savedSettings.contactEmail)
      setBgImage(savedSettings.backgroundImage)
      setPrimaryColor(savedSettings.primaryColor)
      setAppearance({
        glassmorphism: savedSettings.glassmorphism,
        darkMode: savedSettings.darkMode,
        mobileNav: savedSettings.mobileNav,
      })
      setSecurity((current) => ({
        ...current,
        publicRegistration: savedSettings.publicRegistration,
        emailVerification: savedSettings.emailVerification,
        moderatorDashboard: savedSettings.moderatorDashboard,
        maintenanceMode: savedSettings.maintenanceMode,
      }))
      setGoogleAnalyticsId(savedSettings.googleAnalyticsId)
      setFacebookPixelId(savedSettings.facebookPixelId)
      setSeoKeywords(savedSettings.seoKeywords)
      setCustomCss(savedSettings.customCss)
      setCustomJs(savedSettings.customJs)
      window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: savedSettings }))

      toast.success('System settings updated successfully')
    } catch {
      toast.error('Unable to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-3 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Configuration
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">System settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Update platform identity, behavior, and security controls from one workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 px-5 font-semibold">
              <Activity className="mr-2 h-4 w-4" />
              View logs
            </Button>
            <Button onClick={handleSave} disabled={loading} className="h-11 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20">
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </section>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 flex h-auto flex-wrap gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-sm">
          <TabsTrigger value="general" className="rounded-xl px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            <Layout className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-xl px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-xl px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            <Code className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Site identity</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Core naming and public metadata.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Website title</Label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Description</Label>
                  <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Primary domain</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={siteDomain} onChange={(e) => setSiteDomain(e.target.value)} className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Social connections</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Link your public platform channels.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Twitter / X</Label>
                  <Input value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://x.com/your-handle" className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Instagram</Label>
                  <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/your-handle" className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Contact email</Label>
                  <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hello@podhub.com" className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Visual branding</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Background assets and brand color.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Background image</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={bgImage} onChange={(e) => setBgImage(e.target.value)} className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 font-medium" />
                  </div>
                  <div className="h-40 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img src={bgImage} alt="Background preview" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Primary color</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-11 w-16 rounded-xl border-0 bg-transparent p-1" />
                    <span className="font-semibold text-slate-700">{primaryColor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Layout options</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Control how the interface behaves across devices.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Glassmorphism UI</Label>
                    <p className="mt-1 text-sm text-slate-500">Use blurred backgrounds on navigation surfaces.</p>
                  </div>
                  <Switch checked={appearance.glassmorphism} onCheckedChange={(checked) => setAppearance((current) => ({ ...current, glassmorphism: checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Dark mode support</Label>
                    <p className="mt-1 text-sm text-slate-500">Allow users to switch into a dark theme.</p>
                  </div>
                  <Switch checked={appearance.darkMode} onCheckedChange={(checked) => setAppearance((current) => ({ ...current, darkMode: checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Mobile navigation bar</Label>
                    <p className="mt-1 text-sm text-slate-500">Expose quick navigation on smaller screens.</p>
                  </div>
                  <Switch checked={appearance.mobileNav} onCheckedChange={(checked) => setAppearance((current) => ({ ...current, mobileNav: checked }))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Access control</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Registration and moderation permissions.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Public registration</Label>
                    <p className="mt-1 text-sm text-slate-500">Allow new users to sign up without manual approval.</p>
                  </div>
                  <Switch checked={security.publicRegistration} onCheckedChange={(checked) => setSecurity((current) => ({ ...current, publicRegistration: checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Email verification</Label>
                    <p className="mt-1 text-sm text-slate-500">Require verified email before account access.</p>
                  </div>
                  <Switch checked={security.emailVerification} onCheckedChange={(checked) => setSecurity((current) => ({ ...current, emailVerification: checked }))} />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Moderator dashboard</Label>
                    <p className="mt-1 text-sm text-slate-500">Grant non-admin moderators access to limited tools.</p>
                  </div>
                  <Switch checked={security.moderatorDashboard} onCheckedChange={(checked) => setSecurity((current) => ({ ...current, moderatorDashboard: checked }))} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border border-slate-200 shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-950">Maintenance</CardTitle>
                    <CardDescription className="text-sm text-slate-500">Site state controls and emergency actions.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <Label className="font-semibold text-slate-950">Maintenance mode</Label>
                    <p className="mt-1 text-sm text-slate-500">Temporarily restrict site access for maintenance windows.</p>
                  </div>
                  <Switch checked={security.maintenanceMode} onCheckedChange={(checked) => setSecurity((current) => ({ ...current, maintenanceMode: checked }))} />
                </div>
                <Button variant="outline" className="h-11 w-full rounded-2xl border-slate-200 font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear system cache
                </Button>
                <Button variant="outline" className="h-11 w-full rounded-2xl border-slate-200 font-semibold">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Export full database
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="max-w-4xl rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-950">Search visibility</CardTitle>
                  <CardDescription className="text-sm text-slate-500">Manage analytics identifiers and keyword targets.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-0">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Google Analytics ID</Label>
                  <Input value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} placeholder="UA-XXXXX-Y" className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Facebook Pixel ID</Label>
                  <Input value={facebookPixelId} onChange={(e) => setFacebookPixelId(e.target.value)} placeholder="1234567890" className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">SEO keywords</Label>
                <Textarea value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="podcast, audio, creator, streaming, music..." className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 font-medium" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="max-w-4xl rounded-[2rem] border border-slate-200 shadow-sm">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-950">Developer options</CardTitle>
                  <CardDescription className="text-sm text-slate-500">Custom scripts, styles, and public API controls.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6 pt-0">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Custom CSS</Label>
                <Textarea value={customCss} onChange={(e) => setCustomCss(e.target.value)} placeholder="/* Add your custom styles here */" className="min-h-[180px] rounded-2xl border-slate-800 bg-slate-950 font-mono text-sm text-emerald-400" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Custom JS</Label>
                <Textarea value={customJs} onChange={(e) => setCustomJs(e.target.value)} placeholder="// Add your custom scripts here" className="min-h-[180px] rounded-2xl border-slate-800 bg-slate-950 font-mono text-sm text-blue-400" />
              </div>
              <div className="flex flex-col gap-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-200 text-amber-700">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">API access is active</p>
                    <p className="mt-1 text-sm text-amber-800/80">Rotate keys when deploying to a new environment or sharing integrations.</p>
                  </div>
                </div>
                <Button className="h-11 rounded-2xl bg-amber-500 px-5 font-semibold text-white hover:bg-amber-600">
                  Rotate API keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
