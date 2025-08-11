# Email Configuration Guide

## Quick Setup

Add these variables to your `.env.local` file:

```env
# Email Configuration (Required for enquiry emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Staff Email for Notifications
STAFF_EMAIL=dhanvantariayurvedansk@gmail.com
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Current Status

✅ **Enquiry System**: Working (saves to database)  
✅ **Dashboard**: Working (displays enquiries)  
⚠️ **Email Functionality**: Requires SMTP credentials  

## Testing

1. **Without Email Setup**: Enquiries will still be saved and displayed in dashboard
2. **With Email Setup**: Users receive confirmation emails, staff gets notifications

## Troubleshooting

If you see "Missing credentials for PLAIN" error:
- Check that `SMTP_USER` and `SMTP_PASS` are set in `.env.local`
- Verify Gmail app password is correct
- Restart the development server after adding environment variables

The system will continue to work for enquiries even without email setup!
