'use client'

import React, { useState, useEffect } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Reminder from './Reminder'

const MainContent = () => {
  const { user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [head, setHead] = useState('')
  const [noteCreated, setNoteCreated] = useState(false)
  const [Five, setFive] = useState(false)
  const [examMode, setExamMode] = useState(false)

  const email = user?.emailAddresses[0].emailAddress

  useEffect(() => {
    console.log("Current value of Five:", Five)
    console.log("Current value of Exam Mode:", examMode)
  }, [Five, examMode])

  async function handleNoteCreation() {
    if (!prompt || !head || !email) {
      alert('Please fill in all fields.')
      return
    }

    const res = await fetch(
      `/api/createNote?prompt=${encodeURIComponent(prompt)}&head=${encodeURIComponent(head)}&email=${encodeURIComponent(email)}&child=${Five ? 'true' : 'false'}&exam=${examMode ? 'true' : 'false'}`
    )
    const resJSON = await res.json()
    console.log(resJSON)

    setNoteCreated(true)
    setTimeout(() => setNoteCreated(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {noteCreated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-green-600 text-white p-4 w-fit rounded-full fixed top-20 left-1/2 transform -translate-x-1/2 z-50 shadow-lg"
          >
            Note Has Been Created! Go to the notes section.
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full sticky top-0 z-40 bg-black/60 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-xl font-bold text-white">
            Conceptry
          </Link>
          <div className="flex flex-wrap gap-6 items-center justify-center text-sm md:text-base">
            <Link href="/yourNotebooks" className="hover:scale-110 transition-all">Conceptboards</Link>
            <Link href="/sharedNotes" className="hover:scale-110 transition-all">Shared Notes</Link>
            <Link href="/notes" className="hover:scale-110 transition-all">Notes</Link>
            <Link href="/doubtOut" className="hover:scale-110 transition-all">DoubtOut</Link>
            <Link href="/reminder" className="hover:scale-110 transition-all">Reminders</Link>
            <Link href="/classes" className="hover:scale-110 transition-all">Classes</Link>
            <span className="hidden md:inline-block">|</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">{user?.firstName}</span>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center px-4 py-12 text-center">
        {user && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg text-gray-300 mb-4"
          >
            Hey, <span className="font-semibold">{user.firstName || user.username}</span> 👋
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text"
        >
          Dashboard.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg sm:text-xl text-gray-300 max-w-xl"
        >
          What do you need help with today?
        </motion.p>

        <motion.div className="mt-6 w-full max-w-md flex flex-col items-center gap-4">

          <Button
            variant="outline"
            className={`cursor-pointer ${Five ? 'border-yellow-600 border' : 'border-white/20'}`}
            onClick={() => setFive(!Five)}
          >
            {Five ? "Explaining Like You're 5 ✔️" : "Explain To Me Like I'm 5"}
          </Button>

          <Button
            variant="outline"
            className={`cursor-pointer ${examMode ? 'border-red-500 border' : 'border-white/20'}`}
            onClick={() => setExamMode(!examMode)}
          >
            {examMode ? "Exam Mode On 📝" : "Exam Mode"}
          </Button>

          <motion.input
            className="p-4 w-full font-semibold text-white border border-white rounded-lg bg-transparent placeholder-gray-400"
            placeholder="Type the concept you need help with."
            onChange={(e) => setPrompt(e.target.value)}
          />
          <motion.input
            className="p-4 w-full font-semibold text-white border border-white rounded-lg bg-transparent placeholder-gray-400"
            placeholder="Type the head of your note."
            onChange={(e) => setHead(e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full sm:w-auto hover:scale-105 transition-transform cursor-pointer"
            onClick={handleNoteCreation}
          >
            Go!
          </Button>
        </motion.div>
      </section>

      {/* Reminders section added here */}
      <section className="px-4 py-12">
        <Reminder />
      </section>
    </div>
  )
}

export default MainContent
