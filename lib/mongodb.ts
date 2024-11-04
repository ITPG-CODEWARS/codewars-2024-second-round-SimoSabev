import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://sabevsimeon08:2FrLCJpTDauZihGS@cluster0.f6dww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // replace <db_password> with your password

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
        db = client.db("Cluster0"); // Use your actual database name
        console.log("Connected to MongoDB!");
    }
    return db;
}

export async function insertUrl(originalUrl: string): Promise<string> {
    const db = await connectToDatabase(); // Ensure you connect to the database
    if (!db) {
        throw new Error("Database connection is not established.");
    }

    const collection = db.collection('urls');
    const shortCode = generateShortCode();
    await collection.insertOne({ originalUrl, shortCode });

    return shortCode;
}

function generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
}
