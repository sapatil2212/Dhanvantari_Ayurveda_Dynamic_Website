import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const isActive = searchParams.get('isActive');

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { brandName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const medicines = await prisma.medicine.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('GET /api/medicines error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name: body.name,
        genericName: body.genericName || null,
        brandName: body.brandName || null,
        category: body.category,
        type: body.type,
        strength: body.strength || null,
        dosageForm: body.dosageForm || null,
        route: body.route || null,
        manufacturer: body.manufacturer || null,
        description: body.description || null,
        indications: body.indications || null,
        contraindications: body.contraindications || null,
        sideEffects: body.sideEffects || null,
        interactions: body.interactions || null,
        dosage: body.dosage || null,
        storage: body.storage || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        isPrescription: body.isPrescription !== undefined ? body.isPrescription : true,
        isControlled: body.isControlled !== undefined ? body.isControlled : false,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error('POST /api/medicines error:', error);
    return NextResponse.json(
      { error: 'Failed to create medicine' },
      { status: 500 }
    );
  }
}
