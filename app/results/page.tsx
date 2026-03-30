'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;

    const scan = async () => {
      try {
        const res = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setResults(data);
        }
      } catch (e) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    scan();
  }, [url]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">Scanning your site...</h2>
          <p className="text-gray-400">Checking for compliance issues</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Scan Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            Try another URL
          </button>
        </div>
      </main>
    );
  }

  const issues = [
    {
      key: 'missingPrivacy',
      label: 'Privacy Policy',
      description: 'Required by GDPR, CCPA and most privacy laws',
      missing: results?.missingPrivacy,
    },
    {
      key: 'missingTerms',
      label: 'Terms of Service',
      description: 'Protects your business from legal disputes',
      missing: results?.missingTerms,
    },
    {
      key: 'missingCookies',
      label: 'Cookie Consent',
      description: 'Required by EU law if you use any cookies',
      missing: results?.missingCookies,
    },
  ];

  const score = results?.complianceScore ?? 0;
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-16">
      
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-gray-400 mb-2 text-sm">Scan results for</p>
        <p className="text-blue-400 font-mono text-sm mb-6">{url}</p>
        <h1 className="text-4xl font-bold mb-2">
          Compliance Score:{' '}
          <span className={scoreColor}>{score}/100</span>
        </h1>
        <p className="text-gray-400">
          {score === 100
            ? 'Great job! Your site looks compliant.'
            : 'Your site has compliance issues that need fixing.'}
        </p>
      </div>

      {/* Issues */}
      <div className="w-full max-w-xl space-y-4 mb-10">
        {issues.map((issue) => (
          <div
            key={issue.key}
            className={`p-5 rounded-xl border flex items-start gap-4 ${
              issue.missing
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-green-500/10 border-green-500/30'
            }`}
          >
            <span className="text-2xl">{issue.missing ? '❌' : '✅'}</span>
            <div>
              <p className="font-semibold">{issue.label}</p>
              <p className="text-sm text-gray-400">{issue.description}</p>
              {issue.missing && (
                <p className="text-sm text-red-400 mt-1">Not detected on your site</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {(results?.missingPrivacy || results?.missingTerms || results?.missingCookies) && (
        <div className="w-full max-w-xl bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Fix all issues instantly</h2>
          <p className="text-gray-400 text-sm mb-4">
            Generate a professional privacy policy in seconds — free.
          </p>
          <button
            onClick={() => router.push(`/generate?url=${encodeURIComponent(url || '')}`)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            Fix my site →
          </button>
        </div>
      )}

      {/* Scan again */}
      <button
        onClick={() => router.push('/')}
        className="mt-6 text-gray-500 hover:text-gray-300 text-sm transition-colors"
      >
        ← Scan a different site
      </button>

    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}