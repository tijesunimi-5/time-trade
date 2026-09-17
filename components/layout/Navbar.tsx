'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Shield, Sparkles, User, LogOut, Compass, Flame, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-navy-950 font-black tracking-tighter shadow-glow-cyan group-hover:scale-105 transition-transform">
            YTT
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white uppercase block leading-none">
              YOUR TIME TRADE
            </span>
            <span className="text-[10px] tracking-widest text-brand-cyan font-semibold uppercase block mt-0.5">
              90-Day Growth System
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors ${pathname === '/' ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Overview
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`transition-colors ${pathname?.startsWith('/dashboard') ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-white'}`}
                >
                  My Dashboard
                </Link>
                {(user.role === 'FOLLOW_UP' || user.role === 'ADMIN') && (
                  <Link
                    href="/follow-up"
                    className={`transition-colors flex items-center gap-1.5 ${pathname?.startsWith('/follow-up') ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-white'}`}
                  >
                    <Users className="w-4 h-4 text-emerald-400" />
                    Follow-Up Portal
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`transition-colors flex items-center gap-1.5 ${pathname?.startsWith('/admin') ? 'text-brand-cyan font-semibold' : 'text-slate-300 hover:text-white'}`}
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    Admin EXCO
                  </Link>
                )}
              </>
            )}
          </div>
        )}

        {/* User Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-white">{user.fullName}</span>
                <span className="text-[10px] text-brand-cyan font-mono uppercase">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl glass-panel text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="glass" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Join Challenge
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
