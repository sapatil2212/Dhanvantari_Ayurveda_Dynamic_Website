"use client";
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/Loader';

const schema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' }),
});

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = useForm<z.infer<typeof schema>>({ 
    resolver: zodResolver(schema),
    mode: 'onBlur'
  });

  const watchedEmail = watch('email');

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login page - Session status:', status);
    console.log('Login page - Session data:', session);
    console.log('Login page - Callback URL:', searchParams.get('callbackUrl'));
    
    if (status === 'authenticated' && session) {
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      console.log('Login page - Redirecting to:', callbackUrl);
      
      // Use a more reliable redirect method
      if (callbackUrl.startsWith('/')) {
        console.log('Login page - Using router.replace with:', callbackUrl);
        router.replace(callbackUrl);
        
        // Fallback: if router doesn't work after 2 seconds, use window.location
        setTimeout(() => {
          if (window.location.pathname === '/auth/login') {
            console.log('Login page - Router redirect failed, using window.location');
            window.location.href = callbackUrl;
          }
        }, 2000);
      } else {
        console.log('Login page - Using router.replace with /dashboard');
        router.replace('/dashboard');
        
        // Fallback: if router doesn't work after 2 seconds, use window.location
        setTimeout(() => {
          if (window.location.pathname === '/auth/login') {
            console.log('Login page - Router redirect failed, using window.location');
            window.location.href = '/dashboard';
          }
        }, 2000);
      }
    } else if (status === 'loading') {
      console.log('Login page - Session is loading...');
    } else if (status === 'unauthenticated') {
      console.log('Login page - User is not authenticated');
    }
  }, [status, session, router, searchParams]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (globalError) {
      setGlobalError(null);
    }
    if (errors.email || errors.password) {
      clearErrors();
    }
  }, [watchedEmail, globalError, errors, clearErrors]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      setGlobalError(null);
      clearErrors();

      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email.trim().toLowerCase(),
        password: values.password,
        callbackUrl,
      });

      console.log('SignIn response:', res);

      if (res?.error) {
        setLoginAttempts(prev => prev + 1);
        
        // Handle different error types with specific messages
        switch (res.error) {
          case 'USER_NOT_FOUND':
            setError('email', { 
              type: 'manual', 
              message: 'No account found with this email address' 
            });
            break;
          case 'EMAIL_NOT_VERIFIED':
            setError('email', { 
              type: 'manual', 
              message: 'Please verify your email before logging in. Check your inbox for the verification link.' 
            });
            break;
          case 'ACCOUNT_DISABLED':
            setGlobalError('Your account has been disabled. Please contact support.');
            break;
          case 'CredentialsSignin':
            setError('password', { 
              type: 'manual', 
              message: 'Incorrect password. Please try again.' 
            });
            break;
          case 'RATE_LIMIT_EXCEEDED':
            setGlobalError('Too many login attempts. Please wait a few minutes before trying again.');
            break;
          default:
            setGlobalError('Login failed. Please check your credentials and try again.');
            break;
        }
      } else if (res?.ok) {
        // Successful login - redirect immediately
        console.log('Login successful, redirecting to:', callbackUrl);
        
        // Force a session refresh and then redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (callbackUrl.startsWith('/')) {
          router.replace(callbackUrl);
        } else {
          router.replace('/dashboard');
        }
      } else {
        setGlobalError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verified = searchParams.get('verified');
  const verifiedEmail = searchParams.get('email');
  const reason = searchParams.get('reason');

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

  // Debug session status
  if (process.env.NODE_ENV === 'development') {
    console.log('Login page render - Status:', status, 'Session:', session);
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
            
            {/* Show inactivity message if redirected due to timeout */}
            {reason === 'inactivity' && (
              <Alert className="mb-4 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  You were logged out due to inactivity. Please sign in again.
                </AlertDescription>
              </Alert>
            )}

            {/* Show email verification success message */}
            {verified === '1' && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your email {verifiedEmail ? `(${verifiedEmail})` : ''} has been verified successfully. You can now log in.
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    {...register('email')}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
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
                    placeholder="Enter your password" 
                    type={showPassword ? 'text' : 'password'} 
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword((v) => !v)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium" 
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/auth/register" 
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </CardContent>

        {/* Right: Visual */}
        <div className="relative hidden min-h-[520px] bg-gradient-to-br from-emerald-600 to-emerald-800 lg:block">
          <Image
            src="/assets/hero_images/4.webp"
            alt="Login"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Dhanvantari Ayurveda</h2>
              <p className="text-lg opacity-90">Your health, our priority</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


