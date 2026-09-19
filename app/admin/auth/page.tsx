'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Shield, KeyRound, Check, Lock, ArrowRight, Users, Target, MessageSquare, Image, FileText, Crown } from 'lucide-react';

export default function AdminAuthPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [isAdminRegistrationActive, setIsAdminRegistrationActive] = useState<boolean>(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['LEADERSHIP']);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const excoTeams = [
    {
      id: 'LEADERSHIP',
      name: 'Leadership Team',
      desc: 'All EXCO members belong here',
      icon: Crown,
      color: 'amber',
      isDefault: true,
    },
    {
      id: 'FOLLOW_UP',
      name: 'Follow-Up Team',
      desc: 'Participant check-in & coaching',
      icon: Users,
      color: 'emerald',
    },
    {
      id: 'PROGRAM_PLANNING',
      name: 'Program Planning (Curators)',
      desc: 'Challenge calendar & tasks',
      icon: Target,
      color: 'blue',
    },
    {
      id: 'COMMUNITY_MANAGEMENT',
      name: 'Community Management',
      desc: 'WhatsApp & group reflections',
      icon: MessageSquare,
      color: 'purple',
    },
    {
      id: 'MEDIA',
      name: 'Media Team',
      desc: 'Visual assets & media links',
      icon: Image,
      color: 'rose',
    },
    {
      id: 'CONTENT',
      name: 'Content Team',
      desc: 'Study guides & sermon takeaways',
      icon: FileText,
      color: 'cyan',
    },
  ];

  useEffect(() => {
    fetch('/api/v1/auth/admin/status')
      .then((res) => res.json())
      .then((data) => {
        setIsAdminRegistrationActive(data.isAdminRegistrationActive ?? true);
        if (!data.isAdminRegistrationActive) {
          setMode('login');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingStatus(false));
  }, []);

  const toggleRole = (roleId: string) => {
    if (roleId === 'LEADERSHIP') return; // Leadership is mandatory for all EXCOs

    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((r) => r !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.registerAdmin({
        fullName,
        email,
        password,
        roles: selectedRoles,
        phone,
      });

      setAuth(res.user, res.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'EXCO registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email, password });
      setAuth(res.user, res.token);

      const roles = res.user.rolesList || [res.user.role];
      if (roles.includes('ADMIN') || roles.includes('LEADERSHIP')) {
        router.push('/admin');
      } else if (roles.includes('FOLLOW_UP')) {
        router.push('/follow-up');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-3 sm:p-4 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-xl space-y-4 relative z-10 my-auto">
        <div className="text-center space-y-1">
          <Badge variant="nonNegotiable">EXCO TEAM AUTHENTICATION</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">EXCO Team Registration</h1>
          <p className="text-xs text-slate-500">Select your team assignments across the 90-day challenge operations</p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setMode('register')}
            disabled={!isAdminRegistrationActive}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-brand-600 text-white shadow-subtle-sm'
                : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
            }`}
          >
            Register EXCO
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-brand-600 text-white shadow-subtle-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        <Card variant="glass" className="p-5 sm:p-6 space-y-4 bg-white/90 shadow-subtle-lg">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {!isAdminRegistrationActive && mode === 'register' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1 text-center">
              <Lock className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="font-bold text-sm">Admin registration is currently turned off by EXCO.</p>
              <p className="text-xs text-slate-600">Please sign in if you already have an EXCO account.</p>
            </div>
          )}

          {mode === 'register' && isAdminRegistrationActive && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  placeholder="Dr. Samuel Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="samuel@timetrade.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Phone / WhatsApp"
                  placeholder="+1 (555) 019-2831"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Multi-Select EXCO Team Role Pill Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select EXCO Teams (Select All That Apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {excoTeams.map((team) => {
                    const Icon = team.icon;
                    const isSelected = selectedRoles.includes(team.id);

                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => toggleRole(team.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-50 border-brand-300 text-slate-900 shadow-subtle-sm font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-900 truncate">
                              {team.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {team.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-brand-600 stroke-[3] shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full text-sm py-3 mt-2" isLoading={isLoading}>
                Complete EXCO Registration <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                label="EXCO Email"
                type="email"
                placeholder="admin@timetrade.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full text-sm py-3" isLoading={isLoading}>
                Sign In to EXCO Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
