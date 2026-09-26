'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../services/api';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Loader } from '../../../components/ui/Loader';
import { DynamicRegisterForm, DynamicField } from '../../../components/features/DynamicRegisterForm';
import { ArrowRight, AlertCircle, Sparkles, Home, LogIn } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fields, setFields] = useState<DynamicField[]>([]);
  const [isFetchingFields, setIsFetchingFields] = useState(true);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFetchingFields(true);
    api.getDynamicFormFields()
      .then((res) => {
        if (res.fields) {
          const activeFields = res.fields.filter((f: DynamicField) => f.isActive);
          setFields(activeFields);
        }
      })
      .catch((err) => console.error('Failed to fetch dynamic fields:', err))
      .finally(() => setIsFetchingFields(false));
  }, []);

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
        customAnswers,
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
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-3 sm:p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-4 relative z-10 my-auto">
        <div className="text-center space-y-1">
          <Badge variant="cyan" className="text-[10px]">90-Day Challenge Cohort</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Participant Registration</h1>
          <p className="text-xs text-slate-500">Your email is your continuous access ID. No passwords required.</p>
        </div>

        {isFetchingFields ? (
          <Card variant="glass" className="p-8 text-center space-y-3 bg-white/90 shadow-subtle-lg flex flex-col items-center justify-center">
            <Loader size="md" />
            <p className="text-xs font-semibold text-slate-600">Loading cohort registration questions...</p>
          </Card>
        ) : fields.length === 0 ? (
          /* Empty State: No Dynamic Registration Questions Published */
          <Card variant="glass" className="p-8 text-center space-y-4 bg-white/90 shadow-subtle-lg">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-900">Registration Currently Unavailable</h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                No active registration questions have been published by the EXCO team. Registration will become available once administrators publish the cohort questionnaire from the EXCO portal.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" /> Sign In to Existing Account
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                  <Home className="w-3.5 h-3.5" /> Return Home
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Active Registration Form */
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

              {/* Admin-Configured Dynamic Questions Fetched from Backend */}
              <DynamicRegisterForm fields={fields} formData={customAnswers} onChange={handleCustomAnswerChange} />

              <Button type="submit" variant="primary" size="lg" className="w-full text-sm py-3" isLoading={isLoading}>
                Join Challenge Cohort <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        )}

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
