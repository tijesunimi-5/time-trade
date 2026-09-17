import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-white/10 py-12 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-navy-950 font-black text-xs">
              YTT
            </div>
            <span className="text-base font-black tracking-wider text-white uppercase">
              YOUR TIME TRADE
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            A structured system designed to help people remain consistent even after the initial excitement disappears. Growing across Spiritual, Social, and Mental pillars over 90 transformational days.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Growth Pillars</h5>
          <ul className="space-y-2 text-xs">
            <li className="text-purple-300">Spiritual Pillar</li>
            <li className="text-cyan-300">Mental & Financial Literacy</li>
            <li className="text-emerald-300">Social & Emotional Intelligence</li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Community</h5>
          <p className="text-xs text-slate-400 mb-2">
            Conversations and daily reflections happen in our exclusive WhatsApp group.
          </p>
          <a
            href="https://chat.whatsapp.com/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
          >
            Join WhatsApp Community &rarr;
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} YOUR TIME TRADE. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Built with Structure, Discipline & Global Standards.</p>
      </div>
    </footer>
  );
};
