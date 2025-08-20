"use client";
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { SessionActivityProvider } from '@/contexts/SessionActivityContext';
import ClientChrome from './ui/ClientChrome';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} 
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <SessionActivityProvider>
        <AppointmentProvider>
          {children}
        </AppointmentProvider>
      </SessionActivityProvider>
    </SessionProvider>
  );
}


