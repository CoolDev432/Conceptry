'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Clock, Link2, Bell, Loader2, Info, XCircle } from 'lucide-react'
import { motion, useDragControls } from 'framer-motion'

const Reminder = () => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [noteLink, setNoteLink] = useState('')
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const controls = useDragControls()

  const validateInput = () => {
    if (!selectedDate || !selectedTime || !noteLink) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' })
      return false
    }
    try {
      new URL(noteLink)
    } catch (_) {
      setMessage({ type: 'error', text: 'Please enter a valid URL for the note link.' })
      return false
    }
    const reminderDateTime = new Date(`${selectedDate}T${selectedTime}`)
    if (isNaN(reminderDateTime.getTime()) || reminderDateTime < new Date()) {
      setMessage({ type: 'error', text: 'Please select a future date and time.' })
      return false
    }
    return true
  }

  const handleSetReminder = () => {
    if (!validateInput()) return
    setLoading(true)
    setMessage(null)
    setError(null)

    const newReminder = {
      id: Date.now().toString(),
      noteLink,
      reminderDateTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
      createdAt: new Date().toISOString(),
    }

    try {
      const storedReminders = JSON.parse(localStorage.getItem('reminders')) || []
      const updatedReminders = [...storedReminders, newReminder].sort(
        (a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime()
      )
      localStorage.setItem('reminders', JSON.stringify(updatedReminders))
      setReminders(updatedReminders.map(r => ({
        ...r,
        reminderDateTime: new Date(r.reminderDateTime)
      })))
      setMessage({ type: 'success', text: 'Reminder set successfully!' })
      setSelectedDate('')
      setSelectedTime('')
      setNoteLink('')
      setShowForm(false)
    } catch (e) {
      setError(`Failed to save reminder: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReminder = (id) => {
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const storedReminders = JSON.parse(localStorage.getItem('reminders')) || []
      const updatedReminders = storedReminders.filter(r => r.id !== id)
      localStorage.setItem('reminders', JSON.stringify(updatedReminders))
      setReminders(updatedReminders.map(r => ({
        ...r,
        reminderDateTime: new Date(r.reminderDateTime)
      })))
      setMessage({ type: 'success', text: 'Reminder deleted successfully.' })
    } catch (e) {
      setError(`Failed to delete reminder: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = typeof timestamp.getTime === 'function' ? timestamp : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  useEffect(() => {
    setLoading(true)
    try {
      const storedReminders = JSON.parse(localStorage.getItem('reminders')) || []
      setReminders(storedReminders.map(r => ({
        ...r,
        reminderDateTime: new Date(r.reminderDateTime)
      })).sort((a, b) => a.reminderDateTime.getTime() - b.reminderDateTime.getTime()))
    } catch (e) {
      setError(`Failed to load reminders: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  function startDrag(event) {
    controls.start(event)
  }

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      onPointerDown={startDrag}
      dragMomentum={false}
      dragElastic={0.2}
      whileTap={{ cursor: "grabbing" }}
      className="cursor-grab active:cursor-grabbing bg-gray-800 rounded-2xl shadow-xl border border-gray-700 font-inter max-w-sm w-full md:w-[24rem] mx-auto md:absolute md:top-40 p-6 sm:p-10 hover:translate-y-[-12px] transition-all z-50"
    >

      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Bell className="w-6 h-6 text-blue-400" /> Revision Reminders
        </span>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 ml-2 cursor-pointer text-white transition-colors flex items-center justify-center"
          title={showForm ? "Hide Form" : "Add New Reminder"}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </h2>

      {showForm && (
        <div className="bg-gray-700 p-4 rounded-xl mb-4 border border-gray-600">
          <p className="text-gray-300 text-sm mb-3">Set a new reminder:</p>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 bg-gray-600 border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <input
            type="url"
            placeholder="Note URL"
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-600 border border-gray-500 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={handleSetReminder}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : (
              <PlusCircle className="mr-2" size={16} />
            )}
            Set Reminder
          </button>
        </div>
      )}

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${message.type === 'success'
            ? 'bg-green-600/20 text-green-300 border border-green-500'
            : 'bg-red-600/20 text-red-300 border border-red-500'
          }`}>
          {message.type === 'success' ? <Info size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg text-xs flex items-center gap-2 bg-red-600/20 text-red-300 border border-red-500">
          <XCircle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center text-gray-400 py-4 text-sm">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading...
        </div>
      )}

      {!loading && reminders.length === 0 && !error && (
        <p className="text-gray-400 text-center py-4 text-sm">No reminders set yet.</p>
      )}

      {!loading && reminders.length > 0 && (
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="bg-gray-700 p-3 rounded-lg flex items-center justify-between gap-2 border border-gray-600 shadow-sm"
            >
              <div className="flex-grow min-w-0">
                <p className="text-sm font-semibold text-blue-300 flex items-center gap-1">
                  <Clock size={14} className="text-purple-300" />
                  {formatDateTime(reminder.reminderDateTime)}
                </p>
                <a
                  href={reminder.noteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-blue-400 hover:underline text-xs truncate block"
                  title={reminder.noteLink}
                >
                  <Link2 className="inline-block mr-1 w-3 h-3 align-text-bottom" />
                  {reminder.noteLink.replace(/^(https?:\/\/)/, '').split('/')[0]}...
                </a>
              </div>
              <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                title="Delete Reminder"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

export default Reminder
