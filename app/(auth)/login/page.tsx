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
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectUser = (user: any) => {
    const roles = user.rolesList || (user.role ? user.role.split(',') : ['PARTICIPANT']);
    if (roles.includes('ADMIN') || roles.includes('LEADERSHIP')) {
      router.push('/admin');
    } else if (roles.includes('FOLLOW_UP')) {
      router.push('/follow-up');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email, password: password || undefined });
      setAuth(res.user, res.token);
      redirectUser(res.user);
    } catch (err: any) {
      if (err.message?.includes('Password is required')) {
        setShowPassword(true);
        setError('An EXCO team password is required for this email address.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-3 sm:p-4 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md space-y-4 relative z-10 my-auto">
        <div className="text-center space-y-1">
          <Badge variant="cyan">Sign In</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your dashboard with your registered email</p>
        </div>

        <Card variant="glass" className="p-5 sm:p-6 space-y-4 bg-white/90 shadow-subtle-lg">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="david@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {(showPassword || password) && (
              <Input
                label="EXCO Team Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full text-sm py-3" isLoading={isLoading}>
              Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-brand-600 font-bold hover:underline">
            Register for Challenge
          </Link>
        </p>
      </div>
    </div>
  );
}
