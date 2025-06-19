'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NotificationFeedProvider } from '@/context/NotificationContext';
import NotificationTile from './NotificationTile';

export default function NotificationFeedWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <>{children}</>;
  return (
    <NotificationFeedProvider userId={user.id}>
      {children}
      <NotificationTile />
    </NotificationFeedProvider>
  );
} 