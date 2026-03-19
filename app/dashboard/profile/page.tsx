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
  AtSign
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
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState(false)

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
          setAddress(data.address || '')
          setCity(data.city || '')
          setCountry(data.country || '')
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

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
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative h-48 rounded-[2.5rem] bg-gradient-to-r from-primary to-accent overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <div className="relative group">
            <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-background bg-muted shadow-xl">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mb-14">
            <h1 className="text-3xl font-black text-white drop-shadow-md">{displayName || profile?.username}</h1>
            <p className="text-white/80 font-bold flex items-center gap-1.5">
              <AtSign className="h-4 w-4" /> {profile?.username}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-muted/50 bg-card">
            <h3 className="font-black text-lg mb-4">Profile Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-bold">Member Since</span>
                <span className="font-bold text-sm">{new Date(profile?.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-bold">Account Status</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Active</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-muted/50 bg-card">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Public Name
                  </label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="rounded-xl h-12 bg-muted/50 border-none font-semibold focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-muted-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Avatar URL
                  </label>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="rounded-xl h-12 bg-muted/50 border-none font-semibold focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground flex items-center gap-2">
                  <AtSign className="h-4 w-4" /> Bio
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the world about your journey..."
                  rows={4}
                  className="rounded-2xl bg-muted/50 border-none font-semibold focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Website
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    type="url"
                    className="rounded-xl h-12 pl-12 bg-muted/50 border-none font-semibold focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Location Information
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-muted-foreground">Street Address</label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Podcast Ave"
                      className="rounded-xl h-12 bg-muted/50 border-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-muted-foreground">City</label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Los Angeles"
                        className="rounded-xl h-12 bg-muted/50 border-none font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-muted-foreground">Country</label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United States"
                        className="rounded-xl h-12 bg-muted/50 border-none font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  size="lg"
                  className="rounded-full px-12 h-14 font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : 'Update Profile'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
