import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Github, ExternalLink, Heart, ShieldCheck, Terminal, Package } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060A14] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="font-bold text-white tracking-tight">API Response Kit</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized API response bodies, mathematical pagination calculation, and clean Express error-handling utilities for Node.js.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-1" /> Zero Dependencies
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 font-mono">
              Demo Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/playground" className="hover:text-teal-400 transition-colors">
                  Interactive API Playground
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-teal-400 transition-colors">
                  Full API Documentation
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="hover:text-teal-400 transition-colors">
                  Real-World Use Cases
                </Link>
              </li>
              <li>
                <Link to="/testing" className="hover:text-teal-400 transition-colors">
                  Test Results & Package Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Package Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 font-mono">
              NPM Artifact
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.npmjs.com/package/api-response-kit-kshitiz"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 hover:text-teal-400 transition-colors"
                >
                  <Package className="w-3.5 h-3.5 text-red-400" />
                  <span>api-response-kit-kshitiz</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="font-mono text-slate-500 text-[11px]">
                Installed Version: v1.0.0
              </li>
              <li className="font-mono text-slate-500 text-[11px]">
                Module Format: CommonJS
              </li>
              <li className="font-mono text-slate-500 text-[11px]">
                Target: Node.js &gt;= 18
              </li>
            </ul>
          </div>

          {/* Academic Context */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 font-mono">
              Academic Context
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developed as part of the Software Engineering & Application Development curriculum at ADYPU (Year 2 / Sem-3).
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Author: <span className="text-teal-300 font-medium">Kshitiz Raj</span>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} API Response Kit Playground. MIT License.</p>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>Powered by</span>
            <span className="font-mono text-teal-400 font-semibold">api-response-kit-kshitiz@1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
