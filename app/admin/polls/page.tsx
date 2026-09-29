'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { PollCard } from '../../../components/features/PollCard';
import { api } from '../../../services/api';
import { toast } from '../../../store/useToastStore';
import { BarChart2, Plus, Trash2, Eye, CheckCircle, XCircle, Users, CheckSquare, MessageSquare, AlertTriangle, Layers, X, Clock, Pencil, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [scopeType, setScopeType] = useState<'STANDALONE' | 'DAY' | 'TASK'>('STANDALONE');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [showAsPopup, setShowAsPopup] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [options, setOptions] = useState<any[]>([
    { text: 'Option 1', displayOrder: 1 },
    { text: 'Option 2', displayOrder: 2 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Voters Detail Modal State
  const [selectedVoterPoll, setSelectedVoterPoll] = useState<any | null>(null);

  const loadAdminPolls = async () => {
    try {
      setIsLoading(true);
      const [pollsRes, tasksRes, progRes] = await Promise.all([
        api.getAdminPolls().catch(() => ({ polls: [] })),
        api.getTodayTasks().catch(() => ({ tasks: [] })),
        api.getCurrentProgramme().catch(() => null),
      ]);

      setPolls(pollsRes?.polls || []);
      setTasks(tasksRes?.tasks || []);
      if (progRes?.currentDayNumber) {
        setSelectedDayNumber(progRes.currentDayNumber);
      }
    } catch (err) {
      console.error('Failed to load admin polls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminPolls();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPollId(null);
    setQuestion('');
    setDescription('');
    setAllowMultiple(false);
    setScopeType('STANDALONE');
    setShowAsPopup(false);
    setSelectedTaskId('');
    setOptions([
      { text: 'Option 1', displayOrder: 1 },
      { text: 'Option 2', displayOrder: 2 },
    ]);
    setShowCreateModal(true);
  };

  const handleOpenEditPoll = (poll: any) => {
    setEditingPollId(poll.id);
    setQuestion(poll.question || '');
    setDescription(poll.description || '');
    setAllowMultiple(!!poll.allowMultiple);
    if (poll.dayNumber) {
      setScopeType('DAY');
      setSelectedDayNumber(poll.dayNumber);
    } else if (poll.taskId) {
      setScopeType('TASK');
      setSelectedTaskId(poll.taskId);
    } else {
      setScopeType('STANDALONE');
    }
    setShowAsPopup(!!poll.showAsPopup);
    setSelectedTaskId(poll.taskId || '');
    setOptions(
      poll.options?.map((o: any, idx: number) => ({
        id: o.id,
        text: o.text || '',
        displayOrder: o.displayOrder || idx + 1,
      })) || [
        { text: 'Option 1', displayOrder: 1 },
        { text: 'Option 2', displayOrder: 2 },
      ]
    );
    setShowCreateModal(true);
  };

  const handleAddOptionField = () => {
    setOptions((prev) => [...prev, { text: `Option ${prev.length + 1}`, displayOrder: prev.length + 1 }]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (options.length <= 2) {
      toast.error('Minimum Options', 'A poll must have at least 2 options.');
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionTextChange = (index: number, val: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      if (typeof updated[index] === 'string') {
        updated[index] = { text: val, displayOrder: index + 1 };
      } else {
        updated[index] = { ...updated[index], text: val };
      }
      return updated;
    });
  };

  const moveOptionUp = (index: number) => {
    if (index <= 0) return;
    setOptions((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  const moveOptionDown = (index: number) => {
    setOptions((prev) => {
      if (index >= prev.length - 1) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  const handleSavePoll = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error('Question Required', 'Please enter a poll question.');
      return;
    }

    const cleanOpts = options
      .map((o, idx) => ({
        id: o.id || undefined,
        text: (typeof o === 'string' ? o : o.text || '').trim(),
        displayOrder: idx + 1,
      }))
      .filter((o) => o.text.length > 0);

    if (cleanOpts.length < 2) {
      toast.error('Minimum Options', 'At least 2 valid options are required.');
      return;
    }

    if (scopeType === 'TASK' && !selectedTaskId) {
      toast.error('Task Selection Required', 'Please choose a task to attach this poll to.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        question: question.trim(),
        description: description.trim() || null,
        allowMultiple,
        isStandalone: scopeType === 'STANDALONE',
        showAsPopup,
        dayNumber: scopeType === 'DAY' ? selectedDayNumber : null,
        taskId: scopeType === 'TASK' ? selectedTaskId : null,
        options: cleanOpts,
      };

      if (editingPollId) {
        await api.updatePoll(editingPollId, payload);
        toast.success('Poll Updated', 'Poll and option order updated successfully.');
      } else {
        await api.createPoll(payload);
        toast.success('Poll Published', 'New WhatsApp-style poll published successfully.');
      }

      setShowCreateModal(false);
      loadAdminPolls();
    } catch (err: any) {
      console.error('Failed to save poll:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (pollId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.updatePollStatus(pollId, newStatus);
      toast.success('Status Updated', `Poll status changed to ${newStatus}`);
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll and all its votes?')) return;

    try {
      await api.deletePoll(pollId);
      toast.success('Poll Deleted', 'Poll removed successfully.');
      setPolls((prev) => prev.filter((p) => p.id !== pollId));
    } catch (err: any) {
      console.error('Failed to delete poll:', err);
    }
  };

  const activePollsCount = polls.filter((p) => p.status === 'ACTIVE').length;
  const totalVotesAcrossPolls = polls.reduce((acc, p) => acc + (p.totalVotersCount || 0), 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="nonNegotiable">EXCO SURVEY ENGINE</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              WhatsApp-Style Polls & Surveys
            </h1>
            <p className="text-xs text-slate-500">
              Create instant polls for dashboard announcements or attach feedback surveys to daily tasks
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New WhatsApp Poll</span>
          </Button>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card variant="glass" className="space-y-1 p-4 sm:p-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Total Polls
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{polls.length}</div>
          </Card>

          <Card variant="glass" className="space-y-1 p-4 sm:p-6">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              Active Polls
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{activePollsCount}</div>
          </Card>

          <Card variant="glass" className="space-y-1 p-4 sm:p-6">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">
              Total Participant Voters
            </span>
            <div className="text-2xl sm:text-3xl font-black text-brand-600">{totalVotesAcrossPolls}</div>
          </Card>

          <Card variant="glass" className="space-y-1 p-4 sm:p-6">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
              Task Attached Polls
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {polls.filter((p) => p.taskId).length}
            </div>
          </Card>
        </div>

        {/* Admin Polls List */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            All Cohort Polls ({polls.length})
          </h2>

          {isLoading ? (
            <Loader variant="card" text="Loading EXCO poll manager..." />
          ) : polls.length === 0 ? (
            <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl space-y-3">
              <BarChart2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No polls have been created yet.</p>
              <p className="text-xs text-slate-500">Click "+ Create New WhatsApp Poll" to launch your first poll!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Poll Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {poll.taskId ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded border border-amber-300">
                            Attached to Task: {poll.taskTitle || 'Task'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300">
                            Dashboard Standalone {poll.showAsPopup ? '(Popup Enabled)' : ''}
                          </span>
                        )}
                        {poll.allowMultiple && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Multi-Select
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleStatus(poll.id, poll.status)}
                        className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded transition-colors ${
                          poll.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {poll.status}
                      </button>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {poll.question}
                    </h3>
                    {poll.description && (
                      <p className="text-xs text-slate-500">{poll.description}</p>
                    )}

                    {/* Poll Option Percentage Progress Bars */}
                    <div className="space-y-2 pt-2">
                      {poll.options.map((opt: any) => (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span className="truncate pr-2">{opt.text}</span>
                            <span className="font-mono text-slate-600 shrink-0">
                              {opt.percentage}% ({opt.voteCount} votes)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(0, Math.min(100, opt.percentage))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Poll Card Footer Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedVoterPoll(poll)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{poll.totalVotersCount} Voters Breakdown</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditPoll(poll)}
                        className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100"
                        title="Edit Poll & Options"
                      >
                        <Pencil className="w-4 h-4 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete Poll"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE POLL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {editingPollId ? 'Edit WhatsApp Poll & Options' : 'Create WhatsApp-Style Poll'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePoll} className="space-y-4">
              {/* Poll Question */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Poll Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Which time works best for our weekend live workshop?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              {/* Description / Context */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Context / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or guidelines for participants..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Scope Selection */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Poll Publishing Scope</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setScopeType('STANDALONE')}
                    className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      scopeType === 'STANDALONE'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    📢 Standalone
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeType('DAY')}
                    className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      scopeType === 'DAY'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    📅 Day Tasks
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeType('TASK')}
                    className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      scopeType === 'TASK'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    📌 Specific Task
                  </button>
                </div>

                {scopeType === 'DAY' && (
                  <div className="pt-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Select Programme Day</label>
                    <select
                      value={selectedDayNumber}
                      onChange={(e) => setSelectedDayNumber(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-cyan-500 outline-none font-bold"
                    >
                      {Array.from({ length: 90 }, (_, i) => i + 1).map((dNum) => (
                        <option key={dNum} value={dNum}>
                          Day {dNum} {dNum === selectedDayNumber ? '(Selected / Current)' : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-cyan-800 font-medium">
                      Poll will automatically display alongside Day {selectedDayNumber}'s growth tasks for all participants.
                    </p>
                  </div>
                )}

                {scopeType === 'TASK' && (
                  <div className="pt-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Select Target Task</label>
                    <select
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="">-- Select Task --</option>
                      {tasks.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.pillar})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAsPopup}
                    onChange={(e) => setShowAsPopup(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Prompt as interactive pop-up modal on participant dashboard</span>
                </label>
              </div>

              {/* Allow Multiple Choice Toggle */}
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => setAllowMultiple(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Allow Multiple Answer Selections</span>
                  <span className="text-[10px] text-slate-500">
                    Participants can pick more than one option (WhatsApp poll style)
                  </span>
                </div>
              </label>

              {/* Poll Options Builder with Rearrange Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Poll Options (Min 2, Rearrange with ▲ / ▼) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {options.map((optObj, idx) => {
                    const optVal = typeof optObj === 'string' ? optObj : optObj.text || '';
                    return (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-50/70 p-1.5 rounded-xl border border-slate-200">
                        {/* Rearrange Up / Down Buttons */}
                        <div className="flex flex-col items-center justify-center shrink-0 -space-y-1">
                          <button
                            type="button"
                            onClick={() => moveOptionUp(idx)}
                            disabled={idx === 0}
                            title="Move Option Up"
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-200/70 disabled:opacity-30 rounded"
                          >
                            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveOptionDown(idx)}
                            disabled={idx === options.length - 1}
                            title="Move Option Down"
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-200/70 disabled:opacity-30 rounded"
                          >
                            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-500 w-4 shrink-0 font-mono text-center">
                          {idx + 1}.
                        </span>

                        <input
                          type="text"
                          required
                          placeholder={`Option ${idx + 1}`}
                          value={optVal}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                        />

                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionField(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Remove Option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingPollId
                    ? 'Update Poll & Options'
                    : 'Publish WhatsApp Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VOTERS BREAKDOWN MODAL */}
      {selectedVoterPoll && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Voters Breakdown</h3>
                <p className="text-xs text-slate-500 truncate">{selectedVoterPoll.question}</p>
              </div>
              <button
                onClick={() => setSelectedVoterPoll(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedVoterPoll.options.map((opt: any) => (
                <div key={opt.id} className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span>{opt.text}</span>
                    <span className="font-mono text-emerald-700">
                      {opt.percentage}% ({opt.voters?.length || 0} votes)
                    </span>
                  </div>

                  {opt.voters && opt.voters.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opt.voters.map((voter: any) => (
                        <span
                          key={voter.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                        >
                          {voter.fullName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No votes recorded for this option yet.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVoterPoll(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
