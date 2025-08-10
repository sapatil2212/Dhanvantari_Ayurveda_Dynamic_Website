import { prisma } from './prisma';
import { sendEmail } from './email';
import webSocketService from './websocket-service';

export interface InventoryAlert {
  type: 'low_stock' | 'out_of_stock' | 'expiring';
  itemId: string;
  itemName: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  daysUntilExpiry?: number;
  currentStock?: number;
  minStock?: number;
}

export class InventoryNotificationService {
  // Check for low stock items and send alerts
  static async checkLowStockAlerts() {
    try {
      const lowStockItems = await prisma.inventoryItem.findMany({
        where: {
          isActive: true,
          AND: [
            { currentStock: { gt: 0 } },
            { currentStock: { lte: { minStock: true } } }
          ]
        },
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        }
      });

      for (const item of lowStockItems) {
        const alert: InventoryAlert = {
          type: 'low_stock',
          itemId: item.id,
          itemName: item.name,
          message: `Low stock alert: ${item.name} has ${item.currentStock} ${item.unit} remaining (minimum: ${item.minStock} ${item.unit})`,
          priority: item.currentStock === 0 ? 'high' : 'medium',
          currentStock: item.currentStock,
          minStock: item.minStock
        };

        await this.sendInventoryAlert(alert);
      }

      console.log(`Checked ${lowStockItems.length} low stock items`);
    } catch (error) {
      console.error('Error checking low stock alerts:', error);
    }
  }

  // Check for out of stock items and send alerts
  static async checkOutOfStockAlerts() {
    try {
      const outOfStockItems = await prisma.inventoryItem.findMany({
        where: {
          isActive: true,
          currentStock: 0
        },
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        }
      });

      for (const item of outOfStockItems) {
        const alert: InventoryAlert = {
          type: 'out_of_stock',
          itemId: item.id,
          itemName: item.name,
          message: `Out of stock alert: ${item.name} is completely out of stock`,
          priority: 'high',
          currentStock: 0,
          minStock: item.minStock
        };

        await this.sendInventoryAlert(alert);
      }

      console.log(`Checked ${outOfStockItems.length} out of stock items`);
    } catch (error) {
      console.error('Error checking out of stock alerts:', error);
    }
  }

  // Check for expiring items and send alerts
  static async checkExpiringAlerts() {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringItems = await prisma.inventoryItem.findMany({
        where: {
          isActive: true,
          AND: [
            { expiryDate: { not: null } },
            { expiryDate: { lte: thirtyDaysFromNow } },
            { currentStock: { gt: 0 } }
          ]
        },
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        }
      });

      for (const item of expiringItems) {
        if (!item.expiryDate) continue;

        const daysUntilExpiry = Math.ceil(
          (item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        // Only send alerts for items expiring within 30 days
        if (daysUntilExpiry <= 30) {
          const alert: InventoryAlert = {
            type: 'expiring',
            itemId: item.id,
            itemName: item.name,
            message: `Expiring alert: ${item.name} expires in ${daysUntilExpiry} days`,
            priority: daysUntilExpiry <= 7 ? 'high' : daysUntilExpiry <= 14 ? 'medium' : 'low',
            daysUntilExpiry,
            currentStock: item.currentStock
          };

          await this.sendInventoryAlert(alert);
        }
      }

      console.log(`Checked ${expiringItems.length} expiring items`);
    } catch (error) {
      console.error('Error checking expiring alerts:', error);
    }
  }

  // Send inventory alert via email and WebSocket
  static async sendInventoryAlert(alert: InventoryAlert) {
    try {
      // Get users with inventory permissions
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          role: {
            in: ['ADMIN', 'PHARMACIST', 'SUPER_ADMIN']
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      // Send email notifications
      for (const user of users) {
        await this.sendEmailAlert(user, alert);
      }

      // Send WebSocket notification
      await webSocketService.sendStockAlert(alert);

      // Log the alert
      await this.logAlert(alert, users.length);

      console.log(`Sent ${alert.type} alert for ${alert.itemName} to ${users.length} users`);
    } catch (error) {
      console.error('Error sending inventory alert:', error);
    }
  }

  // Send email alert to specific user
  static async sendEmailAlert(user: { id: string; name: string | null; email: string; role: string }, alert: InventoryAlert) {
    try {
      const subject = `Inventory Alert: ${alert.type.replace('_', ' ').toUpperCase()} - ${alert.itemName}`;
      
      const emailContent = this.generateEmailContent(alert, user);
      
      await sendEmail({
        to: user.email,
        subject,
        html: emailContent
      });

      console.log(`Email alert sent to ${user.email}`);
    } catch (error) {
      console.error(`Error sending email alert to ${user.email}:`, error);
    }
  }

  // Generate email content for inventory alert
  static generateEmailContent(alert: InventoryAlert, user: { name: string | null; role: string }): string {
    const priorityColors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444'
    };

    const alertIcons = {
      low_stock: '⚠️',
      out_of_stock: '🚨',
      expiring: '⏰'
    };

    const alertTitles = {
      low_stock: 'Low Stock Alert',
      out_of_stock: 'Out of Stock Alert',
      expiring: 'Expiring Soon Alert'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inventory Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${priorityColors[alert.priority]}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .alert-icon { font-size: 24px; margin-right: 10px; }
          .priority-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .details { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .action-button { display: inline-block; background: ${priorityColors[alert.priority]}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              <span class="alert-icon">${alertIcons[alert.type]}</span>
              ${alertTitles[alert.type]}
            </h1>
            <span class="priority-badge" style="background: ${priorityColors[alert.priority]}">
              ${alert.priority} Priority
            </span>
          </div>
          
          <div class="content">
            <p>Hello ${user.name || 'there'},</p>
            
            <p>This is an automated alert from the Dhanvantari Ayurveda inventory management system.</p>
            
            <div class="details">
              <h3>Alert Details:</h3>
              <p><strong>Item:</strong> ${alert.itemName}</p>
              <p><strong>Message:</strong> ${alert.message}</p>
              ${alert.currentStock !== undefined ? `<p><strong>Current Stock:</strong> ${alert.currentStock}</p>` : ''}
              ${alert.minStock !== undefined ? `<p><strong>Minimum Stock:</strong> ${alert.minStock}</p>` : ''}
              ${alert.daysUntilExpiry !== undefined ? `<p><strong>Days Until Expiry:</strong> ${alert.daysUntilExpiry}</p>` : ''}
            </div>
            
            <p>Please take appropriate action to address this inventory issue.</p>
            
            <a href="${process.env.NEXTAUTH_URL}/dashboard/inventory" class="action-button">
              View Inventory Dashboard
            </a>
          </div>
          
          <div class="footer">
            <p>This is an automated message from Dhanvantari Ayurveda Inventory Management System.</p>
            <p>If you have any questions, please contact the system administrator.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Log alert to database
  static async logAlert(alert: InventoryAlert, recipientCount: number) {
    try {
      // Create notification record
      await prisma.notification.create({
        data: {
          type: 'ALERT',
          priority: alert.priority === 'high' ? 'HIGH' : alert.priority === 'medium' ? 'MEDIUM' : 'LOW',
          title: `Inventory ${alert.type.replace('_', ' ').toUpperCase()} Alert`,
          message: alert.message,
          isRead: false
        }
      });

      console.log(`Alert logged to database: ${alert.type} for ${alert.itemName}`);
    } catch (error) {
      console.error('Error logging alert to database:', error);
    }
  }

  // Run all inventory checks
  static async runAllChecks() {
    console.log('Starting inventory alert checks...');
    
    await Promise.all([
      this.checkLowStockAlerts(),
      this.checkOutOfStockAlerts(),
      this.checkExpiringAlerts()
    ]);
    
    console.log('Completed inventory alert checks');
  }

  // Schedule daily checks (to be called by a cron job or scheduler)
  static scheduleDailyChecks() {
    // This would typically be set up with a cron job or scheduler
    // For now, we'll just log that it should be scheduled
    console.log('Inventory alert checks should be scheduled to run daily');
    
    // Example cron schedule: 0 9 * * * (every day at 9 AM)
    // You can use libraries like node-cron or set up a cron job on your server
  }
}

// Export for use in other modules
export default InventoryNotificationService;
