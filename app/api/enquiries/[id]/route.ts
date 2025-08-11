import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';

// GET - Fetch single enquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
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
      }
    });

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json(enquiry);

  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiry' },
      { status: 500 }
    );
  }
}

// PATCH - Update enquiry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      status,
      priority,
      assignedTo,
      notes,
      followUpDate,
      convertedToPatient,
      convertedToAppointment
    } = body;

    // Get current user ID
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update enquiry
    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo && { 
          assignedTo,
          assignedBy: currentUser.id
        }),
        ...(notes && { notes }),
        ...(followUpDate && { followUpDate: new Date(followUpDate) }),
        ...(convertedToPatient && { convertedToPatient }),
        ...(convertedToAppointment && { convertedToAppointment })
      },
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
      }
    });

    // Create notification if assigned to someone
    if (assignedTo && assignedTo !== currentUser.id) {
      try {
        await prisma.notification.create({
          data: {
            type: 'CREATED',
            priority: 'MEDIUM',
            title: 'Enquiry Assigned',
            message: `Enquiry from ${updatedEnquiry.name} has been assigned to you`,
            userId: assignedTo
          }
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }
    }

    return NextResponse.json(updatedEnquiry);

  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete enquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.enquiry.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Enquiry deleted successfully' });

  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
