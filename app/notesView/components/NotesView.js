'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import mermaid from 'mermaid'
import html2canvas from 'html2canvas'
import { Download, ShareIcon, CheckCheck, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import EditNotePopup from './EditNotePopup'

const NotesView = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const noteId = searchParams.get('id')
  const router = useRouter()
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)

  const [note, setNote] = useState(null)
  const mermaidRef = useRef(null)

  const fetchNoteData = async () => {
    if (!noteId) return

    try {
      const res = await fetch(`/api/getNote?id=${noteId}`)
      const resJSON = await res.json()
      setNote(resJSON)
    } catch (err) {
      console.error("Error getting note:", err)
      setNote(null)
    }
  }

  const handleSaveEditedNote = async (id, newHead, newContent, newFlowchart) => {
    try {
      const params = new URLSearchParams({
        id,
        head: newHead,
        content: newContent,
        flowchart: newFlowchart,
      }).toString()

      const res = await fetch(`/api/updateNote?${params}`, { method: 'GET' })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update note')
      }

      await fetchNoteData()
      alert('Note updated successfully!')
    } catch (error) {
      console.error("Error updating note:", error)
      alert("Failed to update note.")
    }
  }

  async function shareNote() {
    if (!note?.documents?.[0]) return alert("No note to share.")

    try {
      await fetch('/api/shareNotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          head: note.documents[0].head,
          content: note.documents[0].content,
        }),
      })

      alert('Note Shared')
    } catch (err) {
      console.error("Error sharing note:", err)
      alert("Failed to share the note.")
    }
  }

  async function screenShot() {
    if (!mermaidRef.current) return
    setLoading(true)

    try {
      const canvas = await html2canvas(mermaidRef.current, {
        useCORS: true,
        logging: false,
        scale: 2,
        backgroundColor: null,
      })

      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = 'flowchart.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Screenshot error:", error)
      alert("Failed to capture flowchart.")
    } finally {
      setLoading(false)
    }
  }

  function redirect() {
    router.push(`/notesQuiz?id=${noteId}`)
  }

  useEffect(() => {
    fetchNoteData()
  }, [noteId])

  useEffect(() => {
    const currentNoteData = note?.documents?.[0]

    if (currentNoteData && mermaidRef.current) {
      const rawMermaidCode = currentNoteData.flowchart
      mermaidRef.current.innerHTML = ''

      if (rawMermaidCode) {
        try {
          mermaid.initialize({ startOnLoad: false, theme: 'dark' })
          mermaid.render('flowchartDiagram', rawMermaidCode)
            .then(({ svg }) => {
              if (mermaidRef.current) {
                mermaidRef.current.innerHTML = svg
              }
            })
            .catch(error => {
              console.error("Mermaid rendering error:", error)
              if (mermaidRef.current) {
                mermaidRef.current.innerHTML = `<p class="text-red-400">Error rendering flowchart: ${error.message}</p>`
              }
            })
        } catch (e) {
          console.error("Mermaid error:", e)
        }
      }
    }
  }, [note])

  const currentNoteData = note?.documents?.[0]

  return (
    <div className='p-2 min-h-screen bg-gray-900 text-white'>
      <div className="flex justify-end md:p-2 p-10 flex-wrap md:flex-row flex-col">
        <button onClick={screenShot} disabled={loading || !currentNoteData?.flowchart} className="p-4 rounded-full flex gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer">
          <Download /> <h1>Download Flowchart</h1>
        </button>

        <button onClick={shareNote} className='bg-purple-500 flex gap-2 p-4 ml-2 rounded-full hover:bg-purple-700 cursor-pointer'>
          <ShareIcon /> <h1>Share Note</h1>
        </button>

        <button onClick={() => setIsEditPopupOpen(true)} className='bg-red-500 flex gap-2 p-4 ml-2 rounded-full hover:bg-red-700 cursor-pointer'>
          <Edit /> <h1>Edit Note</h1>
        </button>

        <button onClick={redirect} className='bg-orange-500 flex gap-2 p-4 ml-2 rounded-full hover:bg-orange-700 cursor-pointer'>
          <CheckCheck /> <h1>Quiz</h1>
        </button>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {currentNoteData ? (
          <>
            <div className='bg-slate-950 p-7 rounded-2xl'>
              <h1 className="text-4xl font-mono font-bold text-center underline mb-4">{currentNoteData.head}</h1>
              <p className="text-lg text-gray-300 whitespace-pre-wrap">{currentNoteData.content}</p>
            </div>

            {currentNoteData.flowchart ? (
              <>
                <h1 className='mt-10 text-3xl font-bold text-center'>Flowchart:</h1>
                <div ref={mermaidRef} className="mt-6 border p-4 rounded-xl bg-black flex justify-center overflow-x-auto">
                  Loading diagram...
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center mt-10">No flowchart available for this note.</p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center mt-10 text-xl">Loading note or no note found...</p>
        )}
      </div>

      {isEditPopupOpen && currentNoteData && (
        <EditNotePopup
          key={noteId}
          head={currentNoteData.head}
          content={currentNoteData.content}
          flowchart={currentNoteData.flowchart}
          noteId={noteId}
          onClose={() => setIsEditPopupOpen(false)}
          onSave={handleSaveEditedNote}
        />
      )}
    </div>
  )
}

export default NotesView