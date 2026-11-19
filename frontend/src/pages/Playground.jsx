import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileJson,
  Sliders,
  Send,
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { apiClient, executeMeasuredRequest } from '../services/api';
import JsonViewer from '../components/JsonViewer';
import CodeBlock from '../components/CodeBlock';

const SCENARIOS = [
  {
    id: 'success',
    name: 'A. Success Response',
    endpoint: '/api/demo/success',
    method: 'GET',
    category: 'Response Envelope',
    description: 'Demonstrates sendSuccess() returning standard HTTP 200 with structured user object & timestamp.',
    defaultParams: {},
    codeExample: `// Backend Controller
const { sendSuccess } = require('api-response-kit-kshitiz');

function getSuccessDemo(req, res) {
  const sampleUser = {
    userId: 'usr_8923a1',
    name: 'Kshitiz Raj',
    email: 'kshitiz@devflow.io',
    role: 'Lead Architect',
    organization: 'API Response Kit Labs'
  };

  return sendSuccess(res, {
    message: 'User profile retrieved successfully',
    data: sampleUser,
    statusCode: 200
  });
}`
  },
  {
    id: 'error',
    name: 'B. Error Responses',
    endpoint: '/api/demo/error',
    method: 'GET',
    category: 'Error Envelope',
    description: 'Demonstrates sendError() with 400, 401, 403, 404, 422, or 500 status codes and details.',
    defaultParams: { status: '404' },
    codeExample: `// Backend Controller
const { sendError } = require('api-response-kit-kshitiz');

function getErrorDemo(req, res) {
  const statusCode = parseInt(req.query.status || '404', 10);
  
  return sendError(res, {
    message: 'The requested resource was not found',
    statusCode: statusCode,
    code: 'RESOURCE_NOT_FOUND',
    details: { resourceId: 'sess_9901' }
  });
}`
  },
  {
    id: 'pagination',
    name: 'C. Pagination Calculation',
    endpoint: '/api/demo/pagination',
    method: 'GET',
    category: 'Calculation Engine',
    description: 'Demonstrates paginate({ page, limit, total }) calculating totalPages, next/prev links, and safe boundaries.',
    defaultParams: { page: 2, limit: 10, total: 45 },
    codeExample: `// Standalone Pagination Calculator
const { paginate, sendSuccess } = require('api-response-kit-kshitiz');

const meta = paginate({ page: 2, limit: 10, total: 45 });
/* Returns:
{
  page: 2, limit: 10, total: 45, totalPages: 5,
  hasNextPage: true, hasPreviousPage: true,
  nextPage: 3, previousPage: 1
} */
return sendSuccess(res, { message: 'Pagination metadata calculated', data: meta });`
  },
  {
    id: 'users',
    name: 'D. Paginated Users API',
    endpoint: '/api/demo/users',
    method: 'GET',
    category: 'Dataset Integration',
    description: 'Demonstrates paginatedResponse() against an in-memory dataset of 60 users with search & paging.',
    defaultParams: { page: 1, limit: 8, search: '' },
    codeExample: `// Paginated response wrapper
const { paginatedResponse } = require('api-response-kit-kshitiz');

const items = users.slice(startIndex, startIndex + limit);
return res.json(paginatedResponse({
  data: items,
  page,
  limit,
  total: users.length,
  message: 'Retrieved user records'
}));`
  },
  {
    id: 'express',
    name: 'E. Express Integration',
    endpoint: '/api/demo/express',
    method: 'GET',
    category: 'Express Helpers',
    description: 'Direct demonstration of sendSuccess(res, ...) and sendError(res, ...) writing HTTP response headers.',
    defaultParams: { type: 'success' },
    codeExample: `// Express Response Helpers
const { sendSuccess, sendError } = require('api-response-kit-kshitiz');

if (type === 'error') {
  return sendError(res, { message: 'Custom error', statusCode: 400, code: 'DEMO_ERROR' });
}
return sendSuccess(res, { message: 'Success', data: { status: 'operational' }, statusCode: 200 });`
  },
  {
    id: 'async-error',
    name: 'F. Async Error & ApiError',
    endpoint: '/api/demo/async-error',
    method: 'GET',
    category: 'Async Middleware',
    description: 'Demonstrates asyncHandler() catching async rejections, ApiError, and masking unexpected exceptions.',
    defaultParams: { mode: 'apierror' },
    codeExample: `// Async Route Handler with ApiError
const { asyncHandler, ApiError } = require('api-response-kit-kshitiz');

app.get('/api/async', asyncHandler(async (req, res) => {
  if (req.query.mode === 'apierror') {
    throw new ApiError('Target user account is suspended', 403, 'ACCOUNT_SUSPENDED');
  }
  // Native unexpected exceptions get automatically masked as 500 without leaking stack traces
  throw new Error('Database cluster dropped socket');
}));`
  }
];

