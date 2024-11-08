// /pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import favicon from '../public/favicon.png';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [length, setLength] = useState(6); // Default length is 6
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/signin');
    }
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, customCode, length }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setShortUrl(data.shortUrl);
        setError('');
      } else {
        setError(data.message || 'Failed to shorten the URL');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Render nothing until isSignedIn is checked
  if (!isSignedIn) {
    return null;
  }

  return (
      <>
        <Head>
          <title>Urly</title>
          <meta name="description" content="Shorten your URLs easily" />
          <link rel="icon" href={favicon.src} />
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <SignedIn>
            <div className="flex justify-between w-full max-w-sm mb-4">
              <UserButton />
              <button
                  onClick={() => {
                    setOriginalUrl('');
                    setShortUrl('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-full max-w-sm">
              <label className="block mb-2 text-lg font-medium">Enter URL to shorten:</label>
              <input
                  type="url"
                  className="border p-2 rounded w-full mb-4"
                  placeholder="https://example.com"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
              />
              <label className="block mb-2 text-lg font-medium">Custom Short Code (Optional):</label>
              <input
                  type="text"
                  className="border p-2 rounded w-full mb-4"
                  placeholder="custom-name"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
              />
              <label className="block mb-2 text-lg font-medium">Short Code Length:</label>
              <input
                  type="number"
                  min="5"
                  max="10"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="border p-2 rounded w-full mb-4"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full" disabled={loading}>
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
              {shortUrl && (
                  <p className="mt-4">
                    Shortened URL: <a href={shortUrl} className="text-blue-600" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                  </p>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </SignedIn>
        </div>
      </>
  );
}
