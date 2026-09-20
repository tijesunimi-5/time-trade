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
  CheckCircle2,
  Sparkles,
  Lock,
  X,
  ListPlus,
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

  // New Question Form Modal State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'text' | 'textarea' | 'select' | 'multiselect' | 'date'>('text');
  const [newIsRequired, setNewIsRequired] = useState(false);
  const [newOptionsList, setNewOptionsList] = useState<string[]>(['Option 1', 'Option 2']);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Edit Question Modal State
  const [editingQuestion, setEditingQuestion] = useState<QuestionField | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editType, setEditType] = useState<'text' | 'textarea' | 'select' | 'multiselect' | 'date'>('text');
  const [editIsRequired, setEditIsRequired] = useState(false);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editOptionsList, setEditOptionsList] = useState<string[]>([]);
  const [editOptionInput, setEditOptionInput] = useState('');

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
        label: newLabel.trim(),
        fieldType: newType,
        isRequired: newIsRequired,
        options: ['select', 'multiselect'].includes(newType) ? newOptionsList : undefined,
        displayOrder: questions.length + 1,
        isActive: true,
      };

      await api.createDynamicFormField(fieldData);
      toast.success('Question Created', `"${newLabel.trim()}" added to registration questions.`);
      setIsAddingNew(false);
      setNewLabel('');
      setNewType('text');
      setNewIsRequired(false);
      setNewOptionsList(['Option 1', 'Option 2']);
      fetchQuestions();
    } catch (err: any) {
      toast.error('Creation Failed', err.message || 'Failed to create question');
    }
  };

  const openEditModal = (q: QuestionField) => {
    setEditingQuestion(q);
    setEditLabel(q.label);
    setEditType(q.fieldType);
    setEditIsRequired(q.isRequired);
    setEditIsActive(q.isActive);
    let parsed: string[] = [];
    try {
      parsed = q.options ? JSON.parse(q.options) : [];
    } catch {
      parsed = [];
    }
    setEditOptionsList(parsed);
    setEditOptionInput('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editLabel.trim()) return;

    try {
      const updates = {
        label: editLabel.trim(),
        fieldType: editType,
        isRequired: editIsRequired,
        isActive: editIsActive,
        options: ['select', 'multiselect'].includes(editType) ? editOptionsList : undefined,
      };

      await api.updateDynamicFormField(editingQuestion.id, updates);
      toast.success('Question Updated', `Changes to "${editLabel.trim()}" saved successfully.`);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (id: string, label: string) => {
    if (!canEdit) return;
    if (!confirm(`Are you sure you want to delete the question: "${label}"?`)) return;

    try {
      await api.deleteDynamicFormField(id);
      toast.success('Question Deleted', `"${label}" removed.`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete question');
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

    const fieldOrders = updated.map((q, idx) => ({ id: q.id, displayOrder: idx + 1 }));
    setQuestions(updated);

    try {
      await api.reorderDynamicFormFields(fieldOrders);
    } catch (err) {
      console.error(err);
    }
  };

  // New option handlers
  const handleAddOptionToNew = () => {
    if (!newOptionInput.trim()) return;
    setNewOptionsList([...newOptionsList, newOptionInput.trim()]);
    setNewOptionInput('');
  };

  const handleRemoveOptionFromNew = (optIdx: number) => {
    setNewOptionsList(newOptionsList.filter((_, i) => i !== optIdx));
  };

  // Edit option handlers
  const handleAddOptionToEdit = () => {
    if (!editOptionInput.trim()) return;
    setEditOptionsList([...editOptionsList, editOptionInput.trim()]);
    setEditOptionInput('');
  };

  const handleRemoveOptionFromEdit = (optIdx: number) => {
    setEditOptionsList(editOptionsList.filter((_, i) => i !== optIdx));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">ADVANCED FORM BUILDER</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registration Questions & Options CMS
            </h1>
            <p className="text-xs text-slate-500">
              Configure dynamic participant registration questions, dropdown options, and field types.
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
              <span className="font-bold">Read-Only View:</span> Only Leadership, Community Management, and Follow-Up team members can modify registration questions.
            </div>
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
          <Loader variant="card" text="Loading dynamic registration questions..." />
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
                          onClick={() => openEditModal(q)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 text-xs font-bold"
                          title="Edit Question & Options"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
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

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{q.label}</h3>

                    {['select', 'multiselect'].includes(q.fieldType) && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Configured Choices ({parsedOptions.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {parsedOptions.length === 0 ? (
                            <span className="text-xs text-amber-600 italic">No options configured. Click Edit to add choices.</span>
                          ) : (
                            parsedOptions.map((opt, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                              >
                                {opt}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card variant="glass" className="max-w-lg w-full p-6 space-y-5 bg-white border-2 border-blue-500 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Edit Registration Question</h3>
              </div>
              <button
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Question Title / Prompt"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                required
                placeholder="Question text..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Answer Type
                  </label>
                  <select
                    value={editType}
                    onChange={(e: any) => setEditType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="text">Short Text Input</option>
                    <option value="textarea">Paragraph / Long Text</option>
                    <option value="select">Single Choice Dropdown</option>
                    <option value="multiselect">Multiple Choice Checkboxes</option>
                    <option value="date">Date of Birth / Date</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsRequired}
                      onChange={(e) => setEditIsRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Required
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    Active
                  </label>
                </div>
              </div>

              {/* Options Builder for Select & Multiselect in Edit Modal */}
              {['select', 'multiselect'].includes(editType) && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Choice Options Manager
                    </label>
                    <span className="text-[10px] font-bold text-slate-500">
                      {editOptionsList.length} options
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an option choice..."
                      value={editOptionInput}
                      onChange={(e) => setEditOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOptionToEdit();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={handleAddOptionToEdit}>
                      Add Option
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {editOptionsList.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">No option choices added yet.</span>
                    ) : (
                      editOptionsList.map((opt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-xs"
                        >
                          {opt}
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionFromEdit(i)}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="glass" size="sm" onClick={() => setEditingQuestion(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
