'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { Users, MessageSquare, Plus, X } from 'lucide-react';

export default function FollowUpDashboard() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAssignedParticipants();
      setParticipants(res.participants);
    } catch (err) {
      console.error('Failed to load follow up participants:', err);
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
      await api.addFollowUpNote(selectedParticipant.id, noteContent);
      setNoteContent('');
      await loadData();
      // Update local modal data
      setSelectedParticipant((prev: any) => ({
        ...prev,
        notes: [
          { id: Date.now(), noteContent, createdAt: new Date().toISOString() },
          ...(prev.notes || []),
        ],
      }));
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="space-y-1">
          <Badge variant="active">Follow-Up System</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Assigned Cohort Monitoring</h1>
          <p className="text-xs text-slate-500">Surface factual activity trends to reach out to participants effectively</p>
        </div>

        {/* Factual Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card variant="glass" className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Cohort</span>
            <div className="text-2xl font-black text-emerald-600">
              {participants.filter((p) => p.status === 'ACTIVE').length} / {participants.length} Active
            </div>
          </Card>

          <Card variant="glass" className="space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Needs Attention</span>
            <div className="text-2xl font-black text-amber-600">
              {participants.filter((p) => p.status === 'NEEDS_ATTENTION').length} Participants
            </div>
          </Card>

          <Card variant="glass" className="space-y-1">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">Inactive (&gt;48h)</span>
            <div className="text-2xl font-black text-rose-600">
              {participants.filter((p) => p.status === 'INACTIVE').length} Participants
            </div>
          </Card>
        </div>

        {/* Participants Monitoring Table */}
        <Card variant="glass" className="p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Assigned Sub-Group Roster
            </h3>
            <span className="text-xs text-slate-500">Showing {participants.length} assigned participants</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading assigned participants...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100/70">
                    <th className="p-3 sm:p-4 pl-4 sm:pl-6">Participant</th>
                    <th className="p-3 sm:p-4">Today</th>
                    <th className="p-3 sm:p-4">This Week</th>
                    <th className="p-3 sm:p-4">Last Active</th>
                    <th className="p-3 sm:p-4">Factual Status</th>
                    <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 sm:p-4 pl-4 sm:pl-6 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={p.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                          alt={p.fullName}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="block font-bold truncate max-w-[120px] sm:max-w-none">{p.fullName}</span>
                          <span className="text-[11px] text-slate-500 font-normal truncate block">{p.email}</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-bold text-brand-600">{p.todayProgress}</td>
                      <td className="p-3 sm:p-4 font-semibold text-slate-600">{p.weeklyProgress}</td>
                      <td className="p-3 sm:p-4 text-xs font-mono text-slate-500">{p.lastActive}</td>
                      <td className="p-3 sm:p-4">
                        <Badge
                          variant={
                            p.status === 'ACTIVE'
                              ? 'active'
                              : p.status === 'NEEDS_ATTENTION'
                              ? 'attention'
                              : 'inactive'
                          }
                        >
                          {p.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => setSelectedParticipant(p)}
                        >
                          View Details & Notes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Participant Deep Dive Drawer / Modal */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto bg-white">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <img
                  src={selectedParticipant.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedParticipant.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-600"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedParticipant.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedParticipant.email} • {selectedParticipant.phone}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={selectedParticipant.status === 'ACTIVE' ? 'active' : 'attention'}>
                      {selectedParticipant.status}
                    </Badge>
                    <span className="text-xs text-amber-700 font-bold">
                      Streak: {selectedParticipant.currentStreak} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Contact Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-medium">Reach out via WhatsApp or Phone call:</span>
                <a
                  href={`https://wa.me/${selectedParticipant.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="gold" size="sm" className="w-full sm:w-auto flex items-center justify-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Message on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Follow Up Notes Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Follow-up Activity Ledger</h4>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    placeholder="Add factual follow-up note (e.g., Contacted via WhatsApp on 10 AM)..."
                    rows={2}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium placeholder:text-slate-400"
                  />
                  <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingNote}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Follow-up Note
                  </Button>
                </form>

                <div className="space-y-2 pt-2">
                  {selectedParticipant.notes && selectedParticipant.notes.length > 0 ? (
                    selectedParticipant.notes.map((note: any) => (
                      <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <p className="text-xs text-slate-800">{note.noteContent}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Logged at {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No follow-up notes logged yet.</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
