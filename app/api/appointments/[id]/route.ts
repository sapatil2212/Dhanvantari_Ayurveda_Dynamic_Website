import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAppointmentStatusEmail } from '@/lib/email';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const appt = await prisma.appointment.findUnique({ where: { id: params.id } });
    if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(appt);
  } catch (error) {
    console.error('GET /api/appointments/[id] error', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const allowedKeys = [
      'consultationType',
      'preferredDate',
      'preferredTime',
      'name',
      'email',
      'phone',
      'age',
      'gender',
      'chiefComplaint',
      'previousTreatment',
      'medications',
      'additionalNotes',
      'status',
    ] as const;

    const data: any = {};
    for (const key of allowedKeys) {
      if (key in body && body[key] !== undefined) {
        if (key === 'preferredDate') data.preferredDate = new Date(body.preferredDate);
        else if (key === 'age') data.age = body.age ? Number(body.age) : null;
        else data[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const before = await prisma.appointment.findUnique({ where: { id } });
    const updated = await prisma.appointment.update({ where: { id }, data });

    // Notifications for updates
    if (before) {
      if (data.status && data.status !== before.status) {
        await prisma.notification.create({
          data: {
            type: 'STATUS_CHANGED',
            appointmentId: updated.id,
            title: 'Appointment status changed',
            message: `${updated.name} · ${before.status} → ${updated.status}`,
          },
        });
      } else {
        await prisma.notification.create({
          data: {
            type: 'UPDATED',
            appointmentId: updated.id,
            title: 'Appointment updated',
            message: `${updated.name} · ${updated.consultationType} on ${new Date(updated.preferredDate).toLocaleDateString()} at ${updated.preferredTime}`,
          },
        });
      }
    }

    // If status changed, send email
    if (data.status && (data.status === 'CONFIRMED' || data.status === 'CANCELLED' || data.status === 'PENDING' || data.status === 'MISSED')) {
      try {
        await sendAppointmentStatusEmail({
          to: updated.email,
          name: updated.name,
          status: updated.status as any,
          consultationType: updated.consultationType,
          date: updated.preferredDate.toISOString(),
          time: updated.preferredTime,
        });
      } catch (e) {
        console.error('Failed to send status email', e);
      }
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/appointments/[id] error', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const appt = await prisma.appointment.delete({ where: { id } });
    await prisma.notification.create({
      data: {
        type: 'DELETED',
        appointmentId: appt.id,
        title: 'Appointment deleted',
        message: `${appt.name} · ${new Date(appt.preferredDate).toLocaleDateString()} at ${appt.preferredTime}`,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/appointments/[id] error', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}


