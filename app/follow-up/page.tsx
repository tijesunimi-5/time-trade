'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserInitialsAvatar } from '../../components/ui/UserInitialsAvatar';
import { api } from '../../services/api';
import { toast } from '../../store/useToastStore';
import {
  Users,
  MessageSquare,
  Plus,
  X,
  Phone,
  Mail,
  Calendar,
  Flame,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Zap,
} from 'lucide-react';

interface FollowUpParticipant {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  profile?: {
    birthday?: string;
    ageRange?: string;
    goals?: string;
    expectations?: string;
    customAnswers?: string;
  };
  currentStreak: number;
  longestStreak: number;
  isProtected?: boolean;
  todayProgress: string;
  todayCompletedCount: number;
  totalTodayActiveTasks: number;
  totalCompletedCount: number;
  overallPercentage: number;
  lastActive: string;
  riskSegment: 'HIGH' | 'MEDIUM' | 'NORMAL';
  systemRecommendation: string;
  isAssignedToMe?: boolean;
  notes?: any[];
}

export default function FollowUpDashboard() {
  const [participants, setParticipants] = useState<FollowUpParticipant[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'MY_ASSIGNED'>('ALL');

  const [selectedParticipant, setSelectedParticipant] = useState<FollowUpParticipant | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [partsRes, fieldsRes, formsRes] = await Promise.all([
        api.getAssignedParticipants().catch(() => ({ participants: [] })),
        api.getDynamicFormFields().catch(() => ({ fields: [] })),
        api.getAllForms().catch(() => ({ forms: [] })),
      ]);

      if (partsRes.participants) setParticipants(partsRes.participants);

      // Build question label map
      const qMap: Record<string, string> = {};
      if (fieldsRes.fields) {
        fieldsRes.fields.forEach((f: any) => {
          qMap[f.fieldName] = f.label;
        });
      }
      if (formsRes.forms) {
        formsRes.forms.forEach((form: any) => {
          if (Array.isArray(form.fields)) {
            form.fields.forEach((f: any) => {
              qMap[f.fieldName] = f.label;
            });
          }
        });
      }
      setQuestionsMap(qMap);
    } catch (err) {
      console.error('Failed to load follow up data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !noteContent.trim()) return;

    try {
      setIsSubmittingNote(true);
      const res = await api.addFollowUpNote(selectedParticipant.id, noteContent.trim());
      setNoteContent('');
      toast.success('Note Logged', 'Follow-up interaction note saved.');
      
      const newNote = res.note || {
        id: Date.now(),
        noteContent: noteContent.trim(),
        createdAt: new Date().toISOString(),
        author: { fullName: 'You' },
      };

      // Update local state
      setSelectedParticipant((prev: any) => ({
        ...prev,
        notes: [newNote, ...(prev?.notes || [])],
      }));

      loadData();
    } catch (err: any) {
      toast.error('Failed to save note', err.message || 'Unable to add note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const parseAnswers = (customAnswersJson?: string) => {
    if (!customAnswersJson) return [];
    try {
      const parsed = JSON.parse(customAnswersJson);
      return Object.entries(parsed).map(([key, val]) => ({
        question: questionsMap[key] || key,
        answer: Array.isArray(val) ? val.join(', ') : String(val),
      }));
    } catch {
      return [];
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeSegment === 'HIGH') return p.riskSegment === 'HIGH';
    if (activeSegment === 'MEDIUM') return p.riskSegment === 'MEDIUM';
    if (activeSegment === 'NORMAL') return p.riskSegment === 'NORMAL';
    if (activeSegment === 'MY_ASSIGNED') return !!p.isAssignedToMe;
    return true; // 'ALL'
  });

  const highRiskCount = participants.filter((p) => p.riskSegment === 'HIGH').length;
  const mediumRiskCount = participants.filter((p) => p.riskSegment === 'MEDIUM').length;
  const normalCount = participants.filter((p) => p.riskSegment === 'NORMAL').length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">EXCO & FOLLOW-UP TOOLKIT</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cohort Follow-Up & Risk Intelligence
            </h1>
            <p className="text-xs text-slate-500">
              System flags members missing tasks, highlights streaks, and streamlines reach-out via WhatsApp & phone calls.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search member by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Factual Risk Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card variant="glass" className="space-y-1 bg-gradient-to-br from-rose-50 to-white border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> High Risk (Flagged)
              </span>
              <span className="text-xs font-bold text-rose-600">{highRiskCount} Members</span>
            </div>
            <div className="text-2xl font-black text-rose-700">{highRiskCount} Flagged</div>
            <p className="text-[11px] text-rose-600 font-medium">Missed 2+ consecutive days or 0 streak</p>
          </Card>

          <Card variant="glass" className="space-y-1 bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Needs Encouragement
              </span>
              <span className="text-xs font-bold text-amber-700">{mediumRiskCount} Members</span>
            </div>
            <div className="text-2xl font-black text-amber-700">{mediumRiskCount} Attention</div>
            <p className="text-[11px] text-amber-700 font-medium">Missed yesterday or incomplete today</p>
          </Card>

          <Card variant="glass" className="space-y-1 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> On Track / Consistent
              </span>
              <span className="text-xs font-bold text-emerald-700">{normalCount} Members</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">{normalCount} Active</div>
            <p className="text-[11px] text-emerald-700 font-medium">Strong streak and active completions</p>
          </Card>
        </div>

        {/* Risk Filter Segment Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSegment('ALL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSegment === 'ALL'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            All Cohort ({participants.length})
          </button>

          <button
            onClick={() => setActiveSegment('HIGH')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSegment === 'HIGH'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            🔴 High Risk ({highRiskCount})
          </button>

          <button
            onClick={() => setActiveSegment('MEDIUM')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSegment === 'MEDIUM'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Zap className="w-4 h-4" />
            🟡 Medium Risk ({mediumRiskCount})
          </button>

          <button
            onClick={() => setActiveSegment('NORMAL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSegment === 'NORMAL'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            🟢 On Track ({normalCount})
          </button>
        </div>

        {/* Participants Table */}
        <Card variant="glass" className="p-0 overflow-hidden bg-white shadow-subtle">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading cohort participants...</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              No participants found in this filter view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Participant</th>
                    <th className="py-3.5 px-4">Contact & Reach-out</th>
                    <th className="py-3.5 px-4">Streak Status</th>
                    <th className="py-3.5 px-4">Task Completion</th>
                    <th className="py-3.5 px-4">System Intelligence & Action</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredParticipants.map((p) => {
                    const cleanPhone = p.phone ? p.phone.replace(/[^0-9]/g, '') : '';
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Initials Avatar */}
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                          <div
                            onClick={() => setSelectedParticipant(p)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <UserInitialsAvatar
                              fullName={p.fullName}
                              allNamesInList={participants.map((item) => item.fullName)}
                              size="sm"
                            />
                            <div>
                              <span className="block text-slate-900 group-hover:text-brand-600 transition-colors">
                                {p.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 font-normal">{p.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Phone & Direct WhatsApp Action */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-semibold">{p.phone || 'N/A'}</span>
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open Direct WhatsApp Chat"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-[10px] transition-colors"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-700" /> WhatsApp
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Streak */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-xs">
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {p.currentStreak} Days
                            </span>
                            {p.isProtected && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300"
                                title="Streak Protected by Admin"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Protected
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Task Completion Ratio */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-800">
                              {p.todayProgress} <span className="text-slate-400 font-normal">today</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {p.totalCompletedCount} total done ({p.overallPercentage}%)
                            </div>
                          </div>
                        </td>

                        {/* System Recommendation */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 max-w-xs">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                p.riskSegment === 'HIGH'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : p.riskSegment === 'MEDIUM'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {p.riskSegment === 'HIGH' ? '🔴 HIGH RISK' : p.riskSegment === 'MEDIUM' ? '🟡 MEDIUM RISK' : '🟢 ON TRACK'}
                            </span>
                            <p className="text-[11px] text-slate-600 font-normal leading-tight">
                              {p.systemRecommendation}
                            </p>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedParticipant(p)}
                            className="text-xs py-1 px-2.5"
                          >
                            Full Profile & Notes
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Participant Deep Dive Drawer Modal */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <UserInitialsAvatar
                      fullName={selectedParticipant.fullName}
                      allNamesInList={participants.map((item) => item.fullName)}
                      size="lg"
                    />
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        {selectedParticipant.fullName}
                      </h2>
                      <span className="text-xs text-slate-500">{selectedParticipant.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Performance Stats Cards */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Current Streak</span>
                    <span className="text-lg font-black text-amber-600 flex items-center gap-1">
                      🔥 {selectedParticipant.currentStreak} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Total Tasks Done</span>
                    <span className="text-lg font-black text-slate-900">
                      {selectedParticipant.totalCompletedCount} Tasks
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Last Active</span>
                    <span className="font-bold text-slate-700">{selectedParticipant.lastActive}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Consistency Rating</span>
                    <span className="font-bold text-purple-700">{selectedParticipant.overallPercentage}%</span>
                  </div>
                </div>

                {/* Direct Reach-Out Action Buttons */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="text-xs font-bold text-emerald-900">Direct Contact Options</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedParticipant.phone ? (
                      <>
                        <a
                          href={`https://wa.me/${selectedParticipant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${selectedParticipant.fullName}, checking in from the TIME TRADE 90-Day Challenge!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                        >
                          <MessageSquare className="w-4 h-4" /> WhatsApp Message
                        </a>
                        <a
                          href={`tel:${selectedParticipant.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-100"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" /> Phone Call
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">No phone number recorded.</span>
                    )}
                  </div>
                </div>

                {/* Submitted Question Answers Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-600" /> Profile & Registration Responses
                  </h3>

                  {selectedParticipant.profile?.expectations && (
                    <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1">
                      <div className="text-xs font-bold text-brand-900">Expectations & Goals</div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {selectedParticipant.profile.expectations}
                      </p>
                    </div>
                  )}

                  {parseAnswers(selectedParticipant.profile?.customAnswers).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                      <div className="text-xs font-bold text-slate-900">{item.question}</div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.answer || 'No response provided'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Follow Up Notes Ledger */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                    Follow-Up Activity Ledger
                  </h3>

                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      placeholder="Add follow-up notes (e.g., Called via WhatsApp on 10 AM, agreed to complete today's task)..."
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingNote} className="text-xs font-bold">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Save Interaction Note
                    </Button>
                  </form>

                  <div className="space-y-2">
                    {selectedParticipant.notes && selectedParticipant.notes.length > 0 ? (
                      selectedParticipant.notes.map((note: any) => (
                        <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Author: {note.author?.fullName || 'EXCO Member'}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed font-medium">{note.noteContent}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl">
                        No previous interaction notes logged for this member.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button variant="glass" size="sm" className="w-full" onClick={() => setSelectedParticipant(null)}>
                  Close Drawer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
