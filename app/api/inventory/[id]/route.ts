import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory/[id] - Get specific inventory item
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
    if (!checkPermission(session.user.role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        },
        transactions: {
          orderBy: { transactionDate: 'desc' },
          take: 10,
          include: {
            createdBy: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/[id] - Update inventory item
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
    if (!checkPermission(session.user.role, Permission.EDIT_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      category,
      sku,
      description,
      currentStock,
      minStock,
      maxStock,
      unit,
      costPrice,
      sellingPrice,
      supplier,
      expiryDate,
      location,
      status
    } = body;

    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: params.id }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check if SKU is being changed and if it already exists
    if (sku && sku !== existingItem.sku) {
      const skuExists = await prisma.inventoryItem.findUnique({
        where: { sku }
      });

      if (skuExists) {
        return NextResponse.json(
          { error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Determine new status based on stock levels if not explicitly provided
    let newStatus = status;
    if (!status) {
      if (currentStock <= 0) {
        newStatus = 'out_of_stock';
      } else if (currentStock <= minStock) {
        newStatus = 'low_stock';
      } else {
        newStatus = 'active';
      }
    }

    // Update item
    const updatedItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        name,
        category,
        sku,
        description,
        currentStock,
        minStock,
        maxStock,
        unit,
        costPrice,
        sellingPrice,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        location,
        status: newStatus,
        updatedById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/[id] - Delete inventory item (soft delete)
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
    if (!checkPermission(session.user.role, Permission.DELETE_INVENTORY)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: params.id }
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedById: session.user.id
      }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
