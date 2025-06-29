// app/api/getSingleHomeworkSubmissions/route.js
import { NextResponse } from 'next/server'
import { database } from '@/appwriteConf'
import { Query } from 'appwrite'

export async function POST(req) {
  try {
    const { homeworkId } = await req.json()

    if (!homeworkId) {
      return NextResponse.json({ success: false, message: 'Homework ID missing' }, { status: 400 })
    }

    const homeworkRes = await database.listDocuments('conceptry', 'homework', [
      Query.equal('$id', homeworkId)
    ]);

    const homework = homeworkRes.documents.length > 0 ? homeworkRes.documents[0] : null;

    if (!homework) {
      return NextResponse.json({ success: false, message: 'Homework not found' }, { status: 404 });
    }

    const submissionsRes = await database.listDocuments('conceptry', 'homeworkSubmissions', [
      Query.equal('homeworkId', homeworkId),
      Query.orderDesc('$createdAt')
    ]);

    return NextResponse.json({ success: true, submissions: submissionsRes.documents, homework });
  } catch (err) {
    console.error('getSingleHomeworkSubmissions error:', err);
    return NextResponse.json({ success: false, message: 'Server error getting submissions' }, { status: 500 });
  }
}