import { useState, useEffect } from 'react';

export type HospitalInfo = {
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
  linkedin?: string;
  pinterest?: string;
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

export function useHospitalInfo() {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHospitalInfo();
  }, []);

  const fetchHospitalInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/system/hospital-info');
      if (!res.ok) throw new Error('Failed to fetch hospital information');
      const data = await res.json();
      setHospitalInfo(data.hospitalInfo);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch hospital information');
    } finally {
      setLoading(false);
    }
  };

  const updateHospitalInfo = async (updatedInfo: Partial<HospitalInfo>) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/system/hospital-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });
      if (!res.ok) throw new Error('Failed to update hospital information');
      const data = await res.json();
      setHospitalInfo(data.hospitalInfo);
      return data.hospitalInfo;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update hospital information');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    hospitalInfo,
    loading,
    error,
    refetch: fetchHospitalInfo,
    update: updateHospitalInfo,
  };
}
