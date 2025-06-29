import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { ID, Query } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET() {
    const result = await database.listDocuments(
        'conceptry',
        '68491faf0020bd50629e',
    )

    return NextResponse.json(result)
}