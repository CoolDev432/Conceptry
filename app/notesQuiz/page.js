import React, { Suspense } from 'react'
import Quiz from './components/Quiz'

export default function NotesQuizPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<div className="text-center p-10">Loading Quiz...</div>}>
        <Quiz />
      </Suspense>
    </div>
  )
}
