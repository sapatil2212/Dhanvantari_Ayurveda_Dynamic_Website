import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

const schema = z.object({ email: z.string().email(), psk: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, psk } = schema.parse(json);

    if (psk !== process.env.AGENCY_PSK) {
      return NextResponse.json({ message: 'Invalid agency key' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true }); // do not reveal

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    await prisma.passwordResetToken.create({ data: { email, token, expiresAt } });

    const link = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail({ 
      name: user.name || 'User', 
      email, 
      resetToken: token 
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


