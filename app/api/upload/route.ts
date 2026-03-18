import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function parseMultipartFormData(request: NextRequest): Promise<{ file: File }> {
  const contentType = request.headers.get('content-type') || ''
  
  if (!contentType.includes('multipart/form-data')) {
    throw new Error('Invalid content type')
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error('No file in form data')
  }

  return { file }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Upload endpoint called')
    console.log(`Content-Type: ${request.headers.get('content-type')}`)
    console.log(`Content-Length: ${request.headers.get('content-length')}`)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('No user authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`Authenticated user: ${user.id}`)

    // Parse FormData
    let file: File
    try {
      console.log('Parsing FormData...')
      const { file: parsedFile } = await parseMultipartFormData(request)
      file = parsedFile
      console.log('FormData parsed successfully')
    } catch (parseError) {
      console.error('FormData parse error:', parseError)
      return NextResponse.json(
        { error: `Failed to parse request: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` },
        { status: 400 }
      )
    }

    const fileSizeMB = file.size / (1024 * 1024)
    const fileSizeGB = fileSizeMB / 1024
    console.log(`File received: ${file.name}, size: ${fileSizeMB.toFixed(2)}MB (${fileSizeGB.toFixed(2)}GB), type: ${file.type}`)

    // Validate file size (1GB max)
    const MAX_SIZE = 1 * 1024 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      console.error(`File too large: ${fileSizeGB.toFixed(2)}GB > 1GB limit`)
      return NextResponse.json(
        { error: `File too large. Maximum size is 1GB. Your file is ${fileSizeGB.toFixed(2)}GB.` },
        { status: 413 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    console.log(`Generated filename: ${fileName}`)

    // Convert File to Buffer
    console.log('Converting file to buffer...')
    const buffer = await file.arrayBuffer()
    console.log(`Converted to buffer: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB`)

    // Upload to Supabase Storage
    let uploadData = null
    let uploadError: any = null

    try {
      console.log('Starting Supabase upload...')
      const uploadStartTime = Date.now()
      
      const { data, error } = await supabase.storage
        .from('podcast-media')
        .upload(fileName, new Uint8Array(buffer), {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        })

      const uploadTime = Date.now() - uploadStartTime
      console.log(`Supabase upload completed in ${uploadTime}ms`)

      if (error) {
        uploadError = error
        console.error('Supabase upload error:', error)
      } else {
        uploadData = data
        console.log('Upload to Supabase successful:', data)
      }
    } catch (err) {
      console.error('Supabase upload exception:', err)
      uploadError = err
    }

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}` },
        { status: 500 }
      )
    }

    if (!uploadData) {
      console.error('No upload data returned')
      return NextResponse.json(
        { error: 'Upload failed: No data returned' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('podcast-media')
      .getPublicUrl(fileName)

    console.log(`File uploaded successfully: ${publicUrl.publicUrl}`)

    return NextResponse.json({
      pathname: uploadData.path,
      url: publicUrl.publicUrl,
      size: fileSizeMB.toFixed(2),
    })
  } catch (error) {
    console.error('Upload route error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Increase duration for large file uploads (5 minutes max for Hobby plan)
export const maxDuration = 300
