import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { display_name, username, email } = body

    if (!display_name || !username) {
      return NextResponse.json(
        { error: 'Display name and username are required' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    // Generate a UUID for the new profile
    const newId = crypto.randomUUID()

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: newId,
        display_name,
        username,
        email: email || null,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return NextResponse.json(
        { error: `Failed to create member: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(newProfile, { status: 201 })
  } catch (error) {
    console.error('Admin create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
