import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              YTT
            </div>
            <span className="text-base font-black tracking-tight text-white uppercase">
              YOUR TIME TRADE
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            A 90-day intentional growth experience. Designed to help you pause, understand yourself, rebuild what matters, and refocus your energy.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Programme</h5>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <a href="#about" className="hover:text-white transition-colors">About</a>
            </li>
            <li>
              <a href="#journey" className="hover:text-white transition-colors">The Journey</a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            </li>
            <li>
              <a href="#community" className="hover:text-white transition-colors">Community</a>
            </li>
            <li>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Access Column */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Access</h5>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link href="/register" className="text-blue-400 font-bold hover:underline">
                Join the 90 Days &rarr;
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Participant Sign In
              </Link>
            </li>
            <li>
              <Link href="/admin/auth" className="hover:text-white transition-colors">
                EXCO Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} YOUR TIME TRADE. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium">Your next 90 days don't have to happen by accident.</p>
      </div>
    </footer>
  );
};
