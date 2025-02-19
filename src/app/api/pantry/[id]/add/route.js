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
        const { itemname, category, purchase_date } = data;
        if (!itemname || !category || !purchase_date) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }
        console.log('Received data:', { itemname, category, purchase_date });
        const result = await collection.insertOne({ user_id: new ObjectId(user_id), name: itemname, category: category, purchase_date: purchase_date, safe: true });
        // Respond back with a success message
        if (result.insertedId) {
            return NextResponse.json({ success: true, message: 'Data saved successfully' });
        } else {
            return NextResponse.json({ success: false, message: 'Failed to save data' }, { status: 500 });
        }
    }

    // Handle other HTTP methods if necessary
    return NextResponse.error();
}