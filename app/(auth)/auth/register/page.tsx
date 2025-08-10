"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, KeyRound, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuccessModal } from '@/components/ui/Modals';

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Please enter correct password' }),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
  psk: z.string().min(8),
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    setFieldError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (res.ok) {
      setSuccessOpen(true);
      setTimeout(() => router.push('/auth/login'), 1200);
    } else {
      const data = await res.json().catch(() => ({ message: 'Registration failed' }));
      if (data.message?.includes('Email')) setFieldError('email');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl shadow-xl lg:grid-cols-2">
        {/* Left: Form */}
        <CardContent className="p-8 sm:p-10 lg:p-12 min-h-[520px] flex flex-col justify-center">
          <div className="max-w-md">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Home className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
            <div className="mb-2">
              <p className="text-2xl font-semibold leading-tight">Create your account</p>
              <p className="text-sm text-gray-500">Start your journey with us</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Full name" {...register('name')} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className={`pl-10 ${fieldError === 'email' ? 'border-red-500' : ''}`} placeholder="Your e-mail" type="email" {...register('email')} />
                {fieldError === 'email' ? (
                  <p className="mt-1 text-xs text-red-500">Email already registered</p>
                ) : (
                  errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10 pr-10" placeholder="Password" type={showPassword ? 'text' : 'password'} {...register('password')} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <Select defaultValue="OTHER" onValueChange={(value) => {
                  // react-hook-form bind via hidden input
                  (document.getElementById('role-hidden') as HTMLInputElement).value = value;
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input id="role-hidden" type="hidden" value="OTHER" {...register('role')} />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Agency Security Key" type="password" {...register('psk')} />
                {errors.psk && <p className="mt-1 text-xs text-red-500">{errors.psk.message}</p>}
              </div>

              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-4 flex flex-col items-center gap-2 text-sm">
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                <span>
                  Already registered? <span className="font-medium underline">Login Now</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <Home className="h-4 w-4" />
                <span>Back to home</span>
              </Link>
            </div>
          </div>
        </CardContent>

        {/* Right: Visual */}
        <div className="relative hidden min-h-[520px] bg-slate-900 lg:block">
          <Image
            src="/assets/hero_images/5.webp"
            alt="Journey"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/30" />
        </div>
      </Card>
      <SuccessModal open={successOpen} title="Verification email sent" description="Please check your inbox to verify your account." onClose={() => setSuccessOpen(false)} />
    </div>
  );
}


