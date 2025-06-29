import { NextResponse } from "next/server";
import { ID } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const boardName = searchParams.get("boardName");
    const name = searchParams.get("name");
    const res = await database.createDocument(
        'conceptry',
        '68491faf0020bd50629e',
        ID.unique(),
        {
            boardName: boardName,
            createdBy: name
        }
    )

    return NextResponse.json(res)
}