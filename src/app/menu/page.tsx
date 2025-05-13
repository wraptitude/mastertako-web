'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Menu item interface
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  ingredients: string[];
  image: string;
}

export default function MenuPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Sample menu data
  const menuItems: MenuItem[] = [
    {
      id: 'classic',
      name: 'Classic Takoyaki',
      description: 'Our signature dish. Perfectly crispy on the outside, soft and gooey on the inside, with fresh octopus chunks.',
      price: '$7.50',
      ingredients: ['Octopus', 'Green Onion', 'Tempura Scraps', 'Pickled Ginger'],
      image: '/images/classic.jpg'
    },
    {
      id: 'cheese',
      name: 'Cheese Explosion',
      description: 'The perfect combination of traditional takoyaki with melted cheese inside that stretches with every bite!',
      price: '$8.50',
      ingredients: ['Octopus', 'Mozzarella Cheese', 'Green Onion', 'Special Sauce'],
      image: '/images/cheese.jpg'
    },
    {
      id: 'spicy',
      name: 'Spicy Dynamite',
      description: 'For those who enjoy a bit of heat! Our takoyaki with spicy sauce that will make your taste buds dance.',
      price: '$8.00',
      ingredients: ['Octopus', 'Spicy Mayo', 'Chili Oil', 'Spicy Powder'],
      image: '/images/spicy.jpg'
    },
    {
      id: 'veggie',
      name: 'Veggie Delight',
      description: 'A vegetarian option filled with delicious vegetables and tofu instead of octopus.',
      price: '$7.00',
      ingredients: ['Tofu', 'Sweet Corn', 'Bell Pepper', 'Shiitake Mushroom'],
      image: '/images/veggie.jpg'
    },
    {
      id: 'teriyaki',
      name: 'Teriyaki Fusion',
      description: 'Our classic takoyaki drizzled with sweet teriyaki sauce for a unique flavor twist.',
      price: '$8.00',
      ingredients: ['Octopus', 'Teriyaki Sauce', 'Seaweed', 'Sesame Seeds'],
      image: '/images/teriyaki.jpg'
    }
  ]

  useEffect(() => {
    if (!containerRef.current) return

    // Animate the header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power2.out' 
        }
      )
    }

    // Create animations for each menu item
    const menuItems = containerRef.current.querySelectorAll('.menu-item')
    menuItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { 
          x: index % 2 === 0 ? -100 : 100, 
          opacity: 0 
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Animate ingredients to pop up one by one
      const ingredients = item.querySelectorAll('.ingredient')
      gsap.fromTo(
        ingredients,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top center',
            toggleActions: 'play none none reverse',
          }
        }
      )
    })
  }, [])

  // Splitting animation for text
  const splitLetters = (text: string) => {
    return text.split('').map((letter, index) => (
      <motion.span 
        key={index} 
        className="inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.04,
          ease: [0.6, 0.01, -0.05, 0.95]
        }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </motion.span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-orange-700 text-white">
      {/* Back to home button */}
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href="/"
          className="flex items-center text-white hover:text-orange-200 transition-colors duration-300"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            {splitLetters('Our Menu')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Each takoyaki is handcrafted with love and care, following traditional Japanese recipes with our special Master Tako twist.
          </p>
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto">
          {menuItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`menu-item bg-orange-800 bg-opacity-70 rounded-xl p-8 mb-12 shadow-xl flex flex-col md:flex-row ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              <div className="md:w-2/5 flex justify-center mb-6 md:mb-0">
                <div className="relative w-64 h-64 overflow-hidden rounded-full shadow-lg">
                  <motion.div 
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${item.image})` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="md:w-3/5 md:px-6 flex flex-col justify-center">
                <motion.h2 
                  className="text-3xl font-bold mb-2"
                  whileHover={{ scale: 1.05, originX: 0 }}
                >
                  {item.name}
                </motion.h2>
                <p className="text-orange-200 text-2xl mb-2">{item.price}</p>
                <p className="mb-4">{item.description}</p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, i) => (
                      <span 
                        key={i} 
                        className="ingredient inline-block bg-orange-600 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 