'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

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

export interface Notification {
  _id: string;
  type: string;
  message: string;
  data?: Record<string, unknown>;
  seen: boolean;
  createdAt: string;
}

interface NotificationFeedContextType {
  notifications: Notification[];
  unseenCount: number;
  fetchNotifications: () => Promise<void>;
  markAllAsSeen: () => Promise<void>;
  markOneAsSeen: (id: string) => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NotificationFeedContext = createContext<NotificationFeedContextType | undefined>(undefined);

export function NotificationFeedProvider({ userId, children }: { userId: string, children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [open, setOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    const res = await axios.get(`${baseUrl}/api/notifications/user/${userId}`);
    setNotifications(res.data.notifications);
    setUnseenCount(res.data.notifications.filter((n: Notification) => !n.seen).length);
  }, [userId, baseUrl]);

  const markAllAsSeen = async () => {
    if (!userId) return;
    await axios.patch(`${baseUrl}/api/notifications/user/${userId}/seen`);
    setNotifications((prev) => prev.map(n => ({ ...n, seen: true })));
    setUnseenCount(0);
  };

  const markOneAsSeen = async (id: string) => {
    await axios.patch(`${baseUrl}/api/notifications/${id}/seen`);
    setNotifications((prev) => prev.map(n => n._id === id ? { ...n, seen: true } : n));
    setUnseenCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll for new notifications every X seconds
    // const interval = setInterval(fetchNotifications, 60000);
    // return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  return (
    <NotificationFeedContext.Provider value={{ notifications, unseenCount, fetchNotifications, markAllAsSeen, markOneAsSeen, open, setOpen }}>
      {children}
    </NotificationFeedContext.Provider>
  );
}

export function useNotificationFeed() {
  const context = useContext(NotificationFeedContext);
  if (context === undefined) {
    throw new Error('useNotificationFeed must be used within a NotificationFeedProvider');
  }
  return context;
} 