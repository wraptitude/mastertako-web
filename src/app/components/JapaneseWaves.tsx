'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface JapaneseWavesProps {
  position?: 'top' | 'middle' | 'bottom';
  zIndex?: number;
  color?: 'blue' | 'turquoise' | 'navy' | 'hokusai';
  opacity?: number;
}

interface FoamBubble {
  id: number;
  width: number;
  height: number;
  left: string;
  bottom: string;
  animationDuration: string;
  animationDelay: string;
}

export default function JapaneseWaves({ 
  position = 'bottom',
  zIndex = 10,
  color = 'hokusai',
  opacity = 1
}: JapaneseWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [foamBubbles, setFoamBubbles] = useState<FoamBubble[]>([])
  const [isClient, setIsClient] = useState(false)
  
  // Set up positions based on the position prop
  const positions = {
    top: { y: '30%' },
    middle: { y: '60%' },
    bottom: { y: '85%' },
  }
  
  // Enhanced color themes based on the color prop
  const colors = {
    'blue': 'japanese-waves-container wave-blue',
    'turquoise': 'japanese-waves-container wave-turquoise',
    'navy': 'japanese-waves-container wave-navy',
    'hokusai': 'japanese-waves-container traditional-japanese-waves'
  }
  
  // Generate foam bubbles on client-side only
  useEffect(() => {
    // Create random foam bubbles
    const bubbles: FoamBubble[] = Array.from({ length: 8 }).map((_, index) => ({
      id: index,
      width: 10 + Math.random() * 15,
      height: 10 + Math.random() * 15,
      left: `${Math.random() * 100}%`,
      bottom: `${30 + Math.random() * 40}%`,
      animationDuration: `${5 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 2}s`
    }))
    
    setFoamBubbles(bubbles)
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Initial animation with more subtle entrance
    gsap.from(containerRef.current, {
      opacity: 0,
      y: '+=30',
      duration: 1.5, // Faster animation
      ease: 'power2.out'
    })
    
    // More dynamic wave movement
    gsap.to(containerRef.current, {
      x: '+=20', // Increased movement
      duration: 8, // Faster animation
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    
    // Add vertical bobbing movement for more dynamism
    gsap.to(containerRef.current, {
      y: '+=10',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    
    return () => {
      gsap.killTweensOf(containerRef.current)
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className={`absolute w-full pointer-events-none ${colors[color]}`}
      style={{ 
        bottom: 0,
        left: '-25%', 
        height: '95vh',
        width: '150%',
        zIndex,
        opacity
      }}
    >
      {/* Add gradient overlay for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-t" 
        style={{ 
          background: color === 'blue' 
            ? 'linear-gradient(to top, rgba(59,130,246,0.05), rgba(59,130,246,0))' 
            : color === 'turquoise' 
              ? 'linear-gradient(to top, rgba(20,184,166,0.05), rgba(20,184,166,0))' 
              : color === 'hokusai'
                ? 'linear-gradient(to top, rgba(96,165,250,0.1), rgba(147,197,253,0.05), rgba(186,230,253,0))'
                : 'linear-gradient(to top, rgba(30,58,138,0.05), rgba(30,58,138,0))',
          zIndex: 5
        }}
      />
      
      {color === 'hokusai' ? (
        <>
          {/* Hokusai-style waves for traditional look */}
          <div className="absolute bottom-0 w-full h-full overflow-hidden">
            {/* Main wave patterns with strong outlines */}
            <div className="absolute bottom-0 left-0 w-[120%] h-80" style={{ transform: 'translateX(-10%)' }}>
              <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="w-full h-full">
                {/* Bottom blue wave */}
                <path d="M0,250 C150,150 350,150 500,250 C650,350 850,350 1000,250 C1150,150 1350,150 1500,250 L1500,400 L0,400 Z" 
                  fill="#3b82f6" stroke="#000000" strokeWidth="4" />
                
                {/* Middle medium blue wave */}
                <path d="M-100,290 C50,220 150,220 300,290 C450,360 550,360 700,290 C850,220 950,220 1100,290 C1250,360 1350,360 1500,290 L1500,400 L-100,400 Z" 
                  fill="#60a5fa" stroke="#000000" strokeWidth="4" />
                
                {/* Top light blue wave */}
                <path d="M-150,320 C0,270 100,270 250,320 C400,370 500,370 650,320 C800,270 900,270 1050,320 C1200,370 1300,370 1450,320 L1450,400 L-150,400 Z" 
                  fill="#93c5fd" stroke="#000000" strokeWidth="3.5" />
                
                {/* White foam layer */}
                <path d="M-200,350 C-100,320 0,320 100,350 C200,380 300,380 400,350 C500,320 600,320 700,350 C800,380 900,380 1000,350 C1100,320 1200,320 1300,350 C1400,380 1500,380 1600,350 L1600,400 L-200,400 Z" 
                  fill="#ffffff" stroke="#000000" strokeWidth="3" />
                
                {/* Detail lines in the waves */}
                <path d="M-100,370 C0,350 100,350 200,370 C300,390 400,390 500,370 C600,350 700,350 800,370 C900,390 1000,390 1100,370 C1200,350 1300,350 1400,370" 
                  fill="none" stroke="#000000" strokeWidth="2" strokeDasharray="10,5" />
              </svg>
            </div>
            
            {/* Additional wave patterns with faster animations */}
            <div className="absolute bottom-20 left-0 w-full">
              <div className="hokusai-wave-crest absolute bottom-40 left-0 w-full" style={{ animation: 'move-waves 12s linear infinite' }}></div>
              <div className="hokusai-foam absolute bottom-20 left-0 w-full" style={{ animation: 'move-waves 8s linear infinite' }}></div>
            </div>
            
            {/* More dynamic circular whirlpool patterns */}
            <div className="traditional-whirlpool absolute bottom-1/3 left-1/4 w-40 h-40" style={{ animationDuration: '20s' }}></div>
            <div className="traditional-whirlpool absolute bottom-1/4 right-1/3 w-36 h-36" style={{ animationDuration: '15s' }}></div>
            <div className="traditional-whirlpool absolute top-1/2 right-1/4 w-28 h-28" style={{ animationDuration: '10s', opacity: 0.3 }}></div>
            
            {/* Add floating foam bubbles - client-side only */}
            {isClient && (
              <div className="absolute w-full h-full">
                {foamBubbles.map((bubble) => (
                  <div 
                    key={bubble.id}
                    className="absolute rounded-full bg-white opacity-20"
                    style={{
                      width: `${bubble.width}px`,
                      height: `${bubble.height}px`,
                      left: bubble.left,
                      bottom: bubble.bottom,
                      animation: `float-animation ${bubble.animationDuration} infinite ease-in-out`,
                      animationDelay: bubble.animationDelay
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <Player
          autoplay
          loop
          src="/animations/japanese-wave.json"
          style={{ 
            width: '120%', 
            height: '100%',
            marginLeft: '-10%',
            position: 'absolute',
            bottom: positions[position].y,
            transform: 'translateY(50%)',
            filter: 'blur(0.5px)' // Subtle blur for softer edges
          }}
        />
      )}
      
      {/* Enhanced decorative foam elements on top of waves */}
      <div className="absolute top-0 left-0 w-full h-16 overflow-hidden" style={{ opacity: 0.8 }}>
        <div className="wave-foam-enhanced" style={{ animation: 'wave-foam-enhanced 8s linear infinite' }}></div>
      </div>
      
      {/* Add subtle reflection effect */}
      <div className="absolute w-full h-20 bottom-0 overflow-hidden opacity-30"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
          transform: 'scaleY(0.3) translateY(-50%)',
          transformOrigin: 'bottom',
          filter: 'blur(1px)'
        }}>
      </div>
    </div>
  )
} 