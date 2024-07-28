'use client';

import Loader from '@/components/Loader';
import { getClerkUsers } from '@/lib/actions/user.actions';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { ClientSideSuspense, LiveblocksProvider } from '@liveblocks/react/suspense';
import { ReactNode } from 'react';
import { UserProvider } from '@/components/UserContext';

interface CustomUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useClerkUser();

  const getClerkUser = (user: any): CustomUser | null => {
    if (user) {
      return {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        avatar: user.profileImageUrl,
        color: '#000000', // Provide a default or calculated value for color
        name: user.fullName || user.firstName || 'Anonymous',
      };
    }
    return null;
  };

  const user = getClerkUser(clerkUser);

  return (
    <LiveblocksProvider 
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        <UserProvider user={user}>
          {children}
        </UserProvider>
      </ClientSideSuspense>
    </LiveblocksProvider>
  )
}

export default Provider;
