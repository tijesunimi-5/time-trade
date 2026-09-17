'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Calendar, Trophy, BookOpen, MessageSquare, Shield, Users } from 'lucide-react';
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
    { href: '/admin/participants', label: 'Participant Directory', icon: Users },
    { href: '/admin/testimonials', label: 'Testimonials Queue', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 hidden lg:block glass-panel border-r border-white/10 p-4 min-h-[calc(100vh-65px)] sticky top-[65px]">
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Follow-up Section */}
        {(user?.role === 'FOLLOW_UP' || user?.role === 'ADMIN') && (
          <div>
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-3 mb-2">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Admin Section */}
        {user?.role === 'ADMIN' && (
          <div>
            <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-3 mb-2">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
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
