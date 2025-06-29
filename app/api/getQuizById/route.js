import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";
import { Query } from "appwrite";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("id");

    if (!quizId) {
      return NextResponse.json({ error: "Missing quizId" }, { status: 400 });
    }

    const quiz = await database.getDocument("conceptry", "quiz", quizId);

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
