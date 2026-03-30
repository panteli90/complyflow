'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      localStorage.setItem(`policy-${data.id}`, data.policy);
      router.push(`/policy/${data.id}`);

    } catch (e) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">

        <div className="text-6xl mb-6">📄</div>

        <h1 className="text-3xl font-bold mb-4">
          Generate your Privacy Policy
        </h1>

        <p className="text-gray-400 mb-2">
          We'll create a professional privacy policy for:
        </p>
        <p className="text-blue-400 font-mono text-sm mb-8 bg-gray-800 px-4 py-2 rounded-lg inline-block">
          {url || 'your website'}
        </p>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 text-left space-y-3">
          <p className="font-semibold text-white mb-4">What's included:</p>
          {[
            '✅ GDPR & CCPA compliant language',
            '✅ Cookie & tracking disclosure',
            '✅ Data retention policy',
            '✅ User rights section',
            '✅ Contact information',
            '✅ Hosted on a public URL',
          ].map((item) => (
            <p key={item} className="text-gray-300 text-sm">{item}</p>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-colors"
        >
          {loading ? '✨ Generating your policy...' : '✨ Generate my Privacy Policy — Free'}
        </button>

        <p className="text-gray-600 text-xs mt-4">
          Takes about 10 seconds · No account required
        </p>

        <button
          onClick={() => router.back()}
          className="mt-6 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← Go back
        </button>

      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GenerateContent />
    </Suspense>
  );
}