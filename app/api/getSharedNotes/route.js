import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { database } from "@/appwriteConf";

export async function GET() {
    const result = await database.listDocuments(
        'conceptry',
        '684800e30004c11f3849'
    );

    return NextResponse.json(result)
}