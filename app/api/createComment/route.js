import { NextRequest, NextResponse } from "next/server";
import { ID } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const comment = searchParams.get("comment");
    const id = searchParams.get("id");

   const result = await database.createDocument(
        'conceptry',
        'sharedNotesComments',
        ID.unique(),
        {
            comment: comment,
            id: id
        }
    )

    return NextResponse.json({result})
}