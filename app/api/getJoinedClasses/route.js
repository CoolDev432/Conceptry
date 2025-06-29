import { database } from "@/appwriteConf";
import { Query } from "appwrite";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await database.listDocuments(
      "conceptry", // replace with your real DB ID
      "joinedClasses",     // your collection ID
      [Query.equal("studentEmail", email)]
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching joined classes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
