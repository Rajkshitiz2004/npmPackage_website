import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, badge = null, gradient = false }) {
  return (
    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
      gradient
        ? 'border-teal-500/40 bg-gradient-to-b from-teal-500/10 via-slate-900/60 to-slate-950/80 shadow-lg shadow-teal-500/10'
        : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
    }`}>
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
          {badge}
        </span>
      )}
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-teal-500/50 transition-all duration-300">
        <Icon className="w-6 h-6 text-teal-400 group-hover:text-teal-300" />
      </div>
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
