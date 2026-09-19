'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Calendar, Trophy, BookOpen, Settings, Shield, Users } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const participantLinks = [
    { href: '/dashboard', label: 'Today Growth', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Challenge Calendar', icon: Calendar },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/dashboard/resources', label: 'Resources', icon: BookOpen },
  ];

  const followUpLinks = [
    { href: '/follow-up', label: 'Assigned Participants', icon: Users },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Overview Analytics', icon: Shield },
    { href: '/admin/tasks', label: 'Task Engine Manager', icon: CheckSquare },
    { href: '/admin/settings', label: 'EXCO System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 hidden lg:block bg-white/80 backdrop-blur-xl border-r border-slate-200/90 p-4 min-h-[calc(100vh-65px)] sticky top-[65px] shadow-subtle-sm">
      <div className="space-y-6">
        {/* Participant Section */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
        {(user?.role?.includes('FOLLOW_UP') || user?.role?.includes('ADMIN')) && (
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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

        {/* Admin Section */}
        {user?.role?.includes('ADMIN') && (
          <div>
            <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest px-3 mb-2">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-600" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};
