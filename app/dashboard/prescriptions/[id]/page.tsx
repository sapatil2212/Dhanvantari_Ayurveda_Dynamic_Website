'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Edit, Printer, Share, ArrowLeft, User, Stethoscope, Calendar, Pill, Download, FileDown } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToWord, printPrescription, type PrescriptionData } from '@/lib/prescription-export';

type PrescriptionItem = {
  id: string;
  medicineName: string;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  route: string | null;
  durationDays: number | null;
  instructions: string | null;
};

type Prescription = {
  id: string;
  number: string;
  shareCode: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  date: string;
  diagnosis: string | null;
  notes: string | null;
  advice: string | null;
  followUpDate: string | null;
  prescriberName: string;
  prescriberRegNo: string | null;
  items: PrescriptionItem[];
};

export default function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPrescription();
    }
  }, [id]);

  const fetchPrescription = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPrescription(data);
      } else {
        console.error('Failed to fetch prescription');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (prescription) {
      const prescriptionData: PrescriptionData = {
        id: prescription.id,
        number: prescription.number,
        date: prescription.date,
        patient: {
          firstName: prescription.patient.firstName,
          lastName: prescription.patient.lastName,
          email: prescription.patient.email,
          phone: prescription.patient.phone,
        },
        prescriberName: prescription.prescriberName,
        prescriberRegNo: prescription.prescriberRegNo || undefined,
        diagnosis: prescription.diagnosis || undefined,
        advice: prescription.advice || undefined,
        followUpDate: prescription.followUpDate || undefined,
        items: prescription.items.map(item => ({
          medicineName: item.medicineName,
          strength: item.strength || undefined,
          dosage: item.dosage || undefined,
          frequency: item.frequency || undefined,
          route: item.route || undefined,
          durationDays: item.durationDays || undefined,
          instructions: item.instructions || undefined,
        })),
      };
      printPrescription(prescriptionData);
    }
  };

  const handleExportPDF = () => {
    if (prescription) {
      const prescriptionData: PrescriptionData = {
        id: prescription.id,
        number: prescription.number,
        date: prescription.date,
        patient: {
          firstName: prescription.patient.firstName,
          lastName: prescription.patient.lastName,
          email: prescription.patient.email,
          phone: prescription.patient.phone,
        },
        prescriberName: prescription.prescriberName,
        prescriberRegNo: prescription.prescriberRegNo || undefined,
        diagnosis: prescription.diagnosis || undefined,
        advice: prescription.advice || undefined,
        followUpDate: prescription.followUpDate || undefined,
        items: prescription.items.map(item => ({
          medicineName: item.medicineName,
          strength: item.strength || undefined,
          dosage: item.dosage || undefined,
          frequency: item.frequency || undefined,
          route: item.route || undefined,
          durationDays: item.durationDays || undefined,
          instructions: item.instructions || undefined,
        })),
      };
      exportToPDF(prescriptionData);
    }
  };

  const handleExportWord = () => {
    if (prescription) {
      const prescriptionData: PrescriptionData = {
        id: prescription.id,
        number: prescription.number,
        date: prescription.date,
        patient: {
          firstName: prescription.patient.firstName,
          lastName: prescription.patient.lastName,
          email: prescription.patient.email,
          phone: prescription.patient.phone,
        },
        prescriberName: prescription.prescriberName,
        prescriberRegNo: prescription.prescriberRegNo || undefined,
        diagnosis: prescription.diagnosis || undefined,
        advice: prescription.advice || undefined,
        followUpDate: prescription.followUpDate || undefined,
        items: prescription.items.map(item => ({
          medicineName: item.medicineName,
          strength: item.strength || undefined,
          dosage: item.dosage || undefined,
          frequency: item.frequency || undefined,
          route: item.route || undefined,
          durationDays: item.durationDays || undefined,
          instructions: item.instructions || undefined,
        })),
      };
      exportToWord(prescriptionData);
    }
  };

  const handleExportCSV = () => {
    if (prescription) {
      const prescriptionData: PrescriptionData = {
        id: prescription.id,
        number: prescription.number,
        date: prescription.date,
        patient: {
          firstName: prescription.patient.firstName,
          lastName: prescription.patient.lastName,
          email: prescription.patient.email,
          phone: prescription.patient.phone,
        },
        prescriberName: prescription.prescriberName,
        prescriberRegNo: prescription.prescriberRegNo || undefined,
        diagnosis: prescription.diagnosis || undefined,
        advice: prescription.advice || undefined,
        followUpDate: prescription.followUpDate || undefined,
        items: prescription.items.map(item => ({
          medicineName: item.medicineName,
          strength: item.strength || undefined,
          dosage: item.dosage || undefined,
          frequency: item.frequency || undefined,
          route: item.route || undefined,
          durationDays: item.durationDays || undefined,
          instructions: item.instructions || undefined,
        })),
      };
      exportToCSV(prescriptionData);
    }
  };

  const handleShare = async () => {
    if (prescription) {
      const shareUrl = `${window.location.origin}/prescriptions/${prescription.shareCode}`;
      try {
        await navigator.share({
          title: `Prescription ${prescription.number}`,
          text: `Prescription for ${prescription.patient.firstName} ${prescription.patient.lastName}`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading prescription...</div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Prescription not found</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescription {prescription.number}</h1>
            <p className="text-gray-600 mt-2">
              {prescription.patient.firstName} {prescription.patient.lastName}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportWord} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Word
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => router.push(`/dashboard/prescriptions/${id}/edit`)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Prescription Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Doctor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prescription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Patient</p>
                    <p className="font-medium">
                      {prescription.patient.firstName} {prescription.patient.lastName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Prescriber</p>
                    <p className="font-medium">Dr. {prescription.prescriberName}</p>
                    {prescription.prescriberRegNo && (
                      <p className="text-xs text-gray-500">Reg: {prescription.prescriberRegNo}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(prescription.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {prescription.followUpDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Follow-up</p>
                      <p className="font-medium">
                        {new Date(prescription.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {prescription.diagnosis && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
                  <p className="font-medium">{prescription.diagnosis}</p>
                </div>
              )}

              {prescription.advice && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Advice</p>
                  <p className="font-medium">{prescription.advice}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-sm">
                        Medicine {index + 1}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Medicine Name</p>
                        <p className="font-medium text-lg">{item.medicineName}</p>
                      </div>
                      
                      {item.strength && (
                        <div>
                          <p className="text-sm text-gray-600">Strength</p>
                          <p className="font-medium">{item.strength}</p>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {item.dosage && (
                        <div>
                          <p className="text-sm text-gray-600">Dosage</p>
                          <p className="font-medium">{item.dosage}</p>
                        </div>
                      )}
                      
                      {item.frequency && (
                        <div>
                          <p className="text-sm text-gray-600">Frequency</p>
                          <p className="font-medium">{item.frequency}</p>
                        </div>
                      )}
                      
                      {item.route && (
                        <div>
                          <p className="text-sm text-gray-600">Route</p>
                          <p className="font-medium">{item.route}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      {item.durationDays && (
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{item.durationDays} days</p>
                        </div>
                      )}
                      
                      {item.instructions && (
                        <div>
                          <p className="text-sm text-gray-600">Instructions</p>
                          <p className="font-medium">{item.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prescription Info */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Number</p>
                <p className="font-mono font-medium">{prescription.number}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Share Code</p>
                <p className="font-mono font-medium">{prescription.shareCode}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="font-medium">{prescription.items.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Patient Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{prescription.patient.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{prescription.patient.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/patients/${prescription.patient.id}`)}
                className="w-full justify-start"
              >
                View Patient Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/appointments/new?patientId=${prescription.patient.id}`)}
                className="w-full justify-start"
              >
                Book Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


