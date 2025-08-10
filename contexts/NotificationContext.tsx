'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  userId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionLabel?: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  // Hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    // Temporarily disabled to prevent hydration errors
    if (!session?.user || !isClient) return;
    
    try {
      setIsLoading(true);
      // Temporarily return empty data to prevent API calls
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, isClient]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // Temporarily disabled
    console.log('Mark as read disabled temporarily');
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Temporarily disabled
    console.log('Mark all as read disabled temporarily');
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Handle real-time notifications - temporarily disabled
  useEffect(() => {
    if (!session?.user || !isClient) return;

    // Temporarily disabled to prevent hydration errors
    console.log('Real-time notifications disabled temporarily');

    // Initial fetch
    fetchNotifications();

    return () => {
      // Cleanup
    };
  }, [session?.user, isClient, fetchNotifications]);

  // Fallback polling - temporarily disabled
  useEffect(() => {
    if (!session?.user || !isClient) return;

    // Temporarily disabled
    console.log('Polling disabled temporarily');

    return () => {
      // Cleanup
    };
  }, [session?.user, isClient]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
