'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
  blinkProfile: boolean;
  triggerProfileBlink: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [blinkProfile, setBlinkProfile] = useState(false);

  const triggerProfileBlink = () => {
    setBlinkProfile(true);
    setTimeout(() => setBlinkProfile(false), 3000); // Stop blinking after 3 seconds
  };

  return (
    <NotificationContext.Provider value={{
      blinkProfile,
      triggerProfileBlink
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 