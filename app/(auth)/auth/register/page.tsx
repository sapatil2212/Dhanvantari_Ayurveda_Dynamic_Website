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
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Home, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const registrationSchema = z.object({
  name: z.string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  confirmPassword: z.string()
    .min(1, { message: 'Please confirm your password' }),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  otp: z.string()
    .min(6, { message: 'OTP must be 6 digits' })
    .max(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
});

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'registration' | 'otp'>('registration');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { role: 'OTHER' },
    mode: 'onBlur'
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    mode: 'onBlur'
  });

  const watchedEmail = registrationForm.watch('email');
  const watchedPassword = registrationForm.watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [status, session, router]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (globalError) {
      setGlobalError(null);
    }
    if (registrationForm.formState.errors.email || registrationForm.formState.errors.password || registrationForm.formState.errors.name) {
      registrationForm.clearErrors();
    }
  }, [watchedEmail, watchedPassword, globalError, registrationForm]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRegistrationSubmit = async (values: z.infer<typeof registrationSchema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      setGlobalSuccess(null);
      registrationForm.clearErrors();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          role: values.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegistrationData(values);
        setOtpSent(true);
        setResendTimer(60); // 60 seconds cooldown
        setStep('otp');
        setGlobalSuccess('OTP sent successfully! Please check your email.');
      } else {
        // Handle specific error types
        if (res.status === 409 || data.message?.toLowerCase().includes('email')) {
          registrationForm.setError('email', { 
            type: 'manual', 
            message: 'An account with this email already exists' 
          });
        } else if (data.message?.toLowerCase().includes('security key') || 
                   data.message?.toLowerCase().includes('psk')) {
          setGlobalError('Registration is currently restricted. Please contact support for access.');
        } else if (res.status === 429) {
          setGlobalError('Too many registration attempts. Please wait a few minutes before trying again.');
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

  const handleOTPSubmit = async (values: z.infer<typeof otpSchema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      setGlobalSuccess(null);
      otpForm.clearErrors();

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registrationData.email,
          otp: values.otp,
          name: registrationData.name,
          password: registrationData.password,
          role: registrationData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGlobalSuccess('Account created successfully! You can now log in.');
        // Reset forms
        registrationForm.reset();
        otpForm.reset();
        setStep('registration');
        setRegistrationData(null);
        setOtpSent(false);
        setResendTimer(0);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setGlobalError(data.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      setGlobalError(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registrationData.name.trim(),
          email: registrationData.email.trim().toLowerCase(),
          password: registrationData.password,
          role: registrationData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendTimer(60);
        setGlobalSuccess('New OTP sent successfully!');
      } else {
        setGlobalError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToRegistration = () => {
    setStep('registration');
    setOtpSent(false);
    setResendTimer(0);
    setGlobalError(null);
    setGlobalSuccess(null);
  };

  // Show loading state if checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl shadow-xl lg:grid-cols-2">
        {/* Left: Form */}
        <CardContent className="p-8 sm:p-10 lg:p-12 min-h-[520px] flex flex-col justify-center">
          <div className="max-w-md">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Home className="h-4 w-4" />
              <span>Back to home</span>
            </Link>

            {/* Show global success if any */}
            {globalSuccess && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {globalSuccess}
                </AlertDescription>
              </Alert>
            )}

            {/* Show global error if any */}
            {globalError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {globalError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 'registration' ? 'Create your account' : 'Verify your email'}
              </h1>
              <p className="text-gray-600">
                {step === 'registration' ? 'Join us to start your journey' : 'Enter the 6-digit code sent to your email'}
              </p>
            </div>

            {step === 'registration' ? (
              <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="name"
                      className="pl-10" 
                      placeholder="Enter your full name" 
                      {...registrationForm.register('name')}
                      autoComplete="name"
                    />
                  </div>
                  {registrationForm.formState.errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registrationForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="email"
                      className="pl-10" 
                      placeholder="Enter your email" 
                      type="email" 
                      {...registrationForm.register('email')}
                      autoComplete="email"
                    />
                  </div>
                  {registrationForm.formState.errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registrationForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <Select
                    value={registrationForm.watch('role')}
                    onValueChange={(value) => registrationForm.setValue('role', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      <SelectItem value="DOCTOR">Doctor</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...registrationForm.register('role')} />
                  {registrationForm.formState.errors.role && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registrationForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="password"
                      className="pl-10 pr-10" 
                      placeholder="Create a strong password" 
                      type={showPassword ? 'text' : 'password'} 
                      {...registrationForm.register('password')}
                      autoComplete="new-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword((v) => !v)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registrationForm.formState.errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registrationForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="confirmPassword"
                      className="pl-10 pr-10" 
                      placeholder="Confirm your password" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      {...registrationForm.register('confirmPassword')}
                      autoComplete="new-password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword((v) => !v)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registrationForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {registrationForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium" 
                  disabled={loading || registrationForm.formState.isSubmitting}
                >
                  {loading || registrationForm.formState.isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="otp"
                      className="pl-10 text-center text-lg tracking-widest" 
                      placeholder="000000" 
                      maxLength={6}
                      {...otpForm.register('otp')}
                      autoComplete="one-time-code"
                    />
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`font-medium transition-colors ${
                      resendTimer > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={goBackToRegistration}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading || otpForm.formState.isSubmitting}
                  >
                    {loading || otpForm.formState.isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Create Account'
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </CardContent>

        {/* Right: Visual */}
        <div className="relative hidden min-h-[520px] bg-gradient-to-br from-emerald-600 to-emerald-800 lg:block">
          <Image
            src="/assets/hero_images/5.webp"
            alt="Registration"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Dhanvantari Ayurveda</h2>
              <p className="text-lg opacity-90">
                {step === 'registration' ? 'Join our healthcare community' : 'Secure verification for your account'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


