import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission } from '@/lib/permissions';
import { checkPermission } from '@/lib/permissions';

// GET /api/suppliers - Get all suppliers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!checkPermission((session.user as any).role, Permission.VIEW_SUPPLIERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (activeOnly) {
      where.isActive = true;
    }

    // Get total count
    const total = await prisma.supplier.count({ where });

    // Get suppliers with pagination
    const suppliers = await prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        createdBy: {
          select: { name: true, email: true }
        },
        updatedBy: {
          select: { name: true, email: true }
        },
        _count: {
          select: { purchaseOrders: true }
        }
      }
    });

    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/suppliers - Create new supplier
export async function POST(request: NextRequest) {
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
      notes
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    // Check if supplier with same name already exists
    const existingSupplier = await prisma.supplier.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier with this name already exists' },
        { status: 400 }
      );
    }

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        contactPerson,
        website,
        notes,
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

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
