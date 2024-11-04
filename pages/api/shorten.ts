import { NextApiRequest, NextApiResponse } from 'next';
import { insertUrl } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        console.log('Received URL:', originalUrl);
        const shortCode = await insertUrl(originalUrl);
        const shortUrl = `${req.headers.origin}/${shortCode}`;
        console.log('Shortened URL:', shortUrl);
        res.status(200).json({ shortUrl });
    } catch (error) {
        console.error('Error occurred:', error);
        const errorMessage = (error as Error).message || 'Server error. Please try again later.';
        res.status(500).json({ message: errorMessage });
    }
}
