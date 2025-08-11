import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory/purchase-orders - Get all purchase orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission(session.user.role, Permission.MANAGE_PURCHASE_ORDERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const supplier = searchParams.get('supplier') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { number: { contains: search } },
        { supplier: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (supplier) {
      where.supplier = { contains: supplier };
    }

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        where.orderDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate);
      }
    }

    // Get total count
    const total = await prisma.purchaseOrder.count({ where });

    // Get purchase orders with pagination
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { orderDate: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            item: {
              select: { name: true, sku: true }
            }
          }
        }
      }
    });

    return NextResponse.json({
      purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inventory/purchase-orders - Create new purchase order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission(session.user.role, Permission.MANAGE_PURCHASE_ORDERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      supplier,
      expectedDelivery,
      notes,
      items
    } = body;

    // Validate required fields
    if (!supplier || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.name || !item.quantity || !item.unitPrice || item.quantity <= 0 || item.unitPrice <= 0) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        );
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Generate PO number
    const poNumber = `PO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase order
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          number: poNumber,
          supplier,
          expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
          totalAmount,
          notes,
          createdById: session.user.id
        }
      });

      // Create purchase order items
      const purchaseOrderItems = await Promise.all(
        items.map((item: any) =>
          tx.purchaseOrderItem.create({
            data: {
              purchaseOrderId: purchaseOrder.id,
              itemId: item.itemId || null,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              notes: item.notes
            }
          })
        )
      );

      return {
        ...purchaseOrder,
        items: purchaseOrderItems
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
