import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const schema = z.object({ token: z.string(), password: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { token, password } = schema.parse(json);

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email: record.email }, data: { passwordHash } });
    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


