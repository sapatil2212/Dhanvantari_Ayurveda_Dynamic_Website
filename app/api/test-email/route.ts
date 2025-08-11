import { NextRequest, NextResponse } from 'next/server';
import { sendEnquiryConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Test email data
    const testData = {
      name,
      email,
      phone: '+91 1234567890',
      service: 'Test Service',
      message: 'This is a test enquiry to verify email functionality.',
      enquiryId: 'TEST-' + Date.now()
    };

    // Send test email
    const result = await sendEnquiryConfirmationEmail(testData);

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email credentials not configured. Please check EMAIL_CONFIG.md for setup instructions.'
      });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error },
      { status: 500 }
    );
  }
}
