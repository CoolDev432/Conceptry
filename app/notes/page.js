'use client'

import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Notes = () => {
  const { user, isLoaded } = useUser()
  const [notes, setNotes] = useState([])
  const router = useRouter()

  const handleRedirection = (id) => {
    router.push(`/notesView?id=${id}`)
  }

  const fetchNotes = async () => {
    if (!user) return
    try {
      const email = user.emailAddresses?.[0]?.emailAddress
      const res = await fetch(`/api/getNotes?email=${email}`)
      const resJSON = await res.json()

      if (!res.ok || !Array.isArray(resJSON.documents)) {
        console.error('Unexpected response:', resJSON)
        setNotes([])
        return
      }

      setNotes(resJSON.documents)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
      setNotes([]) // fallback to empty array
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchNotes()
    }
  }, [isLoaded, user])

  return (
    <div className='p-6 sm:p-10 min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white'>
      <div className='text-center mb-10'>
        <h1 className='text-5xl sm:text-7xl font-extrabold tracking-tight'>
          Your <span className='bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text'>Notes.</span>
        </h1>
        <p className='mt-4 text-gray-400 text-lg'>All your thoughts in one place. 🧠</p>
      </div>

      <div className='grid gap-6 sm:grid-cols-3 lg:grid-cols-3'>
        {!isLoaded ? (
          <p className="text-center text-gray-400 col-span-full">Loading...</p>
        ) : Array.isArray(notes) && notes.length > 0 ? (
          notes.map((item) => (
            <div
              key={item.$id}
              role="button"
              tabIndex={0}
              onClick={() => handleRedirection(item.$id)}
              onKeyDown={(e) => e.key === 'Enter' && handleRedirection(item.$id)}
              className='bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500 transition-all duration-300 p-6 rounded-2xl shadow-xl hover:scale-[1.02] cursor-pointer'
            >
              <h2 className='text-2xl font-semibold text-white mb-2'>{item.head}</h2>
            </div>
          ))
        ) : (
          <p className='text-gray-500 col-span-full text-center'>No notes found.</p>
        )}
      </div>
    </div>
  )
}

export default Notes
