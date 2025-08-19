const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME || process.env.SMTP_USER || '',
    pass: process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || '',
  },
  // Add timeout and connection settings
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message?: string;
  enquiryId: string;
}

export async function sendEnquiryConfirmationEmail(data: EnquiryEmailData) {
  try {
    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { name, email, service, message, enquiryId } = data;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enquiry Confirmation - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .logo-container { 
            margin: 0 auto 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 12px; 
          }
          .logo { 
            width: 48px; 
            height: 48px; 
            object-fit: contain; 
            border-radius: 6px; 
          }
          .brand-icon { 
            width: 32px; 
            height: 32px; 
            background-color: #10b981; 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .brand-icon svg { 
            width: 18px; 
            height: 18px; 
            fill: white; 
          }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .content { 
            padding: 32px; 
          }
          .greeting { 
            font-size: 14px; 
            color: #111827; 
            margin-bottom: 24px; 
            font-weight: 400; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .details-card { 
            background-color: #f9fafb; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
            border: 1px solid #e5e7eb; 
          }
          .details-title { 
            color: #111827; 
            margin: 0 0 12px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 4px 0; 
          }
          .detail-label { 
            font-weight: 500; 
            color: #6b7280; 
            font-size: 12px; 
          }
          .detail-value { 
            color: #374151; 
            text-align: right; 
            font-size: 12px; 
          }
          .next-steps { 
            background-color: #fffbeb; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
            border: 1px solid #fed7aa; 
          }
          .next-steps-title { 
            color: #92400e; 
            margin: 0 0 12px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .step-list { 
            margin: 0; 
            padding-left: 16px; 
            font-size: 12px; 
          }
          .step-list li { 
            color: #a16207; 
            margin: 4px 0; 
            line-height: 1.5; 
          }
          .contact-note { 
            background-color: #eff6ff; 
            border: 1px solid #dbeafe; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
            text-align: center; 
          }
          .contact-note-text { 
            color: #1e40af; 
            margin: 0; 
            font-size: 12px; 
            line-height: 1.5; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-contact { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          .footer-contact a { 
            color: #10b981; 
            text-decoration: none; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
            .detail-row { flex-direction: column; text-align: left; }
            .detail-value { text-align: left; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
                <div class="brand-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h1>Enquiry received</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${name},</div>
              
              <div class="message">
                Thank you for reaching out to Dhanvantari Ayurveda. We have received your enquiry and our dedicated team will review it carefully and get back to you within 24 hours.
              </div>
              
              <div class="details-card">
                <div class="details-title">Enquiry Details</div>
                <div class="detail-row">
                  <span class="detail-label">Enquiry ID</span>
                  <span class="detail-value">${enquiryId}</span>
                </div>
                ${service ? `
                <div class="detail-row">
                  <span class="detail-label">Service Interest</span>
                  <span class="detail-value">${service}</span>
                </div>
                ` : ''}
                ${message ? `
                <div class="detail-row">
                  <span class="detail-label">Message</span>
                  <span class="detail-value">${message}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="next-steps">
                <div class="next-steps-title">What happens next?</div>
                <ul class="step-list">
                  <li>Our expert team will review your health concerns</li>
                  <li>We'll contact you to discuss your specific needs</li>
                  <li>Arrange a convenient consultation time</li>
                  <li>Begin your personalized Ayurvedic treatment plan</li>
                </ul>
              </div>
              
              <div class="contact-note">
                <div class="contact-note-text">
                  For urgent health concerns, please call us directly at <strong>+91 99211 18724</strong>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">Traditional healing for modern wellness</div>
              <div class="footer-contact">
                📞 <a href="tel:+919921118724">+91 99211 18724</a> | 
                ✉️ <a href="mailto:dhanvantariayurvedansk@gmail.com">dhanvantariayurvedansk@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: email,
      subject: 'Thank you for your enquiry - Dhanvantari Ayurveda',
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Enquiry confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send enquiry confirmation email:', error);
    throw error;
  }
}

export async function sendEnquiryNotificationToStaff(data: EnquiryEmailData) {
  try {
    // Check if email credentials are configured
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping staff notification email send.');
      return null;
    }

    const { name, email, phone, service, message, enquiryId } = data;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Enquiry Alert - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .logo-container { 
            margin: 0 auto 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 12px; 
          }
          .logo { 
            width: 48px; 
            height: 48px; 
            object-fit: contain; 
            border-radius: 6px; 
          }
          .brand-icon { 
            width: 32px; 
            height: 32px; 
            background-color: #f59e0b; 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .brand-icon svg { 
            width: 18px; 
            height: 18px; 
            fill: white; 
          }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .alert-badge { 
            display: inline-block; 
            background-color: #dc2626; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: 500; 
            margin-top: 8px; 
          }
          .content { 
            padding: 32px; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .details-card { 
            background-color: #fef2f2; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
            border: 1px solid #fecaca; 
          }
          .details-title { 
            color: #dc2626; 
            margin: 0 0 12px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 4px 0; 
          }
          .detail-label { 
            font-weight: 500; 
            color: #6b7280; 
            font-size: 12px; 
          }
          .detail-value { 
            color: #374151; 
            text-align: right; 
            font-size: 12px; 
            max-width: 60%; 
            word-break: break-word; 
          }
          .action-card { 
            background-color: #fffbeb; 
            border: 1px solid #fed7aa; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
          }
          .action-title { 
            color: #92400e; 
            margin: 0 0 8px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .action-text { 
            color: #a16207; 
            margin: 0; 
            font-size: 12px; 
            line-height: 1.5; 
          }
          .timestamp { 
            background-color: #f3f4f6; 
            border-radius: 4px; 
            padding: 12px; 
            margin: 24px 0; 
            text-align: center; 
          }
          .timestamp-text { 
            color: #6b7280; 
            margin: 0; 
            font-size: 11px; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-contact { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          .footer-contact a { 
            color: #10b981; 
            text-decoration: none; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
            .detail-row { flex-direction: column; text-align: left; }
            .detail-value { text-align: left; margin-top: 4px; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
                <div class="brand-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                  </svg>
                </div>
              </div>
              <h1>New enquiry alert</h1>
              <div class="alert-badge">ACTION REQUIRED</div>
            </div>
            
            <div class="content">
              <div class="message">
                A new enquiry has been received through the website. Please review the details below and contact the customer within 24 hours.
              </div>
              
              <div class="details-card">
                <div class="details-title">Customer Details</div>
                <div class="detail-row">
                  <span class="detail-label">Enquiry ID</span>
                  <span class="detail-value">${enquiryId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Customer Name</span>
                  <span class="detail-value">${name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value">${email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone Number</span>
                  <span class="detail-value">${phone}</span>
                </div>
                ${service ? `
                <div class="detail-row">
                  <span class="detail-label">Service Interest</span>
                  <span class="detail-value">${service}</span>
                </div>
                ` : ''}
                ${message ? `
                <div class="detail-row">
                  <span class="detail-label">Customer Message</span>
                  <span class="detail-value">${message}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="action-card">
                <div class="action-title">Required Action</div>
                <div class="action-text">
                  Please contact this customer within 24 hours to discuss their health concerns and schedule a consultation. This is crucial for providing excellent customer service.
                </div>
              </div>
              
              <div class="timestamp">
                <div class="timestamp-text">
                  Received: ${new Date().toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">Traditional healing for modern wellness</div>
              <div class="footer-contact">
                📞 <a href="tel:+919921118724">+91 99211 18724</a> | 
                ✉️ <a href="mailto:dhanvantariayurvedansk@gmail.com">dhanvantariayurvedansk@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: process.env.STAFF_EMAIL || 'dhanvantariayurvedansk@gmail.com',
      subject: `New Enquiry from ${name} - ${enquiryId}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Staff notification email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send staff notification email:', error);
    throw error;
  }
}

// Appointment email interfaces
export interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  service?: string;
  notes?: string;
  appointmentId: string;
}

export interface AppointmentStatusData {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  service?: string;
  notes?: string;
  appointmentId: string;
}

export interface AppointmentRescheduleData {
  patientName: string;
  patientEmail: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  service?: string;
  notes?: string;
  appointmentId: string;
}

export interface VerificationEmailData {
  name: string;
  email: string;
  verificationToken: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetToken: string;
}

// Appointment booking confirmation email
export async function sendAppointmentBookedEmail(data: AppointmentEmailData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { patientName, patientEmail, appointmentDate, appointmentTime, service, notes, appointmentId } = data;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .logo-container { 
            margin: 0 auto 16px; 
            text-align: center; 
            width: 100%; 
          }
          .logo { 
            width: 120px; 
            height: 120px; 
            object-fit: contain; 
            border-radius: 8px; 
            display: inline-block; 
            margin: 0 auto; 
          }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .content { 
            padding: 32px; 
          }
          .greeting { 
            font-size: 14px; 
            color: #111827; 
            margin-bottom: 24px; 
            font-weight: 400; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .appointment-details { 
            background-color: #f0fdf4; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
            border: 1px solid #bbf7d0; 
          }
          .details-title { 
            color: #047857; 
            margin: 0 0 12px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            margin: 8px 0; 
            padding: 4px 0; 
          }
          .detail-label { 
            font-weight: 500; 
            color: #6b7280; 
            font-size: 12px; 
          }
          .detail-value { 
            color: #374151; 
            text-align: right; 
            font-size: 12px; 
          }
          .reminders { 
            background-color: #fffbeb; 
            border: 1px solid #fed7aa; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
          }
          .reminders-title { 
            color: #92400e; 
            margin: 0 0 8px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .reminders-list { 
            color: #a16207; 
            margin: 0; 
            padding-left: 16px; 
            font-size: 12px; 
          }
          .reminders-list li { 
            margin: 4px 0; 
            line-height: 1.4; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-contact { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          .footer-contact a { 
            color: #10b981; 
            text-decoration: none; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
            .detail-row { flex-direction: column; text-align: left; }
            .detail-value { text-align: left; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
              </div>
                             <h1>Appointment booked</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${patientName},</div>
              
              <div class="message">
                Your appointment has been successfully booked with Dhanvantari Ayurveda. We look forward to serving you and helping you on your wellness journey.
              </div>
              
              <div class="appointment-details">
                <div class="details-title">Appointment Details</div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${appointmentDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${appointmentTime}</span>
                </div>
                ${service ? `
                <div class="detail-row">
                  <span class="detail-label">Service</span>
                  <span class="detail-value">${service}</span>
                </div>
                ` : ''}
                ${notes ? `
                <div class="detail-row">
                  <span class="detail-label">Notes</span>
                  <span class="detail-value">${notes}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="detail-label">Appointment ID</span>
                  <span class="detail-value">${appointmentId}</span>
                </div>
              </div>
              
              <div class="reminders">
                <div class="reminders-title">Important Reminders</div>
                <ul class="reminders-list">
                  <li>Please arrive 10 minutes before your scheduled time</li>
                  <li>Bring any relevant medical reports or prescriptions</li>
                  <li>Avoid heavy meals 2 hours before your appointment</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">Traditional healing for modern wellness</div>
              <div class="footer-contact">
                📞 <a href="tel:+919921118724">+91 99211 18724</a> | 
                ✉️ <a href="mailto:dhanvantariayurvedansk@gmail.com">dhanvantariayurvedansk@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: patientEmail,
      subject: `Appointment Booked - ${appointmentDate} at ${appointmentTime}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send appointment confirmation email:', error);
    throw error;
  }
}

// Appointment status update email
export async function sendAppointmentStatusEmail(data: AppointmentStatusData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { patientName, patientEmail, appointmentDate, appointmentTime, status, service, notes, appointmentId } = data;

    const statusText = status === 'confirmed' ? 'Confirmed' : status === 'cancelled' ? 'Cancelled' : 'Rescheduled';
    const statusColor = status === 'confirmed' ? '#059669' : status === 'cancelled' ? '#dc2626' : '#f59e0b';

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment ${statusText} - Dhanvantari Ayurveda</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 180px; height: 100px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 20px 0 0 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: ${statusColor}; margin-bottom: 20px; font-weight: 600; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .appointment-details { background: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #374151; }
          .detail-value { color: #6b7280; text-align: right; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            <h1>Appointment ${statusText}</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${patientName},</div>
            <div class="message">
              Your appointment has been <strong>${statusText.toLowerCase()}</strong>. ${status === 'confirmed' ? 'We look forward to seeing you!' : status === 'cancelled' ? 'Please contact us to reschedule if needed.' : 'Please note the new details below.'}
            </div>
            
            <div class="appointment-details">
              <h3 style="color: ${statusColor}; margin: 0 0 20px 0;">Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${appointmentTime}</span>
              </div>
              ${service ? `
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${service}</span>
              </div>
              ` : ''}
              ${notes ? `
              <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${notes}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Appointment ID:</span>
                <span class="detail-value">${appointmentId}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">
              Dhanvantari Ayurveda
            </div>
            <div style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
              Traditional healing for modern wellness
            </div>
            <div style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              📞 +91 99211 18724 | ✉️ dhanvantariayurvedansk@gmail.com
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: patientEmail,
      subject: `Appointment ${statusText} - ${appointmentDate} at ${appointmentTime}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Appointment status email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send appointment status email:', error);
    throw error;
  }
}

// Appointment reschedule email
export async function sendAppointmentRescheduleEmail(data: AppointmentRescheduleData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { patientName, patientEmail, oldDate, oldTime, newDate, newTime, service, notes, appointmentId } = data;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Rescheduled - Dhanvantari Ayurveda</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 20px 0 0 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: #f59e0b; margin-bottom: 20px; font-weight: 600; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .appointment-details { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #374151; }
          .detail-value { color: #6b7280; text-align: right; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            <h1>Appointment Rescheduled</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${patientName},</div>
            <div class="message">
              Your appointment has been rescheduled. Please note the new date and time below.
            </div>
            
            <div class="appointment-details">
              <h3 style="color: #f59e0b; margin: 0 0 20px 0;">Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Previous Date:</span>
                <span class="detail-value">${oldDate} at ${oldTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">New Date:</span>
                <span class="detail-value">${newDate} at ${newTime}</span>
              </div>
              ${service ? `
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${service}</span>
              </div>
              ` : ''}
              ${notes ? `
              <div class="detail-row">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">${notes}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Appointment ID:</span>
                <span class="detail-value">${appointmentId}</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">
              Dhanvantari Ayurveda
            </div>
            <div style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
              Traditional healing for modern wellness
            </div>
            <div style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              📞 +91 99211 18724 | ✉️ dhanvantariayurvedansk@gmail.com
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: patientEmail,
      subject: `Appointment Rescheduled - ${newDate} at ${newTime}`,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Appointment reschedule email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send appointment reschedule email:', error);
    throw error;
  }
}

// Email verification email
export async function sendVerificationEmail(data: VerificationEmailData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { name, email, verificationToken } = data;
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .logo-container { 
            margin: 0 auto 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 12px; 
          }
          .logo { 
            width: 48px; 
            height: 48px; 
            object-fit: contain; 
            border-radius: 6px; 
          }
          .brand-icon { 
            width: 32px; 
            height: 32px; 
            background-color: #4f46e5; 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .brand-icon svg { 
            width: 18px; 
            height: 18px; 
            fill: white; 
          }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .content { 
            padding: 32px; 
          }
          .greeting { 
            font-size: 14px; 
            color: #111827; 
            margin-bottom: 24px; 
            font-weight: 400; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .button-container { 
            text-align: center; 
            margin: 32px 0; 
          }
          .verify-button { 
            display: inline-block; 
            background-color: #4f46e5; 
            color: #ffffff; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500; 
            font-size: 14px; 
            transition: background-color 0.2s; 
          }
          .verify-button:hover { 
            background-color: #4338ca; 
          }
          .link-fallback { 
            color: #9ca3af; 
            font-size: 12px; 
            margin-top: 24px; 
            line-height: 1.5; 
          }
          .link-fallback a { 
            color: #4f46e5; 
            text-decoration: none; 
            word-break: break-all; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-copyright { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
                <div class="brand-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <h1>Verify your email address</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${name},</div>
              
              <div class="message">
                Thank you for registering with Dhanvantari Ayurveda. Please verify your email address by clicking the button below to complete your account setup.
              </div>
              
              <div class="button-container">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>
              
              <div class="link-fallback">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="${verificationUrl}">${verificationUrl}</a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">An effortless wellness solution with all the features you need.</div>
              <div class="footer-copyright">© 2025 Dhanvantari Ayurveda. All rights reserved.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: email,
      subject: 'Verify Your Email - Dhanvantari Ayurveda',
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

// Password reset email
export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const { name, email, resetToken } = data;
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
          .logo-container { 
            margin: 0 auto 16px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 12px; 
          }
          .logo { 
            width: 48px; 
            height: 48px; 
            object-fit: contain; 
            border-radius: 6px; 
          }
          .brand-icon { 
            width: 32px; 
            height: 32px; 
            background-color: #ef4444; 
            border-radius: 6px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
          .brand-icon svg { 
            width: 18px; 
            height: 18px; 
            fill: white; 
          }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .content { 
            padding: 32px; 
          }
          .greeting { 
            font-size: 14px; 
            color: #111827; 
            margin-bottom: 24px; 
            font-weight: 400; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .button-container { 
            text-align: center; 
            margin: 32px 0; 
          }
          .reset-button { 
            display: inline-block; 
            background-color: #ef4444; 
            color: #ffffff; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 500; 
            font-size: 14px; 
            transition: background-color 0.2s; 
          }
          .reset-button:hover { 
            background-color: #dc2626; 
          }
          .security-note { 
            background-color: #fef2f2; 
            border: 1px solid #fecaca; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
          }
          .security-note-text { 
            color: #991b1b; 
            margin: 0; 
            font-size: 12px; 
            line-height: 1.5; 
          }
          .link-fallback { 
            color: #9ca3af; 
            font-size: 12px; 
            margin-top: 24px; 
            line-height: 1.5; 
          }
          .link-fallback a { 
            color: #ef4444; 
            text-decoration: none; 
            word-break: break-all; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-copyright { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
                <div class="brand-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
              </div>
              <h1>Reset your password</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hello ${name},</div>
              
              <div class="message">
                We received a request to reset your password for your Dhanvantari Ayurveda account. Click the button below to create a new password.
              </div>
              
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <div class="security-note">
                <div class="security-note-text">
                  If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                </div>
              </div>
              
              <div class="link-fallback">
                If the button doesn't work, you can copy and paste this link into your browser:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">An effortless wellness solution with all the features you need.</div>
              <div class="footer-copyright">© 2025 Dhanvantari Ayurveda. All rights reserved.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: email,
      subject: 'Reset Your Password - Dhanvantari Ayurveda',
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

// OTP email interfaces
export interface OTPEmailData {
  email: string;
  name: string;
  otp: string;
  type: 'REGISTRATION' | 'PASSWORD_RESET';
}

// Send OTP email
export async function sendOTPEmail(data: OTPEmailData) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping OTP email send.');
      return null;
    }

         const { email, name, otp, type } = data;
     const isRegistration = type === 'REGISTRATION';
     const subject = isRegistration ? 'Verify Your Account - Dhanvantari Ayurveda' : 'Reset Your Password - Dhanvantari Ayurveda';
     const title = isRegistration ? 'Verify Your Account' : 'Reset Your Password';
     const heading = isRegistration ? 'Verify your Dhanvantari sign-up' : 'Password reset OTP';
     const message = isRegistration 
       ? 'Thank you for registering with Dhanvantari Ayurveda. Please use the OTP below to verify your account.'
       : 'We received a request to reset your password. Please use the OTP below to create a new password.';

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Dhanvantari Ayurveda</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #374151; 
            background-color: #f9fafb; 
          }
          .email-wrapper { 
            width: 100%; 
            padding: 20px 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 480px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #e5e7eb; 
          }
          .header { 
            background-color: #ffffff; 
            padding: 32px 32px 24px; 
            text-align: center; 
            border-bottom: 1px solid #f3f4f6; 
          }
                     .logo-container { 
             margin: 0 auto 16px; 
             display: flex; 
             align-items: center; 
             justify-content: center; 
             width: 100%; 
             text-align: center; 
           }
           .logo { 
             width: 140px; 
             height: 140px; 
             object-fit: contain; 
             border-radius: 8px; 
             margin: 0 auto; 
           }
          .header h1 { 
            color: #111827; 
            margin: 0; 
            font-size: 20px; 
            font-weight: 600; 
            letter-spacing: -0.025em; 
          }
          .content { 
            padding: 32px; 
          }
          .greeting { 
            font-size: 14px; 
            color: #111827; 
            margin-bottom: 24px; 
            font-weight: 400; 
          }
          .message { 
            color: #6b7280; 
            line-height: 1.6; 
            margin-bottom: 32px; 
            font-size: 14px; 
          }
          .otp-container { 
            background-color: #f9fafb; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 32px 0; 
            text-align: center; 
            border: 1px solid #e5e7eb; 
          }
          .otp-code { 
            font-size: 32px; 
            font-weight: 700; 
            color: #111827; 
            letter-spacing: 8px; 
            margin: 16px 0; 
            font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; 
            background-color: #ffffff; 
            padding: 12px 16px; 
            border-radius: 6px; 
            border: 1px solid #d1d5db; 
            display: inline-block; 
          }
          .otp-expiry { 
            color: #9ca3af; 
            font-size: 12px; 
            margin-top: 8px; 
          }
          .security-note { 
            background-color: #fffbeb; 
            border: 1px solid #fed7aa; 
            border-radius: 6px; 
            padding: 16px; 
            margin: 24px 0; 
          }
          .security-note-title { 
            color: #92400e; 
            margin: 0 0 8px 0; 
            font-size: 13px; 
            font-weight: 500; 
          }
          .security-note-text { 
            color: #a16207; 
            margin: 0; 
            font-size: 12px; 
            line-height: 1.5; 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 24px 32px; 
            text-align: center; 
            border-top: 1px solid #f3f4f6; 
          }
          .footer-brand { 
            color: #111827; 
            margin: 0; 
            font-size: 14px; 
            font-weight: 500; 
          }
          .footer-tagline { 
            color: #9ca3af; 
            margin: 4px 0 0 0; 
            font-size: 12px; 
          }
          .footer-copyright { 
            color: #9ca3af; 
            margin: 16px 0 0 0; 
            font-size: 11px; 
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px; }
            .container { margin: 0; border-radius: 0; }
            .header, .content, .footer { padding: 24px 20px; }
            .otp-code { font-size: 28px; letter-spacing: 6px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
                         <div class="header">
               <div class="logo-container">
                 <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
               </div>
               <h1>${heading}</h1>
             </div>
            
            <div class="content">
              <div class="greeting">Hello ${name},</div>
              
              <div class="message">
                ${message}
              </div>
              
              <div class="otp-container">
                <div class="otp-code">${otp}</div>
                <div class="otp-expiry">If you did not attempt to sign up but received this email, please disregard it. The code will remain active for 10 minutes.</div>
              </div>
              
              <div class="security-note">
                <div class="security-note-title">Security Notice</div>
                <div class="security-note-text">
                  Never share this verification code with anyone. Our team will never ask for this code via phone or email.
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-brand">Dhanvantari Ayurveda</div>
              <div class="footer-tagline">An effortless wellness solution with all the features you need.</div>
              <div class="footer-copyright">© 2025 Dhanvantari Ayurveda. All rights reserved.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: email,
      subject: subject,
      html: emailContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
}

// Generic email function for simple email sending
export async function sendEmail(data: { to: string; subject: string; html: string }) {
  try {
    const emailUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
    
    if (!emailUser || !emailPass) {
      console.warn('Email credentials not configured. Skipping email send.');
      return null;
    }

    const mailOptions = {
      from: `"Dhanvantari Ayurveda" <${emailUser}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}


