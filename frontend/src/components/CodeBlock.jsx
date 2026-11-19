import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, language = 'javascript', title = null, showCopy = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0A0F1D] text-slate-200 text-sm shadow-xl font-mono">
      {(title || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            {title && <span className="text-xs text-slate-400 font-sans font-medium ml-2">{title}</span>}
          </div>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors px-2 py-1 rounded hover:bg-slate-800/60"
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-sans">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}
