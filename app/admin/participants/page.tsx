'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { api } from '../../../services/api';
import {
  Users,
  Search,
  Eye,
  X,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Shield,
  FileText,
  UserCheck,
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
  };
}

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [partsRes, fieldsRes] = await Promise.all([
        api.getAllParticipants(),
        api.getDynamicFormFields(),
      ]);

      if (partsRes.participants) setParticipants(partsRes.participants);
      
      if (fieldsRes.fields) {
        const qMap: Record<string, string> = {};
        fieldsRes.fields.forEach((f: any) => {
          qMap[f.fieldName] = f.label;
        });
        setQuestionsMap(qMap);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      (p.phone && p.phone.includes(term))
    );
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

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">PARTICIPANT ROSTER & RESPONSES</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Participant Directory & Answers
            </h1>
            <p className="text-xs text-slate-500">
              View all registered participants and inspect their detailed question responses.
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

        {/* Roster Table Card */}
        <Card variant="glass" className="p-0 overflow-hidden bg-white shadow-subtle">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading participants...</div>
          ) : filteredParticipants.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">No participants found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Participant</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Roles</th>
                    <th className="py-3.5 px-4">Registration Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                        <div>{p.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{p.email}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {p.phone || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.rolesList.map((r, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                r === 'PARTICIPANT'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedParticipant(p)}
                          className="text-xs py-1 px-2.5"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Answers
                        </Button>
                      </td>
                    </tr>
                  ))}
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
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                      PARTICIPANT DETAILS
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
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
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
                    <FileText className="w-4 h-4 text-blue-600" /> Submitted Registration Responses
                  </h3>

                  {selectedParticipant.profile?.expectations && (
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                      <div className="text-xs font-bold text-blue-900">Expectations & Goals</div>
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
      </div>
    </div>
  );
}
