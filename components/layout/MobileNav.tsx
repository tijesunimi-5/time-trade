'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Trophy, BookOpen, Users, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user || pathname === '/' || pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null;
  }

  const links = [
    { href: '/dashboard', label: 'Growth', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
    { href: '/dashboard/leaderboard', label: 'Ranks', icon: Trophy },
    { href: '/dashboard/resources', label: 'Library', icon: BookOpen },
  ];

  if (user.role === 'FOLLOW_UP' || user.role === 'ADMIN') {
    links.push({ href: '/follow-up', label: 'Follow-Up', icon: Users });
  }

  if (user.role === 'ADMIN') {
    links.push({ href: '/admin', label: 'EXCO', icon: Shield });
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 shadow-subtle-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-600 font-extrabold bg-brand-50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 stroke-[2.5]' : 'text-slate-500'}`} />
              <span className="text-[10px] mt-0.5 font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
