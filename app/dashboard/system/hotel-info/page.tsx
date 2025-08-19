'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Share2, 
  Image as ImageIcon,
  Save,
  Upload,
  Eye,
  Trash2
} from 'lucide-react';
import Image from 'next/image';

type HotelInfo = {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  workingHours?: string;
  emergencyContact?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  headerLogo?: string;
  footerLogo?: string;
  favicon?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  gstNumber?: string;
  licenseNumber?: string;
  registrationNumber?: string;
  updatedAt: string;
};

export default function HotelInfoPage() {
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    loadHotelInfo();
  }, []);

  async function loadHotelInfo() {
    try {
      setLoading(true);
      const res = await fetch('/api/system/hotel-info');
      if (!res.ok) throw new Error('Failed to load hotel information');
      const data = await res.json();
      setHotelInfo(data.hotelInfo);
    } catch (e) {
      toast.error('Failed to load hotel information');
    } finally {
      setLoading(false);
    }
  }

  async function saveHotelInfo() {
    if (!hotelInfo) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/system/hotel-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelInfo),
      });
      if (!res.ok) throw new Error('Failed to save hotel information');
      toast.success('Hotel information saved successfully');
    } catch (e) {
      toast.error('Failed to save hotel information');
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(type: 'header' | 'footer' | 'favicon', file: File) {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const res = await fetch('/api/system/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload logo');
      const data = await res.json();
      
      // Update the correct property based on type
      if (type === 'favicon') {
        setHotelInfo(prev => prev ? { ...prev, favicon: data.url } : null);
      } else if (type === 'header') {
        setHotelInfo(prev => prev ? { ...prev, headerLogo: data.url } : null);
      } else if (type === 'footer') {
        setHotelInfo(prev => prev ? { ...prev, footerLogo: data.url } : null);
      }
      toast.success(`${type} logo uploaded successfully`);
    } catch (e) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(null);
    }
  }

  function handleLogoUpload(type: 'header' | 'footer' | 'favicon') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadLogo(type, file);
      }
    };
    input.click();
  }

  async function removeLogo(type: 'header' | 'footer' | 'favicon') {
    try {
      // Extract public ID from current logo URL if it's a Cloudinary URL
      let currentLogo: string | undefined;
      if (type === 'favicon') {
        currentLogo = hotelInfo?.favicon;
      } else if (type === 'header') {
        currentLogo = hotelInfo?.headerLogo;
      } else if (type === 'footer') {
        currentLogo = hotelInfo?.footerLogo;
      }
      
      if (currentLogo && currentLogo.includes('cloudinary.com')) {
        const urlParts = currentLogo.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        
        // Delete from Cloudinary
        const res = await fetch(`/api/system/upload-logo?publicId=${publicId}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          toast.error('Failed to delete logo from cloud storage');
          return;
        }
      }
      
      // Reset to default logo
      if (type === 'favicon') {
        setHotelInfo(prev => prev ? { ...prev, favicon: '/assets/logo/logo.png' } : null);
      } else if (type === 'header') {
        setHotelInfo(prev => prev ? { ...prev, headerLogo: '/assets/logo/logo.png' } : null);
      } else if (type === 'footer') {
        setHotelInfo(prev => prev ? { ...prev, footerLogo: '/assets/logo/logo.png' } : null);
      }
      toast.success(`${type} logo removed successfully`);
    } catch (e) {
      toast.error('Failed to remove logo');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hospital Information</h1>
          <p className="text-gray-600">Manage your clinic's information and branding</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hotelInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hospital Information</h1>
          <p className="text-gray-600">Manage your clinic's information and branding</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No hotel information found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hospital Information</h1>
          <p className="text-gray-600">Manage your clinic's information and branding</p>
        </div>
        <Button onClick={saveHotelInfo} disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-emerald-50 border border-emerald-200">
          <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-300">
            <Building2 className="w-4 h-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-300">
            <Phone className="w-4 h-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-300">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="logos" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-300">
            <ImageIcon className="w-4 h-4" />
            Logos
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-300">
            <Eye className="w-4 h-4" />
            SEO & Legal
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-emerald-50/30 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Building2 className="w-5 h-5 flex-shrink-0" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Clinic Name *</Label>
                  <Input
                    id="name"
                    value={hotelInfo.name}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, name: e.target.value })}
                    placeholder="Enter clinic name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={hotelInfo.tagline || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, tagline: e.target.value })}
                    placeholder="Enter tagline"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={hotelInfo.description || ''}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, description: e.target.value })}
                  placeholder="Enter clinic description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={hotelInfo.workingHours || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, workingHours: e.target.value })}
                    placeholder="e.g., Monday - Saturday: 9:00 AM - 7:00 PM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={hotelInfo.emergencyContact || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, emergencyContact: e.target.value })}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="bg-emerald-50/30 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Phone className="w-5 h-5 flex-shrink-0" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={hotelInfo.phone || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={hotelInfo.email || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={hotelInfo.website || ''}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, website: e.target.value })}
                  placeholder="Enter website URL"
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address Information
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={hotelInfo.address || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={hotelInfo.city || ''}
                      onChange={(e) => setHotelInfo({ ...hotelInfo, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={hotelInfo.state || ''}
                      onChange={(e) => setHotelInfo({ ...hotelInfo, state: e.target.value })}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={hotelInfo.pincode || ''}
                      onChange={(e) => setHotelInfo({ ...hotelInfo, pincode: e.target.value })}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={hotelInfo.landmark || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, landmark: e.target.value })}
                    placeholder="Enter landmark"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="bg-emerald-50/30 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Share2 className="w-5 h-5 flex-shrink-0" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={hotelInfo.facebook || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, facebook: e.target.value })}
                    placeholder="Facebook page URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={hotelInfo.instagram || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, instagram: e.target.value })}
                    placeholder="Instagram profile URL"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={hotelInfo.twitter || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, twitter: e.target.value })}
                    placeholder="Twitter profile URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={hotelInfo.youtube || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, youtube: e.target.value })}
                    placeholder="YouTube channel URL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logos Tab */}
        <TabsContent value="logos" className="space-y-6">
          <Card className="bg-emerald-50/30 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <ImageIcon className="w-5 h-5 flex-shrink-0" />
                Logo Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Logo */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-lg">Header Logo</h4>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={hotelInfo.headerLogo || '/assets/logo/logo.png'}
                      alt="Header Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLogoUpload('header')}
                      disabled={uploading === 'header'}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span>{uploading === 'header' ? 'Uploading...' : 'Upload'}</span>
                    </button>
                    <button
                      onClick={() => removeLogo('header')}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 flex-shrink-0" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Footer Logo */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-lg">Footer Logo</h4>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={hotelInfo.footerLogo || '/assets/logo/logo.png'}
                      alt="Footer Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLogoUpload('footer')}
                      disabled={uploading === 'footer'}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span>{uploading === 'footer' ? 'Uploading...' : 'Upload'}</span>
                    </button>
                    <button
                      onClick={() => removeLogo('footer')}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 flex-shrink-0" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Favicon */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-lg">Favicon</h4>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={hotelInfo.favicon || '/assets/logo/logo.png'}
                      alt="Favicon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLogoUpload('favicon')}
                      disabled={uploading === 'favicon'}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span>{uploading === 'favicon' ? 'Uploading...' : 'Upload'}</span>
                    </button>
                    <button
                      onClick={() => removeLogo('favicon')}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 h-9 rounded-md border bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 flex-shrink-0" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Supported formats: JPEG, PNG, WebP, SVG. Maximum file size: 5MB.
                  Recommended dimensions: Header/Footer logo - 200x80px, Favicon - 32x32px.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Legal Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="bg-emerald-50/30 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-800">
                <Eye className="w-5 h-5 flex-shrink-0" />
                SEO & Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SEO Information */}
              <div className="space-y-4">
                <h4 className="font-medium">SEO Information</h4>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={hotelInfo.metaTitle || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, metaTitle: e.target.value })}
                    placeholder="Enter meta title for SEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={hotelInfo.metaDescription || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, metaDescription: e.target.value })}
                    placeholder="Enter meta description for SEO"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={hotelInfo.metaKeywords || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, metaKeywords: e.target.value })}
                    placeholder="Enter meta keywords (comma separated)"
                  />
                </div>
              </div>

              <Separator />

              {/* Legal Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Legal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={hotelInfo.gstNumber || ''}
                      onChange={(e) => setHotelInfo({ ...hotelInfo, gstNumber: e.target.value })}
                      placeholder="Enter GST number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={hotelInfo.licenseNumber || ''}
                      onChange={(e) => setHotelInfo({ ...hotelInfo, licenseNumber: e.target.value })}
                      placeholder="Enter license number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={hotelInfo.registrationNumber || ''}
                    onChange={(e) => setHotelInfo({ ...hotelInfo, registrationNumber: e.target.value })}
                    placeholder="Enter registration number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Updated Info */}
      <Card className="bg-emerald-50/50 border-emerald-200">
        <CardContent className="pt-6">
          <p className="text-sm text-emerald-700">
            Last updated: {new Date(hotelInfo.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
