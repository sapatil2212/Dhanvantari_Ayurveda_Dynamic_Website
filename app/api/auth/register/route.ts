import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

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

    // Check if email already exists
    const existing = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (existing) {
      return NextResponse.json({ 
        message: 'An account with this email already exists' 
      }, { status: 409 });
    }

    // Check if there's a pending verification for this email
    const pendingVerification = await prisma.verificationToken.findFirst({
      where: { email: email.toLowerCase().trim() }
    });

    if (pendingVerification) {
      // If verification is still valid (not expired), don't allow new registration
      if (pendingVerification.expiresAt > new Date()) {
        return NextResponse.json({ 
          message: 'A verification email has already been sent to this address. Please check your inbox or wait for the link to expire.' 
        }, { status: 409 });
      } else {
        // Clean up expired verification
        await prisma.verificationToken.delete({
          where: { id: pendingVerification.id }
        });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Clean up any expired tokens globally
    await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      },
    });

    // Create verification token
    await prisma.verificationToken.create({
      data: { 
        email: email.toLowerCase().trim(), 
        name: name.trim(), 
        passwordHash, 
        role, 
        token, 
        expiresAt 
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail({ 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        verificationToken: token 
      });
    } catch (emailError) {
      // If email fails, clean up the verification token
      await prisma.verificationToken.delete({
        where: { token }
      });
      
      console.error('Email sending failed:', emailError);
      return NextResponse.json({ 
        message: 'Failed to send verification email. Please try again later.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Registration successful! Please check your email to verify your account.' 
    });
    
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


