"use client";
import { signIn } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { SuccessModal } from '@/components/ui/Modals';
import { LoadingOverlay, Spinner } from '@/components/ui/Loader';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Please enter correct password' }),
});

function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [verifiedOpen, setVerifiedOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: '/dashboard',
    });
    setLoading(false);
    if (!res?.error) {
      setSuccessOpen(true);
      setTimeout(() => router.push('/dashboard'), 800);
    } else {
      if (res.error === 'USER_NOT_FOUND') {
        setError('email', { type: 'manual', message: 'User is not registered yet!' });
      } else if (res.error === 'EMAIL_NOT_VERIFIED') {
        setError('email', { type: 'manual', message: 'Please verify your email before logging in.' });
      } else {
        // CredentialsSignin or generic error
        setError('password', { type: 'manual', message: 'Please enter correct password' });
      }
    }
  };

  const verified = searchParams.get('verified');
  const verifiedEmail = searchParams.get('email');

  useEffect(() => {
    if (verified === '1') {
      setVerifiedOpen(true);
      const t = setTimeout(() => setVerifiedOpen(false), 3000);
      return () => clearTimeout(t);
    }
  }, [verified]);

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl  lg:grid-cols-2">
        {/* Left: Form */}
        <CardContent className="p-8 sm:p-10 lg:p-12 min-h-[520px] flex flex-col justify-center">
          <div className="max-w-md">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Home className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
            <div className="mb-5">
              <p className="text-2xl font-semibold leading-tight">Welcome back,</p>
              <p className="text-2xl font-semibold leading-tight">Sign In to continue</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Your e-mail" type="email" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10 pr-10" placeholder="Password" type={showPassword ? 'text' : 'password'} {...register('password')} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              {/* PSK not required for login per new flow, keep optional if needed in future */}

              <div className="flex items-center justify-end text-sm">
                <Link href="/auth/forgot-password" className="text-gray-500 hover:text-gray-700">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={16} /> Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-4 flex flex-col items-center gap-2 text-sm">
              <Link href="/auth/register" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                <span>
                  Not registered yet? <span className="font-medium underline">Sign up Now</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Removed third-party login options for a cleaner UI */}
          </div>
        </CardContent>

        {/* Right: Visual */}
        <div className="relative hidden min-h-[520px] bg-slate-900 lg:block">
          <Image
            src="/assets/hero_images/4.webp"
            alt="Adventure"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/30" />
        </div>
      </Card>

      <SuccessModal open={successOpen} title="Login successful" onClose={() => setSuccessOpen(false)} />
      <SuccessModal
        open={verifiedOpen}
        title="Account verified"
        description={`Your account ${verifiedEmail ?? ''} is verified. You can log in now.`}
        onClose={() => setVerifiedOpen(false)}
      />
      {loading && <LoadingOverlay message="Signing you in..." />}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-10">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}


