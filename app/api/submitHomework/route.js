import { database } from '@/appwriteConf';
import { ID, Query } from 'appwrite';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { homeworkId, classId, answer, email } = await req.json();

    if (!homeworkId || !answer || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required data for submission (homeworkId, answer, or email).' },
        { status: 400 }
      );
    }

    const alreadySubmitted = await database.listDocuments(
      'conceptry',
      'homeworkSubmissions',
      [
        Query.equal('homeworkId', homeworkId),
        Query.equal('studentEmail', email)
      ]
    );

    if (alreadySubmitted.documents.length > 0) {
      return NextResponse.json({ success: false, message: 'You have already submitted this homework.' });
    }

    const submission = await database.createDocument(
      'conceptry',
      'homeworkSubmissions',
      ID.unique(),
      {
        homeworkId,
        studentEmail: email,
        answer
      }
    );

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error submitting homework:', error);
    return NextResponse.json({ success: false, message: 'Server error during homework submission.' }, { status: 500 });
  }
}