'use client';

import React from 'react';

interface UserInitialsAvatarProps {
  fullName: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  allNamesInList?: string[]; // Optional cohort names list to resolve initial collisions!
}

const GRADIENT_PALETTES = [
  'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
  'bg-gradient-to-br from-emerald-500 to-teal-700 text-white',
  'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
  'bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
  'bg-gradient-to-br from-violet-600 to-indigo-800 text-white',
  'bg-gradient-to-br from-blue-600 to-cyan-600 text-white',
  'bg-gradient-to-br from-fuchsia-600 to-pink-700 text-white',
];

export function getInitials(fullName: string, allNamesInList?: string[]): string {
  if (!fullName || !fullName.trim()) return 'P';
  const parts = fullName.trim().split(/\s+/);

  let firstChar = parts[0][0].toUpperCase();
  let lastChar = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : '';

  if (!lastChar && parts[0].length > 1) {
    lastChar = parts[0][1].toUpperCase();
  }

  const baseInitials = `${firstChar}${lastChar}`;

  // Collision Disambiguation Check
  if (allNamesInList && Array.isArray(allNamesInList)) {
    const collisions = allNamesInList.filter((n) => {
      if (!n || n === fullName) return false;
      const p = n.trim().split(/\s+/);
      const fC = p[0][0].toUpperCase();
      const lC = p.length > 1 ? p[p.length - 1][0].toUpperCase() : (p[0].length > 1 ? p[0][1].toUpperCase() : '');
      return `${fC}${lC}` === baseInitials;
    });

    if (collisions.length > 0) {
      // Disambiguate by taking first 2 letters of first name + 1st letter of last name
      const fname2 = parts[0].substring(0, 2).toUpperCase();
      const lname1 = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : '';
      return `${fname2}${lname1}`;
    }
  }

  return baseInitials;
}

export function getInitialsColorClass(identifier: string): string {
  if (!identifier) return GRADIENT_PALETTES[0];
  let sum = 0;
  for (let i = 0; i < identifier.length; i++) {
    sum += identifier.charCodeAt(i);
  }
  return GRADIENT_PALETTES[sum % GRADIENT_PALETTES.length];
}

export const UserInitialsAvatar: React.FC<UserInitialsAvatarProps> = ({
  fullName,
  avatarUrl,
  size = 'md',
  className = '',
  allNamesInList,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs sm:text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-xl',
  };

  if (avatarUrl && avatarUrl.trim() !== '') {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={`${sizeClasses[size]} rounded-full border-2 border-brand-200 object-cover shadow-xs ${className}`}
      />
    );
  }

  const initials = getInitials(fullName, allNamesInList);
  const colorClass = getInitialsColorClass(fullName);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-black tracking-wider shadow-xs border-2 border-white/40 shrink-0 ${colorClass} ${className}`}
      title={fullName}
    >
      {initials}
    </div>
  );
};
