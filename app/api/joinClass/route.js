import { NextResponse } from 'next/server'
import { database } from '@/appwriteConf'
import { Query, ID } from 'appwrite'

export async function POST(req) {
  try {
    const { studentEmail, passcode } = await req.json()

    if (!studentEmail || !passcode) {
      return NextResponse.json(
        { success: false, message: 'Email and passcode are required.' },
        { status: 400 }
      )
    }

    // Step 1: Find the class with the given passcode
    const classRes = await database.listDocuments(
      'conceptry',        // ✅ Your database ID
      'class',            // ✅ Your class collection ID
      [Query.equal('passcode', passcode)]
    )

    if (classRes.documents.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No class found with this passcode.' },
        { status: 404 }
      )
    }

    const classDoc = classRes.documents[0]

    // Step 2: Check if the student already joined the class
    const joinedCheck = await database.listDocuments(
      'conceptry',
      'joinedClasses',
      [
        Query.equal('studentEmail', studentEmail),
        Query.equal('classId', classDoc.$id)
      ]
    )

    if (joinedCheck.documents.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'You already joined this class.'
      })
    }

    // Step 3: Create a join record
    await database.createDocument(
      'conceptry',
      'joinedClasses',
      ID.unique(),
      {
        classId: classDoc.$id,
        className: classDoc.name,
        teacherEmail: classDoc.teacherEmail,
        teacherName: classDoc.teacher,
        studentEmail,
        passcode // ✅ Added to fix the required field error
      }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Join class error:', err)
    return NextResponse.json(
      { success: false, message: 'Server error while joining class.' },
      { status: 500 }
    )
  }
}
