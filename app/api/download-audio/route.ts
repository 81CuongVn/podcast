import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const pathname = searchParams.get('pathname') || searchParams.get('path')

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    // Try to get the file from Supabase Storage
    const bucket = 'podcast-media'
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(pathname)

    if (error) {
      console.error(`Supabase storage download error (Bucket: ${bucket}, Path: ${pathname}):`, error)
      return NextResponse.json({ error: 'Failed to download from storage', details: error.message }, { status: 500 })
    }

    if (!data) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Determine content type
    const contentType = data.type || 'audio/mpeg'

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${pathname.split('/').pop()}"`,
        'Cache-Control': 'private, max-age=3600',
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error) {
    console.error('CRITICAL: Error serving audio:', error)
    return NextResponse.json({ 
      error: 'Failed to serve audio', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
