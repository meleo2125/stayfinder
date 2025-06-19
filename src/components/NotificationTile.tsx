'use client';
import { useEffect, useRef } from 'react';
import { useNotificationFeed } from '@/context/NotificationContext';

export default function NotificationTile() {
  const { notifications, open, setOpen, markAllAsSeen } = useNotificationFeed();
  const ref = useRef<HTMLDivElement>(null);
  const seenMarked = useRef(false);

  useEffect(() => {
    if (open && !seenMarked.current) {
      markAllAsSeen();
      seenMarked.current = true;
    }
    if (!open) {
      seenMarked.current = false;
    }
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpen, markAllAsSeen]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 mt-2 w-96 max-w-full bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-bold text-lg">Notifications</span>
        <button className="text-gray-400 hover:text-gray-600" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No notifications</div>
        ) : notifications.map(n => (
          <div key={n._id} className={`p-4 ${!n.seen ? 'bg-blue-50' : ''}`}>
            <div className="text-sm text-gray-800">{n.message}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 