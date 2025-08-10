"use client";
import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationsList from './NotificationsList';

type Appt = {
  id: string;
  name: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function AppointmentBell() {
  const [items, setItems] = useState<Appt[]>([]);
  const [unread, setUnread] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);

  const lastSeenKey = 'appointmentsLastSeenAt';
  const lastNotifKey = 'lastNotificationAt';

  const computeUnread = (list: Appt[]) => {
    const lastSeen = localStorage.getItem(lastSeenKey);
    if (!lastSeen) return 0;
    const last = new Date(lastSeen).getTime();
    return list.filter((a) => new Date(a.createdAt).getTime() > last).length;
  };

  const poll = async () => {
    try {
      const res = await fetch('/api/appointments?take=5', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const list: Appt[] = data.items || [];
      setItems(list);
      setUnread(computeUnread(list));
      // Also check notifications for red dot
      const since = localStorage.getItem(lastNotifKey) || new Date(0).toISOString();
      const nres = await fetch(`/api/notifications?since=${encodeURIComponent(since)}`, { cache: 'no-store' });
      if (nres.ok) {
        const ndata = await nres.json();
        if (ndata.items && ndata.items.length > 0) {
          // set bell dot via unread count
          setUnread((u) => Math.max(u, 1));
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (!localStorage.getItem(lastSeenKey)) {
      localStorage.setItem(lastSeenKey, new Date().toISOString());
    }
    poll();
    intervalRef.current = window.setInterval(poll, 15000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const markAllRead = () => {
    localStorage.setItem(lastSeenKey, new Date().toISOString());
    localStorage.setItem(lastNotifKey, new Date().toISOString());
    setUnread(0);
  };

  return (
    <DropdownMenu open={open} onOpenChange={(v) => { setOpen(v); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-3 text-center text-xs text-gray-500">No recent activity</div>
        ) : (
          <>
            <div className="px-2 pb-1 text-[10px] uppercase tracking-wide text-gray-500">Recent appointments</div>
            {items.map((a) => (
              <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-0 py-2">
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-medium">{a.status === 'CONFIRMED' ? 'Confirmed' : 'Booked'}</span>
                  <span className="text-[10px] text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-gray-600">{a.name} · {new Date(a.preferredDate).toLocaleDateString()} · {a.preferredTime}</div>
              </DropdownMenuItem>
            ))}
            <div className="px-2 pt-2 text-[10px] uppercase tracking-wide text-gray-500">Other activity</div>
            <NotificationsList take={4} />
          </>
        )}
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <button onClick={markAllRead} className="text-xs text-emerald-700 hover:underline">Mark as read</button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


