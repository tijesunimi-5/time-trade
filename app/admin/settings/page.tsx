'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { api } from '../../../services/api';
import { toast } from '../../../store/useToastStore';
import { Settings, Shield, Lock, Unlock, Check, Plus, Trash2, Layers } from 'lucide-react';

const DEFAULT_PILLARS = ['SPIRITUAL', 'MENTAL', 'SOCIAL', 'PHYSICAL', 'FINANCIAL', 'RELATIONSHIP'];

export default function AdminSettingsPage() {
  const [isAdminRegistrationActive, setIsAdminRegistrationActive] = useState<boolean>(true);
  const [pillars, setPillars] = useState<string[]>(DEFAULT_PILLARS);
  const [newPillarInput, setNewPillarInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSettings();
      if (res.settings) {
        setIsAdminRegistrationActive(res.settings.isAdminRegistrationActive);
        if (res.settings.pillarsList && Array.isArray(res.settings.pillarsList)) {
          setPillars(res.settings.pillarsList);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggleAdminReg = async () => {
    try {
      setIsSaving(true);
      const newStatus = !isAdminRegistrationActive;
      const res = await api.updateSettings({ isAdminRegistrationActive: newStatus });
      setIsAdminRegistrationActive(res.settings.isAdminRegistrationActive);
      toast.success(
        'Registration Setting Updated',
        newStatus ? 'Admin Registration URL is now OPEN' : 'Admin Registration URL is now CLOSED'
      );
    } catch (err: any) {
      toast.error('Update Failed', err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPillar = () => {
    const trimmed = newPillarInput.trim().toUpperCase();
    if (!trimmed) return;
    if (pillars.includes(trimmed)) {
      toast.error('Duplicate Pillar', `Pillar "${trimmed}" already exists.`);
      return;
    }
    setPillars([...pillars, trimmed]);
    setNewPillarInput('');
  };

  const handleRemovePillar = (pillarToRemove: string) => {
    if (pillars.length <= 1) {
      toast.error('Cannot Delete', 'At least 1 active pillar is required.');
      return;
    }
    setPillars(pillars.filter((p) => p !== pillarToRemove));
  };

  const handleSavePillars = async () => {
    try {
      setIsSaving(true);
      const res = await api.updateSettings({ pillars });
      if (res.settings?.pillarsList) {
        setPillars(res.settings.pillarsList);
      }
      toast.success('Pillars Updated', 'Custom growth pillars saved successfully.');
    } catch (err: any) {
      toast.error('Failed to save pillars', err.message || 'Unable to update pillars');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <div className="space-y-1">
          <Badge variant="nonNegotiable">EXCO SETTINGS</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Configuration</h1>
          <p className="text-xs text-slate-500">Manage security settings, registration URL controls, and custom growth pillars</p>
        </div>

        {/* Admin Registration Setting */}
        <Card variant="glass" className="space-y-6 bg-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {isAdminRegistrationActive ? (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-600" />
                )}
                Admin & EXCO Registration Control (`/admin/auth`)
              </h3>
              <p className="text-xs text-slate-500">
                When turned off, external users cannot register as Admin EXCO or Follow-Up coaches via `/admin/auth`.
              </p>
            </div>

            <button
              onClick={handleToggleAdminReg}
              disabled={isSaving || isLoading}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isAdminRegistrationActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
              }`}
            >
              {isAdminRegistrationActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  REGISTRATION OPEN (Click to Close)
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  REGISTRATION CLOSED (Click to Open)
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Secret Admin URL Reference</h4>
            <p className="text-xs text-slate-600">
              Share this secret link with new EXCO members when registration is open:
            </p>
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-semibold text-brand-700 flex items-center justify-between">
              <span>https://time-trade-amber.vercel.app/admin/auth</span>
              <span className="text-[10px] text-slate-500 font-normal">Send to EXCOs only</span>
            </div>
          </div>
        </Card>

        {/* Custom Pillars Management */}
        <Card variant="glass" className="space-y-6 bg-white p-6">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              Custom Growth Pillars Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Define the growth pillars available across your programme (e.g. SPIRITUAL, MENTAL, SOCIAL, PHYSICAL, FINANCIAL, RELATIONSHIP). Tasks will be categorized under these pillars.
            </p>
          </div>

          <div className="space-y-4">
            {/* Add Pillar Form */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter new pillar name (e.g. ACADEMICS, HEALTH)..."
                value={newPillarInput}
                onChange={(e) => setNewPillarInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPillar();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="primary" onClick={handleAddPillar} className="gap-1">
                <Plus className="w-4 h-4" /> Add Pillar
              </Button>
            </div>

            {/* Pillar List */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-800"
                >
                  <Badge variant={pillar.toLowerCase()}>{pillar}</Badge>
                  <button
                    onClick={() => handleRemovePillar(pillar)}
                    title={`Remove ${pillar}`}
                    className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Save Pillars Button */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={handleSavePillars}
                disabled={isSaving}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                {isSaving ? 'Saving Pillars...' : 'Save Pillars Configuration'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
