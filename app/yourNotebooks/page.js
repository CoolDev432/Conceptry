'use client'
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Boards from './components/Boards'

const Notebooks = () => {
  const { user, isLoaded } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [boardName, setBoardName] = useState('')

  const handleAddBoard = async () => {
    if (!boardName) {
      alert('Please enter a name!')
      return
    }

    try {
      await fetch(`/api/createBoard?boardName=${boardName}&name=${user?.firstName}`)
      setShowModal(false)
      setBoardName('')
      alert('Conceptboard created successfully!');
    } catch (error) {
      console.error('Failed to create board:', error)
      alert('Failed to create board. Please try again.')
    }
  }


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8">
      <nav className="w-full py-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
        >
          + Add a Conceptboard
        </button>
      </nav>

      <div className="flex justify-center items-center h-40 font-bold flex-col text-center mt-8 mb-12">
        <h1 className="text-shadow-lg text-5xl md:text-7xl leading-tight">
          Concept
          <span className="bg-gradient-to-b from-indigo-300 opacity-90 to-purple-900 bg-clip-text text-transparent">
            boards
          </span>
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          One Board. Infinite Ideas. <span className="animate-pulse">♾️</span>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Create A Conceptboard</h2>
            <input
              className="p-4 w-full font-semibold text-white border-2 border-white rounded-xl mt-3 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type the name of your board."
              onChange={(e) => setBoardName(e.target.value)}
              value={boardName}
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowModal(false)
                  setBoardName('')
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBoard}
                className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition-colors duration-20 cursor-pointer0"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <Boards/>
    </div>
  )
}

export default Notebooks