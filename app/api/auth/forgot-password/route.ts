import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

const schema = z.object({
  email: z.string().email(),
});

// Simple in-memory rate limiting for password reset requests
const resetAttempts = new Map<string, { count: number; resetTime: number }>();

function isResetRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = resetAttempts.get(ip);
  
  if (!attempt) {
    resetAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  if (now > attempt.resetTime) {
    resetAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return false;
  }
  
  if (attempt.count >= 3) { // Max 3 attempts per 15 minutes
    return true;
  }
  
  attempt.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limiting
    if (isResetRateLimited(ip)) {
      return NextResponse.json({ 
        message: 'Too many password reset attempts. Please wait 15 minutes before trying again.' 
      }, { status: 429 });
    }

    const json = await request.json();
    const { email } = schema.parse(json);

    const userEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'No account found with this email address' 
      }, { status: 404 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ 
        message: 'Account is disabled. Please contact support.' 
      }, { status: 403 });
    }

    // Check if there's already a pending reset token
    const existingToken = await prisma.passwordResetToken.findFirst({
      where: { email: userEmail }
    });

    if (existingToken) {
      // If token is still valid, don't create a new one
      if (existingToken.expiresAt > new Date()) {
        return NextResponse.json({ 
          message: 'A password reset email has already been sent. Please check your inbox or wait for the link to expire.' 
        }, { status: 409 });
      } else {
        // Clean up expired token
        await prisma.passwordResetToken.delete({
          where: { id: existingToken.id }
        });
      }
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Clean up any expired tokens globally
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      },
    });

    // Create reset token
    await prisma.passwordResetToken.create({
      data: {
        email: userEmail,
        token,
        expiresAt,
      },
    });

    // Send reset email
    try {
      await sendPasswordResetEmail({
        name: user.name || 'User',
        email: userEmail,
        resetToken: token
      });
    } catch (emailError) {
      // If email fails, clean up the reset token
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      
      console.error('Password reset email sending failed:', emailError);
      return NextResponse.json({ 
        message: 'Failed to send reset email. Please try again later.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Password reset instructions sent to your email' 
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid email address' 
      }, { status: 400 });
    }
    
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}


