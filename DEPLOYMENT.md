# Deployment Guide - Dhanvantari Ayurveda

This guide will help you deploy the Dhanvantari Ayurveda application to Vercel with TiDB database.

## Prerequisites

- Vercel account
- TiDB Cloud account
- GitHub repository with the application code

## Step 1: Database Setup

### 1.1 Create TiDB Database

1. Log in to [TiDB Cloud](https://tidbcloud.com)
2. Create a new cluster or use an existing one
3. Note down the connection details:
   - Host: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`
   - Port: `4000`
   - Database: `dhanvantari`
   - Username: `2eCzcoDvebHUdTd.root`
   - Password: `U1pliZhGv35AskBG`

### 1.2 Test Database Connection

Run the database connection test:

```bash
npm run test-db-connection
```

## Step 2: Environment Variables

Set up the following environment variables in your Vercel project:

```env
# Database Configuration
DATABASE_URL="mysql://2eCzcoDvebHUdTd.root:U1pliZhGv35AskBG@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/dhanvantari?sslaccept=strict"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USERNAME="saptechnoeditors@gmail.com"
EMAIL_PASSWORD="uyqhyiptjkarfgdq"

# File Upload
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"

# Agency Security Key
AGENCY_PSK="swapnil2212"
```

## Step 3: Database Migration

### 3.1 Run Database Setup

Execute the database setup script to create tables and initial data:

```bash
npm run db:setup
```

This script will:
- Test database connection
- Run Prisma migrations
- Generate Prisma client
- Create default admin user
- Set up default system settings

### 3.2 Verify Database Setup

Test the database connection and table creation:

```bash
node scripts/test-db-connection.js
```

## Step 4: Vercel Deployment

### 4.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings

### 4.2 Build Configuration

The project is configured with:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4.3 Environment Variables

Add all environment variables from Step 2 to your Vercel project:
1. Go to Project Settings → Environment Variables
2. Add each variable with the appropriate values
3. Set them for Production, Preview, and Development environments

## Step 5: Deploy

### 5.1 Initial Deployment

1. Push your code to GitHub
2. Vercel will automatically trigger a build
3. Monitor the build logs for any issues

### 5.2 Database Migration on Vercel

The build process includes:
- Prisma client generation
- Database migration deployment
- Next.js build

## Step 6: Post-Deployment

### 6.1 Verify Deployment

1. Check if the application is accessible
2. Test the login functionality
3. Verify database connectivity

### 6.2 Default Admin Access

Default admin credentials:
- **Email**: `admin@dhanvantari.com`
- **Password**: `admin123`

**Important**: Change these credentials after first login!

## Troubleshooting

### Build Failures

If the build fails with database errors:

1. **Check Environment Variables**: Ensure all environment variables are set correctly
2. **Database Connection**: Verify the TiDB connection string
3. **Network Issues**: Check if Vercel can reach your TiDB instance

### Database Connection Issues

1. **SSL Configuration**: Ensure `sslaccept=strict` is in the connection string
2. **Firewall**: Check if TiDB allows connections from Vercel's IP ranges
3. **Credentials**: Verify username and password are correct

### API Route Errors

If you see "Dynamic server usage" errors:

1. The application is configured to handle these automatically
2. Check that the middleware is properly configured
3. Ensure API routes are not being statically generated

## Monitoring

### 6.3 Application Monitoring

1. **Vercel Analytics**: Enable Vercel Analytics for performance monitoring
2. **Error Tracking**: Set up error tracking (e.g., Sentry)
3. **Database Monitoring**: Monitor TiDB Cloud metrics

### 6.4 Regular Maintenance

1. **Database Backups**: TiDB Cloud provides automatic backups
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor application performance

## Support

If you encounter issues:

1. Check the Vercel build logs
2. Review the database connection test results
3. Verify all environment variables are set correctly
4. Contact support with specific error messages

## Security Notes

- Change default admin credentials immediately
- Use strong, unique secrets for JWT and NextAuth
- Regularly update dependencies
- Monitor for security vulnerabilities
- Enable HTTPS (automatic with Vercel)
