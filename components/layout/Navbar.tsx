'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Shield, Sparkles, User, LogOut, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 px-4 lg:px-8 py-3.5 shadow-subtle-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black tracking-tighter shadow-subtle-md group-hover:scale-105 transition-transform">
            YTT
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-slate-900 uppercase block leading-none">
              YOUR TIME TRADE
            </span>
            <span className="text-[10px] tracking-widest text-brand-600 font-bold uppercase block mt-0.5">
              90-Day Growth System
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors ${pathname === '/' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Overview
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`transition-colors ${pathname?.startsWith('/dashboard') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  My Dashboard
                </Link>
                {(user.role === 'FOLLOW_UP' || user.role === 'ADMIN') && (
                  <Link
                    href="/follow-up"
                    className={`transition-colors flex items-center gap-1.5 ${pathname?.startsWith('/follow-up') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    Follow-Up Portal
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`transition-colors flex items-center gap-1.5 ${pathname?.startsWith('/admin') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
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
                <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
                <span className="text-[10px] text-brand-600 font-bold uppercase">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
