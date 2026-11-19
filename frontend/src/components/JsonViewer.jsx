import React, { useState } from 'react';
import { Copy, Check, Minimize2, Maximize2 } from 'lucide-react';

export default function JsonViewer({ data, title = 'JSON Response', initialExpanded = true }) {
  const [copied, setCopied] = useState(false);
  const [compact, setCompact] = useState(false);

  if (data === undefined || data === null) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-sm border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
        No JSON payload received
      </div>
    );
  }

  const jsonString = compact
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Syntax highlighting helper for JSON
  const formatColoredJson = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    // Escape HTML tags
    const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber-300'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-sky-300 font-semibold'; // key
          } else {
            cls = 'text-emerald-300'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-400 font-bold'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-rose-400 italic'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#090E1A] shadow-2xl flex flex-col h-full font-mono">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-300 font-sans tracking-wide uppercase">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCompact(!compact)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition"
            title={compact ? "Expand pretty format" : "Compact single-line"}
          >
            {compact ? <Maximize2 className="w-3 h-3 mr-1" /> : <Minimize2 className="w-3 h-3 mr-1" />}
            <span className="font-sans text-[11px]">{compact ? 'Expand' : 'Compact'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-teal-300 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition"
            title="Copy JSON"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 mr-1" />
                <span className="text-emerald-400 font-sans text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                <span className="font-sans text-[11px]">Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-auto max-h-[500px] text-xs sm:text-sm leading-relaxed flex-1">
        <pre
          className="whitespace-pre-wrap font-mono"
          dangerouslySetInnerHTML={{ __html: formatColoredJson(jsonString) }}
        />
      </div>
    </div>
  );
}
