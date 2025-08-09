'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppointmentContextType {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <AppointmentContext.Provider value={{ isAppointmentModalOpen, setIsAppointmentModalOpen }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
