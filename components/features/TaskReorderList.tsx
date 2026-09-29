'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, GripVertical, Pencil, Trash2, Clock, BadgeCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import { toast } from '../../store/useToastStore';

interface TaskItem {
  id: string;
  title: string;
  pillar: string;
  durationMinutes?: number;
  isNonNegotiable?: boolean;
  timeOfDay?: string;
  displayOrder?: number;
  [key: string]: any;
}

interface TaskReorderListProps {
  tasks: TaskItem[];
  onReorderSuccess?: () => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string, title: string) => void;
}

const getTimeOfDayPriority = (tod?: string | null): number => {
  if (!tod) return 2;
  const upper = tod.trim().toUpperCase();
  if (upper === 'MORNING') return 1;
  if (upper === 'NIGHT' || upper === 'EVENING') return 3;
  return 2;
};

const sortTaskItems = (items: TaskItem[]): TaskItem[] => {
  return [...items].sort((a, b) => {
    const pA = getTimeOfDayPriority(a.timeOfDay);
    const pB = getTimeOfDayPriority(b.timeOfDay);
    if (pA !== pB) return pA - pB;
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });
};

export const TaskReorderList: React.FC<TaskReorderListProps> = ({
  tasks: initialTasks,
  onReorderSuccess,
  onEditTask,
  onDeleteTask,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => sortTaskItems(initialTasks));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Touch drag state for mobile devices
  const touchStartY = useRef<number>(0);
  const touchDraggedIdx = useRef<number | null>(null);

  useEffect(() => {
    setTasks(sortTaskItems(initialTasks));
  }, [initialTasks]);

  const saveNewOrder = async (updatedList: TaskItem[]) => {
    const taskOrders = updatedList.map((t, idx) => ({
      id: t.id,
      displayOrder: idx + 1,
    }));

    try {
      setIsSaving(true);
      await api.reorderTasks(taskOrders);
      toast.success('Task Order Saved', 'Task arrangement updated successfully.');
      if (onReorderSuccess) {
        onReorderSuccess();
      }
    } catch (err: any) {
      console.error('Failed to reorder tasks:', err);
      toast.error('Reorder Error', 'Failed to save task order.');
      setTasks(initialTasks); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  // --- BUTTON REORDER HANDLERS (UP / DOWN) ---
  const moveTaskUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...tasks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    setTasks(updated);
    saveNewOrder(updated);
  };

  const moveTaskDown = (index: number) => {
    if (index >= tasks.length - 1) return;
    const updated = [...tasks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    setTasks(updated);
    saveNewOrder(updated);
  };

  // --- DESKTOP DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...tasks];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    setTasks(updated);
    saveNewOrder(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // --- MOBILE TOUCH DRAG HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchStartY.current = e.touches[0].clientY;
    touchDraggedIdx.current = index;
    setDraggedIndex(index);
  };

  const handleTouchEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    touchDraggedIdx.current = null;
  };

  return (
    <div className="space-y-1.5">
      {tasks.map((task, index) => {
        const isBeingDragged = draggedIndex === index;
        const isDragOver = dragOverIndex === index;

        return (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group text-xs text-slate-700 flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 select-none ${
              isBeingDragged
                ? 'opacity-40 bg-emerald-100 border-dashed border-emerald-400 scale-[0.98]'
                : isDragOver
                ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-400/50'
                : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-subtle-sm'
            }`}
          >
            {/* Left Drag Handle & Order Controls */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {/* Drag Handle Icon (Touch & Desktop) */}
              <div
                title="Drag to rearrange"
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchEnd={handleTouchEnd}
                className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors shrink-0"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Up & Down Arrow Buttons */}
              <div className="flex flex-col items-center justify-center shrink-0 -space-y-1">
                <button
                  type="button"
                  onClick={() => moveTaskUp(index)}
                  disabled={index === 0 || isSaving}
                  title="Move Up"
                  className="p-1 rounded hover:bg-slate-200/80 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => moveTaskDown(index)}
                  disabled={index === tasks.length - 1 || isSaving}
                  title="Move Down"
                  className="p-1 rounded hover:bg-slate-200/80 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Task Details */}
              <div className="flex flex-wrap items-center gap-1.5 truncate pl-1">
                <Badge variant={task.pillar?.toLowerCase() as any}>{task.pillar}</Badge>
                <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-xs">
                  {task.title}
                </span>
                {task.durationMinutes && (
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    {task.durationMinutes}m
                  </span>
                )}
                {task.timeOfDay && (
                  <span className="text-[9px] font-extrabold uppercase bg-slate-200/90 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300/60 shrink-0">
                    {task.timeOfDay === 'MORNING'
                      ? '🌅 MORNING'
                      : task.timeOfDay === 'NIGHT' || task.timeOfDay === 'EVENING'
                      ? '🌙 NIGHT'
                      : '☀️ ANYTIME'}
                  </span>
                )}
                {task.isNonNegotiable && (
                  <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                    Non-Neg
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Delete Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEditTask(task)}
                title="Edit Task"
                className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteTask(task.id, task.title)}
                title="Delete Task"
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
