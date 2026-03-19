'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useState as useStateReact } from 'react'

import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  MapPin, 
  Globe, 
  Camera,
  AtSign,
  Upload
} from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
          setDisplayName(data.display_name || '')
          setBio(data.bio || '')
          setWebsiteUrl(data.website_url || '')
          setAvatarUrl(data.avatar_url || '')
          setCoverUrl(data.cover_url || '')
          setAddress(data.address || '')
          setCity(data.city || '')
          setCountry(data.country || '')
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0]
    if (!file) return

    if (type === 'avatar') setUploadingAvatar(true)
    else setUploadingCover(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/${type}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('podcast-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('podcast-media')
        .getPublicUrl(filePath)

      if (type === 'avatar') setAvatarUrl(publicUrl)
      else setCoverUrl(publicUrl)

      toast.success(`${type === 'avatar' ? 'Avatar' : 'Cover'} uploaded! Remember to save changes.`)
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
    } finally {
      if (type === 'avatar') setUploadingAvatar(false)
      else setUploadingCover(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            display_name: displayName,
            bio: bio,
            website_url: websiteUrl,
            avatar_url: avatarUrl,
            cover_url: coverUrl,
            address: address,
            city: city,
            country: country,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (error) throw error
        toast.success('Profile updated successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Cover Section */}
      <div className="relative h-64 rounded-[2.5rem] bg-muted overflow-hidden shadow-2xl group">
        {coverUrl ? (
          <Image src={coverUrl} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold flex items-center gap-2 hover:bg-white/30 transition-all">
            <Camera className="h-5 w-5" />
            {uploadingCover ? 'Uploading...' : 'Change Cover'}
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploadingCover} />
          </label>
        </div>

        <div className="absolute -bottom-16 left-10 flex items-end gap-6">
          <div className="relative group/avatar">
            <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-8 border-background bg-muted shadow-2xl">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-[2.5rem] cursor-pointer">
              <Camera className="h-8 w-8 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={uploadingAvatar} />
            </label>
          </div>
          <div className="mb-20">
            <h1 className="text-4xl font-black text-white drop-shadow-lg">{displayName || profile?.username}</h1>
            <p className="text-white/90 font-bold flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit mt-2">
              <AtSign className="h-4 w-4" /> {profile?.username}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-16">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-muted/50 bg-card/50 backdrop-blur-md">
            <h3 className="font-black text-lg mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/30">
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Joined On</span>
                <span className="font-bold text-sm">{new Date(profile?.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20">Active</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-muted/50 bg-primary text-primary-foreground overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
            <h3 className="font-black text-lg mb-2 relative z-10">Pro Creator</h3>
            <p className="text-primary-foreground/80 text-xs font-medium mb-4 relative z-10 leading-relaxed">
              Unlock advanced metrics and unlimited storage.
            </p>
            <Button variant="secondary" size="sm" className="w-full rounded-xl font-black relative z-10 h-10 shadow-lg text-xs">
              Upgrade Now
            </Button>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl shadow-muted/50 bg-card">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <User className="h-3 w-3 text-primary" /> Public Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="rounded-xl h-12 bg-muted/50 border-none font-bold text-base px-5 focus-visible:ring-primary shadow-inner"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe className="h-3 w-3 text-primary" /> Website
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="yoursite.com"
                      className="rounded-xl h-12 pl-11 bg-muted/50 border-none font-bold text-base focus-visible:ring-primary shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <AtSign className="h-3 w-3 text-primary" /> Bio
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your listeners about yourself..."
                  rows={3}
                  className="rounded-2xl bg-muted/50 border-none font-bold text-base p-5 focus-visible:ring-primary resize-none shadow-inner leading-relaxed"
                />
              </div>

              <div className="pt-8 border-t border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h3 className="font-black text-xl tracking-tight">Location Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Street Address</label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address"
                      className="rounded-xl h-12 bg-muted/50 border-none font-bold text-base px-5 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">City</label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New York"
                      className="rounded-xl h-12 bg-muted/50 border-none font-bold text-base px-5 shadow-inner"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Country</label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. USA"
                      className="rounded-xl h-12 bg-muted/50 border-none font-bold text-base px-5 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  size="lg"
                  className="rounded-full px-12 h-14 font-black text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
