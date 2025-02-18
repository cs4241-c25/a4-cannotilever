import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI; // Store this in .env.local
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;