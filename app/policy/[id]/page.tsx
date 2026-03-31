'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [policy, setPolicy] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/policy/${id}`);
        if (!res.ok) {
          const saved = localStorage.getItem(`policy-${id}`);
          if (saved) {
            setPolicy(saved);
          } else {
            setNotFound(true);
          }
          return;
        }
        const data = await res.json();
        if (data.policy) {
          setPolicy(data.policy);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        setNotFound(true);
      }
    };
    load();
  }, [id]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Policy not found</h2>
          <p className="text-gray-400 mb-6">This policy may have expired or doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            Create a new policy
          </button>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-full">
              ✅ Policy Generated
            </span>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ← Back to scanner
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Privacy Policy</h1>
          <p className="text-gray-400 text-sm">
            This page is publicly accessible. Link to it from your website footer.
          </p>
          <p className="text-blue-400 font-mono text-xs mt-2">
            {typeof window !== 'undefined' ? window.location.href : ''}
          </p>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold">🔄 Keep your policy auto-updated</p>
            <p className="text-gray-400 text-sm">Upgrade to Pro — your policy updates automatically as laws change.</p>
          </div>
          <a
            href="https://buy.stripe.com/test_14AeV6dCj3q7fo26RG6sw00"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors"
          >
            Upgrade to Pro →
          </a>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="prose prose-invert max-w-none">
            {policy.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-blue-400">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold mt-3">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line === '') {
                return <br key={i} />;
              }
              return <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>;
            })}
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl p-5">
          <p className="font-semibold mb-2">📎 Add this link to your website footer:</p>
          <div className="flex gap-3 items-center">
            <code className="text-blue-400 text-sm flex-1 bg-gray-900 px-3 py-2 rounded-lg overflow-x-auto">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Copy URL
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}