'use client'

import { useEffect, useState, useMemo, memo, useRef } from 'react'

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  wander: number;
  opacity: number;
  type: 'normal' | 'group' | 'tiny';
  animationType?: 'rise' | 'float' | 'bounce';
  rotation?: number;
  innerBubbles?: {
    width: string;
    height: string;
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
    animationDelay: string;
  }[];
}

// Memoized individual bubble component for better performance
const BubbleItem = memo(({ bubble }: { bubble: Bubble }) => {
  // Calculate animation style based on bubble type
  const animationStyle = useMemo(() => {
    const baseStyle = {
      width: `${bubble.size}px`,
      height: `${bubble.size}px`,
      left: `${bubble.left}%`,
      opacity: bubble.opacity,
      '--wander': `${bubble.wander}`,
    } as React.CSSProperties;
    
    // Apply different animation styles based on type
    if (bubble.animationType === 'float') {
      return {
        ...baseStyle,
        animation: `bubble-float ${bubble.duration}s infinite ease-in-out`,
        animationDelay: `${bubble.delay}s`,
        transform: `rotate(${bubble.rotation}deg)`,
      };
    } else if (bubble.animationType === 'bounce') {
      return {
        ...baseStyle,
        animation: `bubble-rise ${bubble.duration * 0.7}s infinite ease-in-out alternate`,
        animationDelay: `${bubble.delay}s`,
      };
    } else {
      return {
        ...baseStyle,
        animationDuration: `${bubble.duration}s`,
        animationDelay: `${bubble.delay}s`,
      };
    }
  }, [bubble]);
  
  return (
    <div
      className={`bubble bubble-${bubble.type} ${bubble.animationType === 'float' ? 'bubble-float' : ''}`}
      style={animationStyle}
    >
      {/* Create interior bubbles for group type */}
      {bubble.type === 'group' && bubble.innerBubbles && bubble.innerBubbles.map((innerBubble, index) => (
        <div 
          key={index}
          className="inner-bubble" 
          style={{
            width: innerBubble.width,
            height: innerBubble.height,
            top: innerBubble.top,
            left: innerBubble.left,
            bottom: innerBubble.bottom,
            right: innerBubble.right,
            animation: 'enhanced-foam 3s infinite ease-in-out',
            animationDelay: innerBubble.animationDelay
          }}
        />
      ))}
    </div>
  );
});

BubbleItem.displayName = 'BubbleItem';

export default function Bubbles({ count = 25 }: { count?: number }) {
  const [isClient, setIsClient] = useState(false);
  const bubblesRef = useRef<Bubble[]>([]);
  
  // Generate bubbles only once, and only client-side
  useEffect(() => {
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < count; i++) {
      // Determine bubble type for more variety
      const type = Math.random() > 0.7 
        ? (Math.random() > 0.5 ? 'group' : 'tiny') 
        : 'normal';
      
      // Choose a random animation type for more dynamic movement
      const animationType = Math.random() > 0.6 
        ? (Math.random() > 0.5 ? 'float' : 'bounce') 
        : 'rise';
      
      const bubble: Bubble = {
        id: i,
        // Size based on type
        size: type === 'normal' 
          ? Math.random() * 25 + 10 // 10-35px for normal
          : type === 'group' 
            ? Math.random() * 40 + 25 // 25-65px for groups
            : Math.random() * 7 + 2, // 2-9px for tiny
        left: Math.random() * 100, // 0-100%
        duration: type === 'tiny'
          ? Math.random() * 5 + 6 // 6-11s for tiny (faster)
          : Math.random() * 8 + 8, // 8-16s for normal/group (faster)
        delay: Math.random() * 10, // 0-10s (reduced for faster initial appearance)
        wander: Math.random() * 4 - 2, // -2 to 2 (more movement)
        opacity: 0.2 + Math.random() * 0.6, // Varying opacity 0.2-0.8
        type,
        animationType,
        rotation: Math.random() * 180, // Random rotation for float animation
      };
      
      // Add inner bubbles only for group type with predefined values
      if (type === 'group') {
        bubble.innerBubbles = [
          {
            width: '40%',
            height: '40%',
            top: '15%',
            left: '20%',
            animationDelay: `${Math.random() * 2}s`
          },
          {
            width: '30%',
            height: '30%',
            bottom: '20%',
            right: '25%',
            animationDelay: `${Math.random() * 2}s`
          }
        ];
      }
      
      newBubbles.push(bubble);
    }
    
    bubblesRef.current = newBubbles;
    setIsClient(true);
  }, [count]);
  
  // Don't render anything during SSR to avoid hydration mismatch
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="bubble-container">
      {bubblesRef.current.map(bubble => (
        <BubbleItem key={bubble.id} bubble={bubble} />
      ))}
    </div>
  );
} 