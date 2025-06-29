import { database } from '@/appwriteConf'
import { Query } from 'appwrite'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { classId } = await req.json()

    const res = await database.listDocuments('conceptry', 'messages', [
      Query.equal('classId', classId),
    ])

    return NextResponse.json({
      success: true,
      messages: res.documents
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
