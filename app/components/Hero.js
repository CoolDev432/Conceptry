'use client'

import React from 'react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navigation from './Navigation'

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden border-2 border-white border-dotted">

      <div className="h-full flex flex-col justify-center items-center text-center px-4">
        <Badge variant="outline" className="mt-12 p-2 sm:p-3 text-base sm:text-xl">
          Made By A Student, For A Student
        </Badge>

        <motion.h1 className="font-bold text-4xl sm:text-5xl mt-3 lg:text-7xl max-w-4xl" initial={{
          y: 50,
          opacity: 0
        }} animate={{
          y:30,
          opacity: 1
        }} transition={{
          duration: 2
        }}>
          The New Way To{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-400 inline-block text-transparent bg-clip-text">
            Learn
          </span>
          .
        </motion.h1>

        <Navigation/>
        <TextHoverEffect text="Conceptry" />
        <div className='absolute w-140 mt-102'>
        </div>


      </div>
    </div>
  )
}

export default Hero
