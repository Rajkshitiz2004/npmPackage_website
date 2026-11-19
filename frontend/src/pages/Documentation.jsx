import React, { useState } from 'react';
import { Search, BookOpen, Copy, Check, ChevronRight, Hash, Layers, ShieldAlert, Cpu } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import JsonViewer from '../components/JsonViewer';

const DOCS_SECTIONS = [
  {
    id: 'success',
    name: 'success(options)',
    category: 'Response Builders',
    signature: 'success({ message = "Success", data = null, statusCode = 200 } = {})',
    purpose: 'Constructs a standardized success response object with an ISO 8601 UTC timestamp.',
    parameters: [
      { name: 'message', type: 'string', default: '"Success"', desc: 'Human-readable summary of the successful operation.' },
      { name: 'data', type: 'any', default: 'null', desc: 'Optional payload object, primitive, or array returned to the caller.' },
      { name: 'statusCode', type: 'number', default: '200', desc: 'Validated HTTP status code (200–399). Validated by package but not included in JSON body.' }
    ],
    returns: '{ success: true, message: string, data: any, timestamp: string }',
    useCases: 'Generic controller returns, microservice messaging, and uniform client contracts.',
    codeExample: `const { success } = require('api-response-kit-kshitiz');

const response = success({
  message: 'User profile retrieved',
  data: { id: 101, username: 'kshitiz' },
  statusCode: 200
});`,
    jsonOutput: {
      success: true,
      message: 'User profile retrieved',
      data: { id: 101, username: 'kshitiz' },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'error',
    name: 'error(options)',
    category: 'Response Builders',
    signature: 'error({ message = "Internal Server Error", statusCode = 500, code = null, details = null } = {})',
    purpose: 'Generates a consistent error response structure with HTTP status code and optional machine-readable error codes.',
    parameters: [
      { name: 'message', type: 'string', default: '"Internal Server Error"', desc: 'Descriptive explanation of the error.' },
      { name: 'statusCode', type: 'number', default: '500', desc: 'HTTP error status code (400–599).' },
      { name: 'code', type: 'string | null', default: 'null', desc: 'Machine-readable uppercase error tag (e.g. "USER_NOT_FOUND").' },
      { name: 'details', type: 'any', default: 'null', desc: 'Granular validation issues, missing parameters, or metadata.' }
    ],
    returns: '{ success: false, message: string, statusCode: number, code: string|null, details: any|null, timestamp: string }',
    useCases: 'Centralized error sanitization, input validation reporting, and unauthorized handling.',
    codeExample: `const { error } = require('api-response-kit-kshitiz');

const errBody = error({
  message: 'User not found in system',
  statusCode: 404,
  code: 'NOT_FOUND',
  details: { userId: 404 }
});`,
    jsonOutput: {
      success: false,
      message: 'User not found in system',
      statusCode: 404,
      code: 'NOT_FOUND',
      details: { userId: 404 },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'paginate',
    name: 'paginate(options)',
    category: 'Pagination',
    signature: 'paginate({ page = 1, limit = 10, total } = {})',
    purpose: 'Computes total pages, previous/next page pointers, and boolean availability flags with safe integer arithmetic.',
    parameters: [
      { name: 'page', type: 'number', default: '1', desc: 'Current page number. Must be a positive safe integer (>= 1).' },
      { name: 'limit', type: 'number', default: '10', desc: 'Records per page. Must be a positive safe integer (>= 1).' },
      { name: 'total', type: 'number', default: 'Required', desc: 'Total number of items. Must be a non-negative safe integer (>= 0).' }
    ],
    returns: '{ page, limit, total, totalPages, hasNextPage, hasPreviousPage, nextPage, previousPage }',
    useCases: 'Database queries (SQL LIMIT/OFFSET, MongoDB skip/limit), search engine results, feeds.',
    codeExample: `const { paginate } = require('api-response-kit-kshitiz');

const meta = paginate({
  page: 2,
  limit: 10,
  total: 45
});`,
    jsonOutput: {
      page: 2,
      limit: 10,
      total: 45,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: true,
      nextPage: 3,
      previousPage: 1
    }
  },
  {
    id: 'paginatedResponse',
    name: 'paginatedResponse(options)',
    category: 'Pagination',
    signature: 'paginatedResponse({ data, page = 1, limit = 10, total, message = "Success" } = {})',
    purpose: 'Combines an array of data items with calculated pagination metadata into a single success envelope.',
    parameters: [
      { name: 'data', type: 'Array', default: 'Required', desc: 'Array containing the slice of records for the current page.' },
      { name: 'page', type: 'number', default: '1', desc: 'Current page number.' },
      { name: 'limit', type: 'number', default: '10', desc: 'Items per page limit.' },
      { name: 'total', type: 'number', default: 'Required', desc: 'Total count of records matching the query.' },
      { name: 'message', type: 'string', default: '"Success"', desc: 'Optional status message.' }
    ],
    returns: '{ success: true, message: string, data: Array, pagination: Object, timestamp: string }',
    useCases: 'All list endpoints: users, products, transactions, articles, logs.',
    codeExample: `const { paginatedResponse } = require('api-response-kit-kshitiz');

const response = paginatedResponse({
  data: [{ id: 11, name: 'Alice' }, { id: 12, name: 'Bob' }],
  page: 2,
  limit: 10,
  total: 45,
  message: 'Users fetched'
});`,
    jsonOutput: {
      success: true,
      message: 'Users fetched',
      data: [{ id: 11, name: 'Alice' }, { id: 12, name: 'Bob' }],
      pagination: {
        page: 2,
        limit: 10,
        total: 45,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: 3,
        previousPage: 1
      },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'sendSuccess',
    name: 'sendSuccess(res, options)',
    category: 'Express Integration',
    signature: 'sendSuccess(res, { message = "Success", data = null, statusCode = 200 } = {})',
    purpose: 'Writes the success response body and sets the corresponding HTTP response status on an Express res object in one step.',
    parameters: [
      { name: 'res', type: 'Response', default: 'Required', desc: 'Express response object.' },
      { name: 'options', type: 'Object', default: '{}', desc: 'Options object passed directly to success().' }
    ],
    returns: 'Express response instance: res.status(statusCode).json(body)',
    useCases: 'Express route handlers returning 200 OK, 201 Created, or 202 Accepted.',
    codeExample: `const { sendSuccess } = require('api-response-kit-kshitiz');

app.get('/api/users/:id', (req, res) => {
  return sendSuccess(res, {
    message: 'User found',
    data: { id: req.params.id, name: 'Kshitiz' },
    statusCode: 200
  });
});`,
    jsonOutput: {
      success: true,
      message: 'User found',
      data: { id: '1', name: 'Kshitiz' },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'sendError',
    name: 'sendError(res, options)',
    category: 'Express Integration',
    signature: 'sendError(res, { message = "Internal Server Error", statusCode = 500, code = null, details = null } = {})',
    purpose: 'Writes the error response body and sets the matching HTTP error status code on an Express res object.',
    parameters: [
      { name: 'res', type: 'Response', default: 'Required', desc: 'Express response object.' },
      { name: 'options', type: 'Object', default: '{}', desc: 'Options object passed directly to error().' }
    ],
    returns: 'Express response instance: res.status(statusCode).json(body)',
    useCases: 'Explicit error returns, bad request handling, authorization barriers.',
    codeExample: `const { sendError } = require('api-response-kit-kshitiz');

app.post('/api/auth/login', (req, res) => {
  if (!req.body.email) {
    return sendError(res, {
      message: 'Email address is required',
      statusCode: 400,
      code: 'MISSING_FIELD',
      details: { field: 'email' }
    });
  }
});`,
    jsonOutput: {
      success: false,
      message: 'Email address is required',
      statusCode: 400,
      code: 'MISSING_FIELD',
      details: { field: 'email' },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'ApiError',
    name: 'new ApiError(message, statusCode, code, details)',
    category: 'Error Classes',
    signature: 'new ApiError(message, statusCode = 500, code = null, details = null)',
    purpose: 'Custom Error subclass with attached HTTP statusCode, machine code, and contextual details, validated on instantiation.',
    parameters: [
      { name: 'message', type: 'string', default: 'Required', desc: 'Error message.' },
      { name: 'statusCode', type: 'number', default: '500', desc: 'HTTP status code (400–599).' },
      { name: 'code', type: 'string | null', default: 'null', desc: 'Alphanumeric machine error code.' },
      { name: 'details', type: 'any', default: 'null', desc: 'Contextual debugging or validation details.' }
    ],
    returns: 'Instance of ApiError (inherits from Error).',
    useCases: 'Thrown inside services and controllers to be caught by Express error middleware.',
    codeExample: `const { ApiError } = require('api-response-kit-kshitiz');

async function findAccount(id) {
  const account = await db.find(id);
  if (!account) {
    throw new ApiError('Account does not exist', 404, 'ACCOUNT_NOT_FOUND', { accountId: id });
  }
  return account;
}`,
    jsonOutput: {
      success: false,
      message: 'Account does not exist',
      statusCode: 404,
      code: 'ACCOUNT_NOT_FOUND',
      details: { accountId: '99' },
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  },
  {
    id: 'asyncHandler',
    name: 'asyncHandler(fn)',
    category: 'Express Integration',
    signature: 'asyncHandler(fn)',
    purpose: 'Wraps asynchronous Express route handlers to automatically catch unhandled Promise rejections and pass them to next(err).',
    parameters: [
      { name: 'fn', type: 'Function', default: 'Required', desc: 'Async route handler with (req, res, next) signature.' }
    ],
    returns: 'Wrapped Express middleware function.',
    useCases: 'Eliminating boilerplate try/catch blocks in Express 4 routes.',
    codeExample: `const { asyncHandler, ApiError } = require('api-response-kit-kshitiz');

app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const order = await orderService.get(req.params.id);
  if (!order) throw new ApiError('Order not found', 404);
  res.json(order);
}));`,
    jsonOutput: {
      note: 'Intercepts errors and invokes next(err) automatically.'
    }
  },
  {
    id: 'errorHandler',
    name: 'errorHandler(err, req, res, next)',
    category: 'Express Integration',
    signature: 'errorHandler(err, req, res, next)',
    purpose: 'Centralized Express error middleware. Exposes ApiError instances while masking unexpected internal exceptions to prevent leakage.',
    parameters: [
      { name: 'err', type: 'Error', default: 'Required', desc: 'Thrown error instance.' },
      { name: 'req', type: 'Request', default: 'Required', desc: 'Express request object.' },
      { name: 'res', type: 'Response', default: 'Required', desc: 'Express response object.' },
      { name: 'next', type: 'Function', default: 'Required', desc: 'Express next function.' }
    ],
    returns: 'Writes standardized error JSON to res or calls next(err) if headers are already sent.',
    useCases: 'Mounted at the end of the Express middleware chain after all routes: app.use(errorHandler).',
    codeExample: `const { errorHandler } = require('api-response-kit-kshitiz');

// Register at the very bottom of your Express app
app.use(errorHandler);`,
    jsonOutput: {
      success: false,
      message: 'Internal Server Error',
      statusCode: 500,
      code: null,
      details: null,
      timestamp: '2026-11-19T10:30:00.000Z'
    }
  }
];

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(DOCS_SECTIONS[0].id);

  // Filter docs by search
  const filteredDocs = DOCS_SECTIONS.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentDoc = DOCS_SECTIONS.find((d) => d.id === selectedDocId) || DOCS_SECTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-1">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-mono font-medium text-teal-400 uppercase tracking-widest">
            Complete API Specification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Package Reference & Documentation
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Exhaustive documentation of all exported functions, signatures, parameters, and behaviors in <code className="text-teal-300 font-mono">api-response-kit-kshitiz@1.0.0</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation & Search (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-20">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter methods (e.g. paginate, sendError)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B1120] border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition"
            />
          </div>

          {/* List of Methods */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-2 max-h-[600px] overflow-y-auto space-y-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === currentDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="truncate">{doc.name}</span>
                  <span className="text-[10px] text-slate-500 font-sans">{doc.category}</span>
                </button>
              );
            })}
            {filteredDocs.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching functions found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Content Pane (8 Cols) */}
        <div className="lg:col-span-8 space-y-8 bg-[#0B1120] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Title & Signature */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {currentDoc.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {currentDoc.name}
            </h2>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto">
              <code>{currentDoc.signature}</code>
            </div>
          </div>

          {/* Purpose & Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Purpose & Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentDoc.purpose}
            </p>
          </div>

          {/* Parameters Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Parameters
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-300 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Parameter</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Default</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {currentDoc.parameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="px-4 py-3 font-mono text-teal-300 font-semibold">{param.name}</td>
                      <td className="px-4 py-3 font-mono text-amber-300">{param.type}</td>
                      <td className="px-4 py-3 font-mono text-slate-400">{param.default}</td>
                      <td className="px-4 py-3 text-slate-300">{param.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Return Value */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Return Value
            </h3>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300">
              <code>{currentDoc.returns}</code>
            </div>
          </div>

          {/* Common Use Cases */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Common Use Cases
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
              {currentDoc.useCases}
            </p>
          </div>

          {/* Usage Code Example */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Implementation Code Example
            </h3>
            <CodeBlock code={currentDoc.codeExample} language="javascript" title="Usage Snippet" />
          </div>

          {/* Standardized JSON Output */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              JSON Output Sample
            </h3>
            <JsonViewer data={currentDoc.jsonOutput} title="Standardized Structure" />
          </div>
        </div>
      </div>
    </div>
  );
}
