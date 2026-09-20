'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const styles = {
    success: {
      bg: 'bg-emerald-50/90 border-emerald-300 text-emerald-950',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      badge: 'bg-emerald-600 text-white',
    },
    error: {
      bg: 'bg-rose-50/90 border-rose-300 text-rose-950',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
      badge: 'bg-rose-600 text-white',
    },
    warning: {
      bg: 'bg-amber-50/90 border-amber-300 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      badge: 'bg-amber-600 text-white',
    },
    info: {
      bg: 'bg-blue-50/90 border-blue-300 text-blue-950',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
      badge: 'bg-blue-600 text-white',
    },
  };

  const style = styles[type];

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border shadow-subtle-sm flex items-start justify-between gap-3 transition-all duration-200 relative overflow-hidden',
        style.bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold leading-tight">{title}</h4>
          {message && <p className="text-[11px] leading-relaxed opacity-90">{message}</p>}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
