'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SwirlingVoiceBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const words = [
    "Vibrant", "Creative", "Voice", "Podcast", "Hub", "Stories", 
    "Voz", "Histórias", "Criatividade", "Som", "Áudio", "Vibe"
  ]

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Central Swirling Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[1000px]">
        {/* Animated Rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            animate={{
              rotate: ring % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + ring * 10,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute inset-0 rounded-full border border-primary/10"
            style={{
              margin: `${ring * 10}%`,
              opacity: 0.4 / ring
            }}
          />
        ))}

        {/* Rotating Words */}
        {words.map((word, index) => {
          const angle = (index / words.length) * 360
          const radius = 35 + (index % 3) * 5 // Varied radius

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                rotate: 360
              }}
              transition={{
                opacity: {
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                },
                rotate: {
                  duration: 40 + (index % 5) * 10,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
              className="absolute top-1/2 left-1/2 font-black text-primary/20 whitespace-nowrap uppercase tracking-[0.5em] text-sm"
              style={{
                originX: "0px",
                originY: "0px",
                transform: `rotate(${angle}deg) translateX(${radius}%)`,
                filter: "blur(1px)"
              }}
            >
              {word}
            </motion.div>
          )
        })}

        {/* Pulsing Voice Core */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-[100px]"
        />
      </div>
    </div>
  )
}
