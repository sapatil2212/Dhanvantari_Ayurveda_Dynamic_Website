import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/inventory - Get all inventory items with pagination and filtering
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const supplier = searchParams.get('supplier') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (supplier) {
      where.supplier = { contains: supplier };
    }

    // Get total count
    const total = await prisma.inventoryItem.count({ where });

    // Get items with pagination
    const items = await prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.CREATE_INVENTORY)) {
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
      location
    } = body;

    // Validate required fields
    if (!name || !category || !sku || !unit || costPrice === undefined || sellingPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { sku }
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Determine initial status based on stock levels
    let status = 'active';
    if (currentStock <= 0) {
      status = 'out_of_stock';
    } else if (currentStock <= minStock) {
      status = 'low_stock';
    }

    // Create inventory item
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        sku,
        description,
        currentStock: currentStock || 0,
        minStock: minStock || 0,
        maxStock: maxStock || 0,
        unit,
        costPrice,
        sellingPrice,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        location,
        status,
        createdBy: {
          connect: {
            id: (session.user as any).id
          }
        }
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    // Create initial transaction if stock is provided
    if (currentStock && currentStock > 0) {
      await prisma.inventoryTransaction.create({
        data: {
          itemId: item.id,
          type: 'IN',
          quantity: currentStock,
          reason: 'Initial stock',
          reference: 'Initial setup',
          createdById: (session.user as any).id
        }
      });
    }

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
