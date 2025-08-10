import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
  const header = ['MRN','First Name','Last Name','Gender','DoB','Phone','Email','Blood','City','State','Postal Code'];
  const rows = patients.map(p => [
    p.medicalRecordNumber,
    p.firstName,
    p.lastName,
    p.gender ?? '',
    p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().slice(0,10) : '',
    p.phone ?? '',
    p.email ?? '',
    p.bloodType ?? '',
    p.city ?? '',
    p.state ?? '',
    p.postalCode ?? '',
  ]);
  const csv = [header, ...rows].map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',')).join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="patients.csv"`,
    },
  });
}


