'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Pill, 
  User, 
  Calendar, 
  Download, 
  Printer, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

type SharedPrescriptionData = {
  sharedPrescription: {
    id: string;
    shareCode: string;
    accessCode?: string;
    expiresAt?: string;
    maxViews?: number;
    currentViews: number;
    allowDownload: boolean;
    allowPrint: boolean;
    shareType: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
    createdAt: string;
    prescription: {
      id: string;
      number: string;
      date: string;
      diagnosis?: string;
      notes?: string;
      advice?: string;
      followUpDate?: string;
      prescriberName: string;
      prescriberRegNo?: string;
      patient: {
        id: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        dateOfBirth?: string;
        gender?: string;
        medicalRecordNumber: string;
      };
      createdBy: {
        id: string;
        name: string;
        email: string;
        specialization?: string;
        licenseNumber?: string;
      };
      items: Array<{
        id: string;
        medicineName: string;
        strength?: string;
        dosage?: string;
        frequency?: string;
        route?: string;
        durationDays?: number;
        instructions?: string;
        quantity?: number;
        unit?: string;
      }>;
    };
  };
  allowDownload: boolean;
  allowPrint: boolean;
};

export default function SharedPrescriptionPage({ 
  params 
}: { 
  params: { shareCode: string } 
}) {
  const [data, setData] = useState<SharedPrescriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [showAccessForm, setShowAccessForm] = useState(false);

  useEffect(() => {
    fetchSharedPrescription();
  }, []);

  const fetchSharedPrescription = async (code?: string) => {
    try {
      setLoading(true);
      setError(null);
      
             const url = code 
         ? `/api/shared-prescriptions/view/${params.shareCode}?accessCode=${code}`
         : `/api/shared-prescriptions/view/${params.shareCode}`;
      
      const response = await fetch(url);
      
      if (response.status === 403) {
        setShowAccessForm(true);
        setError('This prescription requires an access code');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load prescription');
        return;
      }

      const prescriptionData = await response.json();
      setData(prescriptionData);
    } catch (error) {
      setError('Failed to load prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSharedPrescription(accessCode);
  };

  const handleDownload = () => {
    if (!data) return;
    
    // Create a printable version and trigger download
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${data.sharedPrescription.prescription.number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .patient-info { margin-bottom: 20px; }
              .prescription-info { margin-bottom: 20px; }
              .medicines { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .footer { margin-top: 30px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Medical Prescription</h1>
              <p>Prescription #${data.sharedPrescription.prescription.number}</p>
            </div>
            
            <div class="patient-info">
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> ${data.sharedPrescription.prescription.patient.firstName} ${data.sharedPrescription.prescription.patient.lastName}</p>
              <p><strong>MR#:</strong> ${data.sharedPrescription.prescription.patient.medicalRecordNumber}</p>
              <p><strong>Date:</strong> ${formatDate(data.sharedPrescription.prescription.date)}</p>
            </div>
            
            <div class="prescription-info">
              <h3>Prescription Details</h3>
              ${data.sharedPrescription.prescription.diagnosis ? `<p><strong>Diagnosis:</strong> ${data.sharedPrescription.prescription.diagnosis}</p>` : ''}
              ${data.sharedPrescription.prescription.notes ? `<p><strong>Notes:</strong> ${data.sharedPrescription.prescription.notes}</p>` : ''}
            </div>
            
            <div class="medicines">
              <h3>Medications</h3>
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Strength</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.sharedPrescription.prescription.items.map(item => `
                    <tr>
                      <td>${item.medicineName}</td>
                      <td>${item.strength || '-'}</td>
                      <td>${item.dosage || '-'}</td>
                      <td>${item.frequency || '-'}</td>
                      <td>${item.durationDays ? `${item.durationDays} days` : '-'}</td>
                      <td>${item.instructions || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <p><strong>Prescribed by:</strong> ${data.sharedPrescription.prescription.prescriberName}</p>
              ${data.sharedPrescription.prescription.prescriberRegNo ? `<p><strong>Registration:</strong> ${data.sharedPrescription.prescription.prescriberRegNo}</p>` : ''}
              <p><strong>Date:</strong> ${formatDate(data.sharedPrescription.prescription.date)}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              
              {showAccessForm && (
                <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Access Code</label>
                    <Input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter access code"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Access Prescription
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-lg">Prescription not found</p>
        </div>
      </div>
    );
  }

  const { sharedPrescription } = data;
  const { prescription } = sharedPrescription;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Prescription</h1>
          <p className="text-gray-600">Prescription #{prescription.number}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Name</label>
                  <p className="text-lg font-semibold">
                    {prescription.patient.firstName} {prescription.patient.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Medical Record #</label>
                  <p className="text-lg">{prescription.patient.medicalRecordNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-lg">
                    {prescription.patient.dateOfBirth 
                      ? formatDate(prescription.patient.dateOfBirth)
                      : 'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-lg">{prescription.patient.gender || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Prescription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prescription Date</label>
                  <p className="text-lg">{formatDate(prescription.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prescribed By</label>
                  <p className="text-lg">{prescription.prescriberName}</p>
                </div>
              </div>
              
              {prescription.diagnosis && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500">Diagnosis</label>
                  <p className="text-lg">{prescription.diagnosis}</p>
                </div>
              )}
              
              {prescription.notes && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-lg">{prescription.notes}</p>
                </div>
              )}
              
              {prescription.advice && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Advice</label>
                  <p className="text-lg">{prescription.advice}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.medicineName}</TableCell>
                      <TableCell>{item.strength || '-'}</TableCell>
                      <TableCell>{item.dosage || '-'}</TableCell>
                      <TableCell>{item.frequency || '-'}</TableCell>
                      <TableCell>
                        {item.durationDays ? `${item.durationDays} days` : '-'}
                      </TableCell>
                      <TableCell>{item.instructions || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-500">Prescribed by</p>
                  <p className="font-semibold">{prescription.prescriberName}</p>
                  {prescription.prescriberRegNo && (
                    <p className="text-sm text-gray-500">Reg: {prescription.prescriberRegNo}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {data.allowDownload && (
                    <Button onClick={handleDownload} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {data.allowPrint && (
                    <Button onClick={handlePrint} variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
