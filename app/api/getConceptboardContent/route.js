import { NextResponse } from "next/server";
import { ID, Query } from "appwrite";
import { database, storage } from "@/appwriteConf";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const res = await database.listDocuments(
        'conceptry',
        '68493ee70031b23ee87e',
        [Query.equal('conceptboardId', id)]
    );
   return NextResponse.json(res)
}