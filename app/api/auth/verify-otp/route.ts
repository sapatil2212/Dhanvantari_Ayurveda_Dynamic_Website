import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService } from '@/lib/otp-service';

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, otp, name, password, role } = schema.parse(json);

    // Verify OTP and create user
    const result = await OTPService.verifyRegistrationOTP(email, otp, {
      name,
      password,
      role
    });

    if (result.success) {
      return NextResponse.json({ 
        ok: true, 
        message: result.message,
        user: result.user
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
    
    console.error('OTP verification error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}
