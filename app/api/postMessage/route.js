import { NextResponse } from 'next/server'
import { database } from '@/appwriteConf'
import { ID } from 'appwrite'

export async function POST(req) {
  try {
    const { classId, text, senderName, senderEmail, timestamp } = await req.json()

    const res = await database.createDocument('conceptry', 'messages', ID.unique(), {
      classId,
      text,
      senderName,
      senderEmail,
      timestamp,
    })

    return NextResponse.json({ success: true, message: 'Message posted', res })
  } catch (err) {
    console.error('Error posting message:', err)
    return NextResponse.json({ success: false, message: 'Error posting message' })
  }
}
