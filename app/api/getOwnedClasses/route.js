import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";
import { Query } from "appwrite";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: "Authentication required or user email not found." },
        { status: 401 }
      );
    }

    const teacherEmail = user.emailAddresses[0].emailAddress;

    const res = await database.listDocuments(
      "conceptry",
      "class",
      [Query.equal("teacherEmail", teacherEmail)]
    );

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error while getting owned classes" },
      { status: 500 }
    );
  }
}