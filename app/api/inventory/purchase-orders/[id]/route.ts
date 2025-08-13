import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory/purchase-orders/[id] - Get specific purchase order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
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
              select: { name: true, sku: true, unit: true }
            }
          }
        }
      }
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    return NextResponse.json(purchaseOrder);
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/purchase-orders/[id] - Update purchase order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.EDIT_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      supplier,
      supplierId,
      expectedDelivery,
      notes,
      status,
      items
    } = body;

    // Check if purchase order exists
    const existingOrder = await prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);

    // Update purchase order
    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: params.id },
      data: {
        supplier,
        supplierId: supplierId || null,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        notes,
        status,
        totalAmount,
        updatedById: (session.user as any).id
      },
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
              select: { name: true, sku: true, unit: true }
            }
          }
        }
      }
    });

    // Update items if provided
    if (items && items.length > 0) {
      // Delete existing items
      await prisma.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: params.id }
      });

      // Create new items
      await prisma.purchaseOrderItem.createMany({
        data: items.map((item: any) => ({
          purchaseOrderId: params.id,
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        }))
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/purchase-orders/[id] - Delete purchase order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.DELETE_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if purchase order exists
    const existingOrder = await prisma.purchaseOrder.findUnique({
      where: { id: params.id }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Delete purchase order items first
    await prisma.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId: params.id }
    });

    // Delete purchase order
    await prisma.purchaseOrder.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
