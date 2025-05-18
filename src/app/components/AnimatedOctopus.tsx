'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface AnimatedOctopusProps {
  position?: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}

export default function AnimatedOctopus({ 
  position = 'center', 
  size = 'medium',
  delay = 0 
}: AnimatedOctopusProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Set up sizes based on the size prop with significantly increased dimensions
  const dimensions = {
    small: { width: 220, height: 220 },
    medium: { width: 320, height: 320 },
    large: { width: 420, height: 420 },
  }
  
  // Adjust positions to be more visible - move closer to center screen
  const positions = {
    left: { x: '25%', y: '55%' },
    center: { x: '50%', y: '50%' },
    right: { x: '75%', y: '60%' },
  }
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Initial setup
    gsap.set(containerRef.current, {
      x: positions[position].x,
      y: positions[position].y,
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.5,
    })
    
    // Animate in with bounce effect
    const tl = gsap.timeline({ delay })
    
    tl.to(containerRef.current, {
      opacity: 1,
      scale: 1.3, // More dramatic entrance
      duration: 0.6,
      ease: 'back.out(2.5)' // More pronounced bounce
    })
    .to(containerRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    
    // Add floating animation - more pronounced
    gsap.to(containerRef.current, {
      y: `calc(${positions[position].y} - 35px)`, // Larger movement
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
    
    // Add slight rotation for more lively movement
    gsap.to(containerRef.current, {
      rotation: position === 'center' ? 5 : position === 'left' ? 8 : -8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    
    return () => {
      tl.kill()
      gsap.killTweensOf(containerRef.current)
    }
  }, [position, delay])
  
  return (
    <div 
      ref={containerRef}
      className="absolute pointer-events-none octopus-container float-character octopus-glow japanese-bold-border"
      style={{ 
        width: dimensions[size].width, 
        height: dimensions[size].height,
        zIndex: 50, // Higher z-index to ensure visibility against the ocean background
        filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.7)) saturate(2) contrast(1.8)' // Stronger red glow and enhanced colors
      }}
    >
      {/* Red backdrop for stronger color effect */}
      <div className="absolute inset-0 bg-red-700 rounded-full opacity-50 animate-pulse" 
        style={{ animationDuration: '2.5s' }}></div>
      
      {/* Strong black outline for traditional Japanese ukiyo-e style */}
      <div className="absolute inset-2 rounded-full border-[12px] border-black opacity-80"></div>
      
      {/* White highlights to improve contrast */}
      <div className="absolute top-[10%] left-[10%] w-[20%] h-[20%] rounded-full bg-white opacity-30 blur-sm"></div>
      
      <Player
        autoplay
        loop
        src="/animations/Main Scene.json"
        style={{ 
          width: '100%', 
          height: '100%',
          filter: 'contrast(2) brightness(1.4) saturate(2.5)' // Enhanced colors for bold look
        }}
      />
      
      {/* Additional Japanese-style ink splash behind octopus */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30,50 C30,30 70,30 70,50 C70,70 30,70 30,50 Z" fill="#000" />
          <path d="M45,20 C45,10 55,10 55,20 C55,30 45,30 45,20 Z" fill="#000" />
          <path d="M45,80 C45,70 55,70 55,80 C55,90 45,90 45,80 Z" fill="#000" />
          <path d="M20,45 C10,45 10,55 20,55 C30,55 30,45 20,45 Z" fill="#000" />
          <path d="M80,45 C70,45 70,55 80,55 C90,55 90,45 80,45 Z" fill="#000" />
        </svg>
      </div>
    </div>
  )
} 