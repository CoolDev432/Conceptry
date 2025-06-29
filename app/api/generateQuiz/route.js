import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";
import { ID } from "appwrite";

export async function POST(req) {
  try {
    const { topic, classId } = await req.json();
    console.log("Received:", topic, classId);

    if (!topic || !classId) {
      return NextResponse.json({ error: "Missing topic or classId" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Create a quiz on the topic "${topic}" with exactly 15 multiple-choice questions.
Return only the following JSON format with no explanation or markdown:

[
  {
    "question": "Question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  },
  ...
]
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Extract only the JSON array using regex
    const jsonMatch = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!jsonMatch) {
      console.error("Invalid response format:\n", rawText);
      return NextResponse.json({ error: "Gemini did not return valid JSON." }, { status: 500 });
    }

    const quiz = JSON.parse(jsonMatch[0]);

    await database.createDocument("conceptry", "quiz", ID.unique(), {
      classroomId: classId,
      topic: topic,
      questions: JSON.stringify(quiz)
    });

    return NextResponse.json({ success: true, quiz });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to generate or store quiz" }, { status: 500 });
  }
}
