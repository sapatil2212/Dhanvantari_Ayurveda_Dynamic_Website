"use client";

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface SessionActivityContextType {
  resetActivityTimer: () => void;
}

const SessionActivityContext = createContext<SessionActivityContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

interface SessionActivityProviderProps {
  children: ReactNode;
}

export function SessionActivityProvider({ children }: SessionActivityProviderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAuthPageRef = useRef(false);

  // Check if current page is an auth page
  useEffect(() => {
    isAuthPageRef.current = pathname?.startsWith('/auth/') || pathname === '/auth';
  }, [pathname]);

  const resetActivityTimer = () => {
    // Don't set timer on auth pages or if user is not authenticated
    if (isAuthPageRef.current || status !== 'authenticated' || !session) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        // Only logout if user is still on a protected page
        if (!isAuthPageRef.current) {
          await signOut({ 
            callbackUrl: '/auth/login?reason=inactivity',
            redirect: true 
          });
        }
      } catch (error) {
        console.error('Error during auto-logout:', error);
        // Fallback: manually redirect to login
        window.location.href = '/auth/login?reason=inactivity';
      }
    }, INACTIVITY_TIMEOUT);
  };

  // Activity event handlers
  useEffect(() => {
    if (status === 'loading') return;

    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Reset timer on user activity
    const handleActivity = () => {
      resetActivityTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer for authenticated users on protected pages
    if (status === 'authenticated' && session && !isAuthPageRef.current) {
      resetActivityTimer();
    }

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status, session, pathname]);

  // Clear timer when user logs out or navigates to auth pages
  useEffect(() => {
    if (status === 'unauthenticated' || isAuthPageRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [status, pathname]);

  const contextValue = {
    resetActivityTimer,
  };

  return (
    <SessionActivityContext.Provider value={contextValue}>
      {children}
    </SessionActivityContext.Provider>
  );
}

export const useSessionActivity = (): SessionActivityContextType => {
  const context = useContext(SessionActivityContext);
  if (context === undefined) {
    throw new Error('useSessionActivity must be used within a SessionActivityProvider');
  }
  return context;
};
