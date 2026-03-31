'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [siteData, setSiteData] = useState({
    collectsEmails: false,
    usesCookies: false,
    hasPayments: false,
    hasAccounts: false,
    sharesData: false,
  });

  const handleToggle = (key: keyof typeof siteData) => {
    setSiteData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, siteData }),
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

  const options = [
    { key: 'collectsEmails', label: '📧 Collects email addresses' },
    { key: 'usesCookies', label: '🍪 Uses cookies or tracking' },
    { key: 'hasPayments', label: '💳 Processes payments' },
    { key: 'hasAccounts', label: '👤 Has user accounts' },
    { key: 'sharesData', label: '🤝 Shares data with third parties' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-3xl font-bold mb-2">Generate your Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Customise it for your site</p>
          <p className="text-blue-400 font-mono text-sm mt-2 bg-gray-800 px-4 py-2 rounded-lg inline-block">
            {url || 'your website'}
          </p>
        </div>

        {/* Site data checkboxes */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <p className="font-semibold mb-4">Tell us about your website:</p>
          <div className="space-y-3">
            {options.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleToggle(key as keyof typeof siteData)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
                  siteData[key as keyof typeof siteData]
                    ? 'bg-blue-600/20 border-blue-500/50 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300'
                }`}
              >
                <span className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                  siteData[key as keyof typeof siteData]
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-500'
                }`}>
                  {siteData[key as keyof typeof siteData] && '✓'}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-colors"
        >
          {loading ? '✨ Generating your policy...' : '✨ Generate my Privacy Policy — Free'}
        </button>

        <p className="text-gray-600 text-xs mt-4 text-center">
          Takes about 10 seconds · No account required
        </p>

        <button
          onClick={() => router.back()}
          className="mt-6 text-gray-500 hover:text-gray-300 text-sm transition-colors w-full text-center"
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



