import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  searchParams: { token?: string };
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function VerifyPage({ searchParams }: Props) {
  const token = searchParams.token;
  
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Verification Link</h1>
            <p className="text-gray-600 mb-6">
              The verification link is missing or invalid. Please check your email for the correct link.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                Go to Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  try {
    const record = await prisma.verificationToken.findUnique({ 
      where: { token }
    });

    if (!record) {
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Verification Link</h1>
              <p className="text-gray-600 mb-6">
                This verification link is invalid or has already been used. Please request a new verification email.
              </p>
              <div className="space-y-3">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Register Again
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="w-full">
                    Go to Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (record.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({ where: { token } });
      
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Link Expired</h1>
              <p className="text-gray-600 mb-6">
                This verification link has expired. Please register again to receive a new verification email.
              </p>
              <div className="space-y-3">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Register Again
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="w-full">
                    Go to Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({
      where: { email: record.email }
    });

    if (existingUser && existingUser.emailVerified) {
      // Clean up the token
      await prisma.verificationToken.delete({ where: { token } });
      
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Already Verified</h1>
              <p className="text-gray-600 mb-6">
                Your email has already been verified. You can now log in to your account.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">
                  Go to Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Verify the email and create/update user
    try {
      await prisma.user.upsert({
        where: { email: record.email },
        create: {
          email: record.email,
          name: record.name,
          passwordHash: record.passwordHash,
          role: record.role,
          emailVerified: new Date(),
          isActive: true,
        },
        update: { 
          emailVerified: new Date(),
          isActive: true,
        },
      });

      // Clean up the verification token
      await prisma.verificationToken.delete({ where: { token } });

      // Redirect to login with success message
      redirect(`/auth/login?verified=1&email=${encodeURIComponent(record.email)}`);

    } catch (error) {
      console.error('Error during email verification:', error);
      
      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">
                An error occurred while verifying your email. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full">
                    Try Again
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="w-full">
                    Go to Login
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

  } catch (error) {
    console.error('Verification page error:', error);
    
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try again later.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                Go to Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}


