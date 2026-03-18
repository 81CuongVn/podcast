import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
