'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

  // Story timeline data
  const storyTimeline = [
    {
      year: '2018',
      title: 'Our Beginning',
      description: 'Master Tako was born from a deep love for traditional Japanese street food. Our founder visited Osaka and fell in love with the art of takoyaki making.'
    },
    {
      year: '2019',
      title: 'Perfecting the Recipe',
      description: 'After months of testing and perfecting our recipes, we created our signature takoyaki - crispy outside, soft inside, with the perfect balance of flavors.'
    },
    {
      year: '2020',
      title: 'Pop-up Success',
      description: 'We started with pop-up events around Toronto, quickly gaining a dedicated following of takoyaki enthusiasts.'
    },
    {
      year: '2021',
      title: 'Markham Location',
      description: 'Due to popular demand, we opened our first permanent location in Markham, bringing authentic takoyaki to the community.'
    },
    {
      year: '2023',
      title: 'Menu Expansion',
      description: 'We expanded our menu to include more creative takoyaki variations while staying true to our authentic roots.'
    }
  ]

  // Making process steps
  const makingSteps = [
    {
      number: 1,
      title: 'The Batter',
      description: 'We prepare our special batter using imported Japanese flour and dashi for an authentic flavor base.'
    },
    {
      number: 2,
      title: 'Fresh Ingredients',
      description: 'We add fresh octopus, green onions, and tempura scraps to each ball.'
    },
    {
      number: 3,
      title: 'Cooking with Care',
      description: 'Each takoyaki is cooked in our special cast iron pans and flipped multiple times to achieve the perfect shape and texture.'
    },
    {
      number: 4,
      title: 'Finishing Touches',
      description: 'We top each ball with our homemade sauces, bonito flakes, seaweed, and green onions for the perfect finish.'
    }
  ]

  // Team members
  const teamMembers = [
    {
      name: 'Chef Takashi',
      role: 'Master Chef',
      image: '/images/chef.jpg',
      description: 'Trained in Osaka, Chef Takashi brings 15 years of takoyaki expertise to every ball we make.'
    },
    {
      name: 'Lisa Wong',
      role: 'Manager',
      image: '/images/manager.jpg',
      description: 'Lisa ensures our shop runs smoothly and that every customer leaves with a smile.'
    },
    {
      name: 'David Chen',
      role: 'Creative Chef',
      image: '/images/creative-chef.jpg',
      description: 'David develops our innovative takoyaki variations that surprise and delight our customers.'
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

    // Animate the story timeline
    if (storyRef.current) {
      const timelineItems = storyRef.current.querySelectorAll('.timeline-item')
      gsap.fromTo(
        timelineItems,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top center+=100',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }

    // Animate the making steps
    if (stepsRef.current) {
      const steps = stepsRef.current.querySelectorAll('.step-item')
      gsap.fromTo(
        steps,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.7,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top center+=100',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }

    // Animate the team members
    if (teamRef.current) {
      const members = teamRef.current.querySelectorAll('.team-member')
      gsap.fromTo(
        members,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top center+=100',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }
  }, [])

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

      <div ref={containerRef} className="container mx-auto px-4 py-20">
        <div ref={headerRef} className="text-center mb-16">
          <motion.h1 
            className="text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our Story
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Bringing the authentic flavors of Osaka street food to Markham
          </motion.p>
        </div>

        {/* Story Timeline */}
        <div ref={storyRef} className="mb-20">
          <h2 className="text-4xl font-bold mb-10 text-center">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-400 rounded"></div>

            {/* Timeline items */}
            {storyTimeline.map((item, index) => (
              <div 
                key={index} 
                className={`timeline-item relative flex mb-16 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                  <div className="bg-orange-800 p-6 rounded-lg shadow-lg">
                    <span className="text-orange-300 text-2xl font-bold">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-6 h-6 bg-orange-300 rounded-full border-4 border-orange-700"></div>

                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Making Process */}
        <div ref={stepsRef} className="mb-20">
          <h2 className="text-4xl font-bold mb-10 text-center">How We Make Takoyaki</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {makingSteps.map((step, index) => (
              <div key={index} className="step-item bg-orange-800 bg-opacity-70 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold mr-4">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div ref={teamRef}>
          <h2 className="text-4xl font-bold mb-10 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} 
                className="team-member bg-orange-800 bg-opacity-70 rounded-lg overflow-hidden shadow-lg"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-64 overflow-hidden">
                  <div 
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-orange-300 mb-3">{member.role}</p>
                  <p>{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 