'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../services/api';
import { Settings, Shield, Lock, Unlock, Check, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [isAdminRegistrationActive, setIsAdminRegistrationActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getAdminOverview()
      .then((res) => {
        if (res.settings) {
          setIsAdminRegistrationActive(res.settings.isAdminRegistrationActive);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleAdminReg = async () => {
    try {
      setIsSaving(true);
      const newStatus = !isAdminRegistrationActive;
      const res = await api.updateSettings({ isAdminRegistrationActive: newStatus });
      setIsAdminRegistrationActive(res.settings.isAdminRegistrationActive);
      setMessage(newStatus ? 'Admin Registration URL (/admin/auth) is now OPEN' : 'Admin Registration URL (/admin/auth) is now TURNED OFF');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        <div className="space-y-1">
          <Badge variant="nonNegotiable">EXCO SETTINGS</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Configuration</h1>
          <p className="text-xs text-slate-500">Manage security settings, registration URL controls, and EXCO permissions</p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> {message}
          </div>
        )}

        <Card variant="glass" className="space-y-6 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isAdminRegistrationActive
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
              }`}
            >
              {isAdminRegistrationActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  REGISTRATION OPEN (Click to Turn Off)
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
      </div>
    </div>
  );
}
