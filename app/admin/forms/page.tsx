'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

interface QuestionField {
  id: string;
  fieldName: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multiselect' | 'date';
  isRequired: boolean;
  options?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminFormsBuilderPage() {
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.rolesList || (user?.role ? user.role.split(',') : []);
  
  // Can edit if Leadership, Admin, Community Management, or Follow-Up
  const canEdit = userRoles.some((r: string) =>
    ['LEADERSHIP', 'ADMIN', 'COMMUNITY_MANAGEMENT', 'FOLLOW_UP'].includes(r.trim())
  );

  const [questions, setQuestions] = useState<QuestionField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  
  // New Question Form Modal State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'text' | 'textarea' | 'select' | 'multiselect' | 'date'>('text');
  const [newIsRequired, setNewIsRequired] = useState(false);
  const [newOptionsList, setNewOptionsList] = useState<string[]>(['Option 1', 'Option 2']);
  const [newOptionInput, setNewOptionInput] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDynamicFormFields();
      if (res.fields) setQuestions(res.fields);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    try {
      const fieldData = {
        label: newLabel,
        fieldType: newType,
        isRequired: newIsRequired,
        options: ['select', 'multiselect'].includes(newType) ? newOptionsList : undefined,
        displayOrder: questions.length + 1,
        isActive: true,
      };

      await api.createDynamicFormField(fieldData);
      setSaveStatus('Question created successfully!');
      setIsAddingNew(false);
      setNewLabel('');
      setNewType('text');
      setNewIsRequired(false);
      setNewOptionsList(['Option 1', 'Option 2']);
      fetchQuestions();
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to create question');
    }
  };

  const handleUpdateField = async (id: string, updates: Partial<QuestionField>) => {
    if (!canEdit) return;
    try {
      await api.updateDynamicFormField(id, updates);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
      );
      setSaveStatus('Question updated');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (id: string, label: string) => {
    if (!canEdit) return;
    if (!confirm(`Are you sure you want to delete the question: "${label}"?`)) return;

    try {
      await api.deleteDynamicFormField(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setSaveStatus('Question deleted');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!canEdit) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;

    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    // Update display orders
    const fieldOrders = updated.map((q, idx) => ({ id: q.id, displayOrder: idx + 1 }));
    setQuestions(updated);

    try {
      await api.reorderDynamicFormFields(fieldOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOptionToNew = () => {
    if (!newOptionInput.trim()) return;
    setNewOptionsList([...newOptionsList, newOptionInput.trim()]);
    setNewOptionInput('');
  };

  const handleRemoveOptionFromNew = (optIdx: number) => {
    setNewOptionsList(newOptionsList.filter((_, i) => i !== optIdx));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">GOOGLE-FORMS STYLE BUILDER</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registration Questions Builder
            </h1>
            <p className="text-xs text-slate-500">
              Customize questions shown to participants during 90-day registration.
            </p>
          </div>

          {canEdit && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddingNew(true)}
              className="shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New Question
            </Button>
          )}
        </div>

        {/* Read-Only Permission Warning Banner if user cannot edit */}
        {!canEdit && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs font-semibold">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Read-Only View:</span> Only Leadership, Community Management, and Follow-Up team members can create or modify registration questions.
            </div>
          </div>
        )}

        {saveStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Modal / Card to Create New Question */}
        {isAddingNew && (
          <Card variant="glass" className="p-6 space-y-5 bg-white border-2 border-blue-500/40 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Add Registration Question
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <Input
                label="Question Title / Prompt"
                placeholder="e.g. What are your main expectations for the next 90 days?"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Answer Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="text">Short Text Input</option>
                    <option value="textarea">Paragraph / Long Text</option>
                    <option value="select">Single Choice Dropdown</option>
                    <option value="multiselect">Multiple Choice Checkboxes</option>
                    <option value="date">Date of Birth / Date</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="newIsReq"
                    checked={newIsRequired}
                    onChange={(e) => setNewIsRequired(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="newIsReq" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Required Answer
                  </label>
                </div>
              </div>

              {/* Options Builder for Select & Multiselect */}
              {['select', 'multiselect'].includes(newType) && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Choice Options Builder
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an option choice..."
                      value={newOptionInput}
                      onChange={(e) => setNewOptionInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddOptionToNew}>
                      Add Option
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newOptionsList.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-semibold text-slate-800 shadow-xs"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionFromNew(i)}
                          className="text-rose-500 hover:text-rose-700 font-bold text-xs ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Question
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Existing Questions List */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading form questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No dynamic questions configured yet. Click "+ Add New Question" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              let parsedOptions: string[] = [];
              try {
                parsedOptions = q.options ? JSON.parse(q.options) : [];
              } catch {
                parsedOptions = [];
              }

              return (
                <Card
                  key={q.id}
                  variant="glass"
                  className={`p-5 space-y-4 transition-all ${
                    !q.isActive ? 'opacity-60 bg-slate-100/80' : 'bg-white shadow-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        {q.fieldType.toUpperCase()}
                      </span>
                      {q.isRequired && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                          Required
                        </span>
                      )}
                      {!q.isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 py-0.5 rounded-full bg-slate-200">
                          Disabled
                        </span>
                      )}
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === questions.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id, q.label)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 space-y-2">
                      {canEdit ? (
                        <input
                          type="text"
                          value={q.label}
                          onChange={(e) =>
                            setQuestions((prev) =>
                              prev.map((item) => (item.id === q.id ? { ...item, label: e.target.value } : item))
                            )
                          }
                          onBlur={(e) => handleUpdateField(q.id, { label: e.target.value })}
                          className="w-full text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none bg-transparent py-1"
                        />
                      ) : (
                        <div className="text-base font-bold text-slate-900">{q.label}</div>
                      )}

                      {['select', 'multiselect'].includes(q.fieldType) && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {parsedOptions.map((opt, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {canEdit && (
                      <div className="md:col-span-5 flex items-center justify-end gap-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.isRequired}
                            onChange={(e) => handleUpdateField(q.id, { isRequired: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          Required
                        </label>

                        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.isActive}
                            onChange={(e) => handleUpdateField(q.id, { isActive: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 rounded"
                          />
                          Active
                        </label>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
