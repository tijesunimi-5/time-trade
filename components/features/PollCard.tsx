'use client';

import React, { useState, useEffect } from 'react';
import { Check, CheckSquare, Square, Circle, CheckCircle2, BarChart2, MessageSquare, Info, Award } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from '../../store/useToastStore';

export interface PollOptionData {
  id: string;
  text: string;
  displayOrder: number;
  voteCount: number;
  percentage: number;
  hasVoted?: boolean;
}

export interface PollData {
  id: string;
  question: string;
  description?: string | null;
  allowMultiple: boolean;
  isStandalone?: boolean;
  status: string; // 'ACTIVE', 'CLOSED', 'DRAFT'
  totalVotes: number;
  hasVoted: boolean;
  userVotedOptionIds?: string[];
  options: PollOptionData[];
  taskTitle?: string | null;
}

interface PollCardProps {
  poll: PollData;
  onVoteSuccess?: (updatedPoll: PollData) => void;
  isReadOnly?: boolean;
  variant?: 'embedded' | 'standalone' | 'modal';
}

export const PollCard: React.FC<PollCardProps> = ({
  poll: initialPoll,
  onVoteSuccess,
  isReadOnly = false,
  variant = 'standalone',
}) => {
  const [poll, setPoll] = useState<PollData>(initialPoll);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    initialPoll.userVotedOptionIds || initialPoll.options.filter((o) => o.hasVoted).map((o) => o.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPoll(initialPoll);
    setSelectedOptionIds(
      initialPoll.userVotedOptionIds || initialPoll.options.filter((o) => o.hasVoted).map((o) => o.id) || []
    );
  }, [initialPoll]);

  const isClosed = poll.status === 'CLOSED';

  const handleOptionToggle = (optionId: string) => {
    if (isClosed || isReadOnly) return;

    if (poll.allowMultiple) {
      setSelectedOptionIds((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleVoteSubmit = async () => {
    if (selectedOptionIds.length === 0) {
      toast.error('Selection Required', 'Please select at least one option before submitting your vote.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.votePoll(poll.id, selectedOptionIds);
      if (res.poll) {
        setPoll(res.poll);
        toast.success('Vote Submitted', 'Your vote has been recorded on the poll.');
        if (onVoteSuccess) {
          onVoteSuccess(res.poll);
        }
      }
    } catch (err: any) {
      console.error('Failed to submit vote:', err);
      toast.error('Vote Error', err.message || 'Unable to save vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClasses =
    variant === 'embedded'
      ? 'bg-gradient-to-br from-emerald-900/5 via-teal-900/10 to-emerald-900/5 p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-subtle-sm my-3'
      : variant === 'modal'
      ? 'bg-white p-5 sm:p-6 rounded-2xl space-y-4'
      : 'bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md space-y-4';

  return (
    <div className={containerClasses}>
      {/* Poll Header */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 border border-emerald-300/80">
              <BarChart2 className="w-3 h-3 text-emerald-700" />
              WhatsApp Style Poll
            </span>
            {poll.allowMultiple && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Multiple Answers
              </span>
            )}
            {variant === 'embedded' && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600" />
                No Credits Awarded
              </span>
            )}
          </div>

          {isClosed && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-slate-200 text-slate-700">
              Poll Closed
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {poll.question}
        </h3>

        {poll.description && (
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{poll.description}</p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2.5 pt-1">
        {poll.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const hasUserVotedThis = poll.userVotedOptionIds?.includes(option.id) || option.hasVoted;

          return (
            <div
              key={option.id}
              onClick={() => handleOptionToggle(option.id)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer p-3 sm:p-3.5 select-none ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-slate-100/60'
              } ${isClosed ? 'cursor-default' : ''}`}
            >
              {/* WhatsApp-style percentage progress fill behind option text */}
              {(poll.hasVoted || isClosed) && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-200/40 transition-all duration-500 rounded-r-lg"
                  style={{ width: `${Math.max(0, Math.min(100, option.percentage))}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Choice selection indicator */}
                  <div className="shrink-0">
                    {poll.allowMultiple ? (
                      isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )
                    ) : isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-bold leading-normal truncate ${
                      isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'
                    }`}
                  >
                    {option.text}
                  </span>
                </div>

                {/* Percentage & Vote Count Info */}
                {(poll.hasVoted || isClosed) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {hasUserVotedThis && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-200/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> You
                      </span>
                    )}
                    <span className="text-xs font-black text-slate-700 font-mono">
                      {option.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">
                      ({option.voteCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer & Tally */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {poll.totalVotes} {poll.totalVotes === 1 ? 'participant has' : 'participants have'} voted
          </span>
        </div>

        {!isClosed && !isReadOnly && (
          <button
            onClick={handleVoteSubmit}
            disabled={isSubmitting || selectedOptionIds.length === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Saving Vote...</span>
            ) : poll.hasVoted ? (
              <span>Update My Vote</span>
            ) : (
              <span>Cast My Vote</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
