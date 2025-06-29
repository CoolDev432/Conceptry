import { NextResponse } from "next/server";
import { database } from "@/appwriteConf";
import { Query } from "appwrite";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id")
    try {
        const result = await database.listDocuments(
            'conceptry',
            '68469aa9002608b20bee',
            [Query.equal('$id', id)]
        )

        return NextResponse.json(result)
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err, status: 500 })
    }

}