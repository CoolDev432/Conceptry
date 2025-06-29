'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RefreshCw, Trophy, Target, Zap } from 'lucide-react' 

const Quiz = () => {
  const searchParams = useSearchParams()
  const [noteId, setNoteId] = useState(null)
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState('normal')
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [retries, setRetries] = useState(0)
  const MAX_RETRIES = 3

  const difficultyConfig = {
    easy: {
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      label: 'Easy Mode',
      description: 'Basic concepts & definitions'
    },
    normal: {
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
      label: 'Normal Mode',
      description: 'Standard academic level'
    },
    hard: {
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-600/20',
      label: 'Hard Mode',
      description: 'Advanced analysis & critical thinking'
    }
  }

  useEffect(() => {
    const idFromParams = searchParams.get('id')
    if (idFromParams) {
      setNoteId(idFromParams)
    } else {
      setError("No note ID provided. Please navigate from a note.")
      setLoading(false)
    }
  }, [searchParams])

  async function fetchQuiz(attempt = 0) {
    if (!noteId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    if (attempt === 0) {
      setQuiz([])
      setSelectedOptions({})
      setScore(0)
      setQuizCompleted(false)
    }
    
    try {
      const res = await fetch(`/api/quizNote?id=${noteId}&difficulty=${difficulty}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error("Invalid response format from API")
      setQuiz(data)
      setRetries(0)
    } catch (err) {
      console.error(`Attempt ${attempt + 1} failed:`, err)
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`Retrying in ${delay / 1000} seconds... (Attempt ${attempt + 2})`)
        setLoading(true)
        setRetries(attempt + 1)
        setTimeout(() => fetchQuiz(attempt + 1), delay)
      } else {
        setError(`Failed to fetch quiz after ${MAX_RETRIES + 1} attempts: ${err.message}`)
        setLoading(false)
      }
    } finally {
      if (attempt >= MAX_RETRIES || error) {
          setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (noteId) {
      fetchQuiz()
    }
  }, [noteId, difficulty])

  const handleOptionClick = (questionIndex, optionText) => {
    if (selectedOptions[questionIndex] !== undefined) return

    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: optionText
    }))

    if (optionText === quiz[questionIndex].correctAnswer) {
      setScore((prev) => prev + 1)
    }

    if (Object.keys(selectedOptions).length + 1 === quiz.length) {
      setTimeout(() => setQuizCompleted(true), 500)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / quiz.length) * 100
    const difficultyLabel = difficultyConfig[difficulty].label

    if (percentage >= 80) return `🏆 Excellent! ${score}/${quiz.length} on ${difficultyLabel}`
    if (percentage >= 60) return `👍 Good job! ${score}/${quiz.length} on ${difficultyLabel}`
    return `📚 Keep studying! ${score}/${quiz.length} on ${difficultyLabel}`
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div
          className='bg-slate-700 w-fit p-3 rounded-full cursor-pointer hover:scale-110 transition-transform'
          onClick={() => fetchQuiz()}
        >
          <RefreshCw className='hover:rotate-180 transition-transform duration-300' />
        </div>

        <div className="flex gap-2">
          {Object.entries(difficultyConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`
                flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg font-medium transition-all
                ${difficulty === key
                  ? `${config.color} ${config.bgColor} border border-current`
                  : 'text-gray-400 bg-slate-800 hover:bg-slate-700'
                }
              `}
            >
              {config.icon}
              {config.label}
            </button>
          ))}
        </div>
      </div>

        <div className={`w-fit flex m-auto items-center select-none gap-2 mb-4 px-4 py-2 rounded-full ${difficultyConfig[difficulty].bgColor}`}>
          {difficultyConfig[difficulty].icon}
          <span className={`font-medium ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label}
          </span>
          <span className="text-gray-400 text-sm">
            - {difficultyConfig[difficulty].description}
          </span>
        </div>
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-400 text-transparent bg-clip-text inline-block">
          Quiz Me <span className='text-white'>.</span>
        </h1>


        <div className="mt-4 select-none">
          {quizCompleted ? (
            <div className="text-2xl font-bold text-center p-4 bg-slate-800 rounded-lg inline-block">
              {getScoreMessage()}
            </div>
          ) : (
            <p className="text-lg text-gray-400">
              Score: {score}/{quiz.length > 0 ? quiz.length : '?'}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-lg">
            <RefreshCw className="animate-spin" />
            Generating {difficultyConfig[difficulty].label} Quiz...
            {retries > 0 && (
              <span className="text-sm text-gray-400 ml-2">
                (Attempt {retries + 1} of {MAX_RETRIES + 1})
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="space-y-8">
        {quiz.length > 0 ? quiz.map((q, index) => (
          <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <span className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${selectedOptions[index]
                  ? (selectedOptions[index] === q.correctAnswer ? 'bg-green-600' : 'bg-red-600')
                  : 'bg-slate-600'
                }
              `}>
                {index + 1}
              </span>
              <h2 className="text-xl font-semibold leading-tight">
                {q.question}
              </h2>
            </div>

            <ul className="space-y-3">
              {q.options.map((option, i) => {
                let optionClass = "bg-slate-700 hover:bg-slate-600";
                let textClass = "text-white";

                if (selectedOptions[index]) {
                  if (option === q.correctAnswer) {
                    optionClass = "bg-green-600 hover:bg-green-600";
                    textClass = "text-white font-medium";
                  } else if (option === selectedOptions[index]) {
                    optionClass = "bg-red-600 hover:bg-red-600";
                    textClass = "text-white font-medium";
                  } else {
                    optionClass = "bg-slate-600";
                    textClass = "text-gray-300";
                  }
                }

                return (
                  <li
                    key={i}
                    className={`
                      ${optionClass} ${textClass} p-4 rounded-lg transition-all cursor-pointer
                      border border-transparent hover:border-slate-500
                      ${selectedOptions[index] ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    onClick={() => handleOptionClick(index, option)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </div>
                  </li>
                );
              })}
            </ul>

            {selectedOptions[index] && (
              <div className="mt-6 p-4 bg-slate-900 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-300">
                  <strong className="text-blue-200">💡 Explanation:</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>
        )) : !loading && (
          <div className='flex justify-center'>
            <div className="text-center p-8 bg-slate-800 rounded-xl">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
              <h2 className='font-bold text-xl text-gray-300'>
                {error ? "Error Loading Quiz" : `Generating ${difficultyConfig[difficulty].label} Questions...`}
              </h2>
              <p className="text-gray-500 mt-2">
                {error ? error : difficultyConfig[difficulty].description}
              </p>
            </div>
          </div>
        )}
      </div>

      {quizCompleted && (
        <div className="fixed bottom-8 right-8 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-2xl">
          <div className="flex gap-3">
            <button
              onClick={() => fetchQuiz()}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => {
                const newDifficulty = difficulty === 'easy' ? 'normal' : difficulty === 'normal' ? 'hard' : 'easy'
                setDifficulty(newDifficulty)
              }}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Change Difficulty
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz