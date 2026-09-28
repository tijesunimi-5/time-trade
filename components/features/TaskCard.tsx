import React from 'react';
import { Check, Clock, ExternalLink, BookOpen, Headphones, MessageSquare, AlertCircle, Lock, Download, Video, FileText, Mic } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface Task {
  id: string;
  title: string;
  description: string;
  pillar: string;
  category?: string;
  taskType?: string;
  timeOfDay?: string;
  frequencyType?: string;
  isNonNegotiable: boolean;
  isOptional?: boolean;
  durationMinutes?: number;
  pageRange?: string;
  timestampRange?: string;
  discussionQuestions?: string;
  resourceUrl?: string;
  fileUrl?: string;
  fileName?: string;
  instructions?: string;
  isCompleted?: boolean;
  resource?: {
    id: string;
    title: string;
    type: string;
    author?: string;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    accessType?: string;
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

  const getTimeOfDayBadge = (tod?: string) => {
    switch (tod) {
      case 'MORNING':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">🌅 MORNING</span>;
      case 'AFTERNOON':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200">☀️ AFTERNOON</span>;
      case 'NIGHT':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200">🌙 NIGHT</span>;
      default:
        return null;
    }
  };

  const renderResourceActionButtons = () => {
    const res = task.resource;
    const directUrl = task.resourceUrl || res?.url;
    const directFileUrl = task.fileUrl || res?.fileUrl;
    const fileName = task.fileName || res?.fileName;

    const API_HOST = (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '')
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
      : 'https://time-trade-backend.onrender.com';

    const getFullUrl = (url?: string) => {
      if (!url) return '#';
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
      return `${API_HOST}${url}`;
    };

    if (!res && !directUrl && !directFileUrl) return null;

    const resType = res?.type?.toUpperCase() || (directFileUrl ? 'BOOK' : 'EXTERNAL_LINK');

    return (
      <div className="mt-3 p-3.5 bg-gradient-to-r from-cyan-50/90 via-sky-50/70 to-blue-50/90 rounded-xl border border-cyan-200/90 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-950">
            {resType === 'BOOK' || resType === 'DOCUMENT' ? (
              <BookOpen className="w-4 h-4 text-cyan-700 shrink-0" />
            ) : resType === 'VIDEO' ? (
              <Video className="w-4 h-4 text-rose-600 shrink-0" />
            ) : resType === 'PODCAST' ? (
              <Headphones className="w-4 h-4 text-purple-600 shrink-0" />
            ) : resType === 'SERMON' ? (
              <Mic className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="line-clamp-1">{res?.title || task.title}</span>
            {res?.author && <span className="text-cyan-700 font-medium">by {res.author}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Softcopy Download / Open File Button */}
            {directFileUrl && (
              <a
                href={getFullUrl(directFileUrl)}
                download={fileName || true}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Softcopy (PDF)</span>
              </a>
            )}

            {/* External URL Action Button */}
            {directUrl && (
              <a
                href={getFullUrl(directUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs shadow-sm transition-all shrink-0 ${
                  resType === 'VIDEO'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : resType === 'PODCAST'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : resType === 'SERMON'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                {resType === 'VIDEO' ? (
                  <>
                    <Video className="w-3.5 h-3.5" /> Watch Video
                  </>
                ) : resType === 'PODCAST' ? (
                  <>
                    <Headphones className="w-3.5 h-3.5" /> Listen to Podcast
                  </>
                ) : resType === 'SERMON' ? (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Listen to Sermon
                  </>
                ) : resType === 'ARTICLE' ? (
                  <>
                    <FileText className="w-3.5 h-3.5" /> Read Article
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" /> Open Link
                  </>
                )}
              </a>
            )}
          </div>
        </div>

        {/* Page range / Timestamp range details */}
        {(task.pageRange || task.timestampRange) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-cyan-900 font-medium">
            {task.pageRange && (
              <span className="bg-white px-2 py-0.5 rounded-md border border-cyan-300/80 font-mono">
                📖 Pages: {task.pageRange}
              </span>
            )}
            {task.timestampRange && (
              <span className="bg-white px-2 py-0.5 rounded-md border border-cyan-300/80 font-mono">
                ⏱️ Timestamp: {task.timestampRange}
              </span>
            )}
          </div>
        )}
      </div>
    );
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
            <Badge variant={task.pillar?.toLowerCase()}>{task.pillar}</Badge>
            {getTaskTypeBadge(task.taskType)}
            {getTimeOfDayBadge(task.timeOfDay)}
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

          {/* Interactive Media / Resource / Softcopy Download Actions */}
          {renderResourceActionButtons()}

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
