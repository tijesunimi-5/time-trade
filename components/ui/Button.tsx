import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-subtle-md hover:shadow-glow-blue hover:brightness-105 active:scale-[0.98]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold',
    glass: 'bg-white/80 backdrop-blur-md border border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-800 shadow-subtle-sm',
    gold: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-subtle-md hover:shadow-glow-gold hover:brightness-105 active:scale-[0.98]',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-semibold',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
