# Deployment Troubleshooting Guide

## Current Status
✅ **Local Build**: Successful  
✅ **Database**: In sync with schema  
✅ **OTP System**: Fully implemented  
✅ **vercel.json**: Fixed (removed env section)  

## Common Deployment Errors & Solutions

### 1. Environment Variable Errors

**Error**: `Environment Variable "NEXTAUTH_URL" references Secret "nextauth_url", which does not exist`

**Solution**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables directly (NOT as secrets):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-actual-domain.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `904bcaf3fb4242505d7c8971e34372294503f039e43dab34040b223d9dcdef0d` | Production |
| `DATABASE_URL` | `your-database-url` | Production |
| `EMAIL_HOST` | `smtp.gmail.com` | Production |
| `EMAIL_PORT` | `587` | Production |
| `EMAIL_USERNAME` | `your-email@gmail.com` | Production |
| `EMAIL_PASSWORD` | `your-app-password` | Production |

**Important**: Set for both Production AND Preview environments!

### 2. Database Connection Errors

**Error**: `Database connection failed`

**Solution**:
1. Verify your `DATABASE_URL` is correct
2. Ensure your database is accessible from Vercel's servers
3. Check if your database allows external connections

### 3. Build Errors

**Error**: `Build failed`

**Solution**:
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally

### 4. OTP Email Not Sending

**Error**: `Email sending failed`

**Solution**:
1. Verify email credentials are correct
2. Check if Gmail app password is set up properly
3. Ensure SMTP settings are correct

## Step-by-Step Deployment Process

### Step 1: Prepare Environment Variables

1. **Generate NEXTAUTH_SECRET** (already done):
   ```
   904bcaf3fb4242505d7c8971e34372294503f039e43dab34040b223d9dcdef0d
   ```

2. **Get your actual domain** from Vercel dashboard

3. **Verify your database URL** is accessible

### Step 2: Set Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable one by one
5. Make sure to select both Production and Preview environments

### Step 3: Deploy

1. Push your latest changes to GitHub
2. Vercel will automatically deploy
3. Check the deployment logs for any errors

### Step 4: Test the Deployment

1. **Test Registration Flow**:
   - Go to `/auth/register`
   - Fill out the form
   - Check if OTP is sent to email
   - Verify OTP and complete registration

2. **Test Login Flow**:
   - Go to `/auth/login`
   - Login with credentials
   - Verify redirect to dashboard

3. **Test Password Reset**:
   - Go to `/auth/forgot-password`
   - Request password reset
   - Check if OTP is sent
   - Complete password reset

## Debugging Steps

### 1. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on any function to see logs
3. Look for error messages

### 2. Check Environment Variables

1. Go to Settings → Environment Variables
2. Verify all variables are set correctly
3. Check that they're set for the right environments

### 3. Test Database Connection

1. Check if your database is accessible
2. Verify the connection string format
3. Test with a simple query

### 4. Test Email Configuration

1. Verify SMTP settings
2. Check if Gmail app password is correct
3. Test email sending locally first

## Common Issues & Fixes

### Issue: `/api/hotel-info` 404 Errors

**Cause**: Browser cache or external scripts
**Fix**: 
- Clear browser cache
- Check browser dev tools for cached requests
- Ignore these errors (they don't affect functionality)

### Issue: Authentication Not Working

**Cause**: Missing or incorrect environment variables
**Fix**:
- Verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set
- Check that `NEXTAUTH_URL` matches your actual domain

### Issue: OTP Not Sending

**Cause**: Email configuration issues
**Fix**:
- Verify email credentials
- Check SMTP settings
- Ensure Gmail app password is set up

### Issue: Database Errors

**Cause**: Connection or schema issues
**Fix**:
- Verify `DATABASE_URL` is correct
- Check if database is accessible
- Ensure OTP table exists

## Emergency Rollback

If deployment fails:

1. **Revert to previous version** in Vercel dashboard
2. **Check environment variables** are set correctly
3. **Test locally** before redeploying
4. **Check build logs** for specific errors

## Success Indicators

✅ **Build completes successfully**  
✅ **Environment variables are set**  
✅ **Database connection works**  
✅ **OTP emails are sent**  
✅ **Registration flow works**  
✅ **Login flow works**  
✅ **Password reset works**  

## Support

If you continue to have issues:

1. **Check Vercel deployment logs** for specific error messages
2. **Verify all environment variables** are set correctly
3. **Test each component** individually
4. **Check database connectivity** from Vercel's servers

## Next Steps After Successful Deployment

1. **Test all authentication flows**
2. **Monitor email delivery**
3. **Check user experience**
4. **Monitor error logs**
5. **Set up monitoring and alerts**
