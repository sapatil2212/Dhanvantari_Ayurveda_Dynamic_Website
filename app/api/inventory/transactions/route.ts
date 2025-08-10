import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory/transactions - Get inventory transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission(session.user.role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const itemId = searchParams.get('itemId') || '';
    const type = searchParams.get('type') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (itemId) {
      where.itemId = itemId;
    }

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) {
        where.transactionDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.transactionDate.lte = new Date(endDate);
      }
    }

    // Get total count
    const total = await prisma.inventoryTransaction.count({ where });

    // Get transactions with pagination
    const transactions = await prisma.inventoryTransaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { transactionDate: 'desc' },
      include: {
        item: {
          select: { name: true, sku: true, category: true }
        },
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission(session.user.role, Permission.EDIT_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      itemId,
      type,
      quantity,
      reason,
      reference,
      notes
    } = body;

    // Validate required fields
    if (!itemId || !type || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid quantity' },
        { status: 400 }
      );
    }

    // Check if item exists
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Calculate new stock level
    let newStock = item.currentStock;
    if (type === 'IN') {
      newStock += quantity;
    } else if (type === 'OUT') {
      if (item.currentStock < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
      newStock -= quantity;
    } else if (type === 'ADJUSTMENT') {
      newStock = quantity; // Direct adjustment
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.inventoryTransaction.create({
        data: {
          itemId,
          type,
          quantity,
          reason,
          reference,
          notes,
          createdById: session.user.id
        }
      });

      // Update item stock
      let newStatus = item.status;
      if (newStock <= 0) {
        newStatus = 'out_of_stock';
      } else if (newStock <= item.minStock) {
        newStatus = 'low_stock';
      } else {
        newStatus = 'active';
      }

      await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentStock: newStock,
          status: newStatus,
          updatedById: session.user.id
        }
      });

      return transaction;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
