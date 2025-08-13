import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        message: 'Token is required' 
      }, { status: 400 });
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return NextResponse.json({ 
        message: 'Invalid reset token' 
      }, { status: 404 });
    }

    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      
      return NextResponse.json({ 
        message: 'Reset token has expired' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Token is valid' 
    });
    
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { token, password } = schema.parse(json);

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return NextResponse.json({ 
        message: 'Invalid reset token' 
      }, { status: 404 });
    }

    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      
      return NextResponse.json({ 
        message: 'Reset token has expired' 
      }, { status: 400 });
    }

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return NextResponse.json({ 
        message: 'User not found' 
      }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ 
        message: 'Account is disabled' 
      }, { status: 403 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { 
        passwordHash,
        updatedAt: new Date()
      }
    });

    // Clean up the reset token
    await prisma.passwordResetToken.delete({
      where: { token }
    });

    return NextResponse.json({ 
      ok: true, 
      message: 'Password reset successful' 
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Invalid input data' 
      }, { status: 400 });
    }
    
    console.error('Reset password error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred' 
    }, { status: 500 });
  }
}


