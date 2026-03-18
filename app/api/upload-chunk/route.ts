import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024 // 1GB

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract metadata from headers (this avoids FormData parsing issues)
    const chunkIndex = request.headers.get('X-Chunk-Index')
    const totalChunks = request.headers.get('X-Total-Chunks')
    const encodedFileName = request.headers.get('X-File-Name')
    const uploadId = request.headers.get('X-Upload-Id')

    if (!chunkIndex || !totalChunks || !encodedFileName || !uploadId) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      )
    }

    let fileName = encodedFileName
    try {
      fileName = decodeURIComponent(encodedFileName)
    } catch {
      console.warn('Failed to decode upload file name header, using raw value')
    }

    console.log(
      `Uploading chunk ${parseInt(chunkIndex) + 1}/${totalChunks} for ${fileName}`
    )

    // Read raw binary chunk from request body
    const buffer = await request.arrayBuffer()
    const chunkPath = `${user.id}/${uploadId}/${chunkIndex}.chunk`

    const { error: uploadError } = await supabase.storage
      .from('podcast-media')
      .upload(chunkPath, buffer, {
        contentType: 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      console.error('Chunk upload error:', uploadError)
      return NextResponse.json(
        { error: `Chunk upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log(`Chunk ${chunkIndex} uploaded successfully`)

    // If this is the last chunk, combine all chunks
    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      console.log('All chunks uploaded, combining...')

      // Download all chunks
      const chunks: Uint8Array[] = []
      for (let i = 0; i < parseInt(totalChunks); i++) {
        const chunkFilePath = `${user.id}/${uploadId}/${i}.chunk`
        try {
          const { data } = await supabase.storage
            .from('podcast-media')
            .download(chunkFilePath)
          if (data) {
            chunks.push(new Uint8Array(await data.arrayBuffer()))
          }
        } catch (err) {
          console.error(`Error downloading chunk ${i}:`, err)
          return NextResponse.json(
            { error: `Failed to combine chunks` },
            { status: 500 }
          )
        }
      }

      // Combine chunks
      const totalSize = chunks.reduce((sum, c) => sum + c.length, 0)

      if (totalSize > MAX_FILE_SIZE_BYTES) {
        console.error(
          `Combined file size ${totalSize} exceeds limit of ${MAX_FILE_SIZE_BYTES} bytes`
        )
        return NextResponse.json(
          {
            error: `File is too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024 * 1024)}GB.`,
          },
          { status: 400 }
        )
      }

      const combined = new Uint8Array(totalSize)
      let offset = 0
      for (const chunk of chunks) {
        combined.set(chunk, offset)
        offset += chunk.length
      }

      // Upload combined file
      const fileExt = fileName.split('.').pop()
      const finalFileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data: uploadData, error: finalError } = await supabase.storage
        .from('podcast-media')
        .upload(finalFileName, combined, {
          contentType: 'application/octet-stream',
          upsert: false,
        })

      if (finalError) {
        console.error('Final upload error:', finalError)
        return NextResponse.json(
          { error: `Final upload failed: ${finalError.message}` },
          { status: 500 }
        )
      }

      // Clean up chunk files
      for (let i = 0; i < parseInt(totalChunks); i++) {
        try {
          await supabase.storage
            .from('podcast-media')
            .remove([`${user.id}/${uploadId}/${i}.chunk`])
        } catch (err) {
          console.warn(`Failed to cleanup chunk ${i}`)
        }
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('podcast-media')
        .getPublicUrl(finalFileName)

      console.log(`File combined and uploaded: ${publicUrl.publicUrl}`)

      return NextResponse.json({
        complete: true,
        pathname: uploadData.path,
        url: publicUrl.publicUrl,
      })
    }

    return NextResponse.json({ complete: false })
  } catch (error) {
    console.error('Chunk upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export const maxDuration = 300
