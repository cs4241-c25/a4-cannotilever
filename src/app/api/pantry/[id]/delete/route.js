'use server'

import clientPromise from "@/lib/mongo";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";


export async function POST(req, {params}) {
    if (req.method === 'POST') {
        const client = await clientPromise;
        const user_id= (await params).id
        const db = client.db("Pantry");
        const collection = db.collection("items");
        const data = await req.json();
        console.log("Got POST request", data);
        const { id } = data;
        if (!id || !user_id) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }
        console.log('Deleting entry:', { id });
        const result = await collection.findOneAndDelete({ user_id: new ObjectId(user_id), _id: new ObjectId(id) });

        if (result) {
            console.log('Deleted item:', result.value);
            return NextResponse.json({ success: true, message: 'Item deleted successfully' });
        } else {
            console.log('Item not found.');
            return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
        }
    }

    // Handle other HTTP methods if necessary
    return NextResponse.error();
}