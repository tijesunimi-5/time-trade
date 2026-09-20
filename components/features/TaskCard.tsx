'use client';

import React from 'react';
import { Check, Clock, ExternalLink, BookOpen, Headphones, MessageSquare, AlertCircle, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface Task {
  id: string;
  title: string;
  description: string;
  pillar: 'SPIRITUAL' | 'SOCIAL' | 'MENTAL';
  category?: string;
  taskType?: string;
  frequencyType?: string;
  isNonNegotiable: boolean;
  isOptional?: boolean;
  durationMinutes?: number;
  pageRange?: string;
  timestampRange?: string;
  discussionQuestions?: string;
  resourceUrl?: string;
  instructions?: string;
  isCompleted?: boolean;
  resource?: {
    id: string;
    title: string;
    type: string;
    author?: string;
    url?: string;
  };
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
  readOnlyMessage?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  isLoading = false,
  isReadOnly = false,
  readOnlyMessage,
}) => {
  const pillarVariants = {
    SPIRITUAL: 'spiritual',
    MENTAL: 'mental',
    SOCIAL: 'social',
  } as const;

  const getTaskTypeBadge = (type?: string) => {
    switch (type) {
      case 'NON_NEGOTIABLE':
        return <Badge variant="nonNegotiable">NON-NEGOTIABLE</Badge>;
      case 'LEARNING':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">READING/AUDIO</span>;
      case 'COMMUNITY':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">COMMUNITY</span>;
      case 'PERSONAL':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">PERSONAL HABIT</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 relative ${
        task.isCompleted
          ? 'bg-slate-100/60 border-slate-200 opacity-80'
          : task.isNonNegotiable
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-amber-300/80 shadow-subtle-md'
          : 'glass-panel-interactive'
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Task Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {task.isNonNegotiable && <Badge variant="nonNegotiable">NON-NEGOTIABLE</Badge>}
            <Badge variant={pillarVariants[task.pillar] || 'mental'}>{task.pillar}</Badge>
            {getTaskTypeBadge(task.taskType)}
            {task.durationMinutes && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-600" />
                {task.durationMinutes} mins
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

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{task.description}</p>

          {/* Curated Resource Section */}
          {task.resource && (
            <div className="mt-2 p-3 bg-cyan-50/60 rounded-xl border border-cyan-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                  {task.resource.type === 'BOOK' ? (
                    <BookOpen className="w-3.5 h-3.5 text-cyan-700" />
                  ) : (
                    <Headphones className="w-3.5 h-3.5 text-cyan-700" />
                  )}
                  <span>{task.resource.title}</span>
                  {task.resource.author && <span className="text-cyan-600 font-normal">by {task.resource.author}</span>}
                </div>
                {task.resource.url && (
                  <a
                    href={task.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-extrabold text-cyan-800 hover:underline flex items-center gap-1 shrink-0"
                  >
                    Open Resource <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-cyan-800 font-medium">
                {task.pageRange && (
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-cyan-300/60 font-mono">
                    Pages: {task.pageRange}
                  </span>
                )}
                {task.timestampRange && (
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-cyan-300/60 font-mono">
                    Timestamp: {task.timestampRange}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Reflection / Discussion Questions */}
          {task.discussionQuestions && (
            <div className="text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200 flex items-start gap-2 mt-2">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-900 block">Journal Reflection Prompt:</span>
                <span>{task.discussionQuestions}</span>
              </div>
            </div>
          )}

          {task.instructions && (
            <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2 mt-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{task.instructions}</span>
            </div>
          )}

          {task.resourceUrl && !task.resource && (
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
        {isReadOnly ? (
          <div className="flex flex-col items-center justify-center p-2 text-slate-400 bg-slate-100 rounded-xl" title={readOnlyMessage || 'Read-only view'}>
            <Lock className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-bold mt-1 text-slate-500 uppercase">Preview</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
