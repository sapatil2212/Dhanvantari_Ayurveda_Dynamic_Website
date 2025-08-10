import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: { token?: string };
}

export default async function VerifyPage({ searchParams }: Props) {
  const token = searchParams.token;
  if (!token) redirect('/auth/login');

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold">Invalid or expired verification link.</h1>
      </div>
    );
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email: record.email } });
    if (!existing) {
      await tx.user.create({
        data: {
          email: record.email,
          name: record.name,
          passwordHash: record.passwordHash,
          role: record.role,
          emailVerified: new Date(),
        },
      });
    } else if (!existing.emailVerified) {
      await tx.user.update({ where: { id: existing.id }, data: { emailVerified: new Date() } });
    }
    await tx.verificationToken.delete({ where: { token } });
  });

  redirect(`/auth/login?verified=1&email=${encodeURIComponent(record.email)}`);
}


