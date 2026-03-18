import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type (image only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only image files are allowed.' },
        { status: 400 }
      )
    }

    // Create a unique filename with user ID and timestamp
    const timestamp = Date.now()
    const filename = `images/${user.id}/${timestamp}-${file.name}`

    // Upload to private Vercel Blob
    const blob = await put(filename, file, {
      access: 'private',
    })

    return NextResponse.json({
      pathname: blob.pathname,
      success: true,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
