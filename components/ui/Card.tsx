import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive' | 'gold';
  isGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  isGlow = false,
  ...props
}) => {
  const base = 'rounded-2xl p-6 transition-all duration-300';
  const variants = {
    glass: 'glass-panel',
    solid: 'bg-white border border-slate-200 shadow-subtle-sm',
    interactive: 'glass-panel-interactive cursor-pointer',
    gold: 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-400/40 backdrop-blur-xl shadow-subtle-md',
  };

  return (
    <div
      className={cn(
        base,
        variants[variant],
        isGlow && 'ring-2 ring-brand-500/30 border-brand-500 shadow-subtle-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
