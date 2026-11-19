import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, Layers, BookOpen, Cpu, CheckCircle2, Github, ExternalLink, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Playground', path: '/playground', icon: Terminal },
    { name: 'Documentation', path: '/docs', icon: BookOpen },
    { name: 'Use Cases', path: '/use-cases', icon: Layers },
    { name: 'Package & Tests', path: '/testing', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080D18]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-400/40 transition-all duration-300">
              <Cpu className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  API Response Kit
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                api-response-kit-kshitiz
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-teal-300 bg-teal-500/10 border border-teal-500/25 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Actions & Links */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="https://www.npmjs.com/package/api-response-kit-kshitiz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-red-950/40 text-red-300 border border-red-500/30 hover:bg-red-900/40 transition-colors"
            >
              <span className="font-bold text-red-400">npm</span>
              <span className="text-slate-400">v1.0.0</span>
              <ExternalLink className="w-3 h-3 text-red-400/80" />
            </a>

            <Link
              to="/playground"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-black bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Playground</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-[#0B1120] border-b border-slate-800 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-teal-300 bg-teal-500/15 border border-teal-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col space-y-2">
            <a
              href="https://www.npmjs.com/package/api-response-kit-kshitiz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-mono bg-red-950/40 text-red-300 border border-red-500/30"
            >
              <span>NPM: api-response-kit-kshitiz (v1.0.0)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/playground"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-semibold text-black bg-teal-400 hover:bg-teal-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Playground</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
