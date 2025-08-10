"use client";
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({ email: z.string().email(), psk: z.string().min(8) });

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values),
    });
    setLoading(false);
    setSent(res.ok);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-xl">
        <CardContent className="p-8">
          <h1 className="mb-4 text-center text-2xl font-semibold">Forgot password</h1>
          {sent ? (
            <p className="text-center text-sm text-emerald-600">If the email exists, a reset link has been sent.</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Your e-mail" type="email" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Agency Security Key" type="password" {...register('psk')} />
                {errors.psk && <p className="mt-1 text-xs text-red-500">{errors.psk.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm"><Link href="/auth/login" className="underline">Back to login</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}


