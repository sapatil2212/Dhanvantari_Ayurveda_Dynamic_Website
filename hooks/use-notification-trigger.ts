import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { NotificationService } from '@/lib/notification-service';

export function useNotificationTrigger() {
  const { data: session } = useSession();

  const triggerAppointmentNotification = useCallback(async (
    appointmentId: string, 
    action: 'created' | 'updated' | 'cancelled' | 'confirmed'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Appointment notification disabled temporarily:', { appointmentId, action });
  }, []);

  const triggerPatientNotification = useCallback(async (
    patientId: string, 
    action: 'created' | 'updated'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Patient notification disabled temporarily:', { patientId, action });
  }, []);

  const triggerPrescriptionNotification = useCallback(async (
    prescriptionId: string, 
    action: 'created' | 'updated' | 'shared'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Prescription notification disabled temporarily:', { prescriptionId, action });
  }, []);

  const triggerInvoiceNotification = useCallback(async (
    invoiceId: string, 
    action: 'created' | 'paid' | 'overdue'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Invoice notification disabled temporarily:', { invoiceId, action });
  }, []);

  const triggerInventoryNotification = useCallback(async (
    itemId: string, 
    action: 'low_stock' | 'out_of_stock' | 'restocked'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Inventory notification disabled temporarily:', { itemId, action });
  }, []);

  const triggerSystemNotification = useCallback(async (
    title: string,
    message: string,
    type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM' = 'SYSTEM'
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('System notification disabled temporarily:', { title, message, type });
  }, []);

  const triggerCustomNotification = useCallback(async (
    title: string,
    message: string,
    type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM' = 'SYSTEM',
    relatedEntity?: {
      type: 'appointment' | 'patient' | 'prescription' | 'invoice' | 'payment' | 'inventory';
      id: string;
    },
    action?: {
      label: string;
      url: string;
    }
  ) => {
    // Temporarily disabled to prevent hydration issues
    console.log('Custom notification disabled temporarily:', { title, message, type });
  }, []);

  return {
    triggerAppointmentNotification,
    triggerPatientNotification,
    triggerPrescriptionNotification,
    triggerInvoiceNotification,
    triggerInventoryNotification,
    triggerSystemNotification,
    triggerCustomNotification,
  };
}
