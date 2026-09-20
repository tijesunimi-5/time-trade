import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'spiritual'
    | 'mental'
    | 'social'
    | 'nonNegotiable'
    | 'active'
    | 'attention'
    | 'inactive'
    | 'cyan'
    | 'emerald'
    | 'slate'
    | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  ...props
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border';

  const variants = {
    spiritual: 'bg-purple-50 text-purple-700 border-purple-200',
    mental: 'bg-sky-50 text-sky-700 border-sky-200',
    social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    nonNegotiable: 'bg-amber-100 text-amber-800 border-amber-300 shadow-glow-gold font-extrabold animate-pulse',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    attention: 'bg-amber-50 text-amber-700 border-amber-200',
    inactive: 'bg-rose-50 text-rose-700 border-rose-200',
    cyan: 'bg-blue-50 text-brand-700 border-brand-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    slate: 'bg-slate-100 text-slate-700 border-slate-300',
    purple: 'bg-purple-50 text-purple-800 border-purple-300',
  };

  return (
    <span className={cn(base, variants[variant] || variants.cyan, className)} {...props}>
      {children}
    </span>
  );
};
