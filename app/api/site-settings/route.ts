import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { DEFAULT_SITE_SETTINGS, mergeSiteSettings } from '@/lib/site-settings'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select(
        'site_title, site_description, site_domain, public_registration, maintenance_mode'
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
        publicRegistration: data.public_registration,
        maintenanceMode: data.maintenance_mode,
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
          public_registration: payload.publicRegistration,
          maintenance_mode: payload.maintenanceMode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select(
        'site_title, site_description, site_domain, public_registration, maintenance_mode'
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
        publicRegistration: data.public_registration,
        maintenanceMode: data.maintenance_mode,
      })
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
