import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

// GET /api/inventory/alerts - Get inventory alerts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, low_stock, out_of_stock, expiring
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // Build where clause based on alert type
    const where: any = {
      isActive: true
    };

    if (type === 'low_stock') {
      where.AND = [
        { currentStock: { gt: 0 } },
        { currentStock: { lte: { minStock: true } } }
      ];
    } else if (type === 'out_of_stock') {
      where.currentStock = 0;
    } else if (type === 'expiring') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.AND = [
        { expiryDate: { not: null } },
        { expiryDate: { lte: thirtyDaysFromNow } },
        { currentStock: { gt: 0 } }
      ];
    }

    // Get total count
    const total = await prisma.inventoryItem.count({ where });

    // Get items with pagination
    const items = await prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { currentStock: 'asc' },
        { expiryDate: 'asc' }
      ],
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    // Calculate alert statistics
    // Get all items and filter in memory for low stock
    const allItems = await prisma.inventoryItem.findMany({
      where: {
        isActive: true,
        currentStock: { gt: 0 }
      },
      select: {
        currentStock: true,
        minStock: true
      }
    });
    
    const lowStockCount = allItems.filter(item => item.currentStock <= item.minStock).length;

    const outOfStockCount = await prisma.inventoryItem.count({
      where: {
        isActive: true,
        currentStock: 0
      }
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringCount = await prisma.inventoryItem.count({
      where: {
        isActive: true,
        AND: [
          { expiryDate: { not: null } },
          { expiryDate: { lte: thirtyDaysFromNow } },
          { currentStock: { gt: 0 } }
        ]
      }
    });

    // Add alert metadata to each item
    const itemsWithAlerts = items.map(item => {
      const alerts = [];
      
      if (item.currentStock === 0) {
        alerts.push({
          type: 'out_of_stock',
          priority: 'high',
          message: 'Item is out of stock'
        });
      } else if (item.currentStock <= item.minStock) {
        alerts.push({
          type: 'low_stock',
          priority: item.currentStock === 0 ? 'high' : 'medium',
          message: `Stock is low (${item.currentStock} ${item.unit} remaining)`
        });
      }

      if (item.expiryDate) {
        const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && item.currentStock > 0) {
          alerts.push({
            type: 'expiring',
            priority: daysUntilExpiry <= 7 ? 'high' : daysUntilExpiry <= 14 ? 'medium' : 'low',
            message: `Expires in ${daysUntilExpiry} days`,
            daysUntilExpiry
          });
        }
      }

      return {
        ...item,
        alerts
      };
    });

    return NextResponse.json({
      items: itemsWithAlerts,
      statistics: {
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
        expiring: expiringCount,
        total: lowStockCount + outOfStockCount + expiringCount
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
