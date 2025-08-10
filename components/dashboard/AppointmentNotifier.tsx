"use client";
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AppointmentNotifier() {
  const { toast } = useToast();
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch('/api/appointments?take=1', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const latest = data?.items?.[0];
        if (!latest) return;
        const key = 'lastAppointmentSeenId';
        const prev = localStorage.getItem(key);
        if (!prev) {
          localStorage.setItem(key, latest.id);
          return;
        }
        if (prev !== latest.id) {
          localStorage.setItem(key, latest.id);
          if (!cancelled) {
            toast({
              title: 'New appointment booked',
              description: `${latest.name} · ${new Date(latest.preferredDate).toLocaleDateString()} · ${latest.preferredTime}`,
            });
          }
        }
      } catch {}
    };
    poll();
    pollingRef.current = window.setInterval(poll, 15000);
    return () => {
      cancelled = true;
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
  }, [toast]);

  return null;
}


