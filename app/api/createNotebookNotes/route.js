import { NextResponse } from "next/server";
import { ID } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title");
    const content = searchParams.get("content");
    const id = searchParams.get("id");
    const name = searchParams.get('name');

    const res = await database.createDocument(
        'conceptry',
        '68493ee70031b23ee87e',
        ID.unique(),
        {
            title: title,
            content: content,
            conceptboardId: id,
            name: name
        }
    )

    return NextResponse.json(res)
}