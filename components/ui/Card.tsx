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
    solid: 'bg-navy-900 border border-slate-800',
    interactive: 'glass-panel-interactive cursor-pointer',
    gold: 'bg-gradient-to-br from-amber-950/40 via-navy-900 to-navy-950 border border-amber-500/30 backdrop-blur-xl',
  };

  return (
    <div
      className={cn(
        base,
        variants[variant],
        isGlow && 'shadow-glow-cyan border-brand-cyan/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
