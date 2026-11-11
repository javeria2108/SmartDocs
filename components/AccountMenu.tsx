'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useUser } from './UserContext';
import { Button } from './ui/button';

export function AccountMenu() {
  const user = useUser(); const router = useRouter();
  const [pending, setPending] = useState(false); const [error, setError] = useState('');
  return <div className="flex items-center gap-3 text-sm text-white">
    <span className="hidden max-w-40 truncate sm:inline" title={user?.email}>{user?.name}</span>
    <Button type="button" disabled={pending} variant="outline" onClick={async () => {
      setPending(true); setError('');
      try {
        const result = await authClient.signOut();
        if (result.error) throw new Error('Sign out failed');
        router.replace('/sign-in'); router.refresh();
      } catch { setError('Unable to sign out. Try again.'); }
      finally { setPending(false); }
    }}>{pending ? 'Signing out…' : 'Sign out'}</Button>
    {error && <span role="alert" className="text-red-300">{error}</span>}
  </div>;
}
