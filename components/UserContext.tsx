// components/UserContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';

interface CustomUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

interface UserContextType {
  user: CustomUser | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ user, children }: { user: CustomUser | null, children: ReactNode }) => {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context.user;
}
