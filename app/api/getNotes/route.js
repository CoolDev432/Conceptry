import { NextResponse } from 'next/server';
import { database } from '@/appwriteConf';
import { Query } from 'appwrite';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  try {
    const notes = await database.listDocuments('conceptry', '68469aa9002608b20bee', [
      Query.equal('email', email),
    ]);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Appwrite fetch error:", error); 
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
