// /api/shorten.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { insertUrl, connectToDatabase } from '@/lib/mongodb'; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { originalUrl, customCode, length } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    // Set default length to 6 if invalid length provided
    const codeLength = length >= 5 && length <= 10 ? length : 6;

    // If customCode is provided, ensure it is valid
    const shortCode = customCode && customCode.length >= 5 && customCode.length <= 10
        ? customCode
        : generateShortCode(codeLength);

    try {
        // Check if custom short code already exists
        const existingUrl = await checkShortCodeExists(shortCode);
        if (existingUrl) {
            return res.status(400).json({ message: 'Short code already exists. Choose a different one.' });
        }

        const shortUrl = await insertUrl(originalUrl, shortCode);
        const fullShortUrl = `${req.headers.origin}/${shortUrl}`;

        res.status(200).json({ shortUrl: fullShortUrl });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

function generateShortCode(length: number): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Helper function to check if short code already exists
async function checkShortCodeExists(shortCode: string): Promise<boolean> {
    const db = await connectToDatabase(); // Use the imported connectToDatabase function
    const collection = db.collection('urls');
    const existingDoc = await collection.findOne({ shortCode });
    return existingDoc !== null;
}
