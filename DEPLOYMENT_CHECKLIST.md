# Vercel Deployment Checklist - OTP Authentication

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] `NEXTAUTH_URL` - Set to your Vercel domain (e.g., `https://your-app.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - Generate a strong secret key
- [ ] `DATABASE_URL` - Your database connection string
- [ ] `EMAIL_HOST` - SMTP server (e.g., `smtp.gmail.com`)
- [ ] `EMAIL_PORT` - SMTP port (e.g., `587`)
- [ ] `EMAIL_USERNAME` - Your email address
- [ ] `EMAIL_PASSWORD` - Your email app password

### ✅ Database Setup
- [ ] Database is accessible from Vercel
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify OTPToken table exists
- [ ] Test database connection

### ✅ Email Configuration
- [ ] Email credentials are correct
- [ ] SMTP settings are properly configured
- [ ] Test email sending functionality
- [ ] Check spam folder settings

## Vercel Deployment Steps

### 1. Environment Variables Setup
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL=your-database-connection-string
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
4. Set environment to **Production**
5. Click **Save**

### 2. Deploy Application
1. Push your code to GitHub
2. Vercel will automatically trigger a new deployment
3. Monitor the build logs for any errors
4. Wait for deployment to complete

### 3. Post-Deployment Verification

#### Test Registration Flow
1. Visit `https://your-app.vercel.app/auth/register`
2. Fill out the registration form
3. Check if OTP is received via email
4. Enter the OTP to complete registration
5. Verify user is redirected to login

#### Test Login Flow
1. Visit `https://your-app.vercel.app/auth/login`
2. Enter credentials for the newly created account
3. Verify successful login and redirect to dashboard

#### Test Password Reset Flow
1. Visit `https://your-app.vercel.app/auth/forgot-password`
2. Enter email address
3. Check if OTP is received via email
4. Enter OTP and set new password
5. Verify password reset and redirect to login

#### Test Security Features
1. Try registering with existing email (should show error)
2. Try invalid OTP (should show error)
3. Try resending OTP before cooldown (should be disabled)
4. Try expired OTP (should show error)

## Troubleshooting Common Issues

### ❌ "Configuration" Error on Login
**Problem**: NextAuth configuration error
**Solution**:
- Verify `NEXTAUTH_URL` is set correctly
- Ensure `NEXTAUTH_SECRET` is not empty
- Check that all environment variables are set for Production

### ❌ Database Connection Error
**Problem**: Cannot connect to database
**Solution**:
- Verify `DATABASE_URL` is correct
- Check database firewall settings
- Ensure database is accessible from Vercel's IP ranges

### ❌ Email Not Sending
**Problem**: OTP emails not being delivered
**Solution**:
- Check email credentials
- Verify SMTP settings
- Check email provider's security settings
- Look for emails in spam folder

### ❌ OTP Verification Fails
**Problem**: OTP verification not working
**Solution**:
- Check database connection
- Verify OTPToken table exists
- Check OTP expiry settings
- Monitor server logs for errors

### ❌ Build Fails
**Problem**: Vercel build fails
**Solution**:
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Ensure Prisma client is generated
- Check for TypeScript errors

## Monitoring and Maintenance

### ✅ Regular Checks
- [ ] Monitor email delivery rates
- [ ] Check database performance
- [ ] Review error logs
- [ ] Test authentication flows weekly

### ✅ Security Monitoring
- [ ] Monitor failed login attempts
- [ ] Check for unusual OTP requests
- [ ] Review rate limiting effectiveness
- [ ] Monitor database access patterns

### ✅ Performance Monitoring
- [ ] Check API response times
- [ ] Monitor database query performance
- [ ] Review Vercel function execution times
- [ ] Monitor email sending delays

## Emergency Procedures

### If Authentication System Fails
1. Check Vercel deployment status
2. Verify environment variables
3. Test database connectivity
4. Check email service status
5. Review recent code changes

### If Database Issues Occur
1. Check database connection
2. Verify database is running
3. Check for migration issues
4. Review database logs
5. Contact database provider if needed

### If Email Service Fails
1. Check email provider status
2. Verify SMTP credentials
3. Test email sending manually
4. Check for rate limiting
5. Consider alternative email providers

## Success Metrics

### User Experience
- [ ] Registration completion rate > 90%
- [ ] Password reset success rate > 95%
- [ ] Average OTP delivery time < 30 seconds
- [ ] User satisfaction with new flow

### Technical Performance
- [ ] API response time < 2 seconds
- [ ] Database query performance optimal
- [ ] Email delivery rate > 99%
- [ ] Error rate < 1%

### Security
- [ ] No successful brute force attacks
- [ ] Rate limiting working effectively
- [ ] OTP expiry working correctly
- [ ] No unauthorized access attempts

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Database Provider**: Check your database provider's support
- **Email Provider**: Check your email provider's support
- **Development Team**: Your internal development team

## Documentation

- [OTP Implementation Guide](./OTP_IMPLEMENTATION.md)
- [Environment Variables Reference](./OTP_IMPLEMENTATION.md#environment-variables-required)
- [API Documentation](./OTP_IMPLEMENTATION.md#api-endpoints)
- [Troubleshooting Guide](./OTP_IMPLEMENTATION.md#troubleshooting)
