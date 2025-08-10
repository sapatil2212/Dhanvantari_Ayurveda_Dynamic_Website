"use client";
import { useEffect, useState } from 'react';

type Notification = {
  id: string;
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED';
  appointmentId: string;
  title: string;
  message: string;
  createdAt: string;
};

export default function NotificationsList({ take = 5 }: { take?: number }) {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/notifications?take=${take}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
      } catch {}
    };
    run();
  }, []);

  if (items.length === 0) return <div className="p-3 text-center text-xs text-gray-500">No activity</div>;

  return (
    <div className="max-h-60 overflow-auto">
      {items.map((n) => (
        <div key={n.id} className="px-3 py-2 text-xs">
          <div className="font-medium">{n.title}</div>
          <div className="text-gray-600">{n.message}</div>
          <div className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}


