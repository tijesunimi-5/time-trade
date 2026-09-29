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
import { TaskReorderList } from '../../../components/features/TaskReorderList';
import { Plus, Trash2, Pencil, BookOpen, Layers, CheckSquare, FolderPlus, ArrowRight, Calendar, Clock, Upload, FileText, Download, ExternalLink, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminTasksPage() {
  const [activeTab, setActiveTab] = useState<'TREE' | 'TEMPLATES' | 'RESOURCES'>('TREE');
  const [treeData, setTreeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Visibility States
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTargetDayNumber, setResetTargetDayNumber] = useState<number>(1);

  // Editing Entity IDs (null if creating new)
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editingWeekId, setEditingWeekId] = useState<string | null>(null);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  // Phase Form State
  const [phaseTitle, setPhaseTitle] = useState('');
  const [phaseNumber, setPhaseNumber] = useState(1);
  const [phaseDuration, setPhaseDuration] = useState(30);
  const [phaseObjective, setPhaseObjective] = useState('');

  // Week Form State
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [weekNumber, setWeekNumber] = useState(1);
  const [weekTheme, setWeekTheme] = useState('');
  const [weekAnchorResource, setWeekAnchorResource] = useState('');

  // Day Form State
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [dayTitle, setDayTitle] = useState('');
  const [dayFocus, setDayFocus] = useState('');

  // Task Form State
  const [selectedDayId, setSelectedDayId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPillar, setTaskPillar] = useState('SPIRITUAL');
  const [taskType, setTaskType] = useState('GROWTH');
  const [taskDurationMinutes, setTaskDurationMinutes] = useState<number>(15);
  const [taskTimeOfDay, setTaskTimeOfDay] = useState<string>('ANYTIME');
  const [availablePillars, setAvailablePillars] = useState<string[]>(['SPIRITUAL', 'MENTAL', 'SOCIAL', 'PHYSICAL', 'FINANCIAL', 'RELATIONSHIP']);
  const [isNonNegotiable, setIsNonNegotiable] = useState(false);
  const [pageRange, setPageRange] = useState('');
  const [timestampRange, setTimestampRange] = useState('');
  const [discussionQuestions, setDiscussionQuestions] = useState('');

  // Template Form State
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templatePillar, setTemplatePillar] = useState('SPIRITUAL');
  const [templateType, setTemplateType] = useState('GROWTH');
  const [templateDurationMinutes, setTemplateDurationMinutes] = useState<number>(15);
  const [templateTimeOfDay, setTemplateTimeOfDay] = useState<string>('ANYTIME');

  // Resource Form State
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('BOOK');
  const [resourceAuthor, setResourceAuthor] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceFileUrl, setResourceFileUrl] = useState('');
  const [resourceFileName, setResourceFileName] = useState('');
  const [resourceAccessType, setResourceAccessType] = useState<'LINK' | 'FILE'>('LINK');
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Resource Auto-Increment Reading Plan Form State
  const [resourceIsAutoIncrement, setResourceIsAutoIncrement] = useState(false);
  const [resourceStartUnit, setResourceStartUnit] = useState<number>(1);
  const [resourceUnitsPerDay, setResourceUnitsPerDay] = useState<number>(3);
  const [resourceUnitType, setResourceUnitType] = useState<'CHAPTERS' | 'PAGES'>('CHAPTERS');
  const [resourceBookName, setResourceBookName] = useState('');
  const [resourceBibleVersion, setResourceBibleVersion] = useState('KJV');
  const [resourceBibleUrlTemplate, setResourceBibleUrlTemplate] = useState('');

  const loadAdminTree = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminProgrammeTree();
      setTreeData(res);
      api.getSettings().then((sRes) => {
        if (sRes.settings?.pillarsList && Array.isArray(sRes.settings.pillarsList)) {
          setAvailablePillars(sRes.settings.pillarsList);
        }
      }).catch((e) => console.error(e));
    } catch (err) {
      console.error('Failed to load admin tree:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTree();
  }, []);

  // --- PHASE HANDLERS ---
  const handleOpenCreatePhase = () => {
    setEditingPhaseId(null);
    const existingPhases = treeData?.programme?.phases || [];
    setPhaseTitle(`Phase ${existingPhases.length + 1}`);
    setPhaseNumber(existingPhases.length + 1);
    setPhaseDuration(30);
    setPhaseObjective('');
    setShowPhaseModal(true);
  };

  const handleOpenEditPhase = (phase: any) => {
    setEditingPhaseId(phase.id);
    setPhaseTitle(phase.title || '');
    setPhaseNumber(phase.phaseNumber || 1);
    setPhaseDuration(phase.durationDays || 30);
    setPhaseObjective(phase.objective || '');
    setShowPhaseModal(true);
  };

  const handleSavePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.savePhase({
        id: editingPhaseId || undefined,
        title: phaseTitle,
        phaseNumber,
        durationDays: phaseDuration,
        objective: phaseObjective || undefined,
      });
      setShowPhaseModal(false);
      toast.success(editingPhaseId ? 'Phase Updated' : 'Phase Created', `"${phaseTitle}" saved successfully.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Phase Action Failed', err.message || 'Unable to save phase');
    }
  };

  const handleDeletePhase = async (phaseId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete Phase "${title}" and all its weeks, days, and tasks?`)) return;
    try {
      await api.deletePhase(phaseId);
      toast.success('Phase Deleted', `"${title}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete phase');
    }
  };

  // --- WEEK HANDLERS ---
  const handleOpenCreateWeek = (phaseId?: string) => {
    setEditingWeekId(null);
    setSelectedPhaseId(phaseId || treeData?.programme?.phases?.[0]?.id || '');
    const totalWeeks = treeData?.programme?.phases?.reduce((acc: number, p: any) => acc + (p.weeks?.length || 0), 0) || 0;
    setWeekNumber(totalWeeks + 1);
    setWeekTheme('');
    setWeekAnchorResource('');
    setShowWeekModal(true);
  };

  const handleOpenEditWeek = (week: any) => {
    setEditingWeekId(week.id);
    setSelectedPhaseId(week.phaseId);
    setWeekNumber(week.weekNumber || 1);
    setWeekTheme(week.theme || '');
    setWeekAnchorResource(week.anchorResource || '');
    setShowWeekModal(true);
  };

  const handleSaveWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveWeek({
        id: editingWeekId || undefined,
        phaseId: selectedPhaseId,
        weekNumber,
        theme: weekTheme,
        anchorResource: weekAnchorResource || undefined,
      });
      setShowWeekModal(false);
      toast.success(editingWeekId ? 'Week Updated' : 'Week Created', `"${weekTheme}" saved successfully.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Week Action Failed', err.message || 'Unable to save week');
    }
  };

  const handleDeleteWeek = async (weekId: string, theme: string) => {
    if (!window.confirm(`Are you sure you want to delete Week "${theme}" and all its days?`)) return;
    try {
      await api.deleteWeek(weekId);
      toast.success('Week Deleted', `"${theme}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete week');
    }
  };

  // --- DAY HANDLERS ---
  const handleOpenCreateDay = (weekId?: string) => {
    setEditingDayId(null);
    setSelectedWeekId(weekId || '');
    let nextDayNum = 1;
    if (weekId) {
      const foundWeek = treeData?.programme?.phases?.flatMap((p: any) => p.weeks || []).find((w: any) => w.id === weekId);
      if (foundWeek && foundWeek.days?.length > 0) {
        const maxDay = Math.max(...foundWeek.days.map((d: any) => d.dayNumber));
        nextDayNum = maxDay + 1;
      } else if (foundWeek) {
        nextDayNum = (foundWeek.weekNumber - 1) * 7 + 1;
      }
    }
    setDayNumber(nextDayNum);
    setDayTitle(`Day ${nextDayNum}`);
    setDayFocus('');
    setShowDayModal(true);
  };

  const handleOpenEditDay = (day: any) => {
    setEditingDayId(day.id);
    setSelectedWeekId(day.weekId);
    setDayNumber(day.dayNumber || 1);
    setDayTitle(day.title || `Day ${day.dayNumber}`);
    setDayFocus(day.focus || '');
    setShowDayModal(true);
  };

  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveDay({
        id: editingDayId || undefined,
        weekId: selectedWeekId,
        dayNumber,
        title: dayTitle,
        focus: dayFocus || undefined,
      });
      setShowDayModal(false);
      toast.success(editingDayId ? 'Day Updated' : 'Day Created', `"${dayTitle}" saved successfully.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Day Action Failed', err.message || 'Unable to save day');
    }
  };

  const handleDeleteDay = async (dayId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteDay(dayId);
      toast.success('Day Deleted', `"${title}" has been removed.`);
      loadAdminTree();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Unable to delete day');
    }
  };

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
    setTaskDurationMinutes(15);
    setTaskTimeOfDay('ANYTIME');
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
    setTaskDurationMinutes(task.durationMinutes || 15);
    setTaskTimeOfDay(task.timeOfDay || 'ANYTIME');
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
        timeOfDay: taskTimeOfDay,
        durationMinutes: Number(taskDurationMinutes) || 15,
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
    setTemplateDurationMinutes(15);
    setTemplateTimeOfDay('ANYTIME');
    setShowTemplateModal(true);
  };

  const handleOpenEditTemplate = (tmpl: any) => {
    setEditingTemplateId(tmpl.id);
    setTemplateTitle(tmpl.title || '');
    setTemplateDesc(tmpl.description || '');
    setTemplatePillar(tmpl.pillar || 'SPIRITUAL');
    setTemplateType(tmpl.taskType || 'GROWTH');
    setTemplateDurationMinutes(tmpl.defaultDurationMinutes || 15);
    setTemplateTimeOfDay(tmpl.timeOfDay || 'ANYTIME');
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
        timeOfDay: templateTimeOfDay,
        defaultDurationMinutes: Number(templateDurationMinutes) || 15,
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
    setTaskDurationMinutes(tmpl.defaultDurationMinutes || 15);
    setTaskTimeOfDay(tmpl.timeOfDay || 'ANYTIME');
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
    setResourceType('BIBLE');
    setResourceAuthor('');
    setResourceUrl('https://bible.com/bible/1/mat.2.1.kjv');
    setResourceFileUrl('');
    setResourceFileName('');
    setResourceAccessType('LINK');
    setResourceIsAutoIncrement(true);
    setResourceStartUnit(1);
    setResourceUnitsPerDay(3);
    setResourceUnitType('CHAPTERS');
    setResourceBookName('Matthew');
    setResourceBibleVersion('KJV');
    setResourceBibleUrlTemplate('https://bible.com/bible/1/mat.2.1.kjv');
    setShowResourceModal(true);
  };

  const handleOpenEditResource = (res: any) => {
    setEditingResourceId(res.id);
    setResourceTitle(res.title || '');
    setResourceType(res.type || 'BOOK');
    setResourceAuthor(res.author || '');
    setResourceUrl(res.url || '');
    setResourceFileUrl(res.fileUrl || '');
    setResourceFileName(res.fileName || '');
    setResourceAccessType(res.accessType || (res.fileUrl ? 'FILE' : 'LINK'));
    setResourceIsAutoIncrement(!!res.isAutoIncrement || res.type === 'BIBLE');
    setResourceStartUnit(res.startUnit ?? 1);
    setResourceUnitsPerDay(res.unitsPerDay ?? 3);
    setResourceUnitType(res.unitType || (res.type === 'BIBLE' ? 'CHAPTERS' : 'PAGES'));
    setResourceBookName(res.bookName || res.title || '');
    setResourceBibleVersion(res.bibleVersion || 'KJV');
    setResourceBibleUrlTemplate(res.bibleUrlTemplate || res.url || '');
    setShowResourceModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFile(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const res = await api.uploadResourceFile({ fileName: file.name, fileData });
          setResourceFileUrl(res.fileUrl);
          setResourceFileName(res.fileName || file.name);
          setResourceAccessType('FILE');
          toast.success('Softcopy Uploaded!', `"${file.name}" uploaded successfully.`);
        } catch (err: any) {
          toast.error('Upload Failed', err.message || 'Failed to upload file');
        } finally {
          setIsUploadingFile(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error('File Error', err.message || 'Unable to read file');
      setIsUploadingFile(false);
    }
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
        fileUrl: resourceFileUrl || undefined,
        fileName: resourceFileName || undefined,
        accessType: resourceAccessType,
        isAutoIncrement: resourceIsAutoIncrement || resourceType === 'BIBLE',
        startUnit: Number(resourceStartUnit) || 1,
        unitsPerDay: Number(resourceUnitsPerDay) || 3,
        unitType: resourceUnitType,
        bookName: resourceBookName || resourceTitle || undefined,
        bibleVersion: resourceBibleVersion || 'KJV',
        bibleUrlTemplate: resourceBibleUrlTemplate || resourceUrl || undefined,
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

  const handleCommenceChallenge = async (isLive: boolean) => {
    try {
      const clientDate = new Date().toLocaleDateString('sv-SE');
      await api.commenceProgramme({ isLive, clientDate, targetDayNumber: 1 });
      toast.success(
        isLive ? 'Challenge Commenced & LIVE!' : 'Challenge Paused',
        isLive
          ? `The 90-Day Challenge is now live for all participants starting today (${clientDate}).`
          : 'Challenge status set to draft mode.'
      );
      loadAdminTree();
    } catch (err: any) {
      toast.error('Action Failed', err.message || 'Unable to update challenge status');
    }
  };

  const handleResetChallenge = async (targetDay: number) => {
    try {
      const clientDate = new Date().toLocaleDateString('sv-SE');
      await api.resetProgramme({ targetDayNumber: targetDay, clientDate });
      setShowResetModal(false);
      toast.success(
        'Calendar Calibrated!',
        `Active challenge day set to Day ${targetDay} (Starting relative to ${clientDate}).`
      );
      loadAdminTree();
    } catch (err: any) {
      toast.error('Calibration Failed', err.message || 'Unable to calibrate challenge calendar');
    }
  };

  const phasesList = treeData?.programme?.phases || [];

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
              Build and edit custom phases, weekly themes, days, activities, and task schedules dynamically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenCreatePhase}
              className="flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-brand-600" /> Add Phase
            </Button>
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
              <Plus className="w-3.5 h-3.5" /> Assign Task
            </Button>
          </div>
        </div>

        {/* Challenge Launch & Commencement Control Bar */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          treeData?.programme?.isLive
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${
                treeData?.programme?.isLive
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-amber-500 text-white border-amber-600'
              }`}>
                {treeData?.programme?.isLive ? 'STATUS: LIVE & COMMENCED' : 'STATUS: DRAFT (NOT LAUNCHED)'}
              </span>
              {treeData?.programme?.isLive && (
                <span className="text-xs font-bold text-emerald-800">
                  Started: {treeData.programme.startDate}
                </span>
              )}
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {treeData?.programme?.isLive
                ? 'The 90-Day Challenge is currently LIVE for all participants.'
                : 'The 90-Day Challenge has not commenced yet.'}
            </h3>
            <p className="text-xs text-slate-600">
              {treeData?.programme?.isLive
                ? 'Participants can see daily tasks relative to the commencement date.'
                : 'Configure your phases, weeks, and tasks below. Click "Commence Challenge" when ready to publish to participants!'}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Calibrate / Set Active Day
            </Button>

            {treeData?.programme?.isLive ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCommenceChallenge(false)}
                className="bg-white hover:bg-slate-100 text-slate-700 border-slate-300 font-bold"
              >
                Pause / Unpublish Challenge
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCommenceChallenge(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold px-4 py-2"
              >
                🚀 Commence 90-Day Challenge
              </Button>
            )}
          </div>
        </div>

        {/* CMS Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'TREE', label: 'Programme Hierarchy Tree', icon: Layers },
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
                {phasesList.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="text-base font-bold text-slate-900">No Programme Phases Configured</h3>
                      <p className="text-xs text-slate-500">
                        The task builder is completely empty. Start by adding your first Phase (e.g., Phase 1: RESET, 30 Days) to curate custom weeks, days, and activities.
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleOpenCreatePhase}>
                      <Plus className="w-4 h-4 mr-1.5" /> Create First Phase
                    </Button>
                  </div>
                ) : (
                  phasesList.map((phase: any) => (
                    <div key={phase.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle-sm space-y-4">
                      {/* Phase Header */}
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">
                            PHASE {phase.phaseNumber}
                          </span>
                          <h2 className="text-lg font-black text-slate-900">{phase.title} ({phase.durationDays} Days)</h2>
                          {phase.objective && (
                            <p className="text-xs text-slate-500">{phase.objective}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="cyan">{phase.weeks?.length || 0} Weeks Configured</Badge>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenCreateWeek(phase.id)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Week
                          </Button>
                          <button
                            onClick={() => handleOpenEditPhase(phase)}
                            title="Edit Phase"
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePhase(phase.id, phase.title)}
                            title="Delete Phase"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Weeks List */}
                      {phase.weeks?.length === 0 ? (
                        <div className="p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-2">
                          <p className="text-xs text-slate-500">No weeks configured for {phase.title} yet.</p>
                          <Button variant="secondary" size="sm" onClick={() => handleOpenCreateWeek(phase.id)}>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Week to {phase.title}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {phase.weeks?.map((week: any) => (
                            <div key={week.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                              {/* Week Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-bold text-slate-900">
                                    Week {week.weekNumber}: {week.theme}
                                  </h3>
                                  {week.anchorResource && (
                                    <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                      Anchor: {week.anchorResource}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenCreateDay(week.id)}
                                    className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add Day
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditWeek(week)}
                                    title="Edit Week"
                                    className="p-1 text-slate-500 hover:text-brand-600 hover:bg-white rounded transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteWeek(week.id, week.theme)}
                                    title="Delete Week"
                                    className="p-1 text-slate-500 hover:text-red-600 hover:bg-white rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Days List */}
                              {week.days?.length === 0 ? (
                                <div className="p-3 text-center bg-white rounded-lg border border-dashed border-slate-200">
                                  <span className="text-xs text-slate-400">No days configured in this week yet.</span>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {week.days?.map((day: any) => (
                                    <div key={day.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                                      <div className="flex items-center justify-between font-bold text-slate-900">
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span>
                                            {day.title && day.title.startsWith(`Day ${day.dayNumber}`)
                                              ? day.title
                                              : `Day ${day.dayNumber}${day.title ? `: ${day.title}` : ''}`}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                          <span className="text-[10px] font-semibold text-slate-500 mr-1">
                                            {day.tasks?.length || 0} Tasks
                                          </span>
                                          <button
                                            onClick={() => handleOpenCreateTask(day.id)}
                                            title="Add Task to Day"
                                            className="text-brand-600 hover:bg-brand-50 p-1 rounded transition-colors"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleOpenEditDay(day)}
                                            title="Edit Day"
                                            className="text-slate-400 hover:text-brand-600 p-1 rounded transition-colors"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteDay(day.id, day.title || `Day ${day.dayNumber}`)}
                                            title="Delete Day"
                                            className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>

                                      {day.focus && (
                                        <p className="text-[11px] text-slate-500 italic">{day.focus}</p>
                                      )}

                                      {day.tasks?.length === 0 ? (
                                        <p className="text-[11px] text-slate-400 italic">No day-specific tasks assigned</p>
                                      ) : (
                                        <TaskReorderList
                                          tasks={day.tasks}
                                          onEditTask={handleOpenEditTask}
                                          onDeleteTask={handleDeleteTask}
                                          onReorderSuccess={loadAdminTree}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
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
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {tmpl.defaultDurationMinutes || 15} mins
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

      {/* Phase Modal (Create & Edit) */}
      {showPhaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              {editingPhaseId ? 'Edit Programme Phase' : 'Create Programme Phase'}
            </h3>
            <form onSubmit={handleSavePhase} className="space-y-3">
              <Input
                label="Phase Title"
                required
                value={phaseTitle}
                onChange={(e) => setPhaseTitle(e.target.value)}
                placeholder="e.g. RESET, RESTART, REFOCUS, or Custom Phase"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phase Order / Number"
                  type="number"
                  required
                  value={phaseNumber}
                  onChange={(e) => setPhaseNumber(parseInt(e.target.value, 10) || 1)}
                />
                <Input
                  label="Duration (Days)"
                  type="number"
                  required
                  value={phaseDuration}
                  onChange={(e) => setPhaseDuration(parseInt(e.target.value, 10) || 30)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Objective / Theme</label>
                <textarea
                  rows={2}
                  value={phaseObjective}
                  onChange={(e) => setPhaseObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Phase goals or key focus areas..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowPhaseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingPhaseId ? 'Save Changes' : 'Create Phase'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Week Modal (Create & Edit) */}
      {showWeekModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              {editingWeekId ? 'Edit Programme Week' : 'Create Programme Week'}
            </h3>
            <form onSubmit={handleSaveWeek} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Phase</label>
                <select
                  value={selectedPhaseId}
                  onChange={(e) => setSelectedPhaseId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="">Select Target Phase...</option>
                  {phasesList.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      Phase {p.phaseNumber}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Week Number"
                  type="number"
                  required
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value, 10) || 1)}
                />
                <Input
                  label="Anchor Resource (Optional)"
                  placeholder="e.g. Mindset by Carol Dweck"
                  value={weekAnchorResource}
                  onChange={(e) => setWeekAnchorResource(e.target.value)}
                />
              </div>

              <Input
                label="Week Theme"
                required
                value={weekTheme}
                onChange={(e) => setWeekTheme(e.target.value)}
                placeholder="e.g. Reset Your Mindset"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowWeekModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingWeekId ? 'Save Changes' : 'Create Week'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Day Modal (Create & Edit) */}
      {showDayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              {editingDayId ? 'Edit Programme Day' : 'Create Programme Day'}
            </h3>
            <form onSubmit={handleSaveDay} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Week</label>
                <select
                  value={selectedWeekId}
                  onChange={(e) => setSelectedWeekId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select Target Week...</option>
                  {phasesList.flatMap((p: any) =>
                    p.weeks?.map((w: any) => (
                      <option key={w.id} value={w.id}>
                        [Phase {p.phaseNumber}] Week {w.weekNumber}: {w.theme}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <Input
                label="Day Number (e.g. 1 to 90)"
                type="number"
                required
                value={dayNumber}
                onChange={(e) => setDayNumber(parseInt(e.target.value, 10) || 1)}
              />

              <Input
                label="Day Title"
                required
                value={dayTitle}
                onChange={(e) => setDayTitle(e.target.value)}
                placeholder="e.g. Day 1: Pausing Friction"
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Daily Focus / Objective</label>
                <textarea
                  rows={2}
                  value={dayFocus}
                  onChange={(e) => setDayFocus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Focus note for participants..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowDayModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingDayId ? 'Save Changes' : 'Create Day'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Task Modal (Create & Edit) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <Card variant="glass" className="max-w-xl w-full p-4 sm:p-6 space-y-4 bg-white my-auto max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editingTaskId ? 'Edit Programme Task' : 'Assign / Create Task for Programme Day'}
            </h3>
            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Target Day</label>
                <select
                  value={selectedDayId}
                  onChange={(e) => setSelectedDayId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="">Standard Non-Negotiable (Applies Every Day)</option>
                  {phasesList.flatMap((p: any) =>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pillar</label>
                  <select
                    value={taskPillar}
                    onChange={(e) => setTaskPillar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    {availablePillars.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Duration (Minutes)"
                  type="number"
                  min={1}
                  max={480}
                  required
                  value={taskDurationMinutes}
                  onChange={(e) => setTaskDurationMinutes(parseInt(e.target.value, 10) || 15)}
                  placeholder="e.g. 15, 30, 45, 60"
                />
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time of Day (Optional)</label>
                  <select
                    value={taskTimeOfDay}
                    onChange={(e) => setTaskTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="ANYTIME">Anytime (Normal Task)</option>
                    <option value="MORNING">🌅 Morning</option>
                    <option value="AFTERNOON">☀️ Afternoon</option>
                    <option value="NIGHT">🌙 Night / Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className="rounded accent-amber-600 cursor-pointer w-4 h-4"
                />
                <label htmlFor="nonNeg" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Flag as Non-Negotiable Task
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3">
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
                    {availablePillars.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
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

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Default Duration (Minutes)"
                  type="number"
                  min={1}
                  max={480}
                  required
                  value={templateDurationMinutes}
                  onChange={(e) => setTemplateDurationMinutes(parseInt(e.target.value, 10) || 15)}
                  placeholder="e.g. 15, 30, 45, 60"
                />
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Default Time of Day</label>
                  <select
                    value={templateTimeOfDay}
                    onChange={(e) => setTemplateTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="ANYTIME">Anytime (Normal Task)</option>
                    <option value="MORNING">🌅 Morning</option>
                    <option value="AFTERNOON">☀️ Afternoon</option>
                    <option value="NIGHT">🌙 Night / Evening</option>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <Card variant="glass" className="max-w-lg w-full p-4 sm:p-6 space-y-4 bg-white shadow-2xl max-h-[92vh] overflow-y-auto my-auto rounded-2xl border border-slate-200">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editingResourceId ? 'Edit Curated Resource' : 'Add Curated Resource'}
            </h3>
            <form onSubmit={handleSaveResource} className="space-y-4">
              <Input
                label="Resource Title"
                required
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="e.g. Mindset: The New Psychology of Success"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Resource Type</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none font-medium"
                  >
                    <option value="BIBLE">✝️ BIBLE STUDY</option>
                    <option value="BOOK">📖 BOOK</option>
                    <option value="PODCAST">🎧 PODCAST</option>
                    <option value="SERMON">🎙️ SERMON</option>
                    <option value="VIDEO">▶️ VIDEO</option>
                    <option value="ARTICLE">📄 ARTICLE</option>
                    <option value="DOCUMENT">📚 DOCUMENT</option>
                  </select>
                </div>
                <Input
                  label="Author / Speaker"
                  value={resourceAuthor}
                  onChange={(e) => setResourceAuthor(e.target.value)}
                  placeholder="e.g. Carol Dweck or Apostle Paul"
                />
              </div>

              {/* Auto-Increment Reading Plan Configuration */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-3">
                <div
                  onClick={() => setResourceIsAutoIncrement(!resourceIsAutoIncrement)}
                  className="flex items-start justify-between cursor-pointer gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-950 block">
                      Auto-Increment Reading Plan (Daily Progression)
                    </span>
                    <span className="text-[11px] text-amber-800 font-normal block leading-tight">
                      Automatically update chapters/pages every day based on active challenge day!
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={resourceIsAutoIncrement || resourceType === 'BIBLE'}
                    onChange={(e) => setResourceIsAutoIncrement(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded shrink-0 mt-0.5"
                  />
                </div>

                {(resourceIsAutoIncrement || resourceType === 'BIBLE') && (
                  <div className="space-y-3 pt-2 border-t border-amber-200/80">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        label="Book / Bible Name"
                        value={resourceBookName}
                        onChange={(e) => setResourceBookName(e.target.value)}
                        placeholder="e.g. Matthew or Mindset"
                      />
                      <div>
                        <label className="text-xs font-bold text-amber-950 block mb-1">Unit Type</label>
                        <select
                          value={resourceUnitType}
                          onChange={(e) => setResourceUnitType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white font-medium"
                        >
                          <option value="CHAPTERS">Chapters (Bible / Study)</option>
                          <option value="PAGES">Pages (Book Reading)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        label="Starting Chapter/Page"
                        type="number"
                        min={1}
                        value={resourceStartUnit}
                        onChange={(e) => setResourceStartUnit(parseInt(e.target.value, 10) || 1)}
                        placeholder="e.g. 1 or 5"
                      />
                      <Input
                        label="Units Per Day"
                        type="number"
                        min={1}
                        value={resourceUnitsPerDay}
                        onChange={(e) => setResourceUnitsPerDay(parseInt(e.target.value, 10) || 3)}
                        placeholder="e.g. 3 or 10"
                      />
                    </div>

                    {resourceType === 'BIBLE' && (
                      <Input
                        label="Bible Passage Share Link / YouVersion URL"
                        value={resourceBibleUrlTemplate}
                        onChange={(e) => {
                          setResourceBibleUrlTemplate(e.target.value);
                          setResourceUrl(e.target.value);
                        }}
                        placeholder="https://bible.com/bible/1/mat.2.1.kjv"
                      />
                    )}

                    <div className="p-2.5 bg-white rounded-lg border border-amber-300 text-[11px] text-amber-900 space-y-1">
                      <span className="font-bold text-amber-950 block">💡 Daily Auto-Progression Preview:</span>
                      <div>Day 1: {resourceBookName || 'Matthew'} {resourceStartUnit}–{resourceStartUnit + resourceUnitsPerDay - 1}</div>
                      <div>Day 2: {resourceBookName || 'Matthew'} {resourceStartUnit + resourceUnitsPerDay}–{resourceStartUnit + resourceUnitsPerDay * 2 - 1}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Access Mode Selector: Link vs Softcopy File */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">Access Mode & Softcopy Provision</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResourceAccessType('LINK')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      resourceAccessType === 'LINK'
                        ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-brand-600" /> External Link (URL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResourceAccessType('FILE')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      resourceAccessType === 'FILE'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" /> Upload Softcopy File
                  </button>
                </div>
              </div>

              {resourceAccessType === 'FILE' ? (
                <div className="space-y-3 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-900 block">
                      Upload Softcopy (PDF, EPUB, Doc, Audio)
                    </label>
                    <p className="text-[11px] text-emerald-700">
                      Upload the softcopy book or study material so participants can download it directly from their tasks.
                    </p>
                  </div>

                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.epub,.doc,.docx,.mp3,.mp4,.txt,.zip"
                    disabled={isUploadingFile}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  />

                  {isUploadingFile && (
                    <p className="text-xs text-emerald-800 font-bold animate-pulse">Uploading file to server...</p>
                  )}

                  {resourceFileUrl && (
                    <div className="p-2 bg-white rounded-lg border border-emerald-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-950 font-bold min-w-0 flex-1">
                        <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-[220px]">{resourceFileName || 'Uploaded Softcopy'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResourceFileUrl('');
                          setResourceFileName('');
                        }}
                        className="text-[10px] text-red-600 font-bold hover:underline shrink-0 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <Input
                    label="Or Softcopy Direct URL (Optional)"
                    value={resourceFileUrl}
                    onChange={(e) => {
                      setResourceFileUrl(e.target.value);
                      if (!resourceFileName) setResourceFileName('Softcopy Download');
                    }}
                    placeholder="https://drive.google.com/... or https://..."
                  />
                </div>
              ) : (
                <Input
                  label="Resource Web Link / URL"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/watch?... or https://..."
                />
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowResourceModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isUploadingFile}>
                  {editingResourceId ? 'Save Changes' : 'Save Resource'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Calendar Reset / Calibration Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="glass" className="max-w-md w-full p-6 space-y-4 bg-white shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Calibrate / Reset Challenge Day
              </h3>
              <p className="text-xs text-slate-500">
                Set today as any active day number (1 to 90). The start date will be automatically calculated so today becomes your chosen day number. Zero tasks or user logs will be deleted!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetChallenge(resetTargetDayNumber);
              }}
              className="space-y-4"
            >
              <Input
                label="Target Day Number for Today (1 - 90)"
                type="number"
                min={1}
                max={90}
                required
                value={resetTargetDayNumber}
                onChange={(e) => setResetTargetDayNumber(parseInt(e.target.value, 10) || 1)}
                placeholder="e.g. 1 for Day 1, 5 for Day 5"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Quick Day Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 5, 10, 15, 30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setResetTargetDayNumber(d)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                        resetTargetDayNumber === d
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      Day {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block">💡 How Calibration Works:</span>
                <p>
                  Setting today as <strong>Day {resetTargetDayNumber}</strong> will configure the commencement start date so participants immediately see Day {resetTargetDayNumber} tasks starting today!
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="glass" size="sm" onClick={() => setShowResetModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700">
                  Calibrate Calendar Now
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
