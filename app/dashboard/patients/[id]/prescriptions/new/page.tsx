'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Brain } from 'lucide-react';
import AIPrescriptionAssistant from '@/components/dashboard/AIPrescriptionAssistant';
import PrescriptionOptimizer from '@/components/dashboard/PrescriptionOptimizer';

type RxItem = { medicineName: string; strength?: string; dosage?: string; frequency?: string; route?: string; durationDays?: number; instructions?: string };

export default function NewPrescriptionPage() {
  const { id: patientId } = useParams<{ id: string }>();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [prescriberName, setPrescriberName] = useState('');
  const [prescriberRegNo, setPrescriberRegNo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [items, setItems] = useState<RxItem[]>([{ medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
      }
    } catch (error) {
      console.error('Failed to fetch patient:', error);
    }
  };

  const addItem = () => setItems([...items, { medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (index: number, field: keyof RxItem, value: string | number) => {
    setItems(items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    ));
  };

  const save = async () => {
    setSaving(true);
    const payload = { patientId, prescriberName, prescriberRegNo, diagnosis, advice, followUpDate: followUpDate || undefined, items };
    const res = await fetch('/api/prescriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      const created = await res.json();
      router.push(`/dashboard/prescriptions/${created.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Prescription</h1>
          <p className="text-gray-600 mt-2">
            {patient ? `Creating prescription for ${patient.firstName} ${patient.lastName}` : 'Loading patient...'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          {patient && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Name</Label>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Age</Label>
                    <p className="font-medium">{patient.age || 'N/A'} years</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Gender</Label>
                    <p className="font-medium">{patient.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Phone</Label>
                    <p className="font-medium">{patient.phone || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prescription Form */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="prescriberName">Prescriber Name</Label>
                  <Input 
                    id="prescriberName"
                    value={prescriberName} 
                    onChange={(e) => setPrescriberName(e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="prescriberRegNo">Registration No</Label>
                  <Input 
                    id="prescriberRegNo"
                    value={prescriberRegNo} 
                    onChange={(e) => setPrescriberRegNo(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input 
                    id="diagnosis"
                    value={diagnosis} 
                    onChange={(e) => setDiagnosis(e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input 
                    id="followUpDate"
                    type="date" 
                    value={followUpDate} 
                    onChange={(e) => setFollowUpDate(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Medicines</Label>
                <div className="space-y-3 mt-2">
                  {items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Medicine #{index + 1}</h4>
                        {items.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Medicine Name *</Label>
                          <Input
                            placeholder="e.g., Paracetamol"
                            value={item.medicineName}
                            onChange={(e) => updateItem(index, 'medicineName', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Strength</Label>
                          <Input
                            placeholder="e.g., 500mg"
                            value={item.strength || ''}
                            onChange={(e) => updateItem(index, 'strength', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <Input
                            placeholder="e.g., 1-0-1"
                            value={item.dosage || ''}
                            onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Input
                            placeholder="e.g., TID"
                            value={item.frequency || ''}
                            onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Route</Label>
                          <Select value={item.route || 'Oral'} onValueChange={(value) => updateItem(index, 'route', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Oral">Oral</SelectItem>
                              <SelectItem value="Topical">Topical</SelectItem>
                              <SelectItem value="Injection">Injection</SelectItem>
                              <SelectItem value="Inhalation">Inhalation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div className="space-y-2">
                          <Label>Duration (Days)</Label>
                          <Input
                            type="number"
                            placeholder="5"
                            value={item.durationDays || ''}
                            onChange={(e) => updateItem(index, 'durationDays', Number(e.target.value))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Instructions</Label>
                          <Input
                            placeholder="e.g., Take after meals"
                            value={item.instructions || ''}
                            onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button variant="outline" onClick={addItem} className="w-full">
                    Add Medicine
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="advice">Advice/Notes</Label>
                <Textarea
                  id="advice"
                  value={advice} 
                  onChange={(e) => setAdvice(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button 
                  onClick={save} 
                  disabled={saving || !prescriberName || items.some(it => !it.medicineName)}
                >
                  {saving ? 'Saving…' : 'Create Prescription'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="space-y-6">
          {/* AI Prescription Assistant */}
          <AIPrescriptionAssistant
            patientId={patientId}
            patientAge={patient?.age}
            patientGender={patient?.gender}
            onMedicineSelect={(medicine) => {
              const newItem = {
                medicineName: medicine.medicineName,
                strength: medicine.strength || '',
                dosage: medicine.dosage || '',
                frequency: medicine.frequency || '',
                route: medicine.route || 'Oral',
                durationDays: medicine.durationDays || 5,
                instructions: medicine.instructions || '',
              };
              setItems([...items, newItem]);
            }}
            onDosageSelect={(dosage) => {
              // Apply dosage to the last added medicine
              if (items.length > 0) {
                const lastIndex = items.length - 1;
                updateItem(lastIndex, 'dosage', dosage.dosage);
                updateItem(lastIndex, 'frequency', dosage.frequency);
                updateItem(lastIndex, 'route', dosage.route);
                updateItem(lastIndex, 'durationDays', dosage.durationDays);
                updateItem(lastIndex, 'instructions', dosage.instructions);
              }
            }}
          />

          {/* AI Prescription Optimizer */}
          <PrescriptionOptimizer
            patientId={patientId}
            currentPrescription={{
              items,
              diagnosis,
              advice,
            }}
            onOptimizationComplete={(optimization) => {
              console.log('Optimization completed:', optimization);
            }}
          />
        </div>
      </div>
    </div>
  );
}


