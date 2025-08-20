# Agency Permanent Security Key (PSK) Implementation

## Overview

This document describes the implementation of Agency Permanent Security Key (PSK) validation for user registration in the Dhanvantari Ayurveda application. The PSK acts as a security measure to control who can register for new accounts.

## Implementation Details

### 1. Environment Configuration

The PSK is configured via environment variable:

```bash
AGENCY_PSK=dhan2212
```

**Location**: `.env.local` file

### 2. Database Schema Changes

Added a `metadata` field to the `OTPToken` table to store PSK information:

```prisma
model OTPToken {
  id        String   @id @default(cuid())
  email     String
  otp       String
  type      String   // REGISTRATION, PASSWORD_RESET
  attempts  Int      @default(0)
  expiresAt DateTime
  createdAt DateTime @default(now())
  metadata  String?  // JSON string for additional data like PSK

  @@index([email, type])
  @@index([expiresAt])
}
```

### 3. Frontend Changes

#### Registration Form (`app/(auth)/auth/register/page.tsx`)

- Added PSK field to the registration schema
- Added PSK input field with password type for security
- Updated form submission to include PSK
- Updated OTP verification to include PSK validation

**New Form Field:**
```tsx
<div className="space-y-2">
  <label htmlFor="psk" className="text-sm font-medium text-gray-700">
    Agency Permanent Security Key
  </label>
  <div className="relative">
    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input 
      id="psk"
      className="pl-10" 
      placeholder="Enter the Agency Permanent Security Key" 
      type="password"
      {...registrationForm.register('psk')}
      autoComplete="off"
    />
  </div>
  {registrationForm.formState.errors.psk && (
    <p className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {registrationForm.formState.errors.psk.message}
    </p>
  )}
</div>
```

### 4. Backend Changes

#### Registration API (`app/api/auth/register/route.ts`)

- Added PSK validation before sending OTP
- Returns 403 error for invalid PSK
- Returns 500 error if AGENCY_PSK environment variable is not set

**PSK Validation Logic:**
```typescript
// Validate PSK
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
```

#### OTP Verification API (`app/api/auth/verify-otp/route.ts`)

- Added PSK validation during OTP verification
- Ensures PSK is validated at both steps of registration

#### OTP Service (`lib/otp-service.ts`)

- Updated `sendRegistrationOTP` to accept and store PSK
- Updated `verifyRegistrationOTP` to validate PSK
- Stores PSK in OTP metadata for validation during verification

### 5. Security Features

1. **Double Validation**: PSK is validated at both registration initiation and OTP verification
2. **Environment Variable**: PSK is stored securely in environment variables
3. **Password Field**: PSK input is masked as password for security
4. **Rate Limiting**: Existing rate limiting still applies
5. **Error Handling**: Proper error messages without revealing the correct PSK

### 6. User Experience

#### Registration Flow

1. User fills out registration form including PSK
2. System validates PSK before sending OTP
3. If PSK is invalid, user receives clear error message
4. If PSK is valid, OTP is sent to email
5. User enters OTP for final verification
6. PSK is validated again during OTP verification
7. Account is created only if both PSK and OTP are valid

#### Error Messages

- **Invalid PSK**: "Invalid Agency Permanent Security Key. Please enter the correct key to register."
- **Missing PSK**: "Agency Permanent Security Key is required"
- **System Error**: "Registration is currently unavailable. Please contact support."

### 7. Testing

A test script is available at `scripts/test-psk.js` to verify:

- Environment variable configuration
- Database schema changes
- PSK validation logic
- API endpoint availability

**Run the test:**
```bash
node scripts/test-psk.js
```

### 8. Deployment Considerations

1. **Environment Variables**: Ensure `AGENCY_PSK=dhan2212` is set in production environment
2. **Database Migration**: The metadata column will be automatically added via `prisma db push`
3. **Security**: Keep the PSK value confidential and change it periodically
4. **Monitoring**: Monitor registration attempts for security analysis

### 9. Future Enhancements

Potential improvements for the PSK system:

1. **Multiple PSKs**: Support for different PSKs for different user roles
2. **PSK Rotation**: Automatic PSK rotation mechanism
3. **Audit Logging**: Log PSK validation attempts for security monitoring
4. **Time-based PSKs**: PSKs that expire after a certain time
5. **Admin Interface**: Web interface for PSK management

## Files Modified

1. `app/(auth)/auth/register/page.tsx` - Frontend registration form
2. `app/api/auth/register/route.ts` - Registration API
3. `app/api/auth/verify-otp/route.ts` - OTP verification API
4. `lib/otp-service.ts` - OTP service with PSK validation
5. `prisma/schema.prisma` - Database schema
6. `.env.local` - Environment configuration
7. `scripts/test-psk.js` - Test script

## Summary

The PSK implementation provides a secure way to control user registration by requiring a specific security key. The implementation is robust, user-friendly, and maintains security best practices while providing clear feedback to users.
