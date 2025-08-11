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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; position: relative; }
          .logo-container { display: inline-block; background: rgba(255, 255, 255, 0.95); padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .header .subtitle { color: #d1fae5; margin: 8px 0 0 0; font-size: 18px; font-weight: 300; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: #059669; margin-bottom: 20px; font-weight: 600; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .details-card { background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #d1fae5; border-radius: 12px; padding: 25px; margin: 25px 0; position: relative; }
          .details-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #059669 0%, #047857 100%); border-radius: 2px; }
          .details-title { color: #059669; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #374151; }
          .detail-value { color: #6b7280; text-align: right; }
          .next-steps { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
          .next-steps h3 { color: #059669; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; }
          .step-list { margin: 0; padding-left: 20px; }
          .step-list li { color: #4b5563; margin: 8px 0; line-height: 1.6; }
          .emergency-card { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
          .emergency-title { color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600; }
          .emergency-text { color: #92400e; margin: 0; font-size: 14px; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer-content { color: #374151; margin: 0; font-size: 18px; line-height: 1.8; font-weight: 600; }
          .footer-subtitle { color: #6b7280; margin: 5px 0 0 0; font-size: 14px; font-weight: 400; }
          .contact-info { margin-top: 25px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
          .contact-item { text-align: center; }
          .contact-label { color: #374151; font-weight: 600; font-size: 14px; margin-bottom: 5px; display: block; }
          .contact-value { color: #6b7280; font-size: 14px; line-height: 1.6; }
          .contact-link { color: #059669; text-decoration: none; font-weight: 500; transition: color 0.2s; }
          .contact-link:hover { color: #047857; text-decoration: underline; }
          .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
          @media only screen and (max-width: 600px) {
            .container { margin: 0; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 25px 20px; }
            .detail-row { flex-direction: column; text-align: left; }
            .detail-value { text-align: left; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            </div>
            <h1>Dhanvantari Ayurveda</h1>
            <p class="subtitle">Traditional Healing for Modern Wellness</p>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${name},</div>
            
            <div class="message">
              Thank you for reaching out to Dhanvantari Ayurveda. We have received your enquiry and our dedicated team of Ayurvedic practitioners will review it carefully and get back to you within 24 hours.
            </div>
            
            <div class="details-card">
              <h3 class="details-title">📋 Enquiry Details</h3>
              <div class="detail-row">
                <span class="detail-label">Enquiry ID:</span>
                <span class="detail-value">${enquiryId}</span>
              </div>
              ${service ? `
              <div class="detail-row">
                <span class="detail-label">Service Interest:</span>
                <span class="detail-value">${service}</span>
              </div>
              ` : ''}
              ${message ? `
              <div class="detail-row">
                <span class="detail-label">Message:</span>
                <span class="detail-value">${message}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="next-steps">
              <h3>🔄 What Happens Next?</h3>
              <ul class="step-list">
                <li><strong>Review:</strong> Our expert team will carefully review your health concerns</li>
                <li><strong>Consultation:</strong> We'll contact you to discuss your specific needs</li>
                <li><strong>Scheduling:</strong> Arrange a convenient consultation time for you</li>
                <li><strong>Treatment:</strong> Begin your personalized Ayurvedic treatment plan</li>
              </ul>
            </div>
            
            <div class="emergency-card">
              <div class="emergency-title">🚨 Need Immediate Assistance?</div>
              <div class="emergency-text">
                For urgent health concerns, please call us directly at <strong>+91 99211 18724</strong>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              Dhanvantari Ayurveda
            </div>
            <div class="footer-subtitle">
              Traditional healing for modern wellness
            </div>
            
            <div class="divider"></div>
            
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-label">📍 Address</span>
                <div class="contact-value">
                  Dhanvantari Ayurveda Building<br>
                  Saikheda Phata, near Khanderao mandir<br>
                  Ojhar, Maharashtra 422206
                </div>
              </div>
              
              <div class="contact-item">
                <span class="contact-label">📞 Phone</span>
                <div class="contact-value">
                  <a href="tel:+919921118724" class="contact-link">+91 99211 18724</a>
                </div>
              </div>
              
              <div class="contact-item">
                <span class="contact-label">✉️ Email</span>
                <div class="contact-value">
                  <a href="mailto:dhanvantariayurvedansk@gmail.com" class="contact-link">dhanvantariayurvedansk@gmail.com</a>
                </div>
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; position: relative; }
          .logo-container { display: inline-block; background: rgba(255, 255, 255, 0.95); padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .header .subtitle { color: #fecaca; margin: 8px 0 0 0; font-size: 18px; font-weight: 300; }
          .content { padding: 40px 30px; }
          .alert-badge { display: inline-block; background: #dc2626; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .details-card { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca; border-radius: 12px; padding: 25px; margin: 25px 0; position: relative; }
          .details-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 2px; }
          .details-title { color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #374151; }
          .detail-value { color: #6b7280; text-align: right; }
          .action-card { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #dc2626; }
          .action-title { color: #dc2626; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; }
          .action-text { color: #4b5563; margin: 0; line-height: 1.6; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer-content { color: #374151; margin: 0; font-size: 18px; line-height: 1.8; font-weight: 600; }
          .footer-subtitle { color: #6b7280; margin: 5px 0 0 0; font-size: 14px; font-weight: 400; }
          .contact-info { margin-top: 25px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
          .contact-item { text-align: center; }
          .contact-label { color: #374151; font-weight: 600; font-size: 14px; margin-bottom: 5px; display: block; }
          .contact-value { color: #6b7280; font-size: 14px; line-height: 1.6; }
          .contact-link { color: #059669; text-decoration: none; font-weight: 500; transition: color 0.2s; }
          .contact-link:hover { color: #047857; text-decoration: underline; }
          .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
          .timestamp { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .timestamp-text { color: #6b7280; margin: 0; font-size: 14px; }
          @media only screen and (max-width: 600px) {
            .container { margin: 0; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .footer { padding: 25px 20px; }
            .detail-row { flex-direction: column; text-align: left; }
            .detail-value { text-align: left; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            </div>
            <h1>New Enquiry Alert</h1>
            <p class="subtitle">Action Required - Customer Contact Needed</p>
          </div>
          
          <div class="content">
            <div class="alert-badge">🚨 URGENT - NEW ENQUIRY</div>
            
            <div class="message">
              A new enquiry has been received through our website. Please review the details below and contact the customer within 24 hours to provide excellent service.
            </div>
            
            <div class="details-card">
              <h3 class="details-title">📋 Customer Details</h3>
              <div class="detail-row">
                <span class="detail-label">Enquiry ID:</span>
                <span class="detail-value">${enquiryId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email Address:</span>
                <span class="detail-value">${email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone Number:</span>
                <span class="detail-value">${phone}</span>
              </div>
              ${service ? `
              <div class="detail-row">
                <span class="detail-label">Service Interest:</span>
                <span class="detail-value">${service}</span>
              </div>
              ` : ''}
              ${message ? `
              <div class="detail-row">
                <span class="detail-label">Customer Message:</span>
                <span class="detail-value">${message}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="action-card">
              <div class="action-title">⚡ Required Action</div>
              <div class="action-text">
                <strong>Please contact this customer within 24 hours</strong> to discuss their health concerns and schedule a consultation. This is crucial for providing excellent customer service and converting the enquiry into a patient.
              </div>
            </div>
            
            <div class="timestamp">
              <div class="timestamp-text">
                <strong>Received:</strong> ${new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              Dhanvantari Ayurveda
            </div>
            <div class="footer-subtitle">
              Traditional healing for modern wellness
            </div>
            
            <div class="divider"></div>
            
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-label">📍 Address</span>
                <div class="contact-value">
                  Dhanvantari Ayurveda Building<br>
                  Saikheda Phata, near Khanderao mandir<br>
                  Ojhar, Maharashtra 422206
                </div>
              </div>
              
              <div class="contact-item">
                <span class="contact-label">📞 Phone</span>
                <div class="contact-value">
                  <a href="tel:+919921118724" class="contact-link">+91 99211 18724</a>
                </div>
              </div>
              
              <div class="contact-item">
                <span class="contact-label">✉️ Email</span>
                <div class="contact-value">
                  <a href="mailto:dhanvantariayurvedansk@gmail.com" class="contact-link">dhanvantariayurvedansk@gmail.com</a>
                </div>
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 20px 0 0 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: #059669; margin-bottom: 20px; font-weight: 600; }
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
            <h1>Appointment Confirmed</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${patientName},</div>
            <div class="message">
              Your appointment has been successfully booked with Dhanvantari Ayurveda. We look forward to serving you and helping you on your wellness journey.
            </div>
            
            <div class="appointment-details">
              <h3 style="color: #059669; margin: 0 0 20px 0;">Appointment Details</h3>
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
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">Important Reminders</h3>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                • Please arrive 10 minutes before your scheduled time<br>
                • Bring any relevant medical reports or prescriptions<br>
                • Avoid heavy meals 2 hours before your appointment
              </p>
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
      subject: `Appointment Confirmed - ${appointmentDate} at ${appointmentTime}`,
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
          .logo { width: 120px; height: 40px; object-fit: contain; }
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 20px 0 0 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: #059669; margin-bottom: 20px; font-weight: 600; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .verify-button { display: inline-block; background: #059669; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            <h1>Verify Your Email</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${name},</div>
            <div class="message">
              Thank you for registering with Dhanvantari Ayurveda. Please verify your email address by clicking the button below.
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #059669;">${verificationUrl}</a>
            </div>
          </div>
          
          <div class="footer">
            <div style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">
              Dhanvantari Ayurveda
            </div>
            <div style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
              Traditional healing for modern wellness
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
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; }
          .logo { width: 120px; height: 40px; object-fit: contain; }
          .header h1 { color: #ffffff; margin: 20px 0 0 0; font-size: 32px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; color: #dc2626; margin-bottom: 20px; font-weight: 600; }
          .message { color: #4b5563; line-height: 1.8; margin-bottom: 30px; font-size: 16px; }
          .reset-button { display: inline-block; background: #dc2626; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://dhanvantariayurved.in/assets/logo/logo.png" alt="Dhanvantari Ayurveda Logo" class="logo">
            <h1>Reset Your Password</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${name},</div>
            <div class="message">
              We received a request to reset your password for your Dhanvantari Ayurveda account. Click the button below to create a new password.
            </div>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button">Reset Password</a>
            </div>
            
            <div style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              If you didn't request this password reset, you can safely ignore this email.<br>
              If the button doesn't work, you can copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #dc2626;">${resetUrl}</a>
            </div>
          </div>
          
          <div class="footer">
            <div style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">
              Dhanvantari Ayurveda
            </div>
            <div style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
              Traditional healing for modern wellness
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


