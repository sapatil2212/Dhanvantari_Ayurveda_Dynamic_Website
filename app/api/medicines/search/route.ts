import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const isActive = searchParams.get('isActive');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const where: any = {
      isActive: true, // Only search active medicines by default
    };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { genericName: { contains: query, mode: 'insensitive' } },
        { brandName: { contains: query, mode: 'insensitive' } },
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
      select: {
        id: true,
        name: true,
        genericName: true,
        brandName: true,
        category: true,
        type: true,
        strength: true,
        dosageForm: true,
        route: true,
        manufacturer: true,
        isPrescription: true,
        isControlled: true,
      },
      orderBy: [
        { name: 'asc' },
        { genericName: 'asc' },
      ],
      take: limit,
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error('GET /api/medicines/search error:', error);
    return NextResponse.json(
      { error: 'Failed to search medicines' },
      { status: 500 }
    );
  }
}
