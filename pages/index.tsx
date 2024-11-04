import { useState } from 'react';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setShortUrl(data.shortUrl);
        setError('');
      } else {
        setError(data.message || 'Failed to shorten the URL');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Shorten
          </button>
          {shortUrl && (
              <p className="mt-4">
                Shortened URL: <a href={shortUrl} className="text-blue-600" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
              </p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
  );
}