export default function Playground() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [params, setParams] = useState(SCENARIOS[0].defaultParams);
  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [activeTab, setActiveTab] = useState('response'); // 'response' | 'code' | 'headers'

  // Update params when scenario changes
  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setParams(scenario.defaultParams);
    setResponseResult(null);
  };

  const handleParamChange = (key, value) => {
    setParams((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    const result = await executeMeasuredRequest(() => {
      return apiClient.get(selectedScenario.endpoint, {
        params: params
      });
    });
    setResponseResult(result);
    setLoading(false);
  };

  // Run automatically on first mount
  useEffect(() => {
    handleExecuteRequest();
  }, [selectedScenario]);

  // Build full request URL string for display
  const queryString = new URLSearchParams(params).toString();
  const fullRequestUrl = `${apiClient.defaults.baseURL}${selectedScenario.endpoint}${queryString ? `?${queryString}` : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="text-xs font-mono font-medium text-teal-400 uppercase tracking-widest">
              Live Interactive Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            API Response Kit Playground
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real Express backend requests executing <code className="text-teal-300 font-mono">api-response-kit-kshitiz@1.0.0</code>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Target: Express Backend ({apiClient.defaults.baseURL || 'Vercel /api Service'})</span>
          </div>
        </div>
      </div>

      {/* Main 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Request Configuration & Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Scenario Selector */}
          <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Select Demonstration Scenario</span>
              </label>
              <span className="text-[11px] text-teal-400/80 font-mono">{SCENARIOS.length} scenarios</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col space-y-1 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/10 shadow-md shadow-teal-500/10'
                        : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-200'}`}>
                        {sc.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        sc.method === 'GET' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {sc.method}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono truncate">{sc.endpoint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Input Parameter Controls */}
          <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Request Parameters
              </h3>
              <span className="text-xs text-slate-400 font-mono">{selectedScenario.method} {selectedScenario.endpoint}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedScenario.description}
            </p>

            {/* Dynamic Controls based on selected scenario */}
            <div className="space-y-4 pt-1">
              {selectedScenario.id === 'success' && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <span className="text-teal-300 font-semibold">No query parameters required.</span>
                  <p className="mt-1">Sends standard GET request to fetch user profile wrapped in standardized envelope.</p>
                </div>
              )}

              {selectedScenario.id === 'error' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Simulate HTTP Status Code:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: '400', label: '400 Bad Request' },
                      { code: '401', label: '401 Unauthorized' },
                      { code: '403', label: '403 Forbidden' },
                      { code: '404', label: '404 Not Found' },
                      { code: '422', label: '422 Unprocessable' },
                      { code: '500', label: '500 Server Error' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleParamChange('status', item.code)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-mono border transition-all ${
                          params.status === item.code
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    The backend invokes <code className="text-teal-300">sendError(res, &#123; statusCode: {params.status} &#125;)</code>
                  </span>
                </div>
              )}

              {selectedScenario.id === 'pagination' && (
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-sans">Page Number (page):</label>
                    <input
                      type="number"
                      value={params.page}
                      onChange={(e) => handleParamChange('page', parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-sans">Items Per Page (limit):</label>
                    <input
                      type="number"
                      value={params.limit}
                      onChange={(e) => handleParamChange('limit', parseInt(e.target.value, 10) || 10)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-sans">Total Records (total):</label>
                    <input
                      type="number"
                      value={params.total}
                      onChange={(e) => handleParamChange('total', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Test negative or non-integer values (e.g. -1) to observe package's <code className="text-rose-400">RangeError</code> input validation.
                  </p>
                </div>
              )}

              {selectedScenario.id === 'users' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Search in Users:</label>
                    <input
                      type="text"
                      placeholder="Search name, email, department..."
                      value={params.search || ''}
                      onChange={(e) => handleParamChange('search', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 mb-1 font-mono">Page:</label>
                      <input
                        type="number"
                        min="1"
                        value={params.page}
                        onChange={(e) => handleParamChange('page', parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-mono">Limit:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={params.limit}
                        onChange={(e) => handleParamChange('limit', parseInt(e.target.value, 10) || 8)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedScenario.id === 'express' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Helper Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['success', 'error'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleParamChange('type', type)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all ${
                          params.type === type
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        send{type.charAt(0).toUpperCase() + type.slice(1)}()
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedScenario.id === 'async-error' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Async Error Mode:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'apierror', title: 'ApiError (403 Forbidden)', desc: 'Custom error with code & details' },
                      { id: 'notfound', title: 'ApiError (404 Not Found)', desc: 'Transaction missing error' },
                      { id: 'unexpected', title: 'Unexpected Native Error (500)', desc: 'Masks stack traces into safe 500' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleParamChange('mode', item.id)}
                        className={`text-left p-2.5 rounded-lg text-xs border transition-all ${
                          params.mode === item.id
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Execute Request CTA */}
            <div className="pt-2">
              <button
                onClick={handleExecuteRequest}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-black bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20 active:scale-98"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-black" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>Execute Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Response & Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Target URL Bar */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-2 overflow-hidden truncate">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[11px]">
                {selectedScenario.method}
              </span>
              <span className="text-slate-300 truncate" title={fullRequestUrl}>
                {fullRequestUrl}
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              {responseResult && (
                <span className="flex items-center text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-teal-400 mr-1" />
                  {responseResult.duration} ms
                </span>
              )}
            </div>
          </div>

          {/* Status & Tab Toolbar */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              {responseResult ? (
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    responseResult.status >= 200 && responseResult.status < 300
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-rose-400 animate-pulse'
                  }`} />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    STATUS: <span className={responseResult.status >= 200 && responseResult.status < 300 ? 'text-emerald-400' : 'text-rose-400'}>
                      {responseResult.status} {responseResult.statusText}
                    </span>
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Awaiting request trigger...</span>
              )}
            </div>

            {/* View Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('response')}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeTab === 'response' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON Response
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeTab === 'code' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Backend Code
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1 rounded font-medium transition ${
                  activeTab === 'headers' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Headers
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[460px]">
            {activeTab === 'response' && (
              <div className="h-full">
                {loading ? (
                  <div className="h-[460px] flex flex-col items-center justify-center space-y-3 bg-[#0B1120] border border-slate-800 rounded-b-xl text-slate-400">
                    <RotateCcw className="w-8 h-8 text-teal-400 animate-spin" />
                    <span className="text-xs font-mono">Executing Express route with api-response-kit-kshitiz...</span>
                  </div>
                ) : responseResult ? (
                  <JsonViewer data={responseResult.data} title="Standardized Live Output" />
                ) : (
                  <div className="h-[460px] flex items-center justify-center bg-[#0B1120] border border-slate-800 rounded-b-xl text-slate-500 text-xs font-mono">
                    Click "Execute Request" to dispatch API call.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'code' && (
              <CodeBlock
                code={selectedScenario.codeExample}
                language="javascript"
                title="Express Controller Implementation"
              />
            )}

            {activeTab === 'headers' && (
              <div className="bg-[#0B1120] border border-slate-800 rounded-b-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-teal-400 font-semibold mb-3">HTTP Response Headers</div>
                {responseResult?.headers && Object.keys(responseResult.headers).length > 0 ? (
                  Object.entries(responseResult.headers).map(([key, val]) => (
                    <div key={key} className="flex border-b border-slate-800/80 py-1.5">
                      <span className="w-1/3 text-slate-400 font-medium truncate">{key}:</span>
                      <span className="w-2/3 text-emerald-400 truncate">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500">No response headers captured.</div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Visual Pagination Widget if scenario is pagination or users */}
          {(selectedScenario.id === 'pagination' || selectedScenario.id === 'users') && responseResult?.data && (
            <div className="p-4 rounded-xl bg-[#0F172A] border border-teal-500/30 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-teal-300 font-mono uppercase text-[11px] flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Visual Pagination Metadata Verification</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Total: {responseResult.data.pagination?.total ?? responseResult.data.data?.total ?? 'N/A'} items
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  disabled={!(responseResult.data.pagination?.hasPreviousPage ?? responseResult.data.data?.hasPreviousPage)}
                  onClick={() => handleParamChange('page', Math.max(1, (params.page || 1) - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition"
                >
                  ← Previous Page
                </button>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-white font-bold">
                    Page {responseResult.data.pagination?.page ?? responseResult.data.data?.page ?? 1}
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">
                    {responseResult.data.pagination?.totalPages ?? responseResult.data.data?.totalPages ?? 1}
                  </span>
                </div>

                <button
                  disabled={!(responseResult.data.pagination?.hasNextPage ?? responseResult.data.data?.hasNextPage)}
                  onClick={() => handleParamChange('page', (params.page || 1) + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition"
                >
                  Next Page →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
