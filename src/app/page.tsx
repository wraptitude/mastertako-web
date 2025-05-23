'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useGLTF, Environment, Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedOctopus from './components/AnimatedOctopus'
import JapaneseWaves from './components/JapaneseWaves'
import Bubbles from './components/Bubbles'
import JapaneseFrame from './components/JapaneseFrame'
import JapaneseOcean from './components/JapaneseOcean'

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Takoyaki 3D Model Component
interface TakoyakiModelProps {
  index?: number;
  delay?: number;
}

function TakoyakiModel({ index = 0, delay = 0 }: TakoyakiModelProps) {
  const { scene } = useGLTF('/models/takoyaki.glb')
  const modelRef = useRef<THREE.Object3D>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  // 預先計算最終位置以保持一致性
  const finalPosition = useMemo(() => ({
    x: (index % 3 - 1) * 3.5,
    y: 0,
    z: -3 - index * 1.5
  }), [index])
  
  useEffect(() => {
    if (!modelRef.current) return
    
    // 初始位置（海底）
    modelRef.current.position.y = -15
    modelRef.current.position.z = -8 - index * 1.5
    modelRef.current.position.x = finalPosition.x
    
    // 初始旋轉 - 增加些微隨機性
    const initialRotX = (Math.random() - 0.5) * 0.2
    const initialRotZ = (Math.random() - 0.5) * 0.2
    modelRef.current.rotation.x = initialRotX
    modelRef.current.rotation.z = initialRotZ
    
    // 跳出海面的動畫 - 優化流暢度與效能
    const tl = gsap.timeline({ 
      delay: delay + index * 0.2, // 縮短延遲時間
      onComplete: () => setAnimationComplete(true),
      defaults: { 
        ease: 'power3.out', // 使用更流暢的緩動函數
        overwrite: 'auto' // 避免動畫衝突
      }
    })
    
    // 建立更流暢的動畫序列
    tl.to(modelRef.current.position, {
      y: 8,
      duration: 1,
    })
    .to(modelRef.current.position, {
      y: finalPosition.y,
      z: finalPosition.z,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)', // 使用彈性效果代替 bounce
    }, "-=0.2") // 稍微提前開始這步
    .to(modelRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=1.2')
    
    // 清理函數
    return () => {
      tl.kill() // 組件卸載時停止動畫
    }
  }, [index, delay, finalPosition])
  
  // 輕微的漂浮動畫 - 優化效能
  useFrame((state) => {
    if (!modelRef.current || !animationComplete) return
    
    // 使用參數化動畫以降低計算量
    const t = state.clock.elapsedTime
    const floatY = Math.sin(t * 0.7 + index) * 0.15 // 減少振幅，提高效能
    const rotX = Math.sin(t * 0.3 + index) * 0.015
    const rotZ = Math.cos(t * 0.2 + index) * 0.01
    
    // 直接設定位置而非累加，避免位置漂移
    modelRef.current.position.y = finalPosition.y + floatY
    modelRef.current.position.x = finalPosition.x
    modelRef.current.position.z = finalPosition.z
    
    // 旋轉設定
    modelRef.current.rotation.x = rotX
    modelRef.current.rotation.z = rotZ
  })
  
  return (
    <primitive 
      object={scene.clone()} 
      ref={modelRef}
      scale={[1, 1, 1]}
      castShadow
      receiveShadow
    />
  )
}

