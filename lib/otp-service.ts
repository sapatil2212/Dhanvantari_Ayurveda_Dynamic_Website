import { prisma } from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/email';

// OTP configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

export class OTPService {
  /**
   * Generate a 6-digit OTP
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP for registration
   */
  static async sendRegistrationOTP(email: string, name: string, psk?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Clean up expired OTPs
      await this.cleanupExpiredOTPs();

      // Check for existing pending OTP
      const existingOTP = await prisma.oTPToken.findFirst({
        where: { 
          email: email.toLowerCase().trim(),
          type: 'REGISTRATION'
        }
      });

      if (existingOTP && existingOTP.expiresAt > new Date()) {
        return { success: false, message: 'An OTP has already been sent. Please wait a few minutes before requesting another.' };
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Save OTP to database with PSK (if provided)
      await prisma.oTPToken.create({
        data: {
          email: email.toLowerCase().trim(),
          otp,
          type: 'REGISTRATION',
          expiresAt,
          attempts: 0,
          metadata: psk ? JSON.stringify({ psk }) : null
        }
      });

      // Send OTP via email
      await sendOTPEmail({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        otp,
        type: 'REGISTRATION'
      });

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending registration OTP:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  }

  /**
   * Send OTP for password reset
   */
  static async sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!user) {
        return { success: false, message: 'No account found with this email address' };
      }

      // Clean up expired OTPs
      await this.cleanupExpiredOTPs();

      // Check for existing pending OTP
      const existingOTP = await prisma.oTPToken.findFirst({
        where: { 
          email: email.toLowerCase().trim(),
          type: 'PASSWORD_RESET'
        }
      });

      if (existingOTP && existingOTP.expiresAt > new Date()) {
        return { success: false, message: 'An OTP has already been sent. Please wait a few minutes before requesting another.' };
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Save OTP to database
      await prisma.oTPToken.create({
        data: {
          email: email.toLowerCase().trim(),
          otp,
          type: 'PASSWORD_RESET',
          expiresAt,
          attempts: 0
        }
      });

      // Send OTP via email
      await sendOTPEmail({
        email: email.toLowerCase().trim(),
        name: user.name || user.email,
        otp,
        type: 'PASSWORD_RESET'
      });

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending password reset OTP:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  }

  /**
   * Verify OTP for registration
   */
  static async verifyRegistrationOTP(email: string, otp: string, userData: {
    name: string;
    password: string;
    role: string;
    psk?: string;
  }): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const otpRecord = await prisma.oTPToken.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          type: 'REGISTRATION',
          otp
        }
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid OTP' };
      }

      if (otpRecord.expiresAt < new Date()) {
        await this.deleteOTP(otpRecord.id);
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }

      if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await this.deleteOTP(otpRecord.id);
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
      }

      // Validate PSK if provided
      if (userData.psk) {
        const expectedPSK = process.env.AGENCY_PSK;
        if (!expectedPSK) {
          console.error('AGENCY_PSK environment variable is not set');
          return { success: false, message: 'Registration is currently unavailable. Please contact support.' };
        }

        if (userData.psk !== expectedPSK) {
          // Increment attempts for invalid PSK
          await prisma.oTPToken.update({
            where: { id: otpRecord.id },
            data: { attempts: otpRecord.attempts + 1 }
          });
          return { success: false, message: 'Invalid Agency Permanent Security Key. Please enter the correct key to register.' };
        }
      }

      // Increment attempts
      await prisma.oTPToken.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      });

      // If OTP is correct, create user
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(userData.password, 12);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: userData.name.trim(),
          passwordHash,
          role: userData.role as any,
          emailVerified: new Date(), // Since OTP verification is equivalent to email verification
          isActive: true
        }
      });

      // Delete OTP after successful verification
      await this.deleteOTP(otpRecord.id);

      return { 
        success: true, 
        message: 'Account created successfully! You can now log in.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error verifying registration OTP:', error);
      return { success: false, message: 'Failed to verify OTP. Please try again.' };
    }
  }

  /**
   * Verify OTP for password reset
   */
  static async verifyPasswordResetOTP(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const otpRecord = await prisma.oTPToken.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          type: 'PASSWORD_RESET',
          otp
        }
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid OTP' };
      }

      if (otpRecord.expiresAt < new Date()) {
        await this.deleteOTP(otpRecord.id);
        return { success: false, message: 'OTP has expired. Please request a new one.' };
      }

      if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await this.deleteOTP(otpRecord.id);
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
      }

      // Increment attempts
      await prisma.oTPToken.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 }
      });

      // If OTP is correct, update password
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email: email.toLowerCase().trim() },
        data: { passwordHash }
      });

      // Delete OTP after successful verification
      await this.deleteOTP(otpRecord.id);

      return { success: true, message: 'Password updated successfully! You can now log in with your new password.' };
    } catch (error) {
      console.error('Error verifying password reset OTP:', error);
      return { success: false, message: 'Failed to verify OTP. Please try again.' };
    }
  }

  /**
   * Clean up expired OTPs
   */
  static async cleanupExpiredOTPs(): Promise<void> {
    try {
      await prisma.oTPToken.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
    }
  }

  /**
   * Delete specific OTP
   */
  static async deleteOTP(id: string): Promise<void> {
    try {
      await prisma.oTPToken.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting OTP:', error);
    }
  }
}
