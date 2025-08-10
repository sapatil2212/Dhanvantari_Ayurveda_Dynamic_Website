import { prisma } from './prisma';

export interface NotificationData {
  title: string;
  message: string;
  type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM';
  userId?: string;
  appointmentId?: string;
  patientId?: string;
}

export class NotificationService {
  static async createNotification(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          title: data.title,
          message: data.message,
          type: data.type as any, // Type assertion to bypass enum issue
          userId: data.userId || null,
          appointmentId: data.appointmentId || null,
          patientId: data.patientId || null,
        },
      });

      // Emit real-time notification via SSE
      this.emitNotification(notification);
      
      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  static async createAppointmentNotification(appointmentId: string, action: 'created' | 'updated' | 'cancelled' | 'confirmed') {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true }
    });

    if (!appointment) return;

    const messages = {
      created: {
        title: 'New Appointment Booked',
        message: `Appointment booked for ${appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Patient'} on ${new Date(appointment.preferredDate).toLocaleDateString()} at ${appointment.preferredTime}`,
        type: 'CREATED' as const
      },
      updated: {
        title: 'Appointment Updated',
        message: `Appointment for ${appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Patient'} has been updated`,
        type: 'UPDATED' as const
      },
      cancelled: {
        title: 'Appointment Cancelled',
        message: `Appointment for ${appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Patient'} has been cancelled`,
        type: 'STATUS_CHANGED' as const
      },
      confirmed: {
        title: 'Appointment Confirmed',
        message: `Appointment for ${appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'Patient'} has been confirmed`,
        type: 'STATUS_CHANGED' as const
      }
    };

    const notificationData = messages[action];
    
    return this.createNotification({
      ...notificationData,
      appointmentId: appointmentId
    });
  }

  static async createPatientNotification(patientId: string, action: 'created' | 'updated') {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) return;

    const messages = {
      created: {
        title: 'New Patient Added',
        message: `Patient ${patient.firstName} ${patient.lastName} has been added to the system`,
        type: 'CREATED' as const
      },
      updated: {
        title: 'Patient Updated',
        message: `Patient ${patient.firstName} ${patient.lastName}'s information has been updated`,
        type: 'UPDATED' as const
      }
    };

    const notificationData = messages[action];
    
    return this.createNotification({
      ...notificationData,
      patientId: patientId
    });
  }

  static async createPrescriptionNotification(prescriptionId: string, action: 'created' | 'updated' | 'shared') {
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { patient: true }
    });

    if (!prescription) return;

    const messages = {
      created: {
        title: 'New Prescription Created',
        message: `Prescription created for ${prescription.patient ? `${prescription.patient.firstName} ${prescription.patient.lastName}` : 'Patient'}`,
        type: 'CREATED' as const
      },
      updated: {
        title: 'Prescription Updated',
        message: `Prescription for ${prescription.patient ? `${prescription.patient.firstName} ${prescription.patient.lastName}` : 'Patient'} has been updated`,
        type: 'UPDATED' as const
      },
      shared: {
        title: 'Prescription Shared',
        message: `Prescription for ${prescription.patient ? `${prescription.patient.firstName} ${prescription.patient.lastName}` : 'Patient'} has been shared`,
        type: 'UPDATED' as const
      }
    };

    const notificationData = messages[action];
    
    return this.createNotification({
      ...notificationData,
      patientId: prescription.patientId
    });
  }

  static async createInvoiceNotification(invoiceId: string, action: 'created' | 'paid' | 'overdue') {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { patient: true }
    });

    if (!invoice) return;

    const messages = {
      created: {
        title: 'New Invoice Created',
        message: `Invoice #${invoice.number} created for ${invoice.patient ? `${invoice.patient.firstName} ${invoice.patient.lastName}` : 'Patient'}`,
        type: 'CREATED' as const
      },
      paid: {
        title: 'Payment Received',
        message: `Payment received for Invoice #${invoice.number}`,
        type: 'STATUS_CHANGED' as const
      },
      overdue: {
        title: 'Invoice Overdue',
        message: `Invoice #${invoice.number} is overdue`,
        type: 'ALERT' as const
      }
    };

    const notificationData = messages[action];
    
    return this.createNotification({
      ...notificationData,
      patientId: invoice.patientId
    });
  }

  static async createInventoryNotification(itemId: string, action: 'low_stock' | 'out_of_stock' | 'restocked') {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });

    if (!item) return;

    const messages = {
      low_stock: {
        title: 'Low Stock Alert',
        message: `${item.name} is running low (${item.quantity} units remaining)`,
        type: 'ALERT' as const
      },
      out_of_stock: {
        title: 'Out of Stock',
        message: `${item.name} is out of stock`,
        type: 'ALERT' as const
      },
      restocked: {
        title: 'Item Restocked',
        message: `${item.name} has been restocked`,
        type: 'UPDATED' as const
      }
    };

    const notificationData = messages[action];
    
    return this.createNotification({
      ...notificationData
    });
  }

  static async createSystemNotification(title: string, message: string, type: 'CREATED' | 'UPDATED' | 'STATUS_CHANGED' | 'DELETED' | 'REMINDER' | 'ALERT' | 'SYSTEM' = 'SYSTEM') {
    return this.createNotification({
      title,
      message,
      type
    });
  }

  // Real-time notification emission
  private static emitNotification(notification: any) {
    // This will be implemented with Server-Sent Events
    // For now, we'll use a simple event emitter
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification', {
        detail: notification
      }));
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId: string, take: number = 10) {
    return prisma.notification.findMany({
      where: {
        OR: [
          { userId: userId },
          { userId: null } // System-wide notifications
        ]
      },
      orderBy: { createdAt: 'desc' },
      take
    });
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        OR: [
          { userId: userId },
          { userId: null }
        ],
        isRead: false
      },
      data: { isRead: true }
    });
  }

  // Get unread count for a user
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        OR: [
          { userId: userId },
          { userId: null }
        ],
        isRead: false
      }
    });
  }
}
