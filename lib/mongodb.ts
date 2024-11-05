import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://sabevsimeon08:sEPl6FCwy2cWo6D1@cluster0.f6dww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectToDatabase() {
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
    return db;
}

export async function insertUrl(originalUrl: string): Promise<string> {
    const db = await connectToDatabase();
    if (!db) {
        throw new Error("Database connection is not established.");
    }

    const collection = db.collection('urls');
    const shortCode = generateShortCode();
    await collection.insertOne({ originalUrl, shortCode });

    return shortCode;
}

export async function getUrl(shortCode: string): Promise<string> {
    const db = await connectToDatabase();
    if (!db) {
        throw new Error("Database connection is not established.");
    }

    const collection = db.collection('urls');
    const urlDoc = await collection.findOne({ shortCode });

    if (!urlDoc) {
        throw new Error('URL not found');
    }

    return urlDoc.originalUrl;
}

function generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
}