'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function ClassroomContent() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()

  const classId = searchParams.get('id')
  const role = searchParams.get('role') || 'student'

  const [activeTab, setActiveTab] = useState('messages')
  const [menuOpen, setMenuOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [quizList, setQuizList] = useState([])
  const [Email, setEmail] = useState('')
  const [classInfo, setClassInfo] = useState(null)
  const [messages, setMessages] = useState([])

  const [homeworkTitle, setHomeworkTitle] = useState('')
  const [homeworkDesc, setHomeworkDesc] = useState('')
  const [homeworks, setHomeworks] = useState([])
  const [studentAnswers, setStudentAnswers] = useState({})

  useEffect(() => {
    if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      setEmail(user.emailAddresses[0].emailAddress)
    }
  }, [isLoaded, user])

  useEffect(() => {
    if (classId) {
      fetchClassInfo()
      fetchQuizzes()
      fetchHomeworks()
      fetchMessages()
    }
  }, [classId])

  async function fetchClassInfo() {
    const res = await fetch(`/api/getClassById?id=${classId}`)
    const data = await res.json()
    if (data.documents?.length > 0) {
      setClassInfo(data.documents[0])
    }
  }

  async function fetchMessages() {
    const res = await fetch('/api/getMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId })
    })

    const data = await res.json()
    if (data.success) setMessages(data.messages)
      console.log(messages)
  }

  async function sendMessage() {
    if (!topic.trim()) return

    const res = await fetch('/api/postMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId,
        text: topic,
        senderName: user?.fullName || 'Unknown',
        senderEmail: Email,
        timestamp: new Date().toISOString()
      })
    })

    const data = await res.json()
    if (data.success) {
      setTopic('')
      fetchMessages()
    } else {
      alert('Failed to send message')
    }
  }

  async function generateQuiz() {
    if (!topic.trim()) return

    const res = await fetch('/api/generateQuiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, classId })
    })

    const data = await res.json()
    if (data.success) {
      setTopic('')
      fetchQuizzes()
    } else {
      alert('Failed to generate quiz')
    }
  }

  async function fetchQuizzes() {
    const res = await fetch('/api/getQuiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId })
    })

    const data = await res.json()
    if (data.quizzes) {
      setQuizList(data.quizzes)
    }
  }

  async function postHomework() {
    if (!homeworkTitle.trim() || !homeworkDesc.trim()) return

    const res = await fetch('/api/postHomework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId,
        title: homeworkTitle,
        description: homeworkDesc,
        teacherEmail: classInfo?.teacherEmail,
        teacherName: classInfo?.teacher
      })
    })

    const data = await res.json()
    if (data.success) {
      setHomeworkTitle('')
      setHomeworkDesc('')
      fetchHomeworks()
    } else {
      alert('Failed to post homework')
    }
  }

  async function fetchHomeworks() {
    const res = await fetch('/api/getHomework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId })
    })

    const data = await res.json()
    if (data.homeworks) {
      setHomeworks(data.homeworks)
    }
  }

  async function submitHomework(homeworkId) {
    const answer = studentAnswers[homeworkId]
    if (!answer?.trim()) {
      alert('Please write your answer before submitting.')
      return
    }
    if (!Email) {
      alert('User email not loaded.')
      return
    }

    const res = await fetch('/api/submitHomework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, homeworkId, answer, email: Email })
    })

    const data = await res.json()
    if (data.success) {
      alert('Submitted!')
      setStudentAnswers({ ...studentAnswers, [homeworkId]: '' })
    } else {
      alert(data.message || 'Failed to submit homework')
    }
  }

  const handleHomeworkClick = (homeworkId) => {
    if (role === 'teacher') {
      router.push(`/homework-submissions/${homeworkId}`)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 py-6">
      <div className="flex flex-col items-center gap-6 mx-auto max-w-7xl">
        {/* Menu Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition cursor-pointer"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav
          className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-60 opacity block-100 mt-2' : 'max-h-0 opacity-0 hidden'
            }`}
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-300 rounded-2xl py-4 flex flex-col sm:flex-row justify-center items-center gap-3">
            {['messages', 'homework', 'quiz'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setMenuOpen(false)
                }}
                className={`text-md sm:text-lg font-semibold px-5 py-2 rounded-full transition-all cursor-pointer ${activeTab === tab
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-blue-600/40'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-xl shadow h-[196px]">
          <div className="p-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white text-center sm:text-left mb-4 sm:mb-0">
              {classInfo?.name || 'Classroom'}
            </h1>
            <p className='mt-2 opacity-80'>
              Teacher: {classInfo?.teacher}
            </p>
          </div>
          <img
            src="/bg.png"
            alt="Classroom Background"
            className="object-contain max-h-[196px] hidden sm:block"
          />
        </div>

        {/* Tab Content */}
        <div className="w-full mt-6">
          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-4 w-full">
              <h2 className="text-2xl font-bold mb-2">📩 Class Messages</h2>

              {role === 'teacher' && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Type a message to your class..."
                    className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
                    rows={3}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 rounded text-white font-medium"
                  >
                    Send Message
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-gray-400">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.$id} className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-white text-sm">{msg.text}</p>
                      <div className="text-xs text-gray-400 mt-2">
                        — {msg.senderName || 'Unknown'} •{' '}
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* HOMEWORK TAB */}
          {activeTab === 'homework' && (
            <div className="space-y-6 w-full">
              {role === 'teacher' && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                  <h2 className="text-xl font-bold text-white cursor-pointer">📚 Post Homework</h2>
                  <input
                    type="text"
                    placeholder="Homework Title"
                    value={homeworkTitle}
                    onChange={(e) => setHomeworkTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
                  />
                  <textarea
                    placeholder="Homework Description"
                    value={homeworkDesc}
                    onChange={(e) => setHomeworkDesc(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
                    rows={4}
                  />
                  <button
                    onClick={postHomework}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium"
                  >
                    Post Homework
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">📖 Homework List</h2>
                {homeworks.length === 0 ? (
                  <p className="text-gray-400">No homework yet.</p>
                ) : (
                  homeworks.map((hw) => (
                    <div
                      key={hw.$id}
                      className={`border border-white/10 p-4 rounded-xl bg-gray-800 space-y-2 ${role === 'teacher' ? 'cursor-pointer hover:border-blue-500 transition-all' : ''
                        }`}
                      onClick={() => handleHomeworkClick(hw.$id)}
                    >
                      <h3 className="text-lg font-bold">{hw.title}</h3>
                      <p className="text-sm text-gray-300">{hw.description}</p>

                      {role === 'student' && (
                        <div className="mt-2 space-y-2">
                          <textarea
                            placeholder="Write your answer..."
                            className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white"
                            rows={3}
                            value={studentAnswers[hw.$id] || ''}
                            onChange={(e) =>
                              setStudentAnswers({
                                ...studentAnswers,
                                [hw.$id]: e.target.value
                              })
                            }
                          />
                          <button
                            onClick={() => submitHomework(hw.$id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                            disabled={!Email}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 w-full">
              {role === 'teacher' && (
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 w-full">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter quiz topic..."
                    className="flex-1 px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
                  />
                  <button
                    onClick={generateQuiz}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-medium cursor-pointer"
                  >
                    Generate Quiz
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <h2 className="text-2xl font-bold">📝 Class Quizzes</h2>
                {quizList.length === 0 ? (
                  <p className="text-gray-400">No quizzes yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {quizList.map((quiz) => (
                      <div
                        key={quiz.$id}
                        onClick={() => router.push(`/quiz/${quiz.$id}`)}
                        className="border border-white/10 hover:border-purple-500 transition-all duration-300 p-6 rounded-2xl shadow-xl hover:scale-[1.02] cursor-pointer"
                      >
                        {quiz?.topic}
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}