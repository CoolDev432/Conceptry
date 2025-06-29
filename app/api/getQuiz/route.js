import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";
import { Query } from "appwrite"; // You missed importing this

export async function POST(req) {
  try {
    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    const res = await database.listDocuments("conceptry", "quiz", [
      Query.equal("classroomId", classId),
    ]);

    return NextResponse.json({ quizzes: res.documents }, { status: 200 });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
