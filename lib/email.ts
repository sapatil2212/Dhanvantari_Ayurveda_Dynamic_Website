import nodemailer from 'nodemailer';

export function createTransport() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Add security headers to reduce phishing warnings
    headers: {
      'X-Mailer': 'Dhanvantari Ayurveda Healthcare System',
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'normal',
      'X-Report-Abuse': 'Please report abuse here: abuse@dhanvantari-ayurveda.com',
    },
  });
  return transporter;
}

// Common email template wrapper with security features
function createEmailTemplate(content: string, title: string) {
  const currentYear = new Date().getFullYear();
  const domain = process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'dhanvantari-ayurveda.com';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title} - Dhanvantari Ayurveda</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
        .header .subtitle { color: #d1fae5; margin: 5px 0 0 0; font-size: 14px; }
        .content { padding: 40px 30px; }
        .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer p { margin: 5px 0; color: #6c757d; font-size: 12px; }
        .security-notice { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; }
        .security-notice h4 { margin: 0 0 10px 0; color: #856404; font-size: 14px; }
        .security-notice p { margin: 0; color: #856404; font-size: 12px; }
        .button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: linear-gradient(135deg, #047857 0%, #065f46 100%); }
        .info-box { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-box h3 { margin: 0 0 15px 0; color: #059669; font-size: 18px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .info-label { font-weight: 600; color: #495057; }
        .info-value { color: #6c757d; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .status-confirmed { background-color: #d1fae5; color: #065f46; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; text-decoration: none; }
        .domain-info { color: #6c757d; font-size: 11px; margin-top: 10px; }
        @media only screen and (max-width: 600px) {
          .content { padding: 20px 15px; }
          .header { padding: 20px 15px; }
          .footer { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="${process.env.NEXTAUTH_URL}" class="logo">🌿 Dhanvantari</a>
          <p class="subtitle">Traditional Ayurvedic Healthcare</p>
        </div>
        
        <div class="content">
          ${content}
          
          <div class="security-notice">
            <h4>🔒 Security Notice</h4>
            <p>This email was sent from ${domain}. If you didn't request this action, please ignore this email or contact our support team immediately.</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Dhanvantari Ayurveda</strong></p>
          <p>Traditional healing for modern wellness</p>
          <p>© ${currentYear} Dhanvantari Ayurveda. All rights reserved.</p>
          <p class="domain-info">This email was sent from ${domain}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(opts: { to: string; link: string }) {
  const transporter = createTransport();
  const from = process.env.EMAIL_FROM || `"Dhanvantari Ayurveda" <${process.env.EMAIL_USERNAME}>`;
  
  const content = `
    <h2 style="color: #059669; margin-bottom: 20px;">Welcome to Dhanvantari Ayurveda! 🌿</h2>
    
    <p>Thank you for registering with us. To complete your account setup and access our healthcare platform, please verify your email address.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${opts.link}" class="button" style="text-decoration: none;">
        ✅ Verify My Email Address
      </a>
    </div>
    
    <div class="info-box">
      <h3>What happens next?</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>Click the verification button above</li>
        <li>Your account will be activated immediately</li>
        <li>You can then log in to access our services</li>
        <li>Start booking appointments and managing healthcare</li>
      </ul>
    </div>
    
    <p><strong>Important:</strong> This verification link will expire in 5 minutes for your security.</p>
    
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6c757d; font-size: 12px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${opts.link}</p>
  `;
  
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: '🔐 Verify Your Dhanvantari Ayurveda Account',
    html: createEmailTemplate(content, 'Email Verification'),
  });
}

export async function sendPasswordResetEmail(opts: { to: string; link: string }) {
  const transporter = createTransport();
  const from = process.env.EMAIL_FROM || `"Dhanvantari Ayurveda" <${process.env.EMAIL_USERNAME}>`;
  
  const content = `
    <h2 style="color: #059669; margin-bottom: 20px;">Password Reset Request 🔑</h2>
    
    <p>We received a request to reset your password for your Dhanvantari Ayurveda account. If this was you, please click the button below to create a new password.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${opts.link}" class="button" style="text-decoration: none;">
        🔄 Reset My Password
      </a>
    </div>
    
    <div class="info-box">
      <h3>Security Information</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li>This link is valid for 5 minutes only</li>
        <li>It can only be used once</li>
        <li>If you didn't request this, your account is still secure</li>
        <li>Your current password will remain unchanged</li>
      </ul>
    </div>
    
    <p><strong>Didn't request this?</strong> If you didn't request a password reset, you can safely ignore this email. Your account security has not been compromised.</p>
    
    <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6c757d; font-size: 12px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${opts.link}</p>
  `;
  
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: '🔑 Reset Your Dhanvantari Ayurveda Password',
    html: createEmailTemplate(content, 'Password Reset'),
  });
}

export async function sendAppointmentStatusEmail(opts: {
  to: string;
  name: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  consultationType: string;
  date: string; // ISO date string
  time: string;
}) {
  const transporter = createTransport();
  const from = process.env.EMAIL_FROM || `"Dhanvantari Ayurveda" <${process.env.EMAIL_USERNAME}>`;
  const prettyDate = new Date(opts.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const statusConfig = {
    CONFIRMED: { color: '#059669', bg: '#d1fae5', text: 'Confirmed', icon: '✅' },
    PENDING: { color: '#d97706', bg: '#fef3c7', text: 'Pending', icon: '⏳' },
    CANCELLED: { color: '#dc2626', bg: '#fee2e2', text: 'Cancelled', icon: '❌' }
  };
  
  const status = statusConfig[opts.status];
  
  const content = `
    <h2 style="color: #059669; margin-bottom: 20px;">Appointment Update 📅</h2>
    
    <p>Hello <strong>${opts.name}</strong>,</p>
    
    <p>Your appointment status has been updated. Here are the current details:</p>
    
    <div class="info-box">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span style="font-size: 20px; margin-right: 10px;">${status.icon}</span>
        <span class="status-badge" style="background-color: ${status.bg}; color: ${status.color};">
          ${status.text}
        </span>
      </div>
      
      <div class="info-row">
        <span class="info-label">Consultation Type:</span>
        <span class="info-value">${opts.consultationType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${prettyDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time:</span>
        <span class="info-value">${opts.time}</span>
      </div>
    </div>
    
    ${opts.status === 'CONFIRMED' ? `
      <div style="background-color: #d1fae5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #065f46;">✅ Appointment Confirmed!</h4>
        <p style="margin: 0; color: #065f46;">We look forward to seeing you. Please arrive 10 minutes before your scheduled time.</p>
      </div>
    ` : opts.status === 'CANCELLED' ? `
      <div style="background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #991b1b;">❌ Appointment Cancelled</h4>
        <p style="margin: 0; color: #991b1b;">If you need to reschedule, please contact us as soon as possible.</p>
      </div>
    ` : `
      <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px 0; color: #92400e;">⏳ Appointment Pending</h4>
        <p style="margin: 0; color: #92400e;">We're reviewing your appointment request and will confirm shortly.</p>
      </div>
    `}
    
    <p>If you have any questions or need to make changes, please don't hesitate to contact us.</p>
    
    <p style="margin-top: 30px;">
      <strong>Best regards,</strong><br>
      The Dhanvantari Ayurveda Team
    </p>
  `;
  
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: `📅 Your Appointment is ${opts.status.toLowerCase()} - Dhanvantari Ayurveda`,
    html: createEmailTemplate(content, 'Appointment Update'),
  });
}

export async function sendAppointmentRescheduleEmail(opts: {
  to: string;
  name: string;
  consultationType: string;
  oldDate: string; // ISO date string
  oldTime: string;
  newDate: string; // ISO date string
  newTime: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'MISSED';
}) {
  const transporter = createTransport();
  const from = process.env.EMAIL_FROM || `"Dhanvantari Ayurveda" <${process.env.EMAIL_USERNAME}>`;
  const prettyOld = new Date(opts.oldDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const prettyNew = new Date(opts.newDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const content = `
    <h2 style="color: #059669; margin-bottom: 20px;">Appointment Rescheduled 📅</h2>
    
    <p>Hello <strong>${opts.name}</strong>,</p>
    
    <p>Your appointment has been rescheduled. Here are the updated details:</p>
    
    <div class="info-box">
      <h3>New Appointment Details</h3>
      <div class="info-row">
        <span class="info-label">Consultation Type:</span>
        <span class="info-value">${opts.consultationType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">New Date:</span>
        <span class="info-value">${prettyNew}</span>
      </div>
      <div class="info-row">
        <span class="info-label">New Time:</span>
        <span class="info-value">${opts.newTime}</span>
      </div>
    </div>
    
    <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #92400e;">📝 Reschedule Notice</h4>
      <p style="margin: 0; color: #92400e;">
        Your previous appointment on <strong>${prettyOld}</strong> at <strong>${opts.oldTime}</strong> 
        was rescheduled to the new date and time above.
      </p>
    </div>
    
    <p>We apologize for any inconvenience this may have caused. If the new time doesn't work for you, please contact us to arrange an alternative.</p>
    
    <p style="margin-top: 30px;">
      <strong>Best regards,</strong><br>
      The Dhanvantari Ayurveda Team
    </p>
  `;
  
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: '📅 Appointment Rescheduled - Dhanvantari Ayurveda',
    html: createEmailTemplate(content, 'Appointment Rescheduled'),
  });
}

export async function sendAppointmentBookedEmail(opts: {
  to: string;
  name: string;
  consultationType: string;
  date: string; // ISO date string
  time: string;
}) {
  const transporter = createTransport();
  const from = process.env.EMAIL_FROM || `"Dhanvantari Ayurveda" <${process.env.EMAIL_USERNAME}>`;
  const prettyDate = new Date(opts.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const content = `
    <h2 style="color: #059669; margin-bottom: 20px;">Appointment Confirmed! 🎉</h2>
    
    <p>Hello <strong>${opts.name}</strong>,</p>
    
    <p>Thank you for choosing Dhanvantari Ayurveda! Your appointment has been successfully booked and confirmed.</p>
    
    <div class="info-box">
      <h3>Appointment Details</h3>
      <div class="info-row">
        <span class="info-label">Consultation Type:</span>
        <span class="info-value">${opts.consultationType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${prettyDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Time:</span>
        <span class="info-value">${opts.time}</span>
      </div>
    </div>
    
    <div style="background-color: #d1fae5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #065f46;">📋 What to Expect</h4>
      <ul style="margin: 0; padding-left: 20px; color: #065f46;">
        <li>Please arrive 10 minutes before your scheduled time</li>
        <li>Bring any relevant medical history or current medications</li>
        <li>Wear comfortable clothing for the consultation</li>
        <li>Our team will guide you through the process</li>
      </ul>
    </div>
    
    <p>We look forward to providing you with the best Ayurvedic care and helping you on your wellness journey.</p>
    
    <p style="margin-top: 30px;">
      <strong>Best regards,</strong><br>
      The Dhanvantari Ayurveda Team
    </p>
  `;
  
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: '✅ Appointment Confirmed - Dhanvantari Ayurveda',
    html: createEmailTemplate(content, 'Appointment Confirmed'),
  });
}


