import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/suppliers/[id] - Get specific supplier
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
    if (!checkPermission((session.user as any).role, Permission.VIEW_SUPPLIERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        },
        purchaseOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: true
          }
        },
        _count: {
          select: { purchaseOrders: true }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/suppliers/[id] - Update supplier
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
    if (!checkPermission((session.user as any).role, Permission.MANAGE_SUPPLIERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      contactPerson,
      website,
      notes,
      isActive
    } = body;

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id }
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== existingSupplier.name) {
      const nameExists = await prisma.supplier.findFirst({
        where: { 
          name: { equals: name },
          id: { not: params.id }
        }
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Supplier with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update supplier
    const updatedSupplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        address,
        contactPerson,
        website,
        notes,
        isActive,
        updatedBy: {
          connect: {
            id: (session.user as any).id
          }
        }
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

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/suppliers/[id] - Delete supplier (soft delete)
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
    if (!checkPermission((session.user as any).role, Permission.MANAGE_SUPPLIERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { purchaseOrders: true }
        }
      }
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Check if supplier has associated purchase orders
    if (existingSupplier._count.purchaseOrders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete supplier with associated purchase orders' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.supplier.update({
      where: { id: params.id },
      data: {
        isActive: false,
        updatedBy: {
          connect: {
            id: (session.user as any).id
          }
        }
      }
    });

    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
