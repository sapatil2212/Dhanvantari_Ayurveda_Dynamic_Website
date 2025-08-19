import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { Permission, Role, checkPermission } from '@/lib/permissions';

export async function GET() {
  try {
    // For GET requests, we allow public access to hotel info
    let hotelInfo = await prisma.hotelInfo.findFirst();
    
    if (!hotelInfo) {
      // Create default hotel info if none exists
      hotelInfo = await prisma.hotelInfo.create({
        data: {
          name: "Dhanvantari Ayurvedic Clinic",
          tagline: "Authentic Ayurvedic Healing",
          description: "Traditional Panchkarma treatments and personalized wellness solutions",
          phone: "+91 99211 18724",
          email: "dhanvantariayurvedansk@gmail.com",
          website: "https://dhanvantariayurveda.com",
          address: "Dhanvantari Ayurveda Building",
          city: "Ojhar",
          state: "Maharashtra",
          pincode: "422206",
          landmark: "Saikheda Phata, near Khanderao mandir",
          workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM",
          headerLogo: "/assets/logo/logo.png",
          footerLogo: "/assets/logo/logo.png",
          favicon: "/assets/logo/logo.png"
        }
      });
    }
    
    return NextResponse.json({ hotelInfo });
  } catch (e) {
    console.error('GET /api/system/hotel-info error', e);
    return NextResponse.json({ error: 'Failed to fetch hotel information' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRole = (session.user as any).role as Role | undefined;
    const userId = (session.user as any).id as string | undefined;
    const email = session.user?.email as string | undefined;

    let role: Role | undefined = sessionRole;
    if (!role) {
      if (userId) {
        role = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role as Role | undefined;
      } else if (email) {
        role = (await prisma.user.findUnique({ where: { email }, select: { role: true } }))?.role as Role | undefined;
      }
    }
    if (!role) return NextResponse.json({ error: 'Insufficient permissions or stale session' }, { status: 403 });
    if (!checkPermission(role, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      tagline,
      description,
      phone,
      email: hotelEmail,
      website,
      address,
      city,
      state,
      pincode,
      landmark,
      workingHours,
      emergencyContact,
      facebook,
      instagram,
      twitter,
      youtube,
      linkedin,
      pinterest,
      headerLogo,
      footerLogo,
      favicon,
      metaTitle,
      metaDescription,
      metaKeywords,
      gstNumber,
      licenseNumber,
      registrationNumber
    } = body;

    let hotelInfo = await prisma.hotelInfo.findFirst();
    
    if (hotelInfo) {
      // Update existing hotel info
      hotelInfo = await prisma.hotelInfo.update({
        where: { id: hotelInfo.id },
        data: {
          name: name ?? hotelInfo.name,
          tagline: tagline ?? hotelInfo.tagline,
          description: description ?? hotelInfo.description,
                     phone: phone ?? hotelInfo.phone,
           email: hotelEmail ?? hotelInfo.email,
          website: website ?? hotelInfo.website,
          address: address ?? hotelInfo.address,
          city: city ?? hotelInfo.city,
          state: state ?? hotelInfo.state,
          pincode: pincode ?? hotelInfo.pincode,
          landmark: landmark ?? hotelInfo.landmark,
          workingHours: workingHours ?? hotelInfo.workingHours,
          emergencyContact: emergencyContact ?? hotelInfo.emergencyContact,
          facebook: facebook ?? hotelInfo.facebook,
          instagram: instagram ?? hotelInfo.instagram,
          twitter: twitter ?? hotelInfo.twitter,
          youtube: youtube ?? hotelInfo.youtube,
          linkedin: linkedin ?? hotelInfo.linkedin,
          pinterest: pinterest ?? hotelInfo.pinterest,
          headerLogo: headerLogo ?? hotelInfo.headerLogo,
          footerLogo: footerLogo ?? hotelInfo.footerLogo,
          favicon: favicon ?? hotelInfo.favicon,
          metaTitle: metaTitle ?? hotelInfo.metaTitle,
          metaDescription: metaDescription ?? hotelInfo.metaDescription,
          metaKeywords: metaKeywords ?? hotelInfo.metaKeywords,
          gstNumber: gstNumber ?? hotelInfo.gstNumber,
          licenseNumber: licenseNumber ?? hotelInfo.licenseNumber,
          registrationNumber: registrationNumber ?? hotelInfo.registrationNumber,
          updatedById: (session.user as any).id,
        }
      });
    } else {
      // Create new hotel info
      hotelInfo = await prisma.hotelInfo.create({
        data: {
          name: name ?? "Dhanvantari Ayurvedic Clinic",
          tagline: tagline ?? "Authentic Ayurvedic Healing",
          description: description ?? "Traditional Panchkarma treatments and personalized wellness solutions",
                     phone: phone ?? "+91 99211 18724",
           email: hotelEmail ?? "dhanvantariayurvedansk@gmail.com",
          website: website ?? "https://dhanvantariayurveda.com",
          address: address ?? "Dhanvantari Ayurveda Building",
          city: city ?? "Ojhar",
          state: state ?? "Maharashtra",
          pincode: pincode ?? "422206",
          landmark: landmark ?? "Saikheda Phata, near Khanderao mandir",
          workingHours: workingHours ?? "Monday - Saturday: 9:00 AM - 7:00 PM",
          emergencyContact,
          facebook,
          instagram,
          twitter,
          youtube,
          linkedin,
          pinterest,
          headerLogo: headerLogo ?? "/assets/logo/logo.png",
          footerLogo: footerLogo ?? "/assets/logo/logo.png",
          favicon: favicon ?? "/assets/logo/logo.png",
          metaTitle,
          metaDescription,
          metaKeywords,
          gstNumber,
          licenseNumber,
          registrationNumber,
          updatedById: (session.user as any).id,
        }
      });
    }

    return NextResponse.json({ hotelInfo });
  } catch (e) {
    console.error('PUT /api/system/hotel-info error', e);
    return NextResponse.json({ error: 'Failed to update hotel information' }, { status: 500 });
  }
}
