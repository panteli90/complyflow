{/* Embed code for paid users */}
<div className="mt-4 bg-gray-800 rounded-xl p-5">
  <p className="font-semibold mb-1">⚡ Pro: Embed on your website</p>
  <p className="text-gray-400 text-sm mb-3">Paste this where you want your policy to appear. Upgrade to Pro to use this feature.</p>
  <div className="flex gap-3 items-center">
    <code className="text-green-400 text-xs flex-1 bg-gray-900 px-3 py-2 rounded-lg overflow-x-auto">
      {`<div id="complyflow-policy"></div>\n<script src="https://complyflow-eqyt.vercel.app/embed.js" data-id="${id}"></script>`}
    </code>
    <button
      onClick={() => navigator.clipboard.writeText(`<div id="complyflow-policy"></div>\n<script src="https://complyflow-eqyt.vercel.app/embed.js" data-id="${id}"></script>`)}
      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
    >
      Copy
    </button>
  </div>
</div>
