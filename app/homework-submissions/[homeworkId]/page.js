// app/homework-submissions/[homeworkId]/page.js
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function HomeworkSubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const homeworkId = params.homeworkId

  const [submissions, setSubmissions] = useState([])
  const [homeworkInfo, setHomeworkInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchSubmissions() {
      if (!homeworkId) return

      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/getSingleHomeworkSubmissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homeworkId })
        })
        const data = await res.json()

        if (data.success) {
          setSubmissions(data.submissions)
          setHomeworkInfo(data.homework)
        } else {
          setError(data.message || 'Failed to fetch submissions.')
        }
      } catch (err) {
        console.error('Error fetching submissions:', err)
        setError('An unexpected error occurred while fetching submissions.')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [homeworkId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <button
          onClick={() => router.back()}
          className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition mb-4 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <div className="text-red-400 text-xl text-center">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700 hover:scale-120 transition mb-6 flex items-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Classroom
        </button>

        {homeworkInfo ? (
          <h1 className="text-4xl font-bold mb-6 text-center text-blue-300">
            Submissions for: &quot;{homeworkInfo.title}&quot;
          </h1>
        ) : (
          <h1 className="text-4xl font-bold mb-6 text-center text-blue-300">Homework Submissions</h1>
        )}

        {submissions.length === 0 ? (
          <p className="text-gray-400 text-lg text-center">No submissions yet for this homework.</p>
        ) : (
          <div className="space-y-6">
            {submissions.map((sub) => (
              <div
                key={sub.$id}
                className="bg-gray-800 border border-white/10 p-5 rounded-lg shadow-md space-y-2"
              >
                <p className="text-lg font-semibold text-blue-200">Student Email: {sub.studentEmail}</p>
                <p className="text-gray-300">Answer:</p>
                <div className="bg-gray-900 border border-gray-700 p-3 rounded-md">
                  <p className="text-white whitespace-pre-wrap">{sub.answer}</p>
                </div>
                {sub.$createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                        Submitted on: {new Date(sub.$createdAt).toLocaleString()}
                    </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}