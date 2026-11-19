import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileCode,
  Sparkles,
  GitBranch,
  RefreshCw,
  Server,
  Package
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'npm install api-response-kit-kshitiz';

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codePreview = `// 1. Install & import
const { sendSuccess, sendError, ApiError, asyncHandler } = require('api-response-kit-kshitiz');

// 2. Standardized Express route with async error safety
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) {
    throw new ApiError('User account not found', 404, 'USER_NOT_FOUND', { id: req.params.id });
  }

  return sendSuccess(res, {
    message: 'User profile retrieved',
    data: user,
    statusCode: 200
  });
}));`;

  const jsonPreview = `{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": "usr_9410",
    "name": "Kshitiz Raj",
    "role": "Lead Architect",
    "department": "Engineering"
  },
  "timestamp": "2026-11-19T11:59:30.000Z"
}`;

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-500/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-teal-500/30 text-teal-300 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Production Release v1.0.0 Published on NPM</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Zero Dependencies</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Standardize Every <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED6C3] via-[#0FB5A6] to-[#0277A6]">
              API Response.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Build cleaner, more consistent Node.js APIs with a lightweight response utility for success handling, errors, pagination, and Express integration.
          </p>

          {/* Installation snippet with copy */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl font-mono text-xs sm:text-sm text-slate-200">
              <span className="text-teal-400 font-bold">$</span>
              <span>{installCmd}</span>
              <button
                onClick={handleCopyInstall}
                className="ml-2 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-teal-300 transition-colors"
                title="Copy install command"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/playground"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-teal-400 via-teal-300 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/25 transition-all transform active:scale-95 text-sm sm:text-base"
            >
              <Terminal className="w-4 h-4 stroke-[2.5]" />
              <span>Launch Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/docs"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all text-sm sm:text-base"
            >
              <span>View Documentation</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Split Preview */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-slate-800/80 via-slate-900/60 to-[#0B101E] border border-slate-700/80 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                  <span>Backend Handler (Express.js)</span>
                  <span className="text-teal-400 text-[11px]">src/routes/user.js</span>
                </div>
                <CodeBlock code={codePreview} language="javascript" showCopy={false} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                  <span>Standardized Output Body</span>
                  <span className="text-emerald-400 text-[11px]">HTTP 200 OK</span>
                </div>
                <CodeBlock code={jsonPreview} language="json" showCopy={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-teal-400 font-mono font-semibold mb-2">
            Seamless Developer Lifecycle
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How It Works in Your Application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Install', desc: 'npm install api-response-kit-kshitiz' },
            { step: '02', title: 'Import', desc: 'Destructure helpers (sendSuccess, ApiError, etc.)' },
            { step: '03', title: 'Configure', desc: 'Pass message, payload data & HTTP status code' },
            { step: '04', title: 'Execute', desc: 'sendSuccess(res, ...) or throw new ApiError()' },
            { step: '05', title: 'Standardize', desc: 'Predictable, timestamped JSON contract' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-[#0B1120]/70 hover:border-teal-500/40 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  {item.step}
                </span>
                {idx < 4 && <ArrowRight className="hidden md:block w-3.5 h-3.5 text-slate-600" />}
              </div>
              <div>
                <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest text-teal-400 font-mono font-semibold mb-2">
            Core Architecture
          </h2>
          <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Developer Productivity & API Consistency
          </p>
          <p className="text-slate-400 text-sm mt-3">
            Six pillars engineered into an ultra-lean CommonJS package tested with 100% test coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="1. Standardized Success Responses"
            description="Eliminates divergent response formats. Generates clean envelopes with success: true, user message, payload data, and ISO 8601 UTC timestamp."
            badge="success()"
            gradient={true}
          />

          <FeatureCard
            icon={ShieldCheck}
            title="2. Consistent Error Handling"
            description="Sanitizes API error bodies with standard status codes, machine-readable alphanumeric error codes, and structured validation details."
            badge="error()"
          />

          <FeatureCard
            icon={Layers}
            title="3. Smart Pagination Metadata"
            description="Mathematical pagination calculation supporting totalPages, hasNextPage, hasPreviousPage, nextPage, and previousPage with safe boundary checks."
            badge="paginate()"
          />

          <FeatureCard
            icon={Server}
            title="4. Express.js Integration"
            description="First-class response writers: sendSuccess(res, options) and sendError(res, options) write correct HTTP headers and JSON bodies simultaneously."
            badge="sendSuccess()"
          />

          <FeatureCard
            icon={FileCode}
            title="5. Async Error Handling"
            description="asyncHandler wraps asynchronous route controllers, automatically intercepting promise rejections and forwarding them to centralized errorHandler."
            badge="asyncHandler()"
          />

          <FeatureCard
            icon={Package}
            title="6. Zero Runtime Dependencies"
            description="No bloated node_modules trees. Zero runtime dependencies ensures minimal attack surface, instant load times, and rock-solid stability."
            badge="0 Deps"
            gradient={true}
          />
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-teal-500/40 bg-gradient-to-r from-[#0B1528] via-[#091F38] to-[#04244D] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-teal-400/10 text-teal-300 border border-teal-400/20">
              Interactive Live Testing
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test Real Requests against the Live Express Backend
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore live responses, simulate status codes, calculate pagination metadata, and test asynchronous error boundaries using the real NPM package.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/playground"
                className="px-6 py-2.5 rounded-xl font-semibold text-black bg-teal-400 hover:bg-teal-300 transition-colors text-sm shadow-md"
              >
                Open API Playground
              </Link>
              <Link
                to="/testing"
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors text-sm"
              >
                Inspect 19 Verified Tests
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
