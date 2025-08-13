import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService } from '@/lib/otp-service';

const schema = z.object({
  email: z.string().email(),
});

// Simple in-memory rate limiting
const resetAttempts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
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
    if (isRateLimited(ip)) {
      return NextResponse.json({ 
        message: 'Too many password reset attempts. Please wait 15 minutes before trying again.' 
      }, { status: 429 });
    }

    const json = await request.json();
    const { email } = schema.parse(json);

    // Send OTP for password reset
    const result = await OTPService.sendPasswordResetOTP(email);

    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        message: 'OTP sent successfully! Please check your email and enter the 6-digit code to reset your password.' 
      });
    } else {
      return NextResponse.json({ 
        message: result.message 
      }, { status: 400 });
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid email address', 
        issues: error.issues 
      }, { status: 400 });
    }
    
    console.error('Forgot password error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}


