'use client'

import React from 'react'
import { TextHoverEffect } from '@/components/ui/text-hover-effect'
import { Badge } from "@/components/ui/badge"
import Hero from './components/Hero'
import QuoteLine from './components/QuoteLine'
import Features from './components/Features'

const Page = () => {
  return (
    <div className='bg-slate-900'>
      <Hero />
      <Features/>
      <QuoteLine />
    </div>
  )
}

export default Page