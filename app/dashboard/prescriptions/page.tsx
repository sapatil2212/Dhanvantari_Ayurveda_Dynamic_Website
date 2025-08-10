'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, User, Calendar, Stethoscope } from 'lucide-react';

type Prescription = {
  id: string;
  number: string;
  patient?: { firstName: string; lastName: string };
  date: string;
  prescriberName?: string;
  diagnosis: string | null;
  items: Array<{ medicineName: string; strength: string | null; dosage: string | null }>;
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    (prescription.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (prescription.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    prescription.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prescription.prescriberName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-2">Manage and create patient prescriptions</p>
        </div>
        <Link href="/dashboard/prescriptions/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Prescription
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search prescriptions by patient name, prescription number, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No prescriptions found matching your search.' : 'No prescriptions found.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="font-mono">
                            {prescription.number}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(prescription.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {prescription.patient?.firstName} {prescription.patient?.lastName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              {prescription.prescriberName ? `Dr. ${prescription.prescriberName}` : 'No prescriber'}
                            </span>
                          </div>
                        </div>

                        {prescription.diagnosis && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Diagnosis: </span>
                            <span className="text-sm font-medium">{prescription.diagnosis}</span>
                          </div>
                        )}

                        <div className="mt-3">
                          <span className="text-sm text-gray-600">Medicines: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prescription.items.slice(0, 3).map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item.medicineName}
                                {item.strength && ` ${item.strength}`}
                                {item.dosage && ` (${item.dosage})`}
                              </Badge>
                            ))}
                            {prescription.items.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{prescription.items.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/prescriptions/${prescription.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
