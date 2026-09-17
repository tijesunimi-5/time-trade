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

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [ageRange, setAgeRange] = useState('25-34');
  const [goals, setGoals] = useState('');
  const [expectations, setExpectations] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.register({
        fullName,
        email,
        phone,
        password,
        ageRange,
        goals,
        expectations,
      });

      setAuth(res.user, res.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 py-12 relative overflow-hidden bg-slate-50">
      <div className="w-full max-w-xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Badge variant="cyan">Join Cohort</Badge>
          <h1 className="text-3xl font-black text-slate-900">90-Day Challenge Registration</h1>
          <p className="text-xs text-slate-500">Set up your profile and join your assigned follow-up cohort</p>
        </div>

        <Card variant="glass" className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="David Okonkwo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="david@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone / WhatsApp"
                placeholder="+234 803 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Age Range
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
              >
                <option value="18-24">18 - 24 years</option>
                <option value="25-34">25 - 34 years</option>
                <option value="35-44">35 - 44 years</option>
                <option value="45+">45+ years</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Primary Goals for this 90-Day Challenge
              </label>
              <textarea
                placeholder="What breakthrough do you aim to achieve in Spiritual, Mental, and Social pillars?"
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium placeholder:text-slate-400"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Complete Registration <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-brand-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
