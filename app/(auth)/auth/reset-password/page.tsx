"use client";
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const schema = z.object({ password: z.string().min(8) });

export default function ResetPasswordPage() {
  const token = useSearchParams().get('token') || '';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: values.password }) });
    setLoading(false);
    if (res.ok) router.push('/auth/login');
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto w-full max-w-md overflow-hidden rounded-xl shadow-xl">
        <CardContent className="p-8">
          <h1 className="mb-4 text-center text-2xl font-semibold">Reset password</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input className="pl-10 pr-10" placeholder="New password" type={showPassword ? 'text' : 'password'} {...register('password')} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


