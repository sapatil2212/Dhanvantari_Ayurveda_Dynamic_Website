"use client";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2, KeyRound, Lock } from 'lucide-react';

const emailSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

const otpSchema = z.object({
  otp: z.string()
    .min(6, { message: 'OTP must be 6 digits' })
    .max(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
});

const passwordSchema = z.object({
  newPassword: z.string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  confirmPassword: z.string()
    .min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [userEmail, setUserEmail] = useState<string>('');
  const [resendTimer, setResendTimer] = useState(0);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    mode: 'onBlur'
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    mode: 'onBlur'
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur'
  });

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Clear OTP field when switching to OTP step
  useEffect(() => {
    if (step === 'otp') {
      otpForm.reset();
    }
  }, [step, otpForm]);

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      setGlobalSuccess(null);

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserEmail(values.email.trim().toLowerCase());
        setResendTimer(60); // 60 seconds cooldown
        setStep('otp');
        // Clear OTP form when switching to OTP step
        otpForm.reset();
        setGlobalSuccess('OTP sent successfully! Please check your email.');
      } else {
        if (res.status === 404) {
          setGlobalError('No account found with this email address.');
        } else if (res.status === 429) {
          setGlobalError('Too many reset attempts. Please wait a few minutes before trying again.');
        } else {
          setGlobalError(data.message || 'Failed to send OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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

      // For now, just move to password step
      // In a real implementation, you might want to verify OTP here
      setStep('password');
      setGlobalSuccess('OTP verified! Please enter your new password.');
    } catch (error) {
      console.error('OTP verification error:', error);
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      setGlobalSuccess(null);

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          otp: otpForm.getValues('otp'),
          newPassword: values.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGlobalSuccess('Password updated successfully! You can now log in with your new password.');
        // Reset forms
        emailForm.reset();
        otpForm.reset();
        passwordForm.reset();
        setStep('email');
        setUserEmail('');
        setResendTimer(0);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setGlobalError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
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

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
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

  const goBackToEmail = () => {
    setStep('email');
    setResendTimer(0);
    setGlobalError(null);
    setGlobalSuccess(null);
  };

  const goBackToOTP = () => {
    setStep('otp');
    setGlobalError(null);
    setGlobalSuccess(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Forgot your password?';
      case 'otp':
        return 'Enter verification code';
      case 'password':
        return 'Set new password';
      default:
        return 'Forgot your password?';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email address and we\'ll send you a verification code to reset your password.';
      case 'otp':
        return 'Enter the 6-digit code sent to your email address.';
      case 'password':
        return 'Enter your new password below.';
      default:
        return 'Enter your email address and we\'ll send you a verification code to reset your password.';
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl shadow-xl lg:grid-cols-2">
        {/* Left: Form */}
        <CardContent className="p-8 sm:p-10 lg:p-12 min-h-[520px] flex flex-col justify-center">
          <div className="max-w-md">
            <Link 
              href="/auth/login" 
              className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to login</span>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
              <p className="text-gray-600">{getStepDescription()}</p>
            </div>

            {step === 'email' && (
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
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
                      {...emailForm.register('email')}
                      autoComplete="email"
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    'Send verification code'
                  )}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form key="otp-form" onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      key={`otp-input-${step}`}
                      id="otp"
                      className="pl-10 text-center text-lg tracking-widest" 
                      placeholder="000000" 
                      maxLength={6}
                      {...otpForm.register('otp')}
                      autoComplete="one-time-code"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      inputMode="numeric"
                      pattern="[0-9]*"
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
                    onClick={goBackToEmail}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="newPassword"
                      className="pl-10" 
                      placeholder="Enter new password" 
                      type="password" 
                      {...passwordForm.register('newPassword')}
                      autoComplete="new-password"
                    />
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="confirmPassword"
                      className="pl-10" 
                      placeholder="Confirm new password" 
                      type="password" 
                      {...passwordForm.register('confirmPassword')}
                      autoComplete="new-password"
                    />
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={goBackToOTP}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating password...
                      </span>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
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
            src="/assets/hero_images/4.webp"
            alt="Forgot Password"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Reset Password</h2>
              <p className="text-lg opacity-90">
                {step === 'email' ? 'We\'ll help you get back to your account' : 
                 step === 'otp' ? 'Verify your account' : 
                 'Set your new password'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


