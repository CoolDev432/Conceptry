import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const head = searchParams.get("head");
  const content = searchParams.get("content");

  if (!id) {
    return NextResponse.json({ error: "Missing note ID" }, { status: 400 });
  }

  try {
    const updatedNote = await database.updateDocument(
      "conceptry",
      "68469aa9002608b20bee",
      id,
      { head, content }
    );

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Appwrite update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
