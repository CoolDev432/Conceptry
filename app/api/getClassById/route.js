import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { database } from "@/appwriteConf";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const res = await database.listDocuments("conceptry", "class", [
      Query.equal("$id", [id]),
    ]);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}