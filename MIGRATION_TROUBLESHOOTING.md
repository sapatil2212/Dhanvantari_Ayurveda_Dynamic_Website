# Migration Troubleshooting Guide

This guide helps resolve the failed migration issue that's preventing your Vercel deployment.

## The Problem

The migration `20250810110029_enhanced_professional_system` has failed in your TiDB database, and Prisma won't apply new migrations until this is resolved.

## Quick Fix (Recommended)

### Option 1: Run the Quick Fix Script

```bash
npm run db:quick-fix
```

This script will:
1. Connect to your database
2. Check for the failed migration record
3. Either mark it as applied or delete the failed record
4. Deploy all pending migrations

### Option 2: Manual Database Fix

If the script doesn't work, you can fix it manually:

1. **Connect to your TiDB database** using any MySQL client
2. **Check the failed migration**:
   ```sql
   SELECT * FROM _prisma_migrations 
   WHERE migration_name = '20250810110029_enhanced_professional_system'
   ORDER BY finished_at DESC;
   ```

3. **Delete the failed migration record**:
   ```sql
   DELETE FROM _prisma_migrations 
   WHERE migration_name = '20250810110029_enhanced_professional_system' 
   AND finished_at IS NULL;
   ```

4. **Deploy migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## Alternative Solutions

### Option 3: Reset All Migrations

⚠️ **Warning**: This will delete all data in your database!

```bash
npm run db:reset
```

### Option 4: Mark Migration as Applied

If the tables already exist but the migration is marked as failed:

```bash
npx prisma migrate resolve --applied 20250810110029_enhanced_professional_system
```

## Verification Steps

After fixing the migration:

1. **Test database connection**:
   ```bash
   npm run db:test
   ```

2. **Check migration status**:
   ```bash
   npx prisma migrate status
   ```

3. **Deploy to Vercel**:
   - Push your changes to GitHub
   - Vercel will automatically trigger a new build

## Common Issues and Solutions

### Issue: "migrate found failed migrations"

**Solution**: Use the quick fix script or manually delete the failed migration record.

### Issue: "Database connection failed"

**Solution**: 
1. Check your `DATABASE_URL` environment variable
2. Ensure TiDB database is accessible
3. Verify SSL configuration (`sslaccept=strict`)

### Issue: "Permission denied"

**Solution**: 
1. Check database user permissions
2. Ensure the user has full access to the database
3. Verify the database exists

### Issue: "Table already exists"

**Solution**: 
1. Mark the migration as applied
2. Or reset migrations if you don't need existing data

## Prevention

To prevent future migration issues:

1. **Always test migrations locally** before deploying
2. **Use development migrations** for schema changes
3. **Backup your database** before major changes
4. **Monitor migration logs** during deployment

## Getting Help

If none of these solutions work:

1. Check the Vercel build logs for specific error messages
2. Run `npm run db:test` to verify database connectivity
3. Check the TiDB Cloud dashboard for any issues
4. Review the Prisma migration documentation

## Environment Variables

Make sure these are set correctly in Vercel:

```env
DATABASE_URL="mysql://2eCzcoDvebHUdTd.root:U1pliZhGv35AskBG@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/dhanvantari?sslaccept=strict"
```

## Next Steps

After resolving the migration issue:

1. ✅ Deploy to Vercel
2. ✅ Test the application
3. ✅ Login with default admin credentials
4. ✅ Change the default password
5. ✅ Configure your clinic settings
