import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { DEFAULT_SITE_SETTINGS, mergeSiteSettings } from '@/lib/site-settings'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select(
        'site_title, site_description, site_domain, twitter_url, instagram_url, contact_email, background_image, primary_color, glassmorphism, dark_mode, mobile_nav, public_registration, email_verification, moderator_dashboard, maintenance_mode, google_analytics_id, facebook_pixel_id, seo_keywords, custom_css, custom_js'
      )
      .eq('id', 1)
      .single()

    if (error || !data) {
      return NextResponse.json(DEFAULT_SITE_SETTINGS)
    }

    return NextResponse.json(
      mergeSiteSettings({
        siteTitle: data.site_title,
        siteDescription: data.site_description,
        siteDomain: data.site_domain,
        twitterUrl: data.twitter_url,
        instagramUrl: data.instagram_url,
        contactEmail: data.contact_email,
        backgroundImage: data.background_image,
        primaryColor: data.primary_color,
        glassmorphism: data.glassmorphism,
        darkMode: data.dark_mode,
        mobileNav: data.mobile_nav,
        publicRegistration: data.public_registration,
        emailVerification: data.email_verification,
        moderatorDashboard: data.moderator_dashboard,
        maintenanceMode: data.maintenance_mode,
        googleAnalyticsId: data.google_analytics_id,
        facebookPixelId: data.facebook_pixel_id,
        seoKeywords: data.seo_keywords,
        customCss: data.custom_css,
        customJs: data.custom_js,
      })
    )
  } catch {
    return NextResponse.json(DEFAULT_SITE_SETTINGS)
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = mergeSiteSettings(await request.json())

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 1,
          site_title: payload.siteTitle,
          site_description: payload.siteDescription,
          site_domain: payload.siteDomain,
          twitter_url: payload.twitterUrl,
          instagram_url: payload.instagramUrl,
          contact_email: payload.contactEmail,
          background_image: payload.backgroundImage,
          primary_color: payload.primaryColor,
          glassmorphism: payload.glassmorphism,
          dark_mode: payload.darkMode,
          mobile_nav: payload.mobileNav,
          public_registration: payload.publicRegistration,
          email_verification: payload.emailVerification,
          moderator_dashboard: payload.moderatorDashboard,
          maintenance_mode: payload.maintenanceMode,
          google_analytics_id: payload.googleAnalyticsId,
          facebook_pixel_id: payload.facebookPixelId,
          seo_keywords: payload.seoKeywords,
          custom_css: payload.customCss,
          custom_js: payload.customJs,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select(
        'site_title, site_description, site_domain, twitter_url, instagram_url, contact_email, background_image, primary_color, glassmorphism, dark_mode, mobile_nav, public_registration, email_verification, moderator_dashboard, maintenance_mode, google_analytics_id, facebook_pixel_id, seo_keywords, custom_css, custom_js'
      )
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to update site settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      mergeSiteSettings({
        siteTitle: data.site_title,
        siteDescription: data.site_description,
        siteDomain: data.site_domain,
        twitterUrl: data.twitter_url,
        instagramUrl: data.instagram_url,
        contactEmail: data.contact_email,
        backgroundImage: data.background_image,
        primaryColor: data.primary_color,
        glassmorphism: data.glassmorphism,
        darkMode: data.dark_mode,
        mobileNav: data.mobile_nav,
        publicRegistration: data.public_registration,
        emailVerification: data.email_verification,
        moderatorDashboard: data.moderator_dashboard,
        maintenanceMode: data.maintenance_mode,
        googleAnalyticsId: data.google_analytics_id,
        facebookPixelId: data.facebook_pixel_id,
        seoKeywords: data.seo_keywords,
        customCss: data.custom_css,
        customJs: data.custom_js,
      })
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
