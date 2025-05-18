'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface JapaneseOceanProps {
  style?: 'ukiyo-e' | 'modern' | 'minimal' | 'traditional';
}

export default function JapaneseOcean({ style = 'traditional' }: JapaneseOceanProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current || !waveRef.current) return
    
    // Subtle animation for the container
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    })
    
    // Wave animation
    gsap.to(waveRef.current, {
      y: '+=15',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    
    // Background shimmer effect
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: '100px 100px',
        duration: 20,
        repeat: -1,
        ease: 'linear'
      })
    }
    
    return () => {
      gsap.killTweensOf(containerRef.current)
      gsap.killTweensOf(waveRef.current)
      if (bgRef.current) gsap.killTweensOf(bgRef.current)
    }
  }, [])
  
  // Different style configurations
  const styles = {
    'traditional': {
      main: 'bg-gradient-to-b from-blue-800 via-blue-500 to-sky-300',
      waves: '/animations/japanese-ukiyo-wave.json',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM91 60h-2V40h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM39.32 74l-1 1.732-17.32-10L22 64l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM71 80h-2V60h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM120 89v2h-20v-2h20zm-84.134 9.16l-1.732 1-10-17.32 1.732-1 10 17.32zM51 100h-2V80h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM100 109v2H80v-2h20zm19.32 5l-1 1.732-17.32-10 1-1.732 17.32 10zM31 120h-2v-20h2v20z' fill='%23ffffff' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E\")"
    },
    'ukiyo-e': {
      main: 'bg-gradient-to-b from-indigo-900 via-blue-500 to-sky-300',
      waves: '/animations/japanese-ukiyo-wave.json',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM91 60h-2V40h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM39.32 74l-1 1.732-17.32-10L22 64l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM71 80h-2V60h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM120 89v2h-20v-2h20zm-84.134 9.16l-1.732 1-10-17.32 1.732-1 10 17.32zM51 100h-2V80h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM100 109v2H80v-2h20zm19.32 5l-1 1.732-17.32-10 1-1.732 17.32 10zM31 120h-2v-20h2v20z' fill='%23ffffff' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E\")"
    },
    'modern': {
      main: 'bg-gradient-to-b from-blue-900 via-cyan-600 to-teal-300',
      waves: '/animations/japanese-modern-wave.json',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    'minimal': {
      main: 'bg-gradient-to-b from-blue-800 via-blue-400 to-blue-200',
      waves: '/animations/japanese-minimal-wave.json',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
    }
  }
  
  const currentStyle = styles[style]
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 opacity-0 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Ocean background with gradient */}
      <div 
        className={`absolute inset-0 ${currentStyle.main}`}
        ref={bgRef}
        style={{ 
          backgroundImage: currentStyle.pattern,
          zIndex: 1 
        }}
      />
      
      {/* Traditional waves section */}
      {style === 'traditional' ? (
        <div className="traditional-japanese-waves absolute inset-0" style={{ zIndex: 3 }}>
          {/* Background ocean texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-400 to-sky-300 opacity-90"></div>
          
          {/* Bold traditional wave pattern at bottom - Hokusai style */}
          <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden">
            <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="w-full h-full">
              {/* Background waves - lowest dark blue layer */}
              <path d="M0,250 C150,150 350,150 500,250 C650,350 850,350 1000,250 C1150,150 1350,150 1500,250 L1500,400 L0,400 Z" 
                fill="#3b82f6" stroke="#000000" strokeWidth="4" />
              
              {/* Middle wave layer - medium blue */}
              <path d="M-100,270 C50,200 150,200 300,270 C450,340 550,340 700,270 C850,200 950,200 1100,270 C1250,340 1350,340 1500,270 L1500,400 L-100,400 Z" 
                fill="#60a5fa" stroke="#000000" strokeWidth="4" />
              
              {/* Upper wave layer - lighter blue */}
              <path d="M-150,310 C0,260 100,260 250,310 C400,360 500,360 650,310 C800,260 900,260 1050,310 C1200,360 1300,360 1450,310 L1450,400 L-150,400 Z" 
                fill="#93c5fd" stroke="#000000" strokeWidth="4" />
              
              {/* Top foam layer with white caps */}
              <path d="M-200,340 C-100,300 0,300 100,340 C200,380 300,380 400,340 C500,300 600,300 700,340 C800,380 900,380 1000,340 C1100,300 1200,300 1300,340 C1400,380 1500,380 1600,340 L1600,400 L-200,400 Z" 
                fill="#ffffff" stroke="#000000" strokeWidth="4" />
              
              {/* Foam detail lines */}
              <path d="M-100,360 C0,340 100,340 200,360 C300,380 400,380 500,360 C600,340 700,340 800,360 C900,380 1000,380 1100,360 C1200,340 1300,340 1400,360" 
                fill="none" stroke="#000000" strokeWidth="3" strokeDasharray="15,8" />
            </svg>
          </div>
          
          {/* Add whirlpool patterns (larger and more prominent) with faster animation */}
          <div className="traditional-whirlpool absolute top-1/4 left-1/4 w-40 h-40" style={{ animationDuration: '20s' }}></div>
          <div className="traditional-whirlpool absolute bottom-1/3 right-1/4 w-48 h-48" style={{ animationDuration: '24s' }}></div>
          <div className="traditional-whirlpool absolute top-1/3 right-1/3 w-32 h-32 opacity-40" style={{ animationDuration: '18s' }}></div>
          
          {/* More decorative wave circles with animation */}
          <div className="absolute top-1/3 right-1/4 w-40 h-40 opacity-30 animate-pulse" style={{ animationDuration: '4s' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Wave crest lines (Hokusai style) with faster animation */}
          <div className="absolute bottom-60 left-0 right-0 h-40">
            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full opacity-40">
              <path d="M0,50 C50,30 100,70 150,50 C200,30 250,70 300,50 C350,30 400,70 450,50 C500,30 550,70 600,50 C650,30 700,70 750,50 C800,30 850,70 900,50 C950,30 1000,70 1050,50 C1100,30 1150,70 1200,50" 
                fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
          
          {/* Dynamic wave pattern overlays - like the Hokusai reference image with faster animation */}
          <div className="absolute bottom-0 left-0 right-0 h-80 opacity-90" 
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='160' height='80' viewBox='0 0 160 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,40 C20,20 40,20 60,40 C80,60 100,60 120,40 C140,20 160,20 180,40 L180,80 L0,80 Z' fill='none' stroke='%23000000' stroke-width='4'/%3E%3C/svg%3E\")",
              backgroundSize: '160px 80px',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'bottom',
              animation: 'move-waves 10s linear infinite'
            }}
          ></div>
          
          <div className="absolute bottom-30 left-0 right-0 h-60 opacity-70" 
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='120' height='60' viewBox='0 0 120 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,30 C15,15 30,15 45,30 C60,45 75,45 90,30 C105,15 120,15 135,30 L135,60 L0,60 Z' fill='none' stroke='%23ffffff' stroke-width='3'/%3E%3C/svg%3E\")",
              backgroundSize: '120px 60px',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: 'bottom',
              animation: 'move-waves 15s linear infinite reverse'
            }}
          ></div>
          
          {/* Add Japanese-style white spray/foam at wave peaks with faster animation */}
          <div className="absolute bottom-60 left-0 right-0 h-20 opacity-60"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 C5,5 10,15 15,10 C20,5 25,15 30,10 C35,5 40,15 45,10 C50,5 55,15 60,10 C65,5 70,15 75,10 C80,5 85,15 90,10 C95,5 100,15 105,10' stroke='%23ffffff' stroke-width='3' fill='none'/%3E%3C/svg%3E\")",
              backgroundSize: '100px 20px',
              backgroundRepeat: 'repeat-x',
              animation: 'move-waves 8s linear infinite'
            }}
          ></div>
          
          {/* Small dots pattern for water texture */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3Ccircle cx='3' cy='13' r='1'/%3E%3Ccircle cx='13' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: '20px 20px'
            }}
          ></div>
        </div>
      ) : (
        <>
          {/* Light rays effect */}
          <div className="absolute inset-0 underwater-rays opacity-70" style={{ zIndex: 2 }}></div>
          
          {/* Lottie animation waves for other styles */}
          <div
            ref={waveRef}
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{ zIndex: 3 }}
          >
            <Player
              autoplay
              loop
              src={currentStyle.waves}
              style={{ 
                width: '120%', 
                height: '400px', 
                marginLeft: '-10%',
                opacity: 0.85
              }}
            />
          </div>
          
          {/* Add Japanese-style foam patterns at the top of waves */}
          <div 
            className="absolute left-0 right-0 bottom-80 pointer-events-none"
            style={{ zIndex: 4 }}
          >
            <div className="wave-foam-enhanced opacity-60"></div>
          </div>
        </>
      )}
    </div>
  )
} 