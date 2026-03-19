'use client'

import { motion } from 'framer-motion'
import { Headphones, Music } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TurntableProps {
  isPlaying: boolean
  imageUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Turntable({
  isPlaying,
  imageUrl,
  size = 'md',
  className
}: TurntableProps) {
  const sizes = {
    sm: 'h-16 w-16',
    md: 'h-32 w-32 md:h-48 md:w-48',
    lg: 'h-48 w-48 md:h-64 md:w-64'
  }

  return (
    <div className={cn("relative group", sizes[size], className)}>
      {/* Vinyl Outer */}
      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        className="relative h-full w-full rounded-full bg-[#111] shadow-2xl border-4 border-[#222] overflow-hidden flex items-center justify-center"
      >
        {/* Vinyl Grooves */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.05)_31%,transparent_32%)] bg-[length:10px_10px]" />
        
        {/* Cover Art Label */}
        <div className="relative h-[60%] w-[60%] rounded-full bg-muted overflow-hidden border-2 border-black/50 shadow-inner">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Turntable"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <Music className="h-1/2 w-1/2 text-primary/40" />
            </div>
          )}
          {/* Center Hole */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white/20 backdrop-blur-md border border-white/40 z-10" />
        </div>
      </motion.div>

      {/* Tone Arm */}
      <motion.div
        animate={{ rotate: isPlaying ? 25 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ originX: "top right", right: "-10%", top: "0%" }}
        className="absolute h-[60%] w-2 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-lg z-20"
      >
        <div className="absolute bottom-0 right-0 h-4 w-4 bg-gray-700 rounded-sm translate-x-1/2 translate-y-1/2 shadow-md" />
      </motion.div>
    </div>
  )
}
