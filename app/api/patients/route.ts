import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateMrn() {
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `MRN-${ts}-${rand}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') ?? '').trim();
    const take = Number(searchParams.get('take') ?? 50);
    const skip = Number(searchParams.get('skip') ?? 0);

    const where: any = {};
    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { medicalRecordNumber: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('GET /api/patients error', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      email,
      phone,
      alternatePhone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      bloodType,
      maritalStatus,
      occupation,
      emergencyContactName,
      emergencyContactPhone,
      notes,
    } = body ?? {};

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'firstName and lastName are required' }, { status: 400 });
    }

    if (!email && !phone) {
      return NextResponse.json({ error: 'Provide at least one contact: email or phone' }, { status: 400 });
    }

    const mrn = generateMrn();
    const created = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        middleName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        email,
        phone,
        alternatePhone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        bloodType,
        maritalStatus,
        occupation,
        emergencyContactName,
        emergencyContactPhone,
        notes,
        medicalRecordNumber: mrn,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/patients error', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}


