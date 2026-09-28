'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { UserInitialsAvatar } from '../../../components/ui/UserInitialsAvatar';
import { api } from '../../../services/api';
import { toast } from '../../../store/useToastStore';
import {
  Users,
  Search,
  Eye,
  X,
  Calendar,
  Phone,
  Mail,
  Shield,
  FileText,
  UserCheck,
  UserPlus,
  Pencil,
  Check,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Participant {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  rolesList: string[];
  createdAt: string;
  profile?: {
    birthday?: string;
    ageRange?: string;
    goals?: string;
    expectations?: string;
    customAnswers?: string;
  };
  streak?: {
    currentStreak: number;
    totalCompleted: number;
    overallPercentage: number;
    isProtected?: boolean;
    bonusStreak?: number;
  };
}

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'PARTICIPANTS' | 'ADMINS' | 'ALL'>('PARTICIPANTS');

  // Drawer, Role Modal & Streak Protection Modal States
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [editingRolesUser, setEditingRolesUser] = useState<Participant | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [editingStreakUser, setEditingStreakUser] = useState<Participant | null>(null);
  const [streakIsProtected, setStreakIsProtected] = useState<boolean>(false);
  const [streakBonusDays, setStreakBonusDays] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [partsRes, fieldsRes, formsRes] = await Promise.all([
        api.getAllParticipants(),
        api.getDynamicFormFields(),
        api.getAllForms(),
      ]);

      if (partsRes.participants) setParticipants(partsRes.participants);

      // Build comprehensive question label mapping from all forms & fields
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
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isUserAdminOrExco = (p: Participant) => {
    return p.rolesList.some((r) =>
      ['ADMIN', 'LEADERSHIP', 'EXCO', 'FOLLOW_UP', 'PROGRAM_PLANNING'].includes(r.toUpperCase())
    );
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeTab === 'PARTICIPANTS') return !isUserAdminOrExco(p);
    if (activeTab === 'ADMINS') return isUserAdminOrExco(p);
    return true; // 'ALL'
  });

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

  const handleOpenRoleModal = (user: Participant) => {
    setEditingRolesUser(user);
    setSelectedRoles([...user.rolesList]);
  };

  const toggleRoleSelection = (role: string) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length === 1) {
        toast.error('Role Required', 'User must have at least one role assigned.');
        return;
      }
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveRoles = async () => {
    if (!editingRolesUser) return;
    try {
      await api.updateUserRoles(editingRolesUser.id, { roles: selectedRoles });
      toast.success('Roles Updated', `Roles for "${editingRolesUser.fullName}" updated successfully.`);
      setEditingRolesUser(null);
      fetchData();
    } catch (err: any) {
      toast.error('Role Update Failed', err.message || 'Unable to update user roles');
    }
  };

  const handleOpenStreakModal = (user: Participant) => {
    setEditingStreakUser(user);
    setStreakIsProtected(user.streak?.isProtected || false);
    setStreakBonusDays(user.streak?.bonusStreak || 0);
  };

  const handleSaveStreakRepair = async () => {
    if (!editingStreakUser) return;
    try {
      await api.repairParticipantStreak({
        participantId: editingStreakUser.id,
        isProtected: streakIsProtected,
        bonusStreak: Number(streakBonusDays) || 0,
      });
      toast.success('Streak Repaired', `Streak protection and repair updated for "${editingStreakUser.fullName}".`);
      setEditingStreakUser(null);
      fetchData();
    } catch (err: any) {
      toast.error('Streak Repair Failed', err.message || 'Unable to update participant streak');
    }
  };

  const participantCount = participants.filter((p) => !isUserAdminOrExco(p)).length;
  const adminCount = participants.filter((p) => isUserAdminOrExco(p)).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">EXCO & PARTICIPANT DIRECTORY</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Member Directory & Registration Answers
            </h1>
            <p className="text-xs text-slate-500">
              Manage EXCO Admins and Participants separately, inspect submitted answers, and manage roles.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Categorization Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PARTICIPANTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'PARTICIPANTS'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Participants ({participantCount})
          </button>

          <button
            onClick={() => setActiveTab('ADMINS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ADMINS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admins & EXCO Team ({adminCount})
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            All Registered Members ({participants.length})
          </button>
        </div>

        {/* Directory Table Card */}
        <Card variant="glass" className="p-0 overflow-hidden bg-white shadow-subtle">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading members...</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              No members found in {activeTab.toLowerCase()} directory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Member Name</th>
                    <th className="py-3.5 px-4">Contact Details</th>
                    <th className="py-3.5 px-4">Assigned Roles</th>
                    <th className="py-3.5 px-4">Streak & Protection</th>
                    <th className="py-3.5 px-4">Registration Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredParticipants.map((p) => {
                    const isAdmin = isUserAdminOrExco(p);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <UserInitialsAvatar
                              fullName={p.fullName}
                              allNamesInList={participants.map((item) => item.fullName)}
                              size="sm"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{p.fullName}</span>
                                {isAdmin && (
                                  <span className="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                    EXCO / ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-normal">{p.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {p.phone || 'N/A'}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 items-center">
                            {p.rolesList.map((r, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  r === 'PARTICIPANT'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                            <button
                              onClick={() => handleOpenRoleModal(p)}
                              title="Edit User Roles"
                              className="text-slate-400 hover:text-brand-600 p-1 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-xs">
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {p.streak?.currentStreak || 0} Days
                            </span>
                            {p.streak?.isProtected && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300"
                                title="Streak Protection Active (Freeze on 2+ missed days)"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Protected
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenStreakModal(p)}
                              title="Protect / Repair Streak"
                              className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <Zap className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setSelectedParticipant(p)}
                              className="text-xs py-1 px-2.5"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View Answers
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Participant Answers Slide-Over Drawer Modal */}
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600">
                      MEMBER DETAILS
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedParticipant.fullName}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Information Pills */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="font-bold">Email:</span>
                    <span>{selectedParticipant.email}</span>
                  </div>

                  {selectedParticipant.phone && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">Phone:</span>
                      <span>{selectedParticipant.phone}</span>
                    </div>
                  )}

                  {selectedParticipant.profile?.birthday && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="font-bold">Date of Birth:</span>
                      <span>{selectedParticipant.profile.birthday}</span>
                    </div>
                  )}
                </div>

                {/* Submitted Question Answers Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-600" /> Submitted Registration Responses
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

                  {!selectedParticipant.profile?.expectations &&
                    parseAnswers(selectedParticipant.profile?.customAnswers).length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl">
                        No additional question answers submitted.
                      </div>
                    )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button variant="glass" size="sm" className="w-full" onClick={() => setSelectedParticipant(null)}>
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Role Edit Modal */}
        {editingRolesUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
              <h3 className="text-lg font-bold text-slate-900">
                Manage Roles for "{editingRolesUser.fullName}"
              </h3>
              <p className="text-xs text-slate-500">
                Toggle roles to promote user to EXCO Admin, Follow-Up team, or Participant.
              </p>

              <div className="space-y-2 py-2">
                {[
                  { role: 'PARTICIPANT', label: 'Participant (Standard Challenge Member)' },
                  { role: 'ADMIN', label: 'Admin (Full System Operations)' },
                  { role: 'LEADERSHIP', label: 'Leadership / EXCO Team' },
                  { role: 'FOLLOW_UP', label: 'Follow-Up Team Member' },
                  { role: 'PROGRAM_PLANNING', label: 'Program Planning Curator' },
                ].map((item) => {
                  const isChecked = selectedRoles.includes(item.role);
                  return (
                    <div
                      key={item.role}
                      onClick={() => toggleRoleSelection(item.role)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-brand-500 bg-brand-50/50 text-brand-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      {isChecked && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="glass" size="sm" onClick={() => setEditingRolesUser(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveRoles}>
                  Save User Roles
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Streak Protection & Repair Modal */}
        {editingStreakUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Streak Protection & Repair
                  </h3>
                  <p className="text-xs text-slate-500">{editingStreakUser.fullName}</p>
                </div>
              </div>

              <div className="space-y-4 py-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Calculated Streak:</span>
                    <span className="font-extrabold text-amber-600 ml-1.5">
                      🔥 {editingStreakUser.streak?.currentStreak || 0} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Completed Tasks:</span>
                    <span className="font-bold text-slate-900 ml-1.5">
                      {editingStreakUser.streak?.totalCompleted || 0}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setStreakIsProtected(!streakIsProtected)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    streakIsProtected
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${streakIsProtected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Enable Admin Streak Protection</span>
                      {streakIsProtected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                      Prevents current streak from resetting to 0 even if participant misses 2 or more consecutive days.
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">
                    Bonus Streak Days (Manual Adjustment)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={streakBonusDays}
                    onChange={(e) => setStreakBonusDays(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                  <p className="text-[11px] text-slate-400">
                    Add extra streak days to compensate or assist user without altering past task completion records.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="glass" size="sm" onClick={() => setEditingStreakUser(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveStreakRepair}>
                  Save & Repair Streak
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
