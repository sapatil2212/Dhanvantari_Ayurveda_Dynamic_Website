import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService } from '@/lib/otp-service';

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
});

// Simple in-memory rate limiting (in production, use Redis or similar)
const registrationAttempts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = registrationAttempts.get(ip);
  
  if (!attempt) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  if (now > attempt.resetTime) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return false;
  }
  
  if (attempt.count >= 5) { // Max 5 attempts per 15 minutes
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
        message: 'Too many registration attempts. Please wait 15 minutes before trying again.' 
      }, { status: 429 });
    }

    const json = await request.json();
    const { name, email, password, role } = schema.parse(json);

    // Send OTP for registration
    const result = await OTPService.sendRegistrationOTP(email, name);

    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        message: 'OTP sent successfully! Please check your email and enter the 6-digit code to complete registration.' 
      });
    } else {
      return NextResponse.json({ 
        message: result.message 
      }, { status: 400 });
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid input data', 
        issues: error.issues 
      }, { status: 400 });
    }
    
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}


