'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { api } from '../../../services/api';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillar, setPillar] = useState<'SPIRITUAL' | 'MENTAL' | 'SOCIAL'>('SPIRITUAL');
  const [category, setCategory] = useState('');
  const [frequencyType, setFrequencyType] = useState('DAILY');
  const [isNonNegotiable, setIsNonNegotiable] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [instructions, setInstructions] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.getTodayTasks();
      setTasks(res.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTask({
        title,
        description,
        pillar,
        category,
        frequencyType,
        isNonNegotiable,
        durationMinutes: Number(durationMinutes),
        instructions,
        resourceUrl: resourceUrl || undefined,
      });

      setShowModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(id);
      loadTasks();
    } catch (err: any) {
      alert(err.message || 'Failed to delete task');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="cyan">Database Task Engine</Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Task Manager</h1>
            <p className="text-xs text-slate-500">Configure tasks dynamically without developer intervention</p>
          </div>

          <Button variant="primary" size="md" onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Task
          </Button>
        </div>

        {/* Existing Tasks List */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
            Loading database tasks...
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} variant="glass" className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {task.isNonNegotiable && <Badge variant="nonNegotiable">NON-NEGOTIABLE</Badge>}
                      <Badge variant={task.pillar.toLowerCase() as any}>{task.pillar}</Badge>
                      <span className="text-[11px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                        {task.frequencyType}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                    <p className="text-xs text-slate-600">{task.description}</p>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-xl w-full p-6 space-y-4 bg-white">
              <h3 className="text-xl font-bold text-slate-900">Create New Challenge Task</h3>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Task Title"
                  placeholder="Daily Quiet Solitude"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Description</label>
                  <textarea
                    placeholder="Instructions for participants..."
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Growth Pillar</label>
                    <select
                      value={pillar}
                      onChange={(e: any) => setPillar(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                    >
                      <option value="SPIRITUAL">SPIRITUAL</option>
                      <option value="MENTAL">MENTAL</option>
                      <option value="SOCIAL">SOCIAL</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Frequency</label>
                    <select
                      value={frequencyType}
                      onChange={(e) => setFrequencyType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-medium"
                    >
                      <option value="DAILY">DAILY</option>
                      <option value="WEEKLY">WEEKLY</option>
                      <option value="MONTHLY">MONTHLY</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <input
                    type="checkbox"
                    id="nonNeg"
                    checked={isNonNegotiable}
                    onChange={(e) => setIsNonNegotiable(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                  />
                  <label htmlFor="nonNeg" className="text-xs font-bold text-amber-900 cursor-pointer">
                    Flag as NON-NEGOTIABLE Task
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="glass" size="sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save & Publish Task
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
