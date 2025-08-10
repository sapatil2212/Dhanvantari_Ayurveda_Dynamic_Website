import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';

export interface ServerToClientEvents {
  inventoryUpdate: (data: {
    type: 'item_updated' | 'item_created' | 'item_deleted' | 'stock_changed' | 'alert_triggered';
    itemId?: string;
    item?: any;
    message: string;
    timestamp: Date;
  }) => void;
  
  stockAlert: (data: {
    type: 'low_stock' | 'out_of_stock' | 'expiring';
    itemId: string;
    itemName: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: Date;
  }) => void;
  
  purchaseOrderUpdate: (data: {
    type: 'created' | 'updated' | 'received' | 'cancelled';
    orderId: string;
    orderNumber: string;
    message: string;
    timestamp: Date;
  }) => void;
}

export interface ClientToServerEvents {
  joinInventoryRoom: (userId: string) => void;
  leaveInventoryRoom: (userId: string) => void;
  subscribeToItem: (itemId: string) => void;
  unsubscribeFromItem: (itemId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  role: string;
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >;
    };
  };
};

class WebSocketService {
  private io: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > | null = null;

  initialize(server: NetServer) {
    this.io = new SocketIOServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
    console.log('WebSocket service initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle joining inventory room
      socket.on('joinInventoryRoom', (userId: string) => {
        socket.join(`inventory-${userId}`);
        socket.data.userId = userId;
        console.log(`User ${userId} joined inventory room`);
      });

      // Handle leaving inventory room
      socket.on('leaveInventoryRoom', (userId: string) => {
        socket.leave(`inventory-${userId}`);
        console.log(`User ${userId} left inventory room`);
      });

      // Handle subscribing to specific item updates
      socket.on('subscribeToItem', (itemId: string) => {
        socket.join(`item-${itemId}`);
        console.log(`Client ${socket.id} subscribed to item ${itemId}`);
      });

      // Handle unsubscribing from specific item updates
      socket.on('unsubscribeFromItem', (itemId: string) => {
        socket.leave(`item-${itemId}`);
        console.log(`Client ${socket.id} unsubscribed from item ${itemId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Broadcast inventory update to all connected clients
  broadcastInventoryUpdate(data: {
    type: 'item_updated' | 'item_created' | 'item_deleted' | 'stock_changed' | 'alert_triggered';
    itemId?: string;
    item?: any;
    message: string;
    timestamp?: Date;
  }) {
    if (!this.io) return;

    const updateData = {
      ...data,
      timestamp: data.timestamp || new Date()
    };

    // Broadcast to all inventory rooms
    this.io.emit('inventoryUpdate', updateData);

    // If specific item, also broadcast to item-specific room
    if (data.itemId) {
      this.io.to(`item-${data.itemId}`).emit('inventoryUpdate', updateData);
    }

    console.log('Inventory update broadcasted:', updateData);
  }

  // Send stock alert to specific users (admins, pharmacists)
  async sendStockAlert(data: {
    type: 'low_stock' | 'out_of_stock' | 'expiring';
    itemId: string;
    itemName: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) {
    if (!this.io) return;

    const alertData = {
      ...data,
      timestamp: new Date()
    };

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
        role: true
      }
    });

    // Send alert to each user's inventory room
    users.forEach(user => {
      this.io!.to(`inventory-${user.id}`).emit('stockAlert', alertData);
    });

    console.log('Stock alert sent:', alertData);
  }

  // Send purchase order update
  async sendPurchaseOrderUpdate(data: {
    type: 'created' | 'updated' | 'received' | 'cancelled';
    orderId: string;
    orderNumber: string;
    message: string;
  }) {
    if (!this.io) return;

    const updateData = {
      ...data,
      timestamp: new Date()
    };

    // Get users with purchase order permissions
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          in: ['ADMIN', 'PHARMACIST', 'SUPER_ADMIN']
        }
      },
      select: {
        id: true
      }
    });

    // Send update to each user's inventory room
    users.forEach(user => {
      this.io!.to(`inventory-${user.id}`).emit('purchaseOrderUpdate', updateData);
    });

    console.log('Purchase order update sent:', updateData);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    if (!this.io) return 0;
    return this.io.engine.clientsCount;
  }

  // Get server instance
  getIO() {
    return this.io;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
