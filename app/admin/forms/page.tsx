'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Loader } from '../../../components/ui/Loader';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from '../../../store/useToastStore';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Globe,
  EyeOff,
  Save,
  Lock,
  X,
  Sparkles,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';

interface QuestionField {
  id?: string;
  fieldName?: string;
  label: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multiselect' | 'date';
  isRequired: boolean;
  options?: string | string[];
  displayOrder: number;
  isActive: boolean;
}

interface FormSet {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  fields: QuestionField[];
}

export default function AdminFormsBuilderPage() {
  const user = useAuthStore((state) => state.user);
  const initAuth = useAuthStore((state) => state.initAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initAuth();
    setMounted(true);
  }, [initAuth]);

  const userRoles = mounted ? (user?.rolesList || (user?.role ? user.role.split(',') : [])) : [];

  // Can edit if Leadership, Admin, Community Management, or Follow-Up
  const canEdit = mounted && userRoles.some((r: string) =>
    ['LEADERSHIP', 'ADMIN', 'COMMUNITY_MANAGEMENT', 'FOLLOW_UP'].includes(r.trim())
  );

  const [forms, setForms] = useState<FormSet[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Active Form State being edited
  const [formTitle, setFormTitle] = useState('New Registration Questionnaire');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionField[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  // New Question Modal State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'text' | 'textarea' | 'select' | 'multiselect' | 'date'>('text');
  const [newIsRequired, setNewIsRequired] = useState(false);
  const [newOptionsList, setNewOptionsList] = useState<string[]>(['Option 1', 'Option 2']);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Edit Question Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editType, setEditType] = useState<'text' | 'textarea' | 'select' | 'multiselect' | 'date'>('text');
  const [editIsRequired, setEditIsRequired] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editOptionsList, setEditOptionsList] = useState<string[]>([]);
  const [editOptionInput, setEditOptionInput] = useState('');

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllForms();
      if (res.forms) {
        setForms(res.forms);
        if (res.forms.length > 0 && !selectedFormId) {
          loadFormIntoState(res.forms[0]);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const loadFormIntoState = (form: FormSet) => {
    setSelectedFormId(form.id);
    setFormTitle(form.title);
    setFormDescription(form.description || '');
    setIsPublished(form.isPublished);
    setQuestions(form.fields || []);
  };

  const handleCreateNewFormSet = () => {
    setSelectedFormId(null);
    setFormTitle('New Registration Questionnaire');
    setFormDescription('');
    setIsPublished(false);
    setQuestions([]);
  };

  const handleSaveFormDraft = async () => {
    if (!formTitle.trim()) {
      toast.error('Validation Error', 'Form title is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: selectedFormId || undefined,
        title: formTitle.trim(),
        description: formDescription.trim(),
        fields: questions.map((q, idx) => ({
          ...q,
          displayOrder: idx + 1,
          options: typeof q.options === 'object' ? JSON.stringify(q.options) : q.options,
        })),
      };

      const res = await api.saveForm(payload);
      toast.success('Form Saved (Draft)', `"${formTitle.trim()}" saved to database.`);
      
      await fetchForms();
      if (res.form) {
        loadFormIntoState(res.form);
      }
    } catch (err: any) {
      toast.error('Save Failed', err.message || 'Unable to save form');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!selectedFormId) {
      toast.error('Publish Error', 'Please save the form before publishing.');
      return;
    }

    try {
      if (isPublished) {
        // Unpublish
        const res = await api.unpublishForm(selectedFormId);
        setIsPublished(false);
        toast.info('Form Unpublished', 'Registration is now CLOSED for public visitors.');
      } else {
        // Publish
        const res = await api.publishForm(selectedFormId);
        setIsPublished(true);
        toast.success('Form Published & LIVE', `"${formTitle}" is now live for public registration.`);
      }
      fetchForms();
    } catch (err: any) {
      toast.error('Publish Action Failed', err.message || 'Unable to update publish status');
    }
  };

  const handleDeleteFormSet = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete form "${title}"?`)) return;

    try {
      await api.deleteForm(id);
      toast.success('Form Deleted', `"${title}" removed.`);
      if (selectedFormId === id) {
        handleCreateNewFormSet();
      }
      fetchForms();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete form');
    }
  };

  // --- QUESTION HANDLERS ---
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newQ: QuestionField = {
      label: newLabel.trim(),
      fieldType: newType,
      isRequired: newIsRequired,
      options: ['select', 'multiselect'].includes(newType) ? newOptionsList : undefined,
      displayOrder: questions.length + 1,
      isActive: true,
    };

    setQuestions([...questions, newQ]);
    setIsAddingNew(false);
    setNewLabel('');
    setNewType('text');
    setNewIsRequired(false);
    setNewOptionsList(['Option 1', 'Option 2']);
  };

  const openEditModal = (idx: number) => {
    const q = questions[idx];
    setEditingIndex(idx);
    setEditLabel(q.label);
    setEditType(q.fieldType);
    setEditIsRequired(q.isRequired);
    setEditIsActive(q.isActive);
    let parsed: string[] = [];
    if (Array.isArray(q.options)) {
      parsed = q.options;
    } else if (typeof q.options === 'string') {
      try {
        parsed = JSON.parse(q.options);
      } catch {
        parsed = [];
      }
    }
    setEditOptionsList(parsed);
    setEditOptionInput('');
  };

  const handleSaveEditQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editLabel.trim()) return;

    const updated = [...questions];
    updated[editingIndex] = {
      ...updated[editingIndex],
      label: editLabel.trim(),
      fieldType: editType,
      isRequired: editIsRequired,
      isActive: editIsActive,
      options: ['select', 'multiselect'].includes(editType) ? editOptionsList : undefined,
    };

    setQuestions(updated);
    setEditingIndex(null);
  };

  const handleDeleteQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">FORM BUILDER & QUESTION SETS</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registration Question Builder & Publishing
            </h1>
            <p className="text-xs text-slate-500">
              Configure different question sets, save draft forms, and publish live to open public registration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCreateNewFormSet}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" /> Create New Form Set
            </Button>

            {canEdit && (
              <>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleSaveFormDraft}
                  isLoading={isSaving}
                  className="flex items-center gap-1.5 border-slate-300"
                >
                  <Save className="w-3.5 h-3.5 text-slate-700" /> Save Form (Draft)
                </Button>

                {selectedFormId && (
                  <Button
                    variant={isPublished ? 'danger' : 'primary'}
                    size="sm"
                    onClick={handlePublishToggle}
                    className="flex items-center gap-1.5"
                  >
                    {isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Unpublish (Close Registration)
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" /> Publish Form (Make Live)
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Form Set Versioning Tabs & Selector */}
        <Card variant="glass" className="p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-blue-600" /> Configured Question Sets ({forms.length})
            </span>
            {isPublished && (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-600 animate-pulse" /> Live Registration Active
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {forms.map((f) => (
              <div
                key={f.id}
                onClick={() => loadFormIntoState(f)}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  selectedFormId === f.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{f.title}</span>
                {f.isPublished ? (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    selectedFormId === f.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    LIVE
                  </span>
                ) : (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    selectedFormId === f.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    DRAFT
                  </span>
                )}
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFormSet(f.id, f.title);
                    }}
                    title="Delete Form Set"
                    className="p-0.5 hover:text-rose-300 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Current Form Editor Panel */}
        <Card variant="glass" className="p-5 sm:p-6 space-y-5 bg-white border border-slate-200">
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Input
                label="Form Title / Cohort Questionnaire Name"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Cohort 1 Registration Questionnaire"
                required
              />
              <div className="sm:pt-5 shrink-0">
                {isPublished ? (
                  <Badge variant="emerald" className="py-1 px-3">
                    <Globe className="w-3.5 h-3.5 mr-1" /> Published (Live for Registration)
                  </Badge>
                ) : (
                  <Badge variant="attention" className="py-1 px-3">
                    <EyeOff className="w-3.5 h-3.5 mr-1" /> Draft (Unpublished / Closed)
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Internal Description / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Initial intake questionnaire for spiritual, mental, and social goals."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Question List Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Configured Questions ({questions.length})
            </h3>
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingNew(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
              </Button>
            )}
          </div>

          {/* Add Question Modal */}
          {isAddingNew && (
            <Card variant="glass" className="p-5 space-y-4 bg-slate-50 border-2 border-blue-500/40 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Configure New Question
                </h4>
                <button onClick={() => setIsAddingNew(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-3">
                <Input
                  label="Question Title / Prompt"
                  placeholder="e.g. What is your primary focus for this 90-day challenge?"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Answer Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e: any) => setNewType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="text">Short Text Input</option>
                      <option value="textarea">Paragraph / Long Text</option>
                      <option value="select">Single Choice Dropdown</option>
                      <option value="multiselect">Multiple Choice Checkboxes</option>
                      <option value="date">Date of Birth (Month & Day)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-5">
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

                {/* Options Builder */}
                {['select', 'multiselect'].includes(newType) && (
                  <div className="space-y-2 p-3 rounded-xl bg-white border border-slate-200">
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
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (!newOptionInput.trim()) return;
                          setNewOptionsList([...newOptionsList, newOptionInput.trim()]);
                          setNewOptionInput('');
                        }}
                      >
                        Add Option
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newOptionsList.map((opt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800"
                        >
                          {opt}
                          <button
                            type="button"
                            onClick={() => setNewOptionsList(newOptionsList.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="glass" size="sm" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Add Question to Form
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Question List */}
          {questions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-1">
              <p className="text-xs font-bold text-slate-700">No questions added to this form yet.</p>
              <p className="text-[11px] text-slate-400">Click "+ Add Question" above to build your questionnaire.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                let parsedOptions: string[] = [];
                if (Array.isArray(q.options)) {
                  parsedOptions = q.options;
                } else if (typeof q.options === 'string') {
                  try {
                    parsedOptions = JSON.parse(q.options);
                  } catch {
                    parsedOptions = [];
                  }
                }

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          {q.fieldType.toUpperCase()}
                        </span>
                        {q.isRequired && (
                          <span className="text-[9px] font-extrabold uppercase text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Required
                          </span>
                        )}
                      </div>

                      {canEdit && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(idx)}
                            className="p-1 rounded text-blue-600 hover:bg-white text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(idx, 'down')}
                            disabled={idx === questions.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{q.label}</h4>
                      {['select', 'multiselect'].includes(q.fieldType) && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {parsedOptions.map((opt, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-slate-700 border border-slate-200">
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Edit Question Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-lg w-full p-6 space-y-4 bg-white border-2 border-blue-500 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Question #{editingIndex + 1}
              </h3>
              <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditQuestion} className="space-y-3">
              <Input
                label="Question Title / Prompt"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Answer Type
                  </label>
                  <select
                    value={editType}
                    onChange={(e: any) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="text">Short Text Input</option>
                    <option value="textarea">Paragraph / Long Text</option>
                    <option value="select">Single Choice Dropdown</option>
                    <option value="multiselect">Multiple Choice Checkboxes</option>
                    <option value="date">Date of Birth (Month & Day)</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsRequired}
                      onChange={(e) => setEditIsRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Required
                  </label>
                </div>
              </div>

              {/* Options Builder for Select & Multiselect */}
              {['select', 'multiselect'].includes(editType) && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Choice Options Manager ({editOptionsList.length})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an option choice..."
                      value={editOptionInput}
                      onChange={(e) => setEditOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (editOptionInput.trim()) {
                            setEditOptionsList([...editOptionsList, editOptionInput.trim()]);
                            setEditOptionInput('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (editOptionInput.trim()) {
                          setEditOptionsList([...editOptionsList, editOptionInput.trim()]);
                          setEditOptionInput('');
                        }
                      }}
                    >
                      Add Option
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editOptionsList.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-800"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => setEditOptionsList(editOptionsList.filter((_, idx) => idx !== i))}
                          className="text-rose-500 hover:text-rose-700 font-bold text-xs ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="glass" size="sm" onClick={() => setEditingIndex(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Apply Question Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
