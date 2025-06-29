import { NextResponse } from "next/server"
import { database } from "@/appwriteConf"
import { ID } from "appwrite"

export async function POST(req) {
  try {
    const { name, passcode, teacher, teacherEmail } = await req.json()

    if (!name || !passcode || !teacher || !teacherEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const doc = await database.createDocument("conceptry", "class", ID.unique(), {
      name,
      passcode,
      teacher,
      teacherEmail
    })

    return NextResponse.json({ success: true, doc })
  } catch (err) {
    console.error("Create class error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
