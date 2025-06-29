import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const result = await database.listDocuments(
        'conceptry',
        'sharedNotesComments',
        [Query.equal('id', id)]
    )
    return NextResponse.json(result)
}