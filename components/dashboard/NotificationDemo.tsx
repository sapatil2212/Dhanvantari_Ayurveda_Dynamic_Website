'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationTrigger } from '@/hooks/use-notification-trigger';
import { useToast } from '@/hooks/use-toast';

export function NotificationDemo() {
  const {
    triggerAppointmentNotification,
    triggerPatientNotification,
    triggerPrescriptionNotification,
    triggerInvoiceNotification,
    triggerInventoryNotification,
    triggerSystemNotification,
    triggerCustomNotification,
  } = useNotificationTrigger();

  const { toast } = useToast();

  const handleAppointmentNotification = async (action: 'created' | 'updated' | 'cancelled' | 'confirmed') => {
    // In a real app, you would pass the actual appointment ID
    const mockAppointmentId = 'demo-appointment-123';
    await triggerAppointmentNotification(mockAppointmentId, action);
    
    toast({
      title: 'Notification Triggered',
      description: `Appointment ${action} notification sent`,
    });
  };

  const handlePatientNotification = async (action: 'created' | 'updated') => {
    const mockPatientId = 'demo-patient-123';
    await triggerPatientNotification(mockPatientId, action);
    
    toast({
      title: 'Notification Triggered',
      description: `Patient ${action} notification sent`,
    });
  };

  const handlePrescriptionNotification = async (action: 'created' | 'updated' | 'shared') => {
    const mockPrescriptionId = 'demo-prescription-123';
    await triggerPrescriptionNotification(mockPrescriptionId, action);
    
    toast({
      title: 'Notification Triggered',
      description: `Prescription ${action} notification sent`,
    });
  };

  const handleInvoiceNotification = async (action: 'created' | 'paid' | 'overdue') => {
    const mockInvoiceId = 'demo-invoice-123';
    await triggerInvoiceNotification(mockInvoiceId, action);
    
    toast({
      title: 'Notification Triggered',
      description: `Invoice ${action} notification sent`,
    });
  };

  const handleInventoryNotification = async (action: 'low_stock' | 'out_of_stock' | 'restocked') => {
    const mockItemId = 'demo-item-123';
    await triggerInventoryNotification(mockItemId, action);
    
    toast({
      title: 'Notification Triggered',
      description: `Inventory ${action} notification sent`,
    });
  };

  const handleSystemNotification = async (type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM') => {
    const messages = {
      CREATED: { title: 'System Update Complete', message: 'All systems are running smoothly' },
      UPDATED: { title: 'System Updated', message: 'System configuration has been updated' },
      STATUS_CHANGED: { title: 'System Status Changed', message: 'System status has been modified' },
      DELETED: { title: 'System Cleanup', message: 'Old data has been cleaned up' },
      REMINDER: { title: 'Maintenance Reminder', message: 'Scheduled maintenance in 2 hours' },
      ALERT: { title: 'System Alert', message: 'There was an issue with the database connection' },
      SYSTEM: { title: 'System Information', message: 'New features have been deployed' },
    };

    const { title, message } = messages[type];
    await triggerSystemNotification(title, message, type);
    
    toast({
      title: 'Notification Triggered',
      description: `System ${type} notification sent`,
    });
  };

  const handleCustomNotification = async () => {
    await triggerCustomNotification(
      'Custom Notification',
      'This is a custom notification with action buttons',
      'SYSTEM',
      { type: 'appointment', id: 'demo-123' },
      { label: 'View Details', url: '/dashboard/appointments/demo-123' }
    );
    
    toast({
      title: 'Notification Triggered',
      description: 'Custom notification sent',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Notification System</CardTitle>
          <CardDescription>
            Test the notification system by triggering different types of notifications.
            Check the notification bell in the top bar to see real-time updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appointment Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Appointment Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleAppointmentNotification('created')} variant="outline">
                Appointment Created
              </Button>
              <Button onClick={() => handleAppointmentNotification('updated')} variant="outline">
                Appointment Updated
              </Button>
              <Button onClick={() => handleAppointmentNotification('cancelled')} variant="outline">
                Appointment Cancelled
              </Button>
              <Button onClick={() => handleAppointmentNotification('confirmed')} variant="outline">
                Appointment Confirmed
              </Button>
            </div>
          </div>

          {/* Patient Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Patient Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handlePatientNotification('created')} variant="outline">
                Patient Created
              </Button>
              <Button onClick={() => handlePatientNotification('updated')} variant="outline">
                Patient Updated
              </Button>
            </div>
          </div>

          {/* Prescription Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Prescription Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handlePrescriptionNotification('created')} variant="outline">
                Prescription Created
              </Button>
              <Button onClick={() => handlePrescriptionNotification('updated')} variant="outline">
                Prescription Updated
              </Button>
              <Button onClick={() => handlePrescriptionNotification('shared')} variant="outline">
                Prescription Shared
              </Button>
            </div>
          </div>

          {/* Invoice Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Invoice Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleInvoiceNotification('created')} variant="outline">
                Invoice Created
              </Button>
              <Button onClick={() => handleInvoiceNotification('paid')} variant="outline">
                Payment Received
              </Button>
              <Button onClick={() => handleInvoiceNotification('overdue')} variant="outline">
                Invoice Overdue
              </Button>
            </div>
          </div>

          {/* Inventory Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Inventory Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleInventoryNotification('low_stock')} variant="outline">
                Low Stock Alert
              </Button>
              <Button onClick={() => handleInventoryNotification('out_of_stock')} variant="outline">
                Out of Stock
              </Button>
              <Button onClick={() => handleInventoryNotification('restocked')} variant="outline">
                Item Restocked
              </Button>
            </div>
          </div>

          {/* System Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">System Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleSystemNotification('CREATED')} variant="outline" className="text-green-600">
                Success
              </Button>
              <Button onClick={() => handleSystemNotification('ALERT')} variant="outline" className="text-red-600">
                Error
              </Button>
              <Button onClick={() => handleSystemNotification('REMINDER')} variant="outline" className="text-yellow-600">
                Warning
              </Button>
              <Button onClick={() => handleSystemNotification('SYSTEM')} variant="outline" className="text-blue-600">
                Info
              </Button>
            </div>
          </div>

          {/* Custom Notification */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Custom Notification</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCustomNotification} variant="outline">
                Custom Notification with Action
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