// Ocean Wave Animation Component
function OceanWaves() {
  const oceanRef = useRef<HTMLDivElement>(null)
  const [splashes, setSplashes] = useState<Array<{id: number, x: number, y: number}>>([])
  const nextIdRef = useRef(0)
  
  const createSplash = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!oceanRef.current) return
    
    const rect = oceanRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSplash = {
      id: nextIdRef.current++,
      x,
      y
    }
    
    setSplashes(prev => [...prev, newSplash])
    
    // Remove splash after animation completes
    setTimeout(() => {
      setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id))
    }, 600)
  }
  
  return (
    <div 
      ref={oceanRef} 
      className="ocean relative" 
      onClick={createSplash}
      style={{ overflow: 'hidden', height: '400px' }}
    >
      <div className="absolute inset-0 w-[120%] ml-[-10%] mb-[-100px] overflow-hidden">
        <iframe 
          src="/video-player.html" 
          className="w-full h-[500px]" 
          style={{ 
            border: 'none',
            pointerEvents: 'none'
          }}
        />
      </div>
      
      {/* Render splashes */}
      {splashes.map(splash => (
        <div 
          key={splash.id}
          className="splash"
          style={{
            left: `${splash.x}px`,
            top: `${splash.y}px`,
            zIndex: 10
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Ocean Floor Component
function OceanFloorWave() {
  return (
    <group position={[0, -3, 0]}>
      {/* Beautiful ocean floor with gradient */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial 
          color="#0d9488" 
          metalness={0.4}
          roughness={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Subtle seaweed elements */}
      {Array.from({ length: 12 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 40;
        const height = 2 + Math.random() * 3;
        const swaySpeed = 0.2 + Math.random() * 0.3;
        const swayAmount = 0.2 + Math.random() * 0.3;
        
        return (
          <group key={index} position={[x, 0, z]}>
            <mesh rotation={[0, Math.random() * Math.PI, Math.sin(Date.now() * 0.001 * swaySpeed) * swayAmount]} scale={[0.3, height, 0.3]}>
              <cylinderGeometry args={[0.1, 0.3, 1, 8]} />
              <meshStandardMaterial color={index % 2 === 0 ? "#047857" : "#0f766e"} roughness={0.7} />
            </mesh>
          </group>
        );
      })}
      
      {/* Coral elements */}
      {Array.from({ length: 8 }).map((_, index) => {
        const x = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 30;
        const scale = 0.5 + Math.random() * 0.8;
        
        return (
          <group key={`coral-${index}`} position={[x, 0, z]}>
            <mesh rotation={[0.1, Math.random() * Math.PI, 0.1]} scale={[scale, scale * 0.8, scale]}>
              <sphereGeometry args={[1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={index % 3 === 0 ? "#f97316" : index % 3 === 1 ? "#ef4444" : "#ec4899"} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      
      {/* Underwater wave effect */}
      <Html
        transform
        distanceFactor={20}
        position={[0, 0.5, 0]}
        style={{
          width: '120vw',
          height: '50vh',
          pointerEvents: 'none',
          transform: 'translateY(15%) translateX(-8%)',
          opacity: 0.6
        }}
      >
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <iframe 
            src="/video-player.html" 
            style={{ 
              width: '100%', 
              height: '100%',
              border: 'none',
              filter: 'blur(2px) brightness(1.2)'
            }}
          />
        </div>
      </Html>
    </group>
  )
}

// 醬汁文字動畫效果
function SoySauceText() {
  const textRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!textRef.current) return
    const letters = textRef.current.querySelectorAll('.sauce-letter')
    const sauceBg = textRef.current.querySelectorAll('.sauce-bg')
    
    // 使用高效能的GSAP設定
    const ctx = gsap.context(() => {
      // 清除任何既有動畫
      gsap.killTweensOf([letters, sauceBg])
      
      // 先動畫醬汁背景
      gsap.fromTo(sauceBg, 
        { 
          height: '0%', 
          opacity: 0.7 
        },
        { 
          height: '100%', 
          opacity: 1,
          stagger: 0.06, // 更快的錯開時間
          duration: 0.6, // 更短的動畫時間
          delay: 2.2,
          ease: "power2.out", // 更順暢的動畫曲線
          force3D: true // 啟用硬體加速
        }
      )
      
      // 接著動畫文字
      gsap.fromTo(letters, 
        { 
          opacity: 0, 
          y: 20, // 減少移動距離
          scale: 0.7 // 起始稍微大一點
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          stagger: 0.05, // 更快的錯開時間
          duration: 0.7, // 更短的動畫時間
          delay: 2.5, // 更早開始
          ease: "back.out(1.7)", // 更有彈性的動畫曲線
          force3D: true // 啟用硬體加速
        }
      )
    }, textRef);
    
    // 清理函數
    return () => ctx.revert();
  }, [])
  
  return (
    <div 
      ref={textRef} 
      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-7xl font-bold text-white shake-text"
      style={{ willChange: 'transform' }} // 提示瀏覽器優化渲染
    >
      {["マ", "ス", "タ", "ー", " ", "タ", "コ"].map((letter, i) => (
        <span 
          key={i} 
          className="sauce-letter inline-block relative"
          style={{ willChange: 'transform, opacity' }} // 提示瀏覽器優化渲染
        >
          {letter === " " ? "\u00A0" : letter}
          <div 
            className="sauce-bg absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-orange-800 to-amber-600 origin-bottom z-[-1]"
            style={{ willChange: 'height, opacity' }} // 提示瀏覽器優化渲染
          ></div>
        </span>
      ))}
    </div>
  )
}

// Japanese pattern background component
function JapanesePattern() {
  return (
    <div className="absolute inset-0 japanese-pattern pointer-events-none"></div>
  )
}

// Japanese lantern component
function JapaneseLantern({ position }: { position: 'left' | 'right' }) {
  return (
    <div className={`absolute top-24 ${position === 'left' ? 'left-8' : 'right-8'} w-20 h-28 pointer-events-none`}>
      <div className="w-full h-4 bg-amber-800 rounded-t-full"></div>
      <div className="w-full h-20 bg-gradient-to-b from-red-700 to-red-600 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-full h-full bg-red-800 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" 
          }}></div>
        </div>
        <div className="text-white font-bold text-xl">
          {position === 'left' ? '大' : '当'}
        </div>
      </div>
      <div className="w-full h-4 bg-amber-800 rounded-b-full"></div>
      <div className="w-1 h-10 bg-amber-900 mx-auto"></div>
    </div>
  )
}

// Navigation Component
function Navigation() {
  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      <div className="flex space-x-2">
        <Link 
          href="/menu" 
          className="japanese-button px-4 py-2 rounded-md font-bold flex items-center"
        >
          <span className="mr-1">メニュー</span>
          <span className="text-xs opacity-80">Menu</span>
        </Link>
        <Link 
          href="/about" 
          className="japanese-button px-4 py-2 rounded-md font-bold flex items-center"
        >
          <span className="mr-1">紹介</span>
          <span className="text-xs opacity-80">About</span>
        </Link>
      </div>
    </div>
  )
}

// Menu Item Component for the scrolling section
interface MenuItemProps {
  name: string;
  image: string;
  description: string;
  index: number;
}

function MenuItem({ name, image, description, index }: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!itemRef.current) return
    gsap.fromTo(itemRef.current,
      { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }, [index])
  
  return (
    <motion.div 
      ref={itemRef}
      className="flex flex-col md:flex-row items-center p-6 washi-paper rounded-xl my-8 shadow-xl relative overflow-hidden"
      whileHover={{ scale: 1.03 }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 rotate-45 translate-x-8 -translate-y-8 flex items-end justify-start pb-2 pl-2">
        <span className="text-white font-bold rotate-[-45deg]">特製</span>
      </div>
      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
        <h3 className="text-3xl font-bold text-orange-800 mb-2 relative inline-block">
          {name}
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-amber-500"></div>
        </h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <button className="japanese-button px-4 py-2 mt-2 rounded-md font-bold">
          注文する
        </button>
      </div>
      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} p-4`}>
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 bg-red-600 rounded-full opacity-10 animate-pulse"></div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover rounded-full shadow-lg border-4 border-amber-500"
          />
          <div className="absolute -bottom-2 -right-2 bg-white text-red-600 font-bold text-lg rounded-full w-14 h-14 flex items-center justify-center border-2 border-red-600 rotate-12">
            人氣
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Menu item interface
interface MenuItem {
  name: string;
  image: string;
  description: string;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const oceanContainerRef = useRef<HTMLDivElement>(null) // Reference for ocean container
  
  // Menu items data
  const menuItems: MenuItem[] = [
    {
      name: "Classic Takoyaki",
      image: "/images/classic.jpg",
      description: "Traditional takoyaki with octopus, green onion, and bonito flakes, drizzled with our special sauce."
    },
    {
      name: "Cheese Explosion",
      image: "/images/cheese.jpg",
      description: "Our signature takoyaki filled with melted mozzarella cheese that stretches with every bite!"
    },
    {
      name: "Spicy Dynamite",
      image: "/images/spicy.jpg",
      description: "For heat lovers! Takoyaki with hot sauce inside and topped with spicy mayo."
    }
  ]
  
  useEffect(() => {
    // Set up scroll animations
    if (menuRef.current && oceanContainerRef.current) {
      // Fade in menu section
      gsap.fromTo(
        menuRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          scrollTrigger: {
            trigger: menuRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
      
      // Hide ocean when scrolling down with enhanced transition
      gsap.to(oceanContainerRef.current, {
        opacity: 0,
        y: -50,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: menuRef.current,
          start: "top 95%", // Start hiding when menu section is near viewport
          end: "top 75%",
          scrub: 1.5 // Smoother transition with a slight delay
        }
      })
      
      // Add class to body when scrolled
      const handleScroll = () => {
        // Add or remove class based on scroll position (when scrolling past 100vh)
        if (window.scrollY > window.innerHeight * 0.5) {
          document.body.classList.add('is-scrolled')
        } else {
          document.body.classList.remove('is-scrolled')
        }
      }
      
      // Initial check
      handleScroll()
      
      // Add event listener
      window.addEventListener('scroll', handleScroll)
      
      // Clean up
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])
  
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
    
      {/* All Japanese style ocean background elements - only visible in hero section */}
      <div ref={oceanContainerRef} className="hide-on-scroll">
        {/* Ocean video background */}
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 bg-blue-800 bg-gradient-to-b from-blue-800 via-blue-500 to-sky-300"></div>
          
          {/* Direct video element with fallback waves */}
          <div className="responsive-video-container">
            <video
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/video/octopus_ocean.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      
        {/* Japanese ocean background */}
        {/* <JapaneseOcean style="traditional" /> */}
        
        {/* Add traditional whirlpool patterns */}
        {/* <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
          <div className="traditional-whirlpool absolute top-1/4 left-1/3" style={{ animationDuration: "25s" }}></div>
          <div className="traditional-whirlpool absolute bottom-1/3 right-1/4" style={{ animationDuration: "20s" }}></div>
          <div className="traditional-whirlpool absolute top-2/3 left-1/4 w-32 h-32" style={{ animationDuration: "15s" }}></div>
        </div> */}
        
        {/* Animated Octopus with better visibility */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          {/* Enhanced wave pattern with Hokusai style */}
          {/* <JapaneseWaves position="bottom" color="hokusai" zIndex={15} opacity={0.9} /> */}
          
          {/* Add more octopuses for better visibility */}
          {/* <AnimatedOctopus position="left" size="large" delay={0.5} />
          <AnimatedOctopus position="right" size="medium" delay={1.2} />
          <AnimatedOctopus position="center" size="small" delay={0.8} /> */}
          
          {/* Add bubbles for underwater effect */}
          {/* <Bubbles count={50} /> */}
        </div>
      </div>
      
      {/* Decorative frame */}
      {/* <JapaneseFrame /> */}
      
      {/* Navigation */}
      {/* <Navigation /> */}
      
      {/* Hero section with enhanced ocean */}
      <div 
        ref={containerRef}
        className="w-screen h-screen relative overflow-hidden"
      >
        {/* Floating lanterns in background */}
        {/* <div className="absolute top-[15%] left-[10%] z-5 float-character" style={{ animationDelay: "0.5s" }}>
          <div className="w-16 h-24 relative">
            <div className="w-full h-3 bg-amber-800 rounded-t-full"></div>
            <div className="w-full h-16 bg-red-600 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-repeat" style={{ 
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" 
              }}></div>
              <div className="flex justify-center items-center h-full text-white font-bold">福</div>
            </div>
            <div className="w-full h-3 bg-amber-800 rounded-b-full"></div>
            <div className="w-0.5 h-8 bg-amber-900 mx-auto"></div>
          </div>
        </div> */}
        
        {/* <div className="absolute top-[8%] right-[20%] z-5 float-character" style={{ animationDelay: "1.2s" }}>
          <div className="w-14 h-20 relative">
            <div className="w-full h-3 bg-amber-800 rounded-t-full"></div>
            <div className="w-full h-14 bg-red-600 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-repeat" style={{ 
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" 
              }}></div>
              <div className="flex justify-center items-center h-full text-white font-bold">海</div>
            </div>
            <div className="w-full h-3 bg-amber-800 rounded-b-full"></div>
            <div className="w-0.5 h-7 bg-amber-900 mx-auto"></div>
          </div>
        </div> */}
        
        {/* 3D Scene with simplified ocean floor */}
        {/* <div className="absolute inset-0">
          <Canvas 
            camera={{ position: [0, 2, 12], fov: 65 }} 
            shadows
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.4} color="#a5f3fc" />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1.5}
              color="#0ea5e9"
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight 
              position={[-5, 8, -5]} 
              intensity={1} 
              color="#a5f3fc"
            />
            <spotLight
              position={[0, 15, 0]}
              angle={0.3}
              penumbra={0.8}
              intensity={2}
              color="#38bdf8"
              castShadow
            />
            <fog attach="fog" args={['#164e63', 10, 50]} />
            <Environment preset="night" />
            
            <group position={[0, -3, 0]}>
              <mesh 
                rotation={[-Math.PI / 2, 0, 0]} 
                receiveShadow
              >
                <planeGeometry args={[120, 120]} />
                <meshStandardMaterial 
                  color="#0d9488" 
                  metalness={0.4}
                  roughness={0.6}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              
              {Array.from({ length: 6 }).map((_, index) => {
                const x = (Math.random() - 0.5) * 40;
                const z = (Math.random() - 0.5) * 40;
                const height = 2 + Math.random() * 3;
                const swaySpeed = 0.2 + Math.random() * 0.3;
                const swayAmount = 0.2 + Math.random() * 0.3;
                
                return (
                  <group key={index} position={[x, 0, z]}>
                    <mesh rotation={[0, Math.random() * Math.PI, Math.sin(Date.now() * 0.001 * swaySpeed) * swayAmount]} scale={[0.3, height, 0.3]}>
                      <cylinderGeometry args={[0.1, 0.3, 1, 8]} />
                      <meshStandardMaterial color={index % 2 === 0 ? "#047857" : "#0f766e"} roughness={0.7} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          </Canvas>
        </div> */}
        
        {/* Enhanced underwater bubbles effects - Only in hero section */}
        {/* <Bubbles count={40} /> */}
        
        {/* Light rays effect for underwater ambiance */}
        {/* <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="underwater-rays w-full h-full"></div>
          <div className="underwater-rays w-full h-full" style={{ animationDelay: "2s" }}></div>
          <div className="underwater-rays w-full h-full" style={{ animationDelay: "4s" }}></div>
        </div> */}
        
        {/* Text appearing from sauce */}
        {/* <SoySauceText /> */}
        
        {/* Stamp/seal element */}
        <div className="absolute top-16 right-16 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center rotate-12 shadow-lg border-2 border-amber-500 z-30">
          <div className="text-white font-bold text-center leading-tight">
            <div className="text-xs">本物の</div>
            <div className="text-xl">味</div>
          </div>
        </div>
        
        {/* Scroll indicator with enhanced animation */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center z-40"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <p className="mb-2 font-medium">スクロールして探索</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Menu section with solid background to cover ocean */}
      <div ref={menuRef} className="container mx-auto px-4 py-20 relative bg-gradient-to-b from-blue-900 to-indigo-900">
        <div className="absolute left-0 top-0 w-full h-full japanese-pattern opacity-5 pointer-events-none"></div>
        
        <div className="text-center mb-16 relative">
          <h2 className="text-5xl font-bold text-white inline-block relative">
            メニュー
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-500"></div>
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index}
              name={item.name}
              image={item.image}
              description={item.description}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/menu"
            className="japanese-button px-8 py-3 rounded-md font-bold text-lg inline-flex items-center"
          >
            <span className="mr-2">完全なメニューを見る</span>
            <span className="text-sm">See Full Menu</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
      {/* Contact section */}
      <div className="bg-blue-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g fill="white" fillRule="evenodd">
              <path d="M30 5L25 10M30 5L35 10M30 5V15M5 30L10 25M5 30L10 35M5 30H15M55 30L50 25M55 30L50 35M55 30H45M30 55L25 50M30 55L35 50M30 55V45" 
                stroke="white" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-full md:w-1/2 max-w-md">
              <h2 className="text-4xl font-bold mb-8 relative inline-block">
                マスタータコにお越しください
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-amber-500"></div>
              </h2>
              <p className="text-xl mb-4 font-medium">7700 Markham Rd, Markham, ON</p>
              <p className="text-lg mb-6">営業時間: 月-金 11:00-21:00 / 土-日 10:00-22:00</p>
              <a 
                href="https://www.instagram.com/mastertako.markham/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xl hover:text-amber-300 transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                @mastertako.markham
              </a>
              
              <div className="mt-8">
                <Link 
                  href="/about"
                  className="japanese-button px-6 py-2 rounded-md font-bold inline-flex items-center"
                >
                  <span className="mr-2">私たちについて</span>
                  <span className="text-sm">Learn About Us</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 max-w-md flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs rotate-2">
                <div className="bg-white p-2 border-2 border-gray-300">
                  <img src="/images/chef.jpg" alt="Our Chef" className="w-full h-auto" />
                  <div className="mt-2 text-center text-black">
                    <p className="font-bold">マスタシェフ - タケシ</p>
                    <p className="text-sm text-gray-700">タコ焼きの達人</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with Japanese pattern */}
      <div className="bg-blue-900 py-6 text-white">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2024 マスタータコ - Markham&apos;s 本格的なたこ焼き</p>
        </div>
      </div>
      
      {/* Add CSS for wave animations */}
      <style jsx global>{`
        .css-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' fill='%23ffffff' opacity='0.25'/%3E%3C/svg%3E");
          background-size: 1200px 100px;
          animation: wave-animation 15s linear infinite;
        }
        
        .wave1 {
          bottom: 0;
          opacity: 0.5;
          animation: wave-animation 20s linear infinite;
        }
        
        .wave2 {
          bottom: 10px;
          opacity: 0.7;
          animation: wave-animation 18s linear infinite reverse;
        }
        
        .wave3 {
          bottom: 20px;
          opacity: 0.3;
          animation: wave-animation 15s linear infinite;
        }
        
        @keyframes wave-animation {
          0% {
            background-position-x: 0;
          }
          100% {
            background-position-x: 1200px;
          }
        }
      `}</style>
    </div>
  )
}
