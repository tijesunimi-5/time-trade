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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 hover:shadow-glow-cyan font-semibold hover:brightness-110 active:scale-95',
    secondary: 'bg-navy-700 hover:bg-navy-600 text-slate-100 border border-slate-700/50',
    outline: 'border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan/10 hover:border-brand-cyan',
    glass: 'bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-brand-cyan/40 hover:bg-slate-800/80 text-slate-100',
    gold: 'bg-gradient-to-r from-brand-gold to-amber-600 text-navy-950 font-bold hover:shadow-glow-gold hover:brightness-110 active:scale-95',
    danger: 'bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30',
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
