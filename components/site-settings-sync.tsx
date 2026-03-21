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

    document.documentElement.style.setProperty(
      '--site-primary-color',
      settings.primaryColor
    )

    const styleTagId = 'site-custom-css'
    let styleTag = document.getElementById(styleTagId) as HTMLStyleElement | null
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleTagId
      document.head.appendChild(styleTag)
    }
    styleTag.textContent = settings.customCss || ''

    const scriptTagId = 'site-custom-js'
    const existingScript = document.getElementById(scriptTagId)
    if (existingScript) existingScript.remove()
    if (settings.customJs.trim()) {
      const scriptTag = document.createElement('script')
      scriptTag.id = scriptTagId
      scriptTag.textContent = settings.customJs
      document.body.appendChild(scriptTag)
    }
  }, [
    settings.customCss,
    settings.customJs,
    settings.primaryColor,
    settings.siteDescription,
    settings.siteTitle,
  ])

  return null
}
