"use client";
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ClientChrome from './ui/ClientChrome';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppointmentProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppointmentProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}


