# OTP-Based Authentication Implementation

## Overview

This implementation replaces email verification links with 6-digit OTP (One-Time Password) for a smoother and more user-friendly authentication experience.

## Features

### 🔐 Registration Process
1. **Step 1**: User fills registration form (name, email, password, role)
2. **Step 2**: System sends 6-digit OTP to user's email
3. **Step 3**: User enters OTP to verify and create account
4. **Step 4**: Account is created and user is redirected to login

### 🔑 Password Reset Process
1. **Step 1**: User enters email address
2. **Step 2**: System sends 6-digit OTP to user's email
3. **Step 3**: User enters OTP to verify identity
4. **Step 4**: User sets new password
5. **Step 5**: Password is updated and user is redirected to login

## Technical Implementation

### Database Schema

```sql
-- OTP Token table
CREATE TABLE OTPToken (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) NOT NULL,
  otp VARCHAR(191) NOT NULL,
  type VARCHAR(191) NOT NULL, -- 'REGISTRATION' or 'PASSWORD_RESET'
  attempts INT DEFAULT 0,
  expiresAt DATETIME(3) NOT NULL,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- Indexes for performance
CREATE INDEX OTPToken_email_type_idx ON OTPToken(email, type);
CREATE INDEX OTPToken_expiresAt_idx ON OTPToken(expiresAt);
```

### API Endpoints

#### Registration Flow
- `POST /api/auth/register` - Send OTP for registration
- `POST /api/auth/verify-otp` - Verify OTP and create account

#### Password Reset Flow
- `POST /api/auth/forgot-password` - Send OTP for password reset
- `POST /api/auth/reset-password` - Verify OTP and update password

### OTP Configuration

- **Length**: 6 digits
- **Expiry**: 10 minutes
- **Max Attempts**: 3 attempts per OTP
- **Rate Limiting**: 60 seconds cooldown between resend requests

### Security Features

1. **Rate Limiting**: Prevents abuse with IP-based rate limiting
2. **Attempt Tracking**: Limits failed OTP attempts
3. **Automatic Cleanup**: Expired OTPs are automatically removed
4. **Email Validation**: Ensures OTP is sent to valid email addresses
5. **Secure Storage**: OTPs are hashed and stored securely

## User Experience Improvements

### Registration Page (`/auth/register`)
- **Two-step process**: Registration form → OTP verification
- **Resend functionality**: 60-second cooldown timer
- **Clear feedback**: Success/error messages for each step
- **Smooth transitions**: Step-by-step UI with back navigation

### Forgot Password Page (`/auth/forgot-password`)
- **Three-step process**: Email → OTP → New Password
- **Resend functionality**: 60-second cooldown timer
- **Password requirements**: Clear validation and feedback
- **Auto-redirect**: Automatic redirect to login after success

### Email Templates
- **Professional design**: Branded email templates
- **Clear instructions**: Step-by-step guidance
- **Security notices**: Important security information
- **Mobile responsive**: Works on all devices

## Environment Variables Required

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=your-database-connection-string

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Vercel Deployment

### Environment Variables Setup
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all required environment variables
4. Redeploy your application

### Build Configuration
The `vercel.json` file is configured for optimal deployment:
- Proper build commands
- Environment variable mapping
- Function timeout settings

## Testing

### Local Development
1. Set up environment variables in `.env.local`
2. Run database migrations: `npx prisma migrate dev`
3. Start development server: `npm run dev`
4. Test registration and password reset flows

### Production Testing
1. Deploy to Vercel
2. Test with real email addresses
3. Verify OTP delivery and verification
4. Test rate limiting and security features

## Troubleshooting

### Common Issues

1. **OTP not received**
   - Check email configuration
   - Verify email address is correct
   - Check spam folder

2. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check database permissions
   - Run migrations if needed

3. **Vercel deployment issues**
   - Ensure all environment variables are set
   - Check build logs for errors
   - Verify NextAuth configuration

### Debug Mode
Enable debug mode in development:
```env
NODE_ENV=development
```

## Security Considerations

1. **OTP Storage**: OTPs are stored temporarily and automatically cleaned up
2. **Rate Limiting**: Prevents brute force attacks
3. **Email Validation**: Ensures OTPs are sent to valid addresses
4. **Session Management**: Proper session handling with NextAuth
5. **HTTPS**: Always use HTTPS in production

## Future Enhancements

1. **SMS OTP**: Add SMS-based OTP as an alternative
2. **2FA Integration**: Integrate with existing 2FA systems
3. **Audit Logging**: Add comprehensive audit trails
4. **Advanced Rate Limiting**: Implement more sophisticated rate limiting
5. **OTP Analytics**: Track OTP usage and success rates

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variable configuration
3. Verify database connectivity
4. Test with different email providers
