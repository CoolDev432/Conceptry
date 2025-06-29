import { database } from "@/appwriteConf"
import { NextResponse } from "next/server"
import { Query } from "appwrite"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  try {
    const res = await database.listDocuments(
      'conceptry',
      'class',
      [Query.equal("teacherEmail", email)]
    )
    return NextResponse.json(res)
  } catch (err) {
    console.error("Failed to fetch classes:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
