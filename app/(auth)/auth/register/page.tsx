"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, KeyRound, Eye, EyeOff, ArrowRight, Home, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuccessModal } from '@/components/ui/Modals';
import { Spinner } from '@/components/ui/Loader';

const schema = z.object({
  name: z.string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
  psk: z.string()
    .min(1, { message: 'Security key is required' })
    .min(8, { message: 'Security key must be at least 8 characters' }),
});

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'OTHER' },
    mode: 'onBlur'
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      clearErrors();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          email: values.email.trim(),
          name: values.name.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessOpen(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        // Handle specific error types
        if (res.status === 409 || data.message?.toLowerCase().includes('email')) {
          setError('email', { 
            type: 'manual', 
            message: 'An account with this email already exists' 
          });
        } else if (data.message?.toLowerCase().includes('security key') || 
                   data.message?.toLowerCase().includes('psk')) {
          setError('psk', { 
            type: 'manual', 
            message: 'Invalid security key' 
          });
        } else {
          setGlobalError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[400px]">
        <Spinner size={32} />
      </div>
    );
  }

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

            {/* Show global error if any */}
            {globalError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {globalError}
                </AlertDescription>
              </Alert>
            )}
            
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
              <div>
                <Select
                  value={watch('role')}
                  onValueChange={(value) => setValue('role', value as any, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('role')} />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input className="pl-10" placeholder="Agency Security Key" type="password" {...register('psk')} />
                {errors.psk && <p className="mt-1 text-xs text-red-500">{errors.psk.message}</p>}
              </div>

              <Button 
                type="submit" 
                className="mt-2 w-full" 
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={16} /> Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
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
      <SuccessModal 
        open={successOpen} 
        title="Registration successful!" 
        description="Please check your inbox and verify your email address before logging in." 
        onClose={() => setSuccessOpen(false)} 
      />
    </div>
  );
}


