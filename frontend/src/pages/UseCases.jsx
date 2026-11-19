import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  KeyRound,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { apiClient, executeMeasuredRequest } from '../services/api';
import JsonViewer from '../components/JsonViewer';
import CodeBlock from '../components/CodeBlock';

export default function UseCases() {
  const [activeModule, setActiveModule] = useState('users'); // 'users' | 'ecommerce' | 'auth'
  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState(null);

  // User management states
  const [userIdInput, setUserIdInput] = useState('1');
  const [userPage, setUserPage] = useState(1);

  // E-Commerce states
  const [productIdInput, setProductIdInput] = useState('1');
  const [productPage, setProductPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Auth states
  const [authEmail, setAuthEmail] = useState('demo@devflow.io');
  const [authPassword, setAuthPassword] = useState('devkit123');

  // Execution triggers
  const executeUserRequest = async (type) => {
    setLoading(true);
    let result;
    if (type === 'single') {
      result = await executeMeasuredRequest(() => apiClient.get(`/api/users/${userIdInput}`));
    } else {
      result = await executeMeasuredRequest(() => apiClient.get(`/api/users?page=${userPage}&limit=6`));
    }
    setResponseResult(result);
    setLoading(false);
  };

  const executeProductRequest = async (type) => {
    setLoading(true);
    let result;
    if (type === 'single') {
      result = await executeMeasuredRequest(() => apiClient.get(`/api/products/${productIdInput}`));
    } else {
      result = await executeMeasuredRequest(() =>
        apiClient.get(`/api/products?page=${productPage}&limit=6&category=${categoryFilter}`)
      );
    }
    setResponseResult(result);
    setLoading(false);
  };

  const executeAuthRequest = async (mode) => {
    setLoading(true);
    let payload = {};
    if (mode === 'valid') {
      payload = { email: authEmail, password: authPassword };
    } else if (mode === 'missing') {
      payload = { email: authEmail }; // missing password
    } else if (mode === 'invalid') {
      payload = { email: authEmail, password: 'wrongpassword999' };
    }

    const result = await executeMeasuredRequest(() =>
      apiClient.post('/api/demo/auth/login', payload)
    );
    setResponseResult(result);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-1">
          <Database className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-mono font-medium text-teal-400 uppercase tracking-widest">
            Production Scenarios
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Real-World API Use Cases
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Experience how <code className="text-teal-300 font-mono">api-response-kit-kshitiz</code> standardizes typical enterprise application domains: User Management, E-Commerce, and Authentication.
        </p>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'users', label: '1. User Management API', icon: Users, desc: 'Fetch user, not found, paginated directory' },
          { id: 'ecommerce', label: '2. E-Commerce Catalog API', icon: ShoppingBag, desc: 'Product details, missing item, filtered catalog' },
          { id: 'auth', label: '3. Authentication Simulation', icon: KeyRound, desc: 'Login success, invalid credentials, missing fields' },
        ].map((mod) => {
          const Icon = mod.icon;
          const isSelected = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod.id);
                setResponseResult(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/10'
                  : 'border-slate-800 bg-[#0B1120] hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-200'}`}>
                  {mod.label}
                </span>
              </div>
              <p className="text-xs text-slate-400">{mod.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Module Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Control Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* USER MANAGEMENT MODULE */}
          {activeModule === 'users' && (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Users className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">User Directory Actions</h3>
              </div>

              {/* Action 1: Single User */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Fetch Single User by ID</span>
                  <span className="text-[10px] font-mono text-teal-400">GET /api/users/:id</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="Enter ID (1-60 or 999 for 404)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={() => executeUserRequest('single')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-black font-semibold text-xs transition"
                  >
                    Execute
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Quick test:</span>
                  <button onClick={() => { setUserIdInput('1'); }} className="text-teal-400 underline">ID #1 (Found)</button>
                  <button onClick={() => { setUserIdInput('9999'); }} className="text-rose-400 underline">ID #9999 (404)</button>
                </div>
              </div>

              {/* Action 2: Paginated Users */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Paginated Directory (60 Users)</span>
                  <span className="text-[10px] font-mono text-teal-400">GET /api/users?page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-slate-400 font-mono">Page:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={userPage}
                    onChange={(e) => setUserPage(parseInt(e.target.value, 10) || 1)}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={() => executeUserRequest('paginated')}
                    disabled={loading}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                  >
                    Fetch Page {userPage}
                  </button>
                </div>
              </div>

              {/* Workflow Pipeline Box */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <span className="text-teal-300 font-semibold block">Execution Pipeline:</span>
                <div>HTTP GET → Express Route → getUserById() / getAllUsers() → sendSuccess() / ApiError → JSON Envelope</div>
              </div>
            </div>
          )}

          {/* E-COMMERCE MODULE */}
          {activeModule === 'ecommerce' && (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <ShoppingBag className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Product Catalog Actions</h3>
              </div>

              {/* Single Product */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Product Details by ID</span>
                  <span className="text-[10px] font-mono text-teal-400">GET /api/products/:id</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={productIdInput}
                    onChange={(e) => setProductIdInput(e.target.value)}
                    placeholder="Enter ID (1-30 or 888 for 404)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                  />
                  <button
                    onClick={() => executeProductRequest('single')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-black font-semibold text-xs transition"
                  >
                    Execute
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Quick test:</span>
                  <button onClick={() => { setProductIdInput('3'); }} className="text-teal-400 underline">ID #3 (Found)</button>
                  <button onClick={() => { setProductIdInput('888'); }} className="text-rose-400 underline">ID #888 (404)</button>
                </div>
              </div>

              {/* Filtered & Paginated Catalog */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Catalog Filter & Paging</span>
                  <span className="text-[10px] font-mono text-teal-400">paginatedResponse()</span>
                </div>
                <div className="space-y-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="all">All Categories (30 Products)</option>
                    <option value="electronics">Electronics</option>
                    <option value="audio">Audio</option>
                    <option value="peripherals">Peripherals</option>
                    <option value="wearables">Wearables</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-mono">Page:</span>
                    <input
                      type="number"
                      min="1"
                      value={productPage}
                      onChange={(e) => setProductPage(parseInt(e.target.value, 10) || 1)}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => executeProductRequest('paginated')}
                      disabled={loading}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                    >
                      Fetch Catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUTHENTICATION MODULE */}
          {activeModule === 'auth' && (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <KeyRound className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Auth Simulation (Sample Demo)</h3>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Simulates real API response contracts. Does not persist real credentials.
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-sans">Email:</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-sans">Password:</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => executeAuthRequest('valid')}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-semibold text-xs transition text-left flex items-center justify-between"
                >
                  <span>1. Simulate Successful Login (200 OK)</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => executeAuthRequest('missing')}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-semibold text-xs transition text-left flex items-center justify-between"
                >
                  <span>2. Simulate Missing Password (400 Bad Request)</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => executeAuthRequest('invalid')}
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-semibold text-xs transition text-left flex items-center justify-between"
                >
                  <span>3. Simulate Bad Credentials (401 Unauthorized)</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-t-xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Real HTTP Execution Output
            </span>
            {responseResult && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                responseResult.status >= 200 && responseResult.status < 300
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {responseResult.status} {responseResult.statusText}
              </span>
            )}
          </div>

          <div className="min-h-[460px]">
            {loading ? (
              <div className="h-[460px] flex flex-col items-center justify-center space-y-3 bg-[#0B1120] border border-slate-800 rounded-b-xl text-slate-400">
                <RotateCcw className="w-8 h-8 text-teal-400 animate-spin" />
                <span className="text-xs font-mono">Dispatching request to Express...</span>
              </div>
            ) : responseResult ? (
              <JsonViewer data={responseResult.data} title="Standardized JSON Payload" />
            ) : (
              <div className="h-[460px] flex flex-col items-center justify-center bg-[#0B1120] border border-slate-800 rounded-b-xl text-slate-500 text-xs font-mono p-6 text-center space-y-2">
                <Play className="w-8 h-8 text-slate-600 mb-2" />
                <p>Select any real-world action on the left to trigger the Express backend.</p>
                <p className="text-[11px] text-slate-600">The server processes data and packages the response with api-response-kit-kshitiz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
