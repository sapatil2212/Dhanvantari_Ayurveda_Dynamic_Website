import { useState, useEffect } from 'react';

export type HotelInfo = {
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

export function useHotelInfo() {
  const [hotelInfo, setHotelInfo] = useState<HotelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotelInfo();
  }, []);

  const fetchHotelInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/system/hotel-info');
      if (!res.ok) throw new Error('Failed to fetch hotel information');
      const data = await res.json();
      setHotelInfo(data.hotelInfo);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch hotel information');
    } finally {
      setLoading(false);
    }
  };

  const updateHotelInfo = async (updatedInfo: Partial<HotelInfo>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/system/hotel-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });
      if (!res.ok) throw new Error('Failed to update hotel information');
      const data = await res.json();
      setHotelInfo(data.hotelInfo);
      return data.hotelInfo;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update hotel information');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    hotelInfo,
    loading,
    error,
    refetch: fetchHotelInfo,
    update: updateHotelInfo,
  };
}
