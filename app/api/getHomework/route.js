import { database } from '@/appwriteConf'
import { Query } from 'appwrite'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { classId } = await req.json()

  const res = await database.listDocuments('conceptry', 'homework', [
    Query.equal('classId', classId)
  ])

  return NextResponse.json({ homeworks: res.documents })
}
