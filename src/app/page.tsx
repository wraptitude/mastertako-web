'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

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
      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-7xl font-bold text-white"
      style={{ willChange: 'transform' }} // 提示瀏覽器優化渲染
    >
      {/* {["M", "A", "S", "T", "E", "R", " ", "T", "A", "K", "O"].map((letter, i) => (
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
      ))} */}
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
      className="flex flex-col md:flex-row items-center p-6 bg-orange-100 bg-opacity-80 rounded-xl my-8 shadow-xl"
      whileHover={{ scale: 1.03 }}
    >
      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
        <h3 className="text-3xl font-bold text-orange-800 mb-2">{name}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
      </div>
      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} p-4`}>
        <div className="relative w-64 h-64 mx-auto">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover rounded-full shadow-lg"
          />
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
    // Set intro as complete after animation finishes
    // const timer = setTimeout(() => {
    //   setIsIntroComplete(true)
    // }, 4000)
    
    // Set up scroll animations
    if (menuRef.current) {
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
    }
    
    // return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 to-blue-500 overflow-x-hidden">
      {/* Hero section with 3D models */}
      <div 
        ref={containerRef}
        className="w-screen h-screen relative overflow-hidden"
      >
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Canvas 
            camera={{ position: [0, 2, 12], fov: 65 }} 
            shadows
          >
            {/* Improved lighting setup */}
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight 
              position={[-5, 5, -5]} 
              intensity={0.5} 
              color="#5b88ff"
            />
            <Environment preset="sunset" />
            
            {/* Ocean floor */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -3, 0]}
              receiveShadow
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial 
                color="#1e3a8a" 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            
            {/* Multiple Takoyaki models jumping out */}
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TakoyakiModel key={index} index={index} delay={1} />
            ))}

          </Canvas>
        </div>
        
        {/* Water splash animation */}
        <div 
          ref={splashRef} 
          className="absolute bottom-0 left-0 w-full h-64 pointer-events-none"
        >
          <Player
            autoplay
            loop
            src="/animations/splash.json"
            style={{ width: '100%', height: '100%' }}
          />
          
        </div>
        
        {/*  text appearing from sauce */}
        <SoySauceText />
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <p className="mb-2">Scroll to explore</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
      
      {/* Menu section */}
      <div ref={menuRef} className="container mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-white text-center mb-16">Our Menu</h2>
        
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
      </div>
      
      {/* Contact section */}
      <div className="bg-orange-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Visit Master Tako</h2>
          <p className="text-xl mb-4">7700 Markham Rd, Markham, ON</p>
          <a 
            href="https://www.instagram.com/mastertako.markham/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xl hover:text-orange-300 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            @mastertako.markham
          </a>
        </div>
      </div>
    </div>
  )
}
