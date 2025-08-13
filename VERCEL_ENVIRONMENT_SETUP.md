# Vercel Environment Variables Setup Guide

## Critical Issue: INVALID_CALLBACK_URL_ERROR

The error you're seeing is caused by incorrect environment variable configuration in Vercel. Here's how to fix it:

## Step 1: Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your project: `dhanvantari-ayurveda-dynamic-websit`

## Step 2: Navigate to Environment Variables

1. Click on your project
2. Go to **Settings** tab
3. Click on **Environment Variables** in the left sidebar

## Step 3: Add/Update Environment Variables

**IMPORTANT**: You need to set these variables for BOTH **Production** and **Preview** environments!

### Required Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://dhanvantari-ayurveda-dynamic-websit.vercel.app` | Production |
| `NEXTAUTH_SECRET` | `904bcaf3fb4242505d7c8971e34372294503f039e43dab34040b223d9dcdef0d` | Production |
| `DATABASE_URL` | `your-database-url` | Production |
| `EMAIL_HOST` | `smtp.gmail.com` | Production |
| `EMAIL_PORT` | `587` | Production |
| `EMAIL_USERNAME` | `your-email@gmail.com` | Production |
| `EMAIL_PASSWORD` | `your-app-password` | Production |

### For Preview Environment (same values):

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://dhanvantari-ayurveda-dynamic-websit.vercel.app` | Preview |
| `NEXTAUTH_SECRET` | `904bcaf3fb4242505d7c8971e34372294503f039e43dab34040b223d9dcdef0d` | Preview |
| `DATABASE_URL` | `your-database-url` | Preview |
| `EMAIL_HOST` | `smtp.gmail.com` | Preview |
| `EMAIL_PORT` | `587` | Preview |
| `EMAIL_USERNAME` | `your-email@gmail.com` | Preview |
| `EMAIL_PASSWORD` | `your-app-password` | Preview |

## Step 4: How to Add Each Variable

1. Click **Add New** button
2. Fill in the form:
   - **Name**: Enter the variable name (e.g., `NEXTAUTH_URL`)
   - **Value**: Enter the value
   - **Environment**: Select **Production** (repeat for Preview)
3. Click **Save**
4. Repeat for each variable

## Step 5: Verify Your Settings

After adding all variables, your environment variables page should show:

```
NEXTAUTH_URL = https://dhanvantari-ayurveda-dynamic-websit.vercel.app
NEXTAUTH_SECRET = 904bcaf3fb4242505d7c8971e34372294503f039e43dab34040b223d9dcdef0d
DATABASE_URL = your-database-url
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USERNAME = your-email@gmail.com
EMAIL_PASSWORD = your-app-password
```

## Step 6: Redeploy

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots menu
4. Select **Redeploy**

## Step 7: Test the Fix

After redeployment:

1. Go to [https://dhanvantari-ayurveda-dynamic-websit.vercel.app/auth/login](https://dhanvantari-ayurveda-dynamic-websit.vercel.app/auth/login)
2. Try logging in with correct credentials
3. You should be redirected to the dashboard successfully

## Common Issues & Solutions

### Issue: Still getting INVALID_CALLBACK_URL_ERROR

**Solution**: 
- Double-check that `NEXTAUTH_URL` is set correctly
- Make sure it includes `https://` protocol
- Ensure it's set for both Production and Preview environments

### Issue: Environment variables not showing up

**Solution**:
- Wait a few minutes for Vercel to process the changes
- Redeploy the application
- Check that you saved the variables correctly

### Issue: Database connection errors

**Solution**:
- Verify your `DATABASE_URL` is correct
- Ensure your database allows external connections
- Check if your database is accessible from Vercel's servers

### Issue: Email not sending

**Solution**:
- Verify your Gmail app password is correct
- Check that SMTP settings are correct
- Ensure your Gmail account allows less secure apps

## Verification Checklist

- [ ] `NEXTAUTH_URL` is set to `https://dhanvantari-ayurveda-dynamic-websit.vercel.app`
- [ ] `NEXTAUTH_SECRET` is set to the generated secret
- [ ] All variables are set for both Production and Preview
- [ ] Application has been redeployed
- [ ] Login works and redirects to dashboard
- [ ] OTP registration works
- [ ] Password reset works

## Support

If you continue to have issues:

1. Check the Vercel deployment logs for specific error messages
2. Verify all environment variables are set correctly
3. Test each component individually
4. Contact support with the specific error messages

## Next Steps

After fixing the environment variables:

1. Test the complete authentication flow
2. Monitor the application for any other issues
3. Set up monitoring and alerts
4. Consider setting up a custom domain for better branding
