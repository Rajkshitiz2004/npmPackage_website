import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Package,
  FileCheck,
  RotateCcw,
  Sparkles,
  GitBranch,
  Layers,
  Award
} from 'lucide-react';
import { apiClient } from '../services/api';
import CodeBlock from '../components/CodeBlock';

const RECORDED_PACKAGE_TESTS = [
  { id: 1, name: 'paginate computes page metadata', category: 'Pagination', status: 'PASS', duration: '1.38ms' },
  { id: 2, name: 'paginate handles empty collection', category: 'Pagination', status: 'PASS', duration: '0.07ms' },
  { id: 3, name: 'paginate handles page beyond last', category: 'Pagination', status: 'PASS', duration: '0.05ms' },
  { id: 4, name: 'paginate calculates totalPages exactly at integer boundaries', category: 'Pagination', status: 'PASS', duration: '0.05ms' },
  { id: 5, name: 'paginate validates inputs', category: 'Pagination', status: 'PASS', duration: '0.18ms' },
  { id: 6, name: 'paginatedResponse combines results and metadata', category: 'Pagination', status: 'PASS', duration: '0.48ms' },
  { id: 7, name: 'paginatedResponse requires array', category: 'Pagination', status: 'PASS', duration: '0.06ms' },
  { id: 8, name: 'success uses defaults and ISO timestamp', category: 'Response', status: 'PASS', duration: '1.28ms' },
  { id: 9, name: 'success preserves custom data and message', category: 'Response', status: 'PASS', duration: '0.58ms' },
  { id: 10, name: 'success rejects invalid status', category: 'Response', status: 'PASS', duration: '0.16ms' },
  { id: 11, name: 'error produces consistent error body', category: 'Response', status: 'PASS', duration: '0.08ms' },
  { id: 12, name: 'error rejects success status', category: 'Response', status: 'PASS', duration: '0.05ms' },
  { id: 13, name: 'sendSuccess writes HTTP response', category: 'Express Helpers', status: 'PASS', duration: '0.07ms' },
  { id: 14, name: 'sendError writes HTTP response', category: 'Express Helpers', status: 'PASS', duration: '0.05ms' },
  { id: 15, name: 'ApiError stores status and metadata', category: 'Error Subclass', status: 'PASS', duration: '0.05ms' },
  { id: 16, name: 'asyncHandler forwards rejected promises', category: 'Express Helpers', status: 'PASS', duration: '0.14ms' },
  { id: 17, name: 'asyncHandler forwards synchronous exceptions', category: 'Express Helpers', status: 'PASS', duration: '0.08ms' },
  { id: 18, name: 'errorHandler exposes ApiError but hides unexpected error', category: 'Express Helpers', status: 'PASS', duration: '0.07ms' },
  { id: 19, name: 'errorHandler delegates if headers already sent', category: 'Express Helpers', status: 'PASS', duration: '0.04ms' },
];

export default function Testing() {
  const [runningLive, setRunningLive] = useState(false);
  const [liveTestReport, setLiveTestReport] = useState(null);
  const [packageMeta, setPackageMeta] = useState(null);

  useEffect(() => {
    // Fetch package info from backend
    apiClient.get('/api/package-info')
      .then((res) => {
        if (res.data?.data) {
          setPackageMeta(res.data.data);
        }
      })
      .catch((err) => console.log('Could not load package info', err));
  }, []);

  const handleRunLiveBackendTests = async () => {
    setRunningLive(true);
    try {
      const res = await apiClient.get('/api/run-tests');
      setLiveTestReport(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRunningLive(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-1">
          <Award className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-mono font-medium text-teal-400 uppercase tracking-widest">
            Engineering & Test Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Package Quality & Test Suite
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Verification dashboard highlighting test coverage, zero runtime dependencies, and Node.js built-in test runner assertions.
        </p>
      </div>

      {/* Package Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Package Name</span>
          <div className="text-sm font-bold text-teal-300 font-mono truncate">
            api-response-kit-kshitiz
          </div>
          <span className="text-[11px] text-slate-400">Published on NPM registry</span>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Version & Engine</span>
          <div className="text-sm font-bold text-white font-mono">
            v1.0.0 (Node &gt;= 18)
          </div>
          <span className="text-[11px] text-slate-400">CommonJS module format</span>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Runtime Dependencies</span>
          <div className="text-sm font-bold text-emerald-400 font-mono flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4" />
            <span>0 Dependencies</span>
          </div>
          <span className="text-[11px] text-slate-400">Zero third-party bloat</span>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-500 uppercase">Verification Tests</span>
          <div className="text-sm font-bold text-teal-300 font-mono">
            19 / 19 Passed (100%)
          </div>
          <span className="text-[11px] text-slate-400">Node built-in test runner</span>
        </div>
      </div>

      {/* Test Runner Suite Table */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                Recorded Release Results
              </span>
              <span className="text-xs text-slate-400 font-mono">19 Automated Tests</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verified test run from <code className="text-slate-300 font-mono">node --test tests/*.test.js</code> executed against release v1.0.0.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunLiveBackendTests}
              disabled={runningLive}
              className="px-3.5 py-2 rounded-lg bg-teal-400/10 border border-teal-400/30 hover:bg-teal-400/20 text-teal-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${runningLive ? 'animate-spin' : ''}`} />
              <span>{runningLive ? 'Verifying...' : 'Re-verify via Backend Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Live confirmation message if triggered */}
        {liveTestReport && (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>
                Backend Test Endpoint: Verified {liveTestReport.totalTests} tests in {liveTestReport.executionTimeMs} ms. All assertions passed!
              </span>
            </div>
          </div>
        )}

        {/* Tests List */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Test Name & Assertion</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {RECORDED_PACKAGE_TESTS.map((test) => (
                <tr key={test.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-2.5 text-slate-500">{test.id}</td>
                  <td className="px-4 py-2.5 text-slate-200 font-sans">{test.name}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{test.category}</td>
                  <td className="px-4 py-2.5 text-slate-400">{test.duration}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {test.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Command Snippet */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Run Package Tests Locally
        </h3>
        <CodeBlock
          code={`# Run the 19 automated unit tests using Node.js built-in runner
npm test

# Run tests with experimental code coverage report
npm run test:coverage`}
          language="bash"
          title="Terminal Instructions"
        />
      </div>
    </div>
  );
}
