# Hotel Information Management System

## Overview

The Hotel Information Management System allows administrators to manage all clinic information, contact details, logos, and branding from the backend dashboard. This system provides a comprehensive interface for updating clinic information that appears throughout the website.

## Features

### 🏥 Basic Information Management
- **Clinic Name**: Update the clinic's official name
- **Tagline**: Set a catchy tagline for the clinic
- **Description**: Provide a detailed description of services
- **Working Hours**: Configure business hours
- **Emergency Contact**: Set emergency contact number

### 📞 Contact Information
- **Phone Number**: Primary contact number
- **Email Address**: Official email address
- **Website**: Clinic website URL
- **Address**: Complete address information
  - Street address
  - City, State, Pincode
  - Landmark for easy location

### 🌐 Social Media Integration
- **Facebook**: Facebook page URL
- **Instagram**: Instagram profile URL
- **Twitter**: Twitter profile URL
- **YouTube**: YouTube channel URL

### 🖼️ Logo Management
- **Header Logo**: Logo displayed in website header
- **Footer Logo**: Logo displayed in website footer
- **Favicon**: Browser tab icon
- **File Upload Support**: Upload new logos with validation
- **Format Support**: JPEG, PNG, WebP, SVG
- **Size Limits**: Maximum 5MB per file

### 🔍 SEO & Legal Information
- **Meta Title**: SEO-optimized page title
- **Meta Description**: SEO description for search engines
- **Meta Keywords**: SEO keywords
- **GST Number**: Business GST registration
- **License Number**: Medical license number
- **Registration Number**: Business registration

## Database Schema

### HotelInfo Model
```prisma
model HotelInfo {
  id          String   @id @default(cuid())
  name        String   @default("Dhanvantari Ayurvedic Clinic")
  tagline     String?
  description String?
  
  // Contact Information
  phone       String?
  email       String?
  website     String?
  
  // Address
  address     String?
  city        String?
  state       String?
  pincode     String?
  landmark    String?
  
  // Business Hours
  workingHours String?
  emergencyContact String?
  
  // Social Media
  facebook    String?
  instagram   String?
  twitter     String?
  youtube     String?
  
  // Logos
  headerLogo  String?
  footerLogo  String?
  favicon     String?
  
  // SEO & Meta
  metaTitle   String?
  metaDescription String?
  metaKeywords String?
  
  // Additional Info
  gstNumber   String?
  licenseNumber String?
  registrationNumber String?
  
  updatedById String?
  updatedBy   User?    @relation("UpdatedHotelInfo", fields: [updatedById], references: [id])
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())
}
```

## API Endpoints

### GET /api/system/hotel-info
- **Purpose**: Fetch hotel information
- **Access**: Public (no authentication required)
- **Response**: Hotel information object

### PUT /api/system/hotel-info
- **Purpose**: Update hotel information
- **Access**: Authenticated users with MANAGE_SETTINGS permission
- **Request Body**: Hotel information object
- **Response**: Updated hotel information

### POST /api/system/upload-logo
- **Purpose**: Upload logo images
- **Access**: Authenticated users with MANAGE_SETTINGS permission
- **Request**: FormData with file and type
- **Response**: Upload success with file URL

## Frontend Integration

### Dashboard Interface
- **Location**: `/dashboard/system/hotel-info`
- **Features**: 
  - Tabbed interface for different sections
  - Real-time preview of changes
  - File upload for logos
  - Form validation
  - Auto-save functionality

### Website Integration
The hotel information is automatically used throughout the website:

#### Navigation Component
- Header logo
- Clinic name
- Phone number in header

#### Footer Component
- Footer logo
- Contact information
- Address details
- Social media links
- Working hours
- Copyright notice

#### Dynamic Content
- All contact information is pulled from the database
- Logos are dynamically loaded
- Social media links are conditionally displayed

## Usage Instructions

### Accessing Hotel Information Management
1. Login to the dashboard as an administrator
2. Navigate to **System** → **Settings**
3. Click on **Hotel Information** card
4. Or directly visit `/dashboard/system/hotel-info`

### Updating Information
1. **Basic Info Tab**: Update clinic name, tagline, description, and working hours
2. **Contact Tab**: Update phone, email, website, and address information
3. **Social Media Tab**: Add or update social media profile URLs
4. **Logos Tab**: Upload new logos for header, footer, and favicon
5. **SEO & Legal Tab**: Update SEO information and legal details

### Logo Upload Guidelines
- **Supported Formats**: JPEG, PNG, WebP, SVG
- **Maximum Size**: 5MB per file
- **Recommended Dimensions**:
  - Header/Footer Logo: 200x80px
  - Favicon: 32x32px
- **Quality**: Use high-quality images for best results

### Saving Changes
- Click **Save Changes** button to persist all modifications
- Changes are immediately reflected on the website
- A success message confirms the save operation

## Security Features

### Permission Control
- Only users with `MANAGE_SETTINGS` permission can modify hotel information
- Public read access for website display
- Secure file upload with validation

### File Upload Security
- File type validation
- File size limits
- Secure file storage in `/public/uploads/logos/`
- Unique filename generation to prevent conflicts

### Data Validation
- Input validation on all fields
- Email format validation
- URL format validation for social media links
- Required field validation

## Technical Implementation

### Custom Hook: useHotelInfo
```typescript
export function useHotelInfo() {
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hotel information
  const fetchHotelInfo = async () => { ... };
  
  // Update hotel information
  const updateHotelInfo = async (updatedInfo: Partial<HotelInfo>) => { ... };

  return {
    hotelInfo,
    loading,
    error,
    refetch: fetchHotelInfo,
    update: updateHotelInfo,
  };
}
```

### Database Migration
The system includes a migration to create the HotelInfo table:
```bash
npx prisma migrate dev --name add_hotel_info
```

### Seed Data
Default hotel information is seeded using:
```bash
node scripts/seed-hotel-info.js
```

## Benefits

### For Administrators
- **Centralized Management**: All clinic information in one place
- **Real-time Updates**: Changes reflect immediately on the website
- **User-friendly Interface**: Intuitive tabbed interface
- **No Technical Knowledge Required**: Easy to use for non-technical staff

### For Website Visitors
- **Consistent Information**: All contact details are always up-to-date
- **Professional Appearance**: Proper branding and logos
- **Easy Contact**: Accurate contact information and social media links
- **SEO Optimized**: Better search engine visibility

### For Developers
- **Maintainable Code**: Centralized data management
- **Type Safety**: Full TypeScript support
- **API-First Design**: Reusable API endpoints
- **Scalable Architecture**: Easy to extend with new fields

## Future Enhancements

### Planned Features
- **Multi-language Support**: Support for multiple languages
- **Logo Cropping**: Built-in image cropping tool
- **Backup & Restore**: Backup and restore hotel information
- **Version History**: Track changes over time
- **Bulk Import**: Import data from CSV/Excel files

### Integration Possibilities
- **Google My Business**: Sync with Google My Business
- **Social Media APIs**: Direct integration with social platforms
- **Analytics**: Track which information is most viewed
- **Notifications**: Alert when information is updated

## Troubleshooting

### Common Issues

#### Logo Not Displaying
- Check file path in database
- Verify file exists in `/public/uploads/logos/`
- Check file permissions

#### Changes Not Saving
- Verify user has MANAGE_SETTINGS permission
- Check browser console for errors
- Ensure all required fields are filled

#### Upload Failing
- Check file size (max 5MB)
- Verify file format (JPEG, PNG, WebP, SVG)
- Check server disk space

### Support
For technical support or questions about the Hotel Information Management System, please contact the development team or refer to the system documentation.
