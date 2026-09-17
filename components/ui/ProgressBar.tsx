import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'cyan' | 'gold' | 'purple' | 'emerald';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'cyan',
  className = '',
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  const colors = {
    cyan: 'bg-gradient-to-r from-brand-cyan to-brand-blue shadow-glow-cyan',
    gold: 'bg-gradient-to-r from-brand-gold to-amber-600 shadow-glow-gold',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-500',
  };

  return (
    <div className={`w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${colors[color]}`}
        style={{ width: `${normalizedProgress}%` }}
      />
    </div>
  );
};
