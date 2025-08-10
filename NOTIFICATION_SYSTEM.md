# Real-time Notification System

This document explains how to use the real-time notification system implemented in the Dhanvantari Ayurveda application.

## Overview

The notification system provides real-time notifications for various user operations across the system. It includes:

- **Real-time updates** using Server-Sent Events (SSE)
- **Toast notifications** for immediate feedback
- **Persistent notifications** stored in the database
- **Action buttons** for quick navigation
- **Unread count tracking**
- **User-specific and system-wide notifications**

## Architecture

### Components

1. **NotificationService** (`lib/notification-service.ts`) - Core service for creating notifications
2. **NotificationContext** (`contexts/NotificationContext.tsx`) - React context for state management
3. **RealTimeNotificationBell** (`components/ui/RealTimeNotificationBell.tsx`) - UI component
4. **useNotificationTrigger** (`hooks/use-notification-trigger.ts`) - Hook for triggering notifications
5. **API Endpoints** - For fetching, marking as read, and streaming notifications

### Database Schema

The system uses a `Notification` model with the following fields:
- `id` - Unique identifier
- `title` - Notification title
- `message` - Notification message
- `type` - Type (success, error, warning, info)
- `isRead` - Read status
- `userId` - Target user (null for system-wide)
- `relatedEntityType` - Related entity type
- `relatedEntityId` - Related entity ID
- `actionLabel` - Action button label
- `actionUrl` - Action button URL
- `createdAt` - Creation timestamp

## Usage

### 1. Basic Notification Triggering

```typescript
import { useNotificationTrigger } from '@/hooks/use-notification-trigger';

function MyComponent() {
  const { triggerSystemNotification } = useNotificationTrigger();

  const handleSuccess = async () => {
    await triggerSystemNotification(
      'Operation Successful',
      'Your action has been completed successfully',
      'success'
    );
  };

  return <button onClick={handleSuccess}>Perform Action</button>;
}
```

### 2. Entity-Specific Notifications

```typescript
import { useNotificationTrigger } from '@/hooks/use-notification-trigger';

function AppointmentForm() {
  const { triggerAppointmentNotification } = useNotificationTrigger();

  const handleAppointmentCreated = async (appointmentId: string) => {
    await triggerAppointmentNotification(appointmentId, 'created');
  };

  const handleAppointmentUpdated = async (appointmentId: string) => {
    await triggerAppointmentNotification(appointmentId, 'updated');
  };

  // ... form logic
}
```

### 3. Custom Notifications with Actions

```typescript
import { useNotificationTrigger } from '@/hooks/use-notification-trigger';

function CustomNotification() {
  const { triggerCustomNotification } = useNotificationTrigger();

  const handleCustomNotification = async () => {
    await triggerCustomNotification(
      'New Message',
      'You have received a new message from Dr. Sharma',
      'info',
      { type: 'appointment', id: 'appointment-123' },
      { label: 'View Message', url: '/dashboard/messages/123' }
    );
  };

  return <button onClick={handleCustomNotification}>Send Custom Notification</button>;
}
```

### 4. Using the Notification Context

```typescript
import { useNotifications } from '@/contexts/NotificationContext';

function NotificationList() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <h2>Notifications ({unreadCount} unread)</h2>
      <button onClick={markAllAsRead}>Mark All Read</button>
      
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          {notification.actionUrl && (
            <a href={notification.actionUrl}>{notification.actionLabel}</a>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Available Notification Types

### 1. Appointment Notifications
- `created` - New appointment booked
- `updated` - Appointment details updated
- `cancelled` - Appointment cancelled
- `confirmed` - Appointment confirmed

### 2. Patient Notifications
- `created` - New patient added
- `updated` - Patient information updated

### 3. Prescription Notifications
- `created` - New prescription created
- `updated` - Prescription updated
- `shared` - Prescription shared

### 4. Invoice Notifications
- `created` - New invoice created
- `paid` - Payment received
- `overdue` - Invoice overdue

### 5. Inventory Notifications
- `low_stock` - Item running low
- `out_of_stock` - Item out of stock
- `restocked` - Item restocked

### 6. System Notifications
- `success` - Success messages
- `error` - Error messages
- `warning` - Warning messages
- `info` - Information messages

## API Integration

### 1. In API Routes

```typescript
import { NotificationService } from '@/lib/notification-service';

export async function POST(request: Request) {
  try {
    // Your existing logic
    const result = await prisma.someModel.create({ data });
    
    // Create notification
    await NotificationService.createAppointmentNotification(result.id, 'created');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### 2. In Server Actions

```typescript
'use server';

import { NotificationService } from '@/lib/notification-service';

export async function createAppointment(data: any) {
  try {
    const appointment = await prisma.appointment.create({ data });
    
    // Create notification
    await NotificationService.createAppointmentNotification(appointment.id, 'created');
    
    return { success: true, appointment };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Real-time Features

### 1. Server-Sent Events
The system uses SSE for real-time updates. Clients automatically receive notifications when they're created.

### 2. Fallback Polling
If SSE is not supported, the system falls back to polling every 30 seconds.

### 3. Toast Notifications
New notifications automatically trigger toast notifications for immediate user feedback.

## Configuration

### 1. Notification Provider Setup

The `NotificationProvider` is already set up in `app/providers.tsx`:

```typescript
<NotificationProvider>
  {children}
</NotificationProvider>
```

### 2. Real-time Bell Component

The `RealTimeNotificationBell` component is integrated into the Topbar and provides:
- Unread count badge
- Dropdown with recent notifications
- Mark as read functionality
- Action button support

### 3. API Endpoints

The following endpoints are available:
- `GET /api/notifications` - Fetch notifications
- `POST /api/notifications/[id]/read` - Mark notification as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/stream` - SSE endpoint for real-time updates

## Best Practices

### 1. Error Handling
Always wrap notification creation in try-catch blocks:

```typescript
try {
  await NotificationService.createAppointmentNotification(id, 'created');
} catch (error) {
  console.error('Failed to create notification:', error);
  // Don't let notification failures break your main functionality
}
```

### 2. User Experience
- Use appropriate notification types (success, error, warning, info)
- Provide meaningful titles and messages
- Include action buttons when relevant
- Don't spam users with too many notifications

### 3. Performance
- Notifications are created asynchronously
- The system includes fallback mechanisms
- Unread counts are cached and updated efficiently

## Testing

Use the `NotificationDemo` component to test all notification types:

```typescript
import { NotificationDemo } from '@/components/dashboard/NotificationDemo';

// Add to any page for testing
<NotificationDemo />
```

## Troubleshooting

### 1. Notifications not appearing
- Check if the user is authenticated
- Verify the notification service is working
- Check browser console for errors
- Ensure SSE connection is established

### 2. Real-time updates not working
- Check if SSE is supported in the browser
- Verify the `/api/notifications/stream` endpoint is accessible
- Check for network connectivity issues

### 3. Database errors
- Ensure the Notification model exists in the database
- Check Prisma schema and migrations
- Verify database connection

## Future Enhancements

Potential improvements for the notification system:
- Email notifications
- Push notifications
- Notification preferences
- Notification categories
- Bulk operations
- Notification templates
- Advanced filtering and search
