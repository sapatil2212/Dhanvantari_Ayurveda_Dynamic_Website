import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import { sendEnquiryConfirmationEmail, sendEnquiryNotificationToStaff } from '@/lib/email';

// GET - Fetch all enquiries with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (source) where.source = source;
    if (assignedTo) where.assignedTo = assignedTo;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
        { service: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Get enquiries with related data
    const [enquiries, total] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        include: {
          assignedUser: {
            select: { id: true, name: true, email: true }
          },
          assignedByUser: {
            select: { id: true, name: true, email: true }
          },
          patient: {
            select: { id: true, firstName: true, lastName: true, medicalRecordNumber: true }
          },
          appointment: {
            select: { id: true, name: true, preferredDate: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.enquiry.count({ where })
    ]);

    return NextResponse.json({
      items: enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// POST - Create new enquiry (from frontend contact form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, source = 'WEBSITE_CONTACT' } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
        source: source as any,
        ipAddress: ip,
        userAgent
      },
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Send confirmation email to user
    try {
      await sendEnquiryConfirmationEmail({
        name,
        email,
        phone,
        service,
        message,
        enquiryId: enquiry.id
      });
      console.log('Confirmation email sent to user:', email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to staff
    try {
      await sendEnquiryNotificationToStaff({
        name,
        email,
        phone,
        service,
        message,
        enquiryId: enquiry.id
      });
      console.log('Notification email sent to staff');
    } catch (staffEmailError) {
      console.error('Failed to send staff notification email:', staffEmailError);
      // Don't fail the request if email fails
    }

    // Create notification for staff (optional)
    try {
      await prisma.notification.create({
        data: {
          type: 'CREATED',
          priority: 'MEDIUM',
          title: 'New Enquiry Received',
          message: `New enquiry from ${name} (${email})`,
          userId: null // Will be assigned to appropriate staff
        }
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    return NextResponse.json(enquiry, { status: 201 });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}
