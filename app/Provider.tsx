'use client';
import Loader from '@/components/Loader';
import { getUsers } from '@/lib/actions/user.actions';
import { authClient } from '@/lib/auth-client';
import { getUserColor } from '@/lib/utils';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';
import { UserProvider } from '@/components/UserContext';

export default function Provider({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const user: User | null = session ? {
    id: session.user.id, name: session.user.name, email: session.user.email,
    avatar: '/assets/icons/user.svg', color: getUserColor(session.user.id),
  } : null;
  return <UserProvider user={user}>
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" resolveUsers={({ userIds }) => getUsers({ userIds })}>
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  </UserProvider>;
}
