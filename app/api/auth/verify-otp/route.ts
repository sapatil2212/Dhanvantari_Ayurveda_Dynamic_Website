import { NextResponse } from 'next/server';
import { z } from 'zod';
import { OTPService } from '@/lib/otp-service';

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
  role: z.enum(['RECEPTIONIST', 'DOCTOR', 'OTHER']).default('OTHER'),
  psk: z.string().min(1, 'Agency Permanent Security Key is required'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, otp, name, password, role, psk } = schema.parse(json);

    // Validate PSK again during OTP verification
    const expectedPSK = process.env.AGENCY_PSK;
    if (!expectedPSK) {
      console.error('AGENCY_PSK environment variable is not set');
      return NextResponse.json({ 
        message: 'Registration is currently unavailable. Please contact support.' 
      }, { status: 500 });
    }

    if (psk !== expectedPSK) {
      return NextResponse.json({ 
        message: 'Invalid Agency Permanent Security Key. Please enter the correct key to register.' 
      }, { status: 403 });
    }

    // Verify OTP and create user
    const result = await OTPService.verifyRegistrationOTP(email, otp, {
      name,
      password,
      role,
      psk
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
