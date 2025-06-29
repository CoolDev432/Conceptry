import { database } from '@/appwriteConf'
import { NextResponse } from 'next/server'
import { ID } from 'appwrite'

export async function POST(req) {
  const { title, description, classId, teacherEmail } = await req.json()

if (!classId || !title || !description) {
  return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
}


  const res = await database.createDocument('conceptry', 'homework', ID.unique(), {
    title,
    description,
    classId,
    teacherEmail
  })

  return NextResponse.json({ success: true, homework: res })
}
