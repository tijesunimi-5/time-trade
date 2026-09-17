'use client';

import React from 'react';
import { Check, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface Task {
  id: string;
  title: string;
  description: string;
  pillar: 'SPIRITUAL' | 'SOCIAL' | 'MENTAL';
  category?: string;
  frequencyType: string;
  isNonNegotiable: boolean;
  isOptional: boolean;
  durationMinutes?: number;
  resourceUrl?: string;
  instructions?: string;
  isCompleted?: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  isLoading?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, isLoading }) => {
  const pillarVariants = {
    SPIRITUAL: 'spiritual',
    MENTAL: 'mental',
    SOCIAL: 'social',
  } as const;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
        task.isCompleted
          ? 'bg-slate-100/60 border-slate-200 opacity-75'
          : task.isNonNegotiable
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-amber-300/80 shadow-subtle-md'
          : 'glass-panel-interactive'
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Task Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {task.isNonNegotiable && (
              <Badge variant="nonNegotiable">
                NON-NEGOTIABLE
              </Badge>
            )}
            <Badge variant={pillarVariants[task.pillar]}>
              {task.pillar}
            </Badge>
            {task.category && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {task.category}
              </span>
            )}
            {task.durationMinutes && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-600" />
                {task.durationMinutes} m
              </span>
            )}
          </div>

          <h3
            className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
              task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {task.description}
          </p>

          {task.instructions && (
            <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2 mt-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{task.instructions}</span>
            </div>
          )}

          {task.resourceUrl && (
            <a
              href={task.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline pt-1"
            >
              Access Resource <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Checkbox Action Button */}
        <button
          onClick={() => onToggle(task.id)}
          disabled={isLoading}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 touch-manipulation ${
            task.isCompleted
              ? 'bg-emerald-600 text-white shadow-subtle-md'
              : 'border-2 border-slate-300 hover:border-brand-600 text-transparent hover:text-slate-400 bg-white'
          }`}
          title={task.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          <Check className={`w-6 h-6 stroke-[3] ${task.isCompleted ? 'text-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};
