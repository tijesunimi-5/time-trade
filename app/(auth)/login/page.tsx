'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Shield, Sparkles, User, KeyRound, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email, password });
      setAuth(res.user, res.token);

      if (res.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (res.user.role === 'FOLLOW_UP') {
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

  const handleQuickLogin = async (userEmail: string, role: string) => {
    setEmail(userEmail);
    setPassword('password123');
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email: userEmail, password: 'password123' });
      setAuth(res.user, res.token);

      if (res.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (res.user.role === 'FOLLOW_UP') {
        router.push('/follow-up');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Badge variant="cyan">Sign In</Badge>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Access your 90-day task checklist and streak records</p>
        </div>

        <Card variant="glass" className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="participant@timetrade.com"
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
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
              Quick Preset Logins (One-Click)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('participant@timetrade.com', 'PARTICIPANT')}
                className="p-2.5 rounded-xl glass-panel text-left hover:border-brand-cyan/50 text-xs font-medium space-y-1"
              >
                <span className="text-[10px] font-bold text-cyan-400 uppercase block">Participant</span>
                <span className="text-white font-semibold truncate block">David O.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('followup@timetrade.com', 'FOLLOW_UP')}
                className="p-2.5 rounded-xl glass-panel text-left hover:border-emerald-500/50 text-xs font-medium space-y-1"
              >
                <span className="text-[10px] font-bold text-emerald-400 uppercase block">Follow-Up</span>
                <span className="text-white font-semibold truncate block">Coach Grace</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@timetrade.com', 'ADMIN')}
                className="p-2.5 rounded-xl glass-panel text-left hover:border-amber-500/50 text-xs font-medium space-y-1"
              >
                <span className="text-[10px] font-bold text-amber-400 uppercase block">Admin EXCO</span>
                <span className="text-white font-semibold truncate block">Dr. Samuel</span>
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-brand-cyan font-semibold hover:underline">
            Register for the Challenge
          </Link>
        </p>
      </div>
    </div>
  );
}
