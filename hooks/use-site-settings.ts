'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from '@/lib/site-settings'

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/site-settings', {
          method: 'GET',
          cache: 'no-store',
        })
        if (!response.ok) return
        const data = (await response.json()) as SiteSettings
        setSettings(data)
      } catch {
        // Keep defaults when offline/API fails.
      }
    }

    loadSettings()

    const handleCustom = (event: Event) => {
      const customEvent = event as CustomEvent<SiteSettings>
      if (customEvent.detail) {
        setSettings(customEvent.detail)
        return
      }
      void loadSettings()
    }

    window.addEventListener('site-settings-updated', handleCustom)

    return () => {
      window.removeEventListener('site-settings-updated', handleCustom)
    }
  }, [])

  return settings
}
