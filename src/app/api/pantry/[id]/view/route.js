'use server'

import clientPromise from "@/lib/mongo";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";

async function foodIsOK(entries) {
//     iterate through array of entries
    for (let entry of entries) {
        const date = new Date(entry.purchase_date);
        const now = new Date();
        const diff = (now - date)/(1000 * 60 * 60 * 24); // difference in days
        switch (entry.category) {
            case "Fruit":
                if (diff > 7) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            case "Vegetable":
                if (diff > 14) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            case "Meat":
                if (diff > 3) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            case "Dairy":
                if (diff > 12) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            case "Grain":
                if (diff > 30) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            case "Other":
                if (diff > 30) {
                    entry.safe = false;
                } else {
                    entry.safe = true;
                }
                break;
            default:
                entry.safe = false;
        }
    }
    return entries;
}

export async function GET(req, { params })  {

    try {

        const client = await clientPromise;

        const db = client.db("Pantry");
        const userId = (await params).id

        const items = await db
            .collection("items")
            .find({ user_id: new ObjectId(userId) })
            .toArray();

        return NextResponse.json(await foodIsOK(items));

    } catch (e) {

        console.error(e);
        return NextResponse.error();

    }

}