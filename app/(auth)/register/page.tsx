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
import { DynamicRegisterForm } from '../../../components/features/DynamicRegisterForm';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [expectations, setExpectations] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomAnswerChange = (fieldName: string, value: any) => {
    setCustomAnswers((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.register({
        email,
        fullName,
        phone,
        birthday,
        expectations,
        customAnswers,
      });

      // Browser automatically identifies participant via stored token
      setAuth(res.user, res.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-3 sm:p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-4 relative z-10 my-auto">
        <div className="text-center space-y-1">
          <Badge variant="cyan" className="text-[10px]">90-Day Challenge Cohort</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Participant Registration</h1>
          <p className="text-xs text-slate-500">Your email is your continuous access ID. No passwords required.</p>
        </div>

        <Card variant="glass" className="p-5 sm:p-6 space-y-4 bg-white/90 shadow-subtle-lg">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address (Your ID)"
                type="email"
                placeholder="david@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Full Name"
                placeholder="David Okonkwo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="WhatsApp / Phone"
                placeholder="+234 803 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Primary Expectations & Goals
              </label>
              <textarea
                placeholder="What breakthrough do you expect in Spiritual, Mental, and Social pillars?"
                rows={2}
                value={expectations}
                onChange={(e) => setExpectations(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Admin-Configured Dynamic Questions */}
            <DynamicRegisterForm formData={customAnswers} onChange={handleCustomAnswerChange} />

            <Button type="submit" variant="primary" size="lg" className="w-full text-sm py-3" isLoading={isLoading}>
              Join Challenge Cohort <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-brand-600 font-bold hover:underline">
            Sign In with Email
          </Link>
        </p>
      </div>
    </div>
  );
}
