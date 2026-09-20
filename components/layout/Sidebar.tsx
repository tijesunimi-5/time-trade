'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Trophy,
  BookOpen,
  Settings,
  Shield,
  Users,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    router.push('/login');
  };

  const participantLinks = [
    { href: '/dashboard', label: 'Today Growth', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Challenge Calendar', icon: Calendar },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/resources', label: 'Resources', icon: BookOpen },
  ];

  const followUpLinks = [
    { href: '/follow-up', label: 'Assigned Participants', icon: Users },
  ];

  const isExco =
    mounted &&
    (user?.rolesList?.some((r: string) =>
      ['LEADERSHIP', 'ADMIN', 'COMMUNITY_MANAGEMENT', 'FOLLOW_UP', 'PROGRAM_PLANNING', 'MEDIA', 'CONTENT'].includes(r)
    ) ||
      user?.role?.includes('ADMIN') ||
      user?.role?.includes('LEADERSHIP'));

  const showFollowUp =
    mounted &&
    (user?.role?.includes('FOLLOW_UP') || user?.role?.includes('ADMIN') || user?.role?.includes('LEADERSHIP'));

  const adminLinks = [
    { href: '/admin', label: 'Overview Analytics', icon: Shield },
    { href: '/admin/participants', label: 'Participant Answers', icon: Users },
    { href: '/admin/forms', label: 'Question Builder', icon: Settings },
    { href: '/admin/tasks', label: 'Task Engine Manager', icon: CheckSquare },
    { href: '/admin/settings', label: 'EXCO System Settings', icon: Settings },
  ];

  const renderNavContent = () => (
    <div className="space-y-6">
      {/* User Info Card */}
      {mounted && user && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
          <div className="text-xs font-bold text-slate-900 truncate">{user.fullName}</div>
          <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
          {user.role && (
            <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {user.role.replace(/,/g, ' • ')}
            </span>
          )}
        </div>
      )}

      {/* Participant Section */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-600" />
          Participant Portal
        </h4>
        <nav className="space-y-1">
          {participantLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 border border-brand-200/80 shadow-subtle-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Follow-up Section */}
      {showFollowUp && (
        <div>
          <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-3 mb-2">
            Follow-Up System
          </h4>
          <nav className="space-y-1">
            {followUpLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Admin & EXCO Section */}
      {isExco && (
        <div>
          <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-3 mb-2">
            Admin & EXCO Portal
          </h4>
          <nav className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. MOBILE TOP HEADER (Visible on mobile screens < lg) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-subtle-sm w-full">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            TT
          </div>
          <span className="font-black text-slate-900 tracking-tight text-xs uppercase">
            TIME TRADE
          </span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
          <span className="text-[11px] font-bold text-slate-700">Menu</span>
        </button>
      </div>

      {/* 2. DESKTOP STICKY SIDEBAR (Visible on desktop >= lg) */}
      <aside className="w-64 hidden lg:flex flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200/90 p-4 min-h-screen sticky top-0 shadow-subtle-sm z-30 justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                TT
              </div>
              <div>
                <span className="font-black text-slate-900 tracking-tight text-sm block leading-none">
                  TIME TRADE
                </span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mt-0.5">
                  90-Day Challenge
                </span>
              </div>
            </Link>
          </div>

          {renderNavContent()}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* 3. MOBILE SLIDE-OVER SIDEBAR DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute left-0 top-0 bottom-0 w-4/5 max-w-xs bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                      TT
                    </div>
                    <span className="font-black text-slate-900 text-xs">TIME TRADE</span>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {renderNavContent()}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
