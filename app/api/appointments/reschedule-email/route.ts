import { NextResponse } from 'next/server';
import { sendAppointmentRescheduleEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, name, consultationType, oldDate, oldTime, newDate, newTime, status } = body;
    if (!to || !name || !consultationType || !oldDate || !oldTime || !newDate || !newTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await sendAppointmentRescheduleEmail({ to, name, consultationType, oldDate, oldTime, newDate, newTime, status });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/appointments/reschedule-email error', error);
    return NextResponse.json({ error: 'Failed to send reschedule email' }, { status: 500 });
  }
}


