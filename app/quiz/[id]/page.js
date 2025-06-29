'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function QuizPage() {
  const { id: quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    async function fetchQuiz() {
      const res = await fetch(`/api/getQuizById?id=${quizId}`)
      const data = await res.json()
      if (data.quiz) {
        data.quiz.questions = JSON.parse(data.quiz.questions)
        setQuiz(data.quiz)
      }
    }

    if (quizId) fetchQuiz()
  }, [quizId])

  const handleSelect = (index, option) => {
    setAnswers(prev => ({ ...prev, [index]: option }))
  }

  const handleSubmit = () => {
    if (!quiz) return
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct += 1
    })
    setScore(correct)
    setSubmitted(true)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-xl animate-pulse text-gray-400">Loading quiz...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-purple-200 mb-10 drop-shadow">
          {quiz.topic}
        </h1>

        <div className="space-y-8">
          {quiz.questions.map((q, index) => (
            <div key={index} className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl shadow-xl transition-all ">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-purple-300">{index + 1}. {q.question}</h2>
              <div className="space-y-2">
                {q.options.map((option, i) => {
                  const isCorrect = submitted && option === q.answer
                  const isWrong = submitted && answers[index] === option && option !== q.answer
                  return (
                    <label
                      key={i}
                      className={`block p-3 rounded-lg cursor-pointer border transition-all 
                        ${isCorrect
                          ? 'bg-green-800/40 border-green-500 text-green-300'
                          : isWrong
                          ? 'bg-red-800/40 border-red-500 text-red-300'
                          : 'bg-gray-700/40 border-gray-600 hover:bg-gray-600/50'}
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        disabled={submitted}
                        checked={answers[index] === option}
                        onChange={() => handleSelect(index, option)}
                        className="mr-3 accent-purple-500"
                      />
                      {option}
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 hover:scale-120 px-6 py-3 rounded-xl font-semibold text-lg transition-all"
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div className="mt-10 text-center text-2xl font-bold text-green-400">
            ✅ You scored {score} / {quiz.questions.length}
          </div>
        )}
      </div>
    </div>
  )
}
