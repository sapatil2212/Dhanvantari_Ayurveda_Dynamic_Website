import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentBookedEmail } from '@/lib/email';
import { NotificationService } from '@/lib/notification-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const q = searchParams.get('q') ?? '';
    const email = searchParams.get('email') ?? '';
    const phone = searchParams.get('phone') ?? '';
    const name = searchParams.get('name') ?? '';
    const take = Number(searchParams.get('take') ?? 50);
    const skip = Number(searchParams.get('skip') ?? 0);

    const where: any = status ? { status } : {};
    const ors: any[] = [];
    if (q) {
      ors.push(
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      );
    }
    if (email) ors.push({ email: { equals: email } });
    if (phone) ors.push({ phone: { equals: phone } });
    if (name) ors.push({ name: { equals: name } });
    if (ors.length) where.OR = ors;

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error('GET /api/appointments error', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      consultationType,
      preferredDate,
      preferredTime,
      name,
      email,
      phone,
      age,
      gender,
      chiefComplaint,
      previousTreatment,
      medications,
      additionalNotes,
    } = body;

    if (!consultationType || !preferredDate || !preferredTime || !name || !email || !phone || !chiefComplaint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.appointment.create({
      data: {
        consultationType,
        preferredDate: new Date(preferredDate),
        preferredTime,
        name,
        email,
        phone,
        age: age ? Number(age) : null,
        gender,
        chiefComplaint,
        previousTreatment,
        medications,
        additionalNotes,
        // Try to link an existing patient based on email/phone, otherwise leave null
        patient: email || phone ? {
          connectOrCreate: {
            where: email ? { medicalRecordNumber: `AUTO-${email}` } : { medicalRecordNumber: `AUTO-${phone}` },
            create: {
              firstName: name.split(' ')[0] ?? name,
              lastName: name.split(' ').slice(1).join(' ') || 'Patient',
              email: email ?? null,
              phone: phone ?? null,
              medicalRecordNumber: email ? `AUTO-${email}` : `AUTO-${phone}`,
            },
          },
        } : undefined,
      },
    });

    // Create real-time notification - temporarily disabled
    // try {
    //   await NotificationService.createAppointmentNotification(created.id, 'created');
    // } catch (error) {
    //   console.error('Failed to create appointment notification:', error);
    // }

    // Send booking email (best-effort)
    try {
      await sendAppointmentBookedEmail({
        patientName: created.name,
        patientEmail: created.email,
        appointmentDate: created.preferredDate.toISOString().split('T')[0],
        appointmentTime: created.preferredTime,
        service: created.consultationType,
        notes: created.additionalNotes || undefined,
        appointmentId: created.id,
      });
    } catch {}

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}


