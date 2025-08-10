'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Import the email template function (you'll need to export it from lib/email.ts)
// For now, I'll create a simplified version for preview

const createEmailPreview = (type: string, data: any) => {
  const currentYear = new Date().getFullYear();
  const domain = 'dhanvantari-ayurveda.com';
  
  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Preview - Dhanvantari Ayurveda</title>
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
        .info-box { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-box h3 { margin: 0 0 15px 0; color: #059669; font-size: 18px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .info-label { font-weight: 600; color: #495057; }
        .info-value { color: #6c757d; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; text-decoration: none; }
        .domain-info { color: #6c757d; font-size: 11px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">🌿 Dhanvantari</a>
          <p class="subtitle">Traditional Ayurvedic Healthcare</p>
        </div>
        
        <div class="content">
          ${data.content}
          
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

  return baseTemplate;
};

export function EmailPreview() {
  const [emailType, setEmailType] = useState('verification');
  const [previewData, setPreviewData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    consultationType: 'Ayurvedic Consultation',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'CONFIRMED',
  });

  const generatePreview = () => {
    let content = '';
    
    switch (emailType) {
      case 'verification':
        content = `
          <h2 style="color: #059669; margin-bottom: 20px;">Welcome to Dhanvantari Ayurveda! 🌿</h2>
          
          <p>Thank you for registering with us. To complete your account setup and access our healthcare platform, please verify your email address.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button" style="text-decoration: none;">
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
        `;
        break;
        
      case 'password-reset':
        content = `
          <h2 style="color: #059669; margin-bottom: 20px;">Password Reset Request 🔑</h2>
          
          <p>We received a request to reset your password for your Dhanvantari Ayurveda account. If this was you, please click the button below to create a new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button" style="text-decoration: none;">
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
        `;
        break;
        
      case 'appointment-confirmed':
        content = `
          <h2 style="color: #059669; margin-bottom: 20px;">Appointment Confirmed! 🎉</h2>
          
          <p>Hello <strong>${previewData.name}</strong>,</p>
          
          <p>Thank you for choosing Dhanvantari Ayurveda! Your appointment has been successfully booked and confirmed.</p>
          
          <div class="info-box">
            <h3>Appointment Details</h3>
            <div class="info-row">
              <span class="info-label">Consultation Type:</span>
              <span class="info-value">${previewData.consultationType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date(previewData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time:</span>
              <span class="info-value">${previewData.time}</span>
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
        break;
        
      case 'appointment-status':
        const statusConfig = {
          CONFIRMED: { color: '#059669', bg: '#d1fae5', text: 'Confirmed', icon: '✅' },
          PENDING: { color: '#d97706', bg: '#fef3c7', text: 'Pending', icon: '⏳' },
          CANCELLED: { color: '#dc2626', bg: '#fee2e2', text: 'Cancelled', icon: '❌' }
        };
        const status = statusConfig[previewData.status as keyof typeof statusConfig];
        
        content = `
          <h2 style="color: #059669; margin-bottom: 20px;">Appointment Update 📅</h2>
          
          <p>Hello <strong>${previewData.name}</strong>,</p>
          
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
              <span class="info-value">${previewData.consultationType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date(previewData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time:</span>
              <span class="info-value">${previewData.time}</span>
            </div>
          </div>
          
          <p>If you have any questions or need to make changes, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px;">
            <strong>Best regards,</strong><br>
            The Dhanvantari Ayurveda Team
          </p>
        `;
        break;
    }

    const html = createEmailPreview(emailType, { content });
    return html;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email-type">Email Type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verification">Email Verification</SelectItem>
                  <SelectItem value="password-reset">Password Reset</SelectItem>
                  <SelectItem value="appointment-confirmed">Appointment Confirmed</SelectItem>
                  <SelectItem value="appointment-status">Appointment Status Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status (for appointment emails)</Label>
              <Select value={previewData.status} onValueChange={(value) => setPreviewData({ ...previewData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                value={previewData.name}
                onChange={(e) => setPreviewData({ ...previewData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                value={previewData.email}
                onChange={(e) => setPreviewData({ ...previewData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="consultation">Consultation Type</Label>
              <Input
                value={previewData.consultationType}
                onChange={(e) => setPreviewData({ ...previewData, consultationType: e.target.value })}
                placeholder="Ayurvedic Consultation"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={previewData.date}
                onChange={(e) => setPreviewData({ ...previewData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                value={previewData.time}
                onChange={(e) => setPreviewData({ ...previewData, time: e.target.value })}
                placeholder="10:00 AM"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={generatePreview()}
              className="w-full h-[600px] border-0"
              title="Email Preview"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
