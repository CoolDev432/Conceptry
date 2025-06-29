'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PlusCircle, Trash2, Calendar, Clock, Link2, Bell, Loader2, Info, XCircle } from 'lucide-react'

const Reminder = () => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [noteLink, setNoteLink] = useState('')
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

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
      reminderDateTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(), // Store as ISO string
      createdAt: new Date().toISOString(), // Store as ISO string
    }

    try {
      const storedReminders = JSON.parse(localStorage.getItem('reminders')) || []
      const updatedReminders = [...storedReminders, newReminder].sort((a, b) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime())
      localStorage.setItem('reminders', JSON.stringify(updatedReminders))
      setReminders(updatedReminders.map(r => ({ ...r, reminderDateTime: new Date(r.reminderDateTime) }))) // Convert back to Date for state
      setMessage({ type: 'success', text: 'Reminder set successfully!' })
      setSelectedDate('')
      setSelectedTime('')
      setNoteLink('')
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
      setReminders(updatedReminders.map(r => ({ ...r, reminderDateTime: new Date(r.reminderDateTime) }))) // Convert back to Date for state
      setMessage({ type: 'success', text: 'Reminder deleted successfully.' })
    } catch (e) {
      setError(`Failed to delete reminder: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    // Ensure timestamp is a Date object, if it's an ISO string from state, convert it
    const date = typeof timestamp.getTime === 'function' ? timestamp : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white p-6 sm:p-8 font-inter">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
          <Bell className="inline-block mr-4 w-12 h-12 align-middle" />
          Revision Reminders
        </h1>

        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-100 flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-blue-400" /> Set New Reminder
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="reminderDate" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                <Calendar className="mr-2 w-5 h-5 text-purple-300" /> Date
              </label>
              <input
                type="date"
                id="reminderDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="reminderTime" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                <Clock className="mr-2 w-5 h-5 text-purple-300" /> Time
              </label>
              <input
                type="time"
                id="reminderTime"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="noteLink" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
              <Link2 className="mr-2 w-5 h-5 text-purple-300" /> Note Link (URL)
            </label>
            <input
              type="url"
              id="noteLink"
              placeholder="e.g., https://yourdomain.com/notes/123xyz"
              value={noteLink}
              onChange={(e) => setNoteLink(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          
          <button
            onClick={handleSetReminder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Setting Reminder...
              </>
            ) : (
              <>
                <Bell className="mr-2" size={20} />
                Set Reminder
              </>
            )}
          </button>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-base flex items-center gap-3 transition-all duration-300 ${
              message.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-500' : 'bg-red-600/20 text-red-300 border border-red-500'
            }`}>
              {message.type === 'success' ? <Info size={20} /> : <XCircle size={20} />}
              {message.text}
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 rounded-xl text-base flex items-center gap-3 bg-red-600/20 text-red-300 border border-red-500">
              <XCircle size={20} />
              {error}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-100 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-400" /> Your Upcoming Reminders
          </h2>

          {loading && (
            <div className="flex items-center justify-center text-gray-400 py-8">
              <Loader2 className="animate-spin mr-3" size={24} /> Loading Reminders...
            </div>
          )}

          {!loading && reminders.length === 0 && !error && (
            <p className="text-gray-400 text-center py-8">No reminders set yet. Set one above!</p>
          )}

          {!loading && reminders.length > 0 && (
            <ul className="space-y-4">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="bg-gray-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-600 shadow-md">
                  <div>
                    <p className="text-xl font-semibold text-blue-300 flex items-center gap-2 mb-1">
                      <Clock size={20} className="text-purple-300" />
                      {formatDateTime(reminder.reminderDateTime)}
                    </p>
                    <a
                      href={reminder.noteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-blue-400 hover:underline transition-colors break-all text-sm sm:text-base flex items-center gap-2"
                    >
                      <Link2 className="w-5 h-5 text-gray-400" />
                      {reminder.noteLink}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reminder
