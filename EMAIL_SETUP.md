# Email Setup for Enquiry System

## Environment Variables Required

Add these variables to your `.env.local` file:

```env
# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Staff Email for Notifications
STAFF_EMAIL=dhanvantariayurvedansk@gmail.com
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Testing Email Functionality

1. Submit a contact form from the frontend
2. Check the user's email for confirmation
3. Check staff email for notification
4. Check server logs for email status

## Email Templates

The system sends two types of emails:

1. **User Confirmation Email**: Sent to the person who submitted the enquiry
2. **Staff Notification Email**: Sent to staff to notify about new enquiries

Both emails include:
- Professional branding
- Enquiry details
- Contact information
- Next steps

## Troubleshooting

If emails are not sending:

1. Check environment variables are set correctly
2. Verify SMTP credentials
3. Check server logs for error messages
4. Ensure firewall allows SMTP traffic
5. Test with a simple email client first
