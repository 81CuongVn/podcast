'use client'

import { useEffect } from 'react'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function SiteSettingsSync() {
  const settings = useSiteSettings()

  useEffect(() => {
    document.title = settings.siteTitle

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null

    if (metaDescription) {
      metaDescription.content = settings.siteDescription
    }
  }, [settings.siteDescription, settings.siteTitle])

  return null
}
