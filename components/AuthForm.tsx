'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const signingUp = mode === 'sign-up';
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    try {
      const result = signingUp
        ? await authClient.signUp.email({ name: String(data.get('name') || '').trim(), email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(signingUp ? 'We could not create your account. Check your details or try signing in.' : 'Unable to sign in. Check your email and password and try again.');
        return;
      }
      router.replace('/'); router.refresh();
    } catch { setError('We could not connect. Please try again shortly.'); }
    finally { setPending(false); }
  }
  return <section className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0a0f1f] p-6 text-white sm:p-8">
    <Link href="/" className="text-xl font-bold text-[#15D088]">SmartDocs</Link>
    <h1 className="mt-6 text-2xl font-semibold">{signingUp ? 'Create your account' : 'Welcome back'}</h1>
    <p className="mt-2 text-sm text-slate-300">{signingUp ? 'A place to write, collaborate, and bring ideas together.' : 'Sign in to continue working on your documents.'}</p>
    <form onSubmit={submit} className="mt-6 space-y-5">
      {signingUp && <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" required minLength={1} maxLength={100} className="bg-slate-900" /></div>}
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="bg-slate-900" /></div>
      <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete={signingUp ? 'new-password' : 'current-password'} required minLength={signingUp ? 12 : 1} maxLength={128} aria-describedby={signingUp ? 'password-help' : undefined} className="bg-slate-900" />{signingUp && <p id="password-help" className="text-xs text-slate-400">Use at least 12 characters.</p>}</div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full bg-[#15D088] text-slate-950 hover:bg-emerald-400">{pending ? 'Please wait…' : signingUp ? 'Create account' : 'Sign in'}</Button>
    </form>
    <p className="mt-6 text-sm text-slate-300">{signingUp ? 'Already have an account? ' : 'New to SmartDocs? '}<Link className="text-[#15D088] underline underline-offset-4" href={signingUp ? '/sign-in' : '/sign-up'}>{signingUp ? 'Sign in' : 'Create an account'}</Link></p>
  </section>;
}
