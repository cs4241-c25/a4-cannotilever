'use server'

import clientPromise from "@/lib/mongo";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";

export async function GET(req, { params })  {

    try {

        const client = await clientPromise;

        const db = client.db("Pantry");
        const userId = params.id
        console.log(userId)

        const items = await db
            .collection("items")
            .find({ user_id: new ObjectId(userId) })
            .toArray();

        return NextResponse.json(items);

    } catch (e) {

        console.error(e);
        return NextResponse.error();

    }

}