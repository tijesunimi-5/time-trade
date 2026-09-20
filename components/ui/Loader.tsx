'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'fullPage' | 'card';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  if (variant === 'fullPage') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col items-center gap-4 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 animate-pulse">
              YTT
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {text || 'Connecting to Server...'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Synchronizing your 90-day progress
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full w-2/3 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('p-12 text-center glass-panel rounded-2xl flex flex-col items-center justify-center gap-3', className)}>
        <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
        {text && <p className="text-xs font-semibold text-slate-600">{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
        {text && <span className="text-xs font-bold text-slate-700">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-2.5 text-slate-600', className)}>
      <Loader2 className={cn('animate-spin text-blue-600 shrink-0', sizeClasses[size])} />
      {text && <span className="text-xs font-semibold text-slate-700">{text}</span>}
    </div>
  );
};
