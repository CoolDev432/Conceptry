// app/api/shareNote/route.js

import { database } from "@/appwriteConf";
import { ID } from "appwrite";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await database.createDocument(
      "conceptry",
      "684800e30004c11f3849",
      ID.unique(),
      {
        email: body.email,
        head: body.head,
        content: body.content,
        sharedBy: body.firstName,
        comments: 0,
      }
    );

    return NextResponse.json({ message: "Note shared successfully!" });
  } catch (err) {
    console.error("Error sharing note:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
