'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VoiceAssistant, { VoiceInputButton } from '@/components/ui/VoiceAssistant';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2, Plus, X, Mic } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface PrescriptionItem {
  id?: string;
  medicineName: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  durationDays?: number;
  instructions?: string;
}

interface Prescription {
  id: string;
  number: string;
  patientId: string;
  patient: Patient;
  diagnosis?: string;
  notes?: string;
  advice?: string;
  followUpDate?: string;
  prescriberName: string;
  prescriberRegNo?: string;
  createdAt: string;
  items: PrescriptionItem[];
}

export default function EditPrescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.id as string;

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    notes: '',
    advice: '',
    followUpDate: '',
    prescriberName: '',
    prescriberRegNo: '',
  });

  const [items, setItems] = useState<PrescriptionItem[]>([]);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [currentVoiceField, setCurrentVoiceField] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescription();
    fetchPatients();
  }, [prescriptionId]);

  const fetchPrescription = async () => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescription');
      }
      const data = await response.json();
      setPrescription(data);
      
      // Set form data
      setFormData({
        patientId: data.patientId,
        diagnosis: data.diagnosis || '',
        notes: data.notes || '',
        advice: data.advice || '',
        followUpDate: data.followUpDate ? data.followUpDate.split('T')[0] : '',
        prescriberName: data.prescriberName,
        prescriberRegNo: data.prescriberRegNo || '',
      });
      
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch prescription details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceInput = (text: string, field: string) => {
    if (field.startsWith('medicineName-')) {
      const index = parseInt(field.split('-')[1]);
      updateItem(index, 'medicineName', text);
    } else {
      setFormData(prev => ({ ...prev, [field]: text }));
    }
  };

  const handleStartListening = (field: string) => {
    setCurrentVoiceField(field);
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setCurrentVoiceField(null);
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      medicineName: '',
      strength: '',
      dosage: '',
      frequency: '',
      route: '',
      durationDays: undefined,
      instructions: '',
    }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!formData.patientId || !formData.prescriberName) {
      toast({
        title: 'Validation Error',
        description: 'Patient and Prescriber Name are required',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'At least one medicine item is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            ...item,
            durationDays: item.durationDays ? Number(item.durationDays) : null,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prescription');
      }

      toast({
        title: 'Success',
        description: 'Prescription updated successfully',
      });

      router.push(`/dashboard/prescriptions/${prescriptionId}`);
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prescription',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      toast({
        title: 'Success',
        description: 'Prescription deleted successfully',
      });

      router.push('/dashboard/prescriptions');
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prescription',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prescription Not Found</h1>
          <Button onClick={() => router.push('/dashboard/prescriptions')}>
            Back to Prescriptions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/prescriptions/${prescriptionId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Prescription</h1>
            <p className="text-gray-600">Prescription #{prescription.number}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patientId">Patient *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => handleInputChange('patientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prescriberName">Prescriber Name *</Label>
              <div className="flex space-x-2">
                <Input
                  id="prescriberName"
                  value={formData.prescriberName}
                  onChange={(e) => handleInputChange('prescriberName', e.target.value)}
                  placeholder="Enter prescriber name"
                />
                <VoiceInputButton
                  field="prescriberName"
                  isActive={isListening && currentVoiceField === 'prescriberName'}
                  onStartListening={handleStartListening}
                  onStopListening={handleStopListening}
                  className="px-3"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prescriberRegNo">Registration Number</Label>
              <Input
                id="prescriberRegNo"
                value={formData.prescriberRegNo}
                onChange={(e) => handleInputChange('prescriberRegNo', e.target.value)}
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleInputChange('followUpDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis"
                  rows={3}
                />
                <VoiceInputButton
                  field="diagnosis"
                  isActive={isListening && currentVoiceField === 'diagnosis'}
                  onStartListening={handleStartListening}
                  onStopListening={handleStopListening}
                  className="px-3 self-start"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Clinical Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter clinical notes"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="advice">Advice</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="advice"
                  value={formData.advice}
                  onChange={(e) => handleInputChange('advice', e.target.value)}
                  placeholder="Enter advice for patient"
                  rows={3}
                />
                <VoiceInputButton
                  field="advice"
                  isActive={isListening && currentVoiceField === 'advice'}
                  onStartListening={handleStartListening}
                  onStopListening={handleStopListening}
                  className="px-3 self-start"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine Items */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medicine Items</CardTitle>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No medicine items added yet. Click "Add Medicine" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Medicine #{index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label>Medicine Name *</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={item.medicineName}
                          onChange={(e) => updateItem(index, 'medicineName', e.target.value)}
                          placeholder="Enter medicine name"
                        />
                        <VoiceInputButton
                          field={`medicineName-${index}`}
                          isActive={isListening && currentVoiceField === `medicineName-${index}`}
                          onStartListening={handleStartListening}
                          onStopListening={handleStopListening}
                          className="px-3"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Strength</Label>
                      <Input
                        value={item.strength || ''}
                        onChange={(e) => updateItem(index, 'strength', e.target.value)}
                        placeholder="e.g., 500mg"
                      />
                    </div>

                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={item.dosage || ''}
                        onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                        placeholder="e.g., 1 tablet"
                      />
                    </div>

                    <div>
                      <Label>Frequency</Label>
                      <Input
                        value={item.frequency || ''}
                        onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                        placeholder="e.g., Twice daily"
                      />
                    </div>

                    <div>
                      <Label>Route</Label>
                      <Input
                        value={item.route || ''}
                        onChange={(e) => updateItem(index, 'route', e.target.value)}
                        placeholder="e.g., Oral"
                      />
                    </div>

                    <div>
                      <Label>Duration (Days)</Label>
                      <Input
                        type="number"
                        value={item.durationDays || ''}
                        onChange={(e) => updateItem(index, 'durationDays', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 7"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Instructions</Label>
                    <Textarea
                      value={item.instructions || ''}
                      onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                      placeholder="Enter specific instructions for this medicine"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/prescriptions/${prescriptionId}`)}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant
        onTranscript={handleVoiceInput}
        currentField={currentVoiceField}
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
      />
    </div>
  );
}
