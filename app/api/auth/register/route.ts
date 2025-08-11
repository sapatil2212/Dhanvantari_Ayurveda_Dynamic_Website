import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
  psk: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { name, email, password, role, psk } = schema.parse(json);

    if (psk !== process.env.AGENCY_PSK) {
      return NextResponse.json({ message: 'Invalid agency key' }, { status: 401 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

    // Clean up any existing tokens for this email and any expired tokens globally
    await prisma.verificationToken.deleteMany({
      where: {
        OR: [
          { email },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });

    await prisma.verificationToken.create({
      data: { email, name: name ?? null, passwordHash, role, token, expiresAt },
    });

    const link = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
    await sendVerificationEmail({ 
      name: name || 'User', 
      email, 
      verificationToken: token 
    });

    return NextResponse.json({ ok: true, message: 'Verification link sent to email' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


