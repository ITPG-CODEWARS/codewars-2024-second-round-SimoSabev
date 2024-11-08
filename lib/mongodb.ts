// /lib/mongodb.ts
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://sabevsimeon08:sEPl6FCwy2cWo6D1@cluster0.f6dww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        await client.connect();
        db = client.db("Cluster0");
        console.log("Connected to MongoDB!");
    }

    if (!db) {
        throw new Error("Database connection is not established.");
    }

    return db;
}

export async function insertUrl(originalUrl: string, shortCode: string): Promise<string> {
    const db = await connectToDatabase();
    const collection = db.collection('urls');
    await collection.insertOne({ originalUrl, shortCode });

    return shortCode;
}

export async function getUrl(shortCode: string): Promise<string> {
    const db = await connectToDatabase();
    const collection = db.collection('urls');
    const urlDoc = await collection.findOne({ shortCode });

    if (!urlDoc) {
        throw new Error('URL not found');
    }

    return urlDoc.originalUrl;
}

export async function checkShortCodeExists(shortCode: string): Promise<boolean> {
    const db = await connectToDatabase();
    const collection = db.collection('urls');
    const existingDoc = await collection.findOne({ shortCode });
    return existingDoc !== null;
}
