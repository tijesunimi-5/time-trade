'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { api } from '../../../services/api';
import { Loader } from '../../../components/ui/Loader';
import { toast } from '../../../store/useToastStore';
import { Plus, Trash2, Pencil, BookOpen, Layers, CheckSquare, FolderPlus, ArrowRight } from 'lucide-react';

export default function AdminTasksPage() {
  const [activeTab, setActiveTab] = useState<'TREE' | 'TEMPLATES' | 'RESOURCES'>('TREE');
  const [treeData, setTreeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Visibility States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Editing Entity IDs (null if creating new)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  // Task Form State
  const [selectedDayId, setSelectedDayId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPillar, setTaskPillar] = useState('SPIRITUAL');
  const [taskType, setTaskType] = useState('GROWTH');
  const [isNonNegotiable, setIsNonNegotiable] = useState(false);
  const [pageRange, setPageRange] = useState('');
  const [timestampRange, setTimestampRange] = useState('');
  const [discussionQuestions, setDiscussionQuestions] = useState('');

  // Template Form State
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templatePillar, setTemplatePillar] = useState('SPIRITUAL');
  const [templateType, setTemplateType] = useState('GROWTH');

  // Resource Form State
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('BOOK');
  const [resourceAuthor, setResourceAuthor] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  const loadAdminTree = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminProgrammeTree();
      setTreeData(res);
    } catch (err) {
      console.error('Failed to load admin tree:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTree();
  }, []);

  // --- TASK HANDLERS ---
  const handleOpenCreateTask = (dayId?: string) => {
    setEditingTaskId(null);
    setSelectedDayId(dayId || '');
    setSelectedTemplateId('');
    setSelectedResourceId('');
    setTaskTitle('');
    setTaskDesc('');
    setTaskPillar('SPIRITUAL');
    setTaskType('GROWTH');
    setIsNonNegotiable(false);
    setPageRange('');
    setTimestampRange('');
    setDiscussionQuestions('');
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setSelectedDayId(task.dayId || '');
    setSelectedTemplateId(task.templateId || '');
    setSelectedResourceId(task.resourceId || '');
    setTaskTitle(task.title || '');
    setTaskDesc(task.description || '');
    setTaskPillar(task.pillar || 'SPIRITUAL');
    setTaskType(task.taskType || 'GROWTH');
    setIsNonNegotiable(!!task.isNonNegotiable);
    setPageRange(task.pageRange || '');
    setTimestampRange(task.timestampRange || '');
    setDiscussionQuestions(task.discussionQuestions || '');
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        dayId: selectedDayId || undefined,
        templateId: selectedTemplateId || undefined,
        resourceId: selectedResourceId || undefined,
        title: taskTitle,
        description: taskDesc,
        pillar: taskPillar,
        taskType,
        isNonNegotiable,
        pageRange: pageRange || undefined,
        timestampRange: timestampRange || undefined,
        discussionQuestions: discussionQuestions || undefined,
      };

      if (editingTaskId) {
        await api.updateTask(editingTaskId, payload);
        toast.success('Task Updated', `"${taskTitle}" changes saved successfully.`);
      } else {
        await api.assignTaskToDay(payload);
        toast.success('Task Published', `"${taskTitle}" assigned successfully.`);
      }

      setShowTaskModal(false);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Task Action Failed', err.message || 'Unable to save task');
    }
  };

  const handleDeleteTask = async (taskId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) return;
    try {
      await api.deleteTask(taskId);
      toast.success('Task Deleted', `"${title}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete task');
    }
  };

  // --- TEMPLATE HANDLERS ---
  const handleOpenCreateTemplate = () => {
    setEditingTemplateId(null);
    setTemplateTitle('');
    setTemplateDesc('');
    setTemplatePillar('SPIRITUAL');
    setTemplateType('GROWTH');
    setShowTemplateModal(true);
  };

  const handleOpenEditTemplate = (tmpl: any) => {
    setEditingTemplateId(tmpl.id);
    setTemplateTitle(tmpl.title || '');
    setTemplateDesc(tmpl.description || '');
    setTemplatePillar(tmpl.pillar || 'SPIRITUAL');
    setTemplateType(tmpl.taskType || 'GROWTH');
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveTaskTemplate({
        id: editingTemplateId || undefined,
        title: templateTitle,
        description: templateDesc,
        pillar: templatePillar,
        taskType: templateType,
      });
      setShowTemplateModal(false);
      toast.success(
        editingTemplateId ? 'Template Updated' : 'Template Created',
        `"${templateTitle}" saved in template library.`
      );
      loadAdminTree();
    } catch (err: any) {
      toast.error('Template Action Failed', err.message || 'Unable to save template');
    }
  };

  const handleDeleteTemplate = async (templateId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete task template "${title}"?`)) return;
    try {
      await api.deleteTaskTemplate(templateId);
      toast.success('Template Deleted', `"${title}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete template');
    }
  };

  const handleUseTemplateAsTask = (tmpl: any) => {
    setEditingTaskId(null);
    setSelectedDayId('');
    setSelectedTemplateId(tmpl.id);
    setSelectedResourceId('');
    setTaskTitle(tmpl.title || '');
    setTaskDesc(tmpl.description || '');
    setTaskPillar(tmpl.pillar || 'SPIRITUAL');
    setTaskType(tmpl.taskType || 'GROWTH');
    setIsNonNegotiable(tmpl.taskType === 'NON_NEGOTIABLE');
    setPageRange('');
    setTimestampRange('');
    setDiscussionQuestions('');
    setShowTaskModal(true);
  };

  // --- RESOURCE HANDLERS ---
  const handleOpenCreateResource = () => {
    setEditingResourceId(null);
    setResourceTitle('');
    setResourceType('BOOK');
    setResourceAuthor('');
    setResourceUrl('');
    setShowResourceModal(true);
  };

  const handleOpenEditResource = (res: any) => {
    setEditingResourceId(res.id);
    setResourceTitle(res.title || '');
    setResourceType(res.type || 'BOOK');
    setResourceAuthor(res.author || '');
    setResourceUrl(res.url || '');
    setShowResourceModal(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveResource({
        id: editingResourceId || undefined,
        title: resourceTitle,
        type: resourceType,
        author: resourceAuthor || undefined,
        url: resourceUrl || undefined,
      });
      setShowResourceModal(false);
      toast.success(
        editingResourceId ? 'Resource Updated' : 'Resource Cataloged',
        `"${resourceTitle}" saved successfully.`
      );
      loadAdminTree();
    } catch (err: any) {
      toast.error('Resource Action Failed', err.message || 'Unable to save resource');
    }
  };

  const handleDeleteResource = async (resourceId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete resource "${title}"?`)) return;
    try {
      await api.deleteResource(resourceId);
      toast.success('Resource Deleted', `"${title}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete resource');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">EXCO CMS Architecture</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Programme & Task CMS Manager
            </h1>
            <p className="text-xs text-slate-500">
              Curate and edit 90-day task schedules, reading resources, timestamps, and task templates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenCreateResource}
              className="flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600" /> Add Resource
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenCreateTemplate}
              className="flex items-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-600" /> Add Template
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCreateTask()}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Assign Task to Day
            </Button>
          </div>
        </div>

        {/* CMS Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'TREE', label: '90-Day Hierarchy Tree', icon: Layers },
            { id: 'TEMPLATES', label: 'Reusable Templates', icon: CheckSquare },
            { id: 'RESOURCES', label: 'Resource Catalog', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl flex flex-col items-center justify-center gap-3">
            <Loader />
            <span className="text-xs font-medium">Loading CMS hierarchy data...</span>
          </div>
        ) : (
          <>
            {/* TREE TAB */}
            {activeTab === 'TREE' && (
              <div className="space-y-6">
                {treeData?.programme?.phases?.map((phase: any) => (
                  <div key={phase.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">
                          PHASE {phase.phaseNumber}
                        </span>
                        <h2 className="text-lg font-black text-slate-900">{phase.title} ({phase.durationDays} Days)</h2>
                      </div>
                      <Badge variant="cyan">{phase.weeks?.length || 0} Weeks Configured</Badge>
                    </div>

                    <div className="space-y-3">
                      {phase.weeks?.map((week: any) => (
                        <div key={week.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">
                              Week {week.weekNumber}: {week.theme}
                            </h3>
                            {week.anchorResource && (
                              <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                                Anchor: {week.anchorResource}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                            {week.days?.map((day: any) => (
                              <div key={day.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span>
                                    {day.title && day.title.startsWith(`Day ${day.dayNumber}`)
                                      ? day.title
                                      : `Day ${day.dayNumber}${day.title ? `: ${day.title}` : ''}`}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-semibold text-slate-500 mr-1">
                                      {day.tasks?.length || 0} Tasks
                                    </span>
                                    <button
                                      onClick={() => handleOpenCreateTask(day.id)}
                                      title="Add Task to this Day"
                                      className="text-brand-600 hover:bg-brand-50 p-1 rounded transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {day.tasks?.length === 0 ? (
                                  <p className="text-[11px] text-slate-400 italic">No day-specific tasks assigned</p>
                                ) : (
                                  <div className="space-y-1">
                                    {day.tasks?.map((t: any) => (
                                      <div
                                        key={t.id}
                                        className="group text-[11px] text-slate-700 flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 transition-colors"
                                      >
                                        <div className="flex items-center gap-2 truncate pr-2">
                                          <Badge variant={t.pillar?.toLowerCase() as any}>{t.pillar}</Badge>
                                          <span className="font-medium truncate">{t.title}</span>
                                          {t.isNonNegotiable && (
                                            <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                              Non-Neg
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => handleOpenEditTask(t)}
                                            title="Edit Task"
                                            className="p-1 text-slate-500 hover:text-brand-600 hover:bg-white rounded transition-colors"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteTask(t.id, t.title)}
                                            title="Delete Task"
                                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-white rounded transition-colors"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'TEMPLATES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {treeData?.templates?.map((tmpl: any) => (
                  <Card key={tmpl.id} variant="glass" className="space-y-3 p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={tmpl.pillar?.toLowerCase() as any}>{tmpl.pillar}</Badge>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {tmpl.taskType}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{tmpl.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3">{tmpl.description || 'No description provided.'}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleUseTemplateAsTask(tmpl)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        Use as Task <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTemplate(tmpl)}
                          title="Edit Template"
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(tmpl.id, tmpl.title)}
                          title="Delete Template"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'RESOURCES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {treeData?.resources?.map((res: any) => (
                  <Card key={res.id} variant="glass" className="space-y-3 p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {res.type}
                        </span>
                        {res.author && <span className="text-xs text-slate-500 font-medium">by {res.author}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{res.title}</h3>
                      {res.url && (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-brand-600 hover:underline block truncate"
                        >
                          {res.url}
                        </a>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditResource(res)}
                        title="Edit Resource"
                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        title="Delete Resource"
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Modal (Create & Edit) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card variant="glass" className="max-w-xl w-full p-6 space-y-4 bg-white my-8">
            <h3 className="text-lg font-bold text-slate-900">
              {editingTaskId ? 'Edit Programme Task' : 'Assign / Create Task for Programme Day'}
            </h3>
            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Day (1–90)</label>
                <select
                  value={selectedDayId}
                  onChange={(e) => setSelectedDayId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="">Standard Non-Negotiable (All Days)</option>
                  {treeData?.programme?.phases?.flatMap((p: any) =>
                    p.weeks?.flatMap((w: any) =>
                      w.days?.map((d: any) => (
                        <option key={d.id} value={d.id}>
                          Day {d.dayNumber}: {d.title || `Day ${d.dayNumber}`}
                        </option>
                      ))
                    )
                  )}
                </select>
              </div>

              <Input
                label="Task Title"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Read Chapter 2 & Journal Reflection"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description</label>
                <textarea
                  required
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Task instructions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pillar</label>
                  <select
                    value={taskPillar}
                    onChange={(e) => setTaskPillar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="SPIRITUAL">SPIRITUAL</option>
                    <option value="MENTAL">MENTAL</option>
                    <option value="SOCIAL">SOCIAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Link Resource</label>
                  <select
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="">None</option>
                    {treeData?.resources?.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        [{r.type}] {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Book Page Range (Optional)"
                  placeholder="e.g. Chapter 2, pp. 15–30"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                />
                <Input
                  label="Audio/Video Timestamp (Optional)"
                  placeholder="e.g. 12:30 – 28:40"
                  value={timestampRange}
                  onChange={(e) => setTimestampRange(e.target.value)}
                />
              </div>

              <Input
                label="Journal Reflection Prompt (Optional)"
                placeholder="What friction patterns did you notice today?"
                value={discussionQuestions}
                onChange={(e) => setDiscussionQuestions(e.target.value)}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nonNeg"
                  checked={isNonNegotiable}
                  onChange={(e) => setIsNonNegotiable(e.target.checked)}
                  className="rounded accent-amber-600 cursor-pointer"
                />
                <label htmlFor="nonNeg" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Flag as Non-Negotiable Task
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingTaskId ? 'Save Changes' : 'Save & Assign'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Template Modal (Create & Edit) */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              {editingTemplateId ? 'Edit Reusable Task Template' : 'Create Reusable Task Template'}
            </h3>
            <form onSubmit={handleSaveTemplate} className="space-y-3">
              <Input
                label="Template Title"
                required
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                placeholder="e.g. Daily Mindset Journaling"
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description</label>
                <textarea
                  rows={2}
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pillar</label>
                  <select
                    value={templatePillar}
                    onChange={(e) => setTemplatePillar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="SPIRITUAL">SPIRITUAL</option>
                    <option value="MENTAL">MENTAL</option>
                    <option value="SOCIAL">SOCIAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Task Type</label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="GROWTH">GROWTH</option>
                    <option value="NON_NEGOTIABLE">NON_NEGOTIABLE</option>
                    <option value="LEARNING">LEARNING</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowTemplateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingTemplateId ? 'Save Changes' : 'Create Template'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Resource Modal (Create & Edit) */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              {editingResourceId ? 'Edit Curated Resource' : 'Add Curated Resource'}
            </h3>
            <form onSubmit={handleSaveResource} className="space-y-3">
              <Input
                label="Resource Title"
                required
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="e.g. Mindset by Carol Dweck"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="BOOK">BOOK</option>
                    <option value="PODCAST">PODCAST</option>
                    <option value="SERMON">SERMON</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="ARTICLE">ARTICLE</option>
                  </select>
                </div>
                <Input
                  label="Author / Speaker"
                  value={resourceAuthor}
                  onChange={(e) => setResourceAuthor(e.target.value)}
                  placeholder="e.g. Carol Dweck"
                />
              </div>
              <Input
                label="Resource Link / URL (Optional)"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://..."
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowResourceModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingResourceId ? 'Save Changes' : 'Save Resource'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
