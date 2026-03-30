'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScan = async () => {
    if (!url) return;
    setLoading(true);
    router.push(`/results?url=${encodeURIComponent(url)}`);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      
      {/* Badge */}
      <div className="mb-6 px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">
        Free compliance scan — no account needed
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-bold text-center max-w-3xl leading-tight mb-4">
        Check if your website is{' '}
        <span className="text-red-400">legally exposed</span>
      </h1>

      {/* Subheadline */}
      <p className="text-gray-400 text-lg text-center max-w-xl mb-10">
        We scan your site for missing privacy policies, cookie notices, and terms of service — in seconds.
      </p>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
        <input
          type="text"
          placeholder="https://yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          className="flex-1 px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-base"
        />
        <button
          onClick={handleScan}
          disabled={loading || !url}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-base transition-colors"
        >
          {loading ? 'Scanning...' : 'Scan my site'}
        </button>
      </div>

      {/* Trust line */}
      <p className="mt-6 text-gray-600 text-sm">
        Trusted by 1,000+ website owners · Takes under 10 seconds
      </p>

      {/* Feature pills */}
      <div className="mt-12 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
        {['✅ Privacy Policy Check', '✅ Cookie Notice Check', '✅ Terms of Service Check', '✅ Instant Results'].map((item) => (
          <span key={item} className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
            {item}
          </span>
        ))}
      </div>

    </main>
  );
}