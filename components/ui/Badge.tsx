import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'spiritual' | 'mental' | 'social' | 'nonNegotiable' | 'active' | 'attention' | 'inactive' | 'cyan';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  ...props
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border';

  const variants = {
    spiritual: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    mental: 'bg-blue-950/60 text-cyan-300 border-cyan-500/30',
    social: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    nonNegotiable: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-glow-gold animate-pulse',
    active: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40',
    attention: 'bg-amber-950/60 text-amber-400 border-amber-500/40',
    inactive: 'bg-rose-950/60 text-rose-400 border-rose-500/40',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
