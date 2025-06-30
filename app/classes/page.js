'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ClassesPage() {
  const { user } = useUser()
  const router = useRouter()

  const [joinedClasses, setJoinedClasses] = useState([])
  const [ownedClasses, setOwnedClasses] = useState([])

  const [createForm, setCreateForm] = useState({ name: '', passcode: '' })
  const [joinForm, setJoinForm] = useState({ className: '', passcode: '' })

  const email = user?.emailAddresses[0].emailAddress
  const name = user?.fullName

  async function fetchClasses() {
    try {
      const joinedRes = await fetch(`/api/getJoinedClasses?email=${email}`)
      const joinedData = await joinedRes.json()

      const ownedRes = await fetch(`/api/getOwnedClasses?email=${email}`)
      const ownedData = await ownedRes.json()

      setJoinedClasses(joinedData.documents || [])
      setOwnedClasses(ownedData.documents || [])
    } catch (err) {
      console.error('Error fetching classes:', err)
    }
  }

  useEffect(() => {
    if (email) fetchClasses()
  }, [email])

  async function handleCreateClass() {
    const res = await fetch('/api/createClass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...createForm,
        teacher: name,
        teacherEmail: email
      })
    })

    const data = await res.json()
    if (data.success) {
      setCreateForm({ name: '', passcode: '' })
      fetchClasses()
    } else {
      alert(data.error || 'Error creating class')
    }
  }

  async function handleJoinClass() {
    const res = await fetch('/api/joinClass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentEmail: email,
        passcode: joinForm.passcode
      })
    })

    const data = await res.json()
    if (data.success) {
      setJoinForm({ className: '', passcode: '' })
      fetchClasses()
    } else {
      alert(data.message || 'Error joining class')
    }
  }

  const combinedClasses = [
    ...ownedClasses.map((cls) => ({ ...cls, role: 'teacher', classId: cls.$id })),
    ...joinedClasses
      .filter((cls) => !ownedClasses.some((own) => own.$id === (cls.classId || cls.$id)))
      .map((cls) => ({ ...cls, role: 'student', classId: cls.classId }))
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-7xl font-bold mb-9 text-center text-white">📚 Your Classes</h1>

      {/* Create & Join Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Create Class */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">👨‍🏫 Create a Class</h2>
          <input
            type="text"
            placeholder="Class Name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="text"
            placeholder="Passcode"
            value={createForm.passcode}
            onChange={(e) => setCreateForm({ ...createForm, passcode: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" onClick={handleCreateClass}>
            Create
          </Button>
        </div>

        {/* Join Class */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">👨‍🎓 Join a Class</h2>
          <input
            type="text"
            placeholder="Class Name (optional)"
            value={joinForm.className}
            onChange={(e) => setJoinForm({ ...joinForm, className: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="text"
            placeholder="Passcode"
            value={joinForm.passcode}
            onChange={(e) => setJoinForm({ ...joinForm, passcode: e.target.value })}
            className="w-full mb-3 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer" onClick={handleJoinClass}>
            Join
          </Button>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combinedClasses.map((cls) => (
          <div key={cls.classId} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg text-black font-bold mb-2">{cls.name}</h3>
            <p className="text-sm text-gray-700 mb-4">👨‍🏫 {cls.teacherName || cls.teacher}</p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 hover:scale-109 text-white cursor-pointer "
              onClick={() => router.push(`/classroom?id=${cls.classId}&role=${cls.role}`)}
            >
              Enter as {cls.role}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
