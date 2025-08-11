'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';
import { Mic, MicOff, Play, Square, Save, ArrowLeft, User, Stethoscope } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type RxItem = { 
  medicineName: string; 
  strength?: string; 
  dosage?: string; 
  frequency?: string; 
  route?: string; 
  durationDays?: number; 
  instructions?: string 
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientEntryMode, setPatientEntryMode] = useState<'select' | 'manual'>('select');
  
  // Manual patient entry fields
  const [newPatientFirstName, setNewPatientFirstName] = useState('');
  const [newPatientLastName, setNewPatientLastName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  
  const [prescriberName, setPrescriberName] = useState('');
  const [prescriberRegNo, setPrescriberRegNo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [items, setItems] = useState<RxItem[]>([
    { medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' }
  ]);
  const [saving, setSaving] = useState(false);
  
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    fetchPatients();
    
    // Cleanup function to stop recognition when component unmounts
    return () => {
      if (window.currentRecognition) {
        window.currentRecognition.stop();
      }
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      setPatients([]);
    }
  };

  const addItem = () => setItems([...items, { 
    medicineName: '', strength: '', dosage: '', frequency: '', route: 'Oral', durationDays: 5, instructions: '' 
  }]);
  
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (index: number, field: keyof RxItem, value: string | number) => {
    setItems(items.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    ));
  };

  // Voice recognition functions
  const startListening = (field: string) => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice recognition not supported",
        description: "Your browser doesn't support voice recognition. Please use text input instead.",
        variant: "destructive",
      });
      return;
    }

    // Stop any existing recognition
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }

    setCurrentField(field);
    setIsListening(true);
    setTranscript('');

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Store reference to stop later
      window.currentRecognition = recognition;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started for field:', field);
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now for " + field.replace(/([A-Z])/g, ' $1').toLowerCase(),
        });
      };

      recognition.onresult = (event) => {
        console.log('Speech recognition result:', event);
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        console.log('Final transcript:', finalTranscript);
        setTranscript(finalTranscript);
        
        if (finalTranscript.trim()) {
          applyVoiceInput(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentField(null);
        
        let errorMessage = "Voice recognition error occurred.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setCurrentField(null);
        window.currentRecognition = null;
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setCurrentField(null);
      toast({
        title: "Voice Recognition Error",
        description: "Failed to start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (window.currentRecognition) {
      window.currentRecognition.stop();
    }
    setIsListening(false);
    setCurrentField(null);
  };

  const applyVoiceInput = (text: string) => {
    if (!currentField) return;

    // Parse voice input for medicine items
    if (currentField.startsWith('medicine_')) {
      const index = parseInt(currentField.split('_')[1]);
      const field = currentField.split('_')[2] as keyof RxItem;
      
      if (field === 'medicineName') {
        // Try to extract medicine name, strength, and dosage from voice input
        const parts = text.toLowerCase().split(' ');
        let medicineName = '';
        let strength = '';
        let dosage = '';

        // Common medicine patterns
        if (text.includes('tablet') || text.includes('capsule') || text.includes('syrup')) {
          const beforeMedicine = text.toLowerCase().split(/(tablet|capsule|syrup|injection)/)[0];
          medicineName = beforeMedicine.trim();
          
          // Extract strength (e.g., "500mg", "10mg")
          const strengthMatch = text.match(/(\d+)\s*(mg|g|ml|mcg)/i);
          if (strengthMatch) {
            strength = strengthMatch[0];
          }
          
          // Extract dosage (e.g., "one tablet", "two capsules")
          const dosageMatch = text.match(/(one|two|three|1|2|3)\s*(tablet|capsule|spoon|dose)/i);
          if (dosageMatch) {
            dosage = dosageMatch[0];
          }
        } else {
          medicineName = text;
        }

        updateItem(index, 'medicineName', medicineName);
        if (strength) updateItem(index, 'strength', strength);
        if (dosage) updateItem(index, 'dosage', dosage);
      } else {
        updateItem(index, field, text);
      }
    } else {
      // Handle other fields
      switch (currentField) {
        case 'diagnosis':
          setDiagnosis(text);
          break;
        case 'advice':
          setAdvice(text);
          break;
        case 'prescriberName':
          setPrescriberName(text);
          break;
        case 'newPatientFirstName':
          setNewPatientFirstName(text);
          break;
        case 'newPatientLastName':
          setNewPatientLastName(text);
          break;
        default:
          break;
      }
    }

    setTranscript('');
  };

  const createNewPatient = async () => {
    if (!newPatientFirstName || !newPatientLastName) {
      toast({
        title: "Patient name required",
        description: "Please enter first name and last name for the new patient.",
        variant: "destructive",
      });
      return null;
    }

    if (!newPatientEmail && !newPatientPhone) {
      toast({
        title: "Contact information required",
        description: "Please provide either email or phone number for the new patient.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newPatientFirstName,
          lastName: newPatientLastName,
          email: newPatientEmail || undefined,
          phone: newPatientPhone || undefined,
        }),
      });

      if (response.ok) {
        const newPatient = await response.json();
        toast({
          title: "Patient created",
          description: "New patient has been created successfully.",
        });
        return newPatient.id;
      } else {
        const error = await response.json();
        toast({
          title: "Error creating patient",
          description: error.error || "Failed to create new patient",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new patient",
        variant: "destructive",
      });
      return null;
    }
  };

  const save = async () => {
    let patientId = selectedPatientId;

    if (patientEntryMode === 'manual') {
      if (!newPatientFirstName || !newPatientLastName) {
        toast({
          title: "Patient name required",
          description: "Please enter first name and last name for the new patient.",
          variant: "destructive",
        });
        return;
      }

      if (!newPatientEmail && !newPatientPhone) {
        toast({
          title: "Contact information required",
          description: "Please provide either email or phone number for the new patient.",
          variant: "destructive",
        });
        return;
      }

      // Create new patient first
      const newPatientId = await createNewPatient();
      if (!newPatientId) {
        return; // Error already shown in createNewPatient
      }
      patientId = newPatientId;
    } else {
      if (!selectedPatientId) {
        toast({
          title: "Patient required",
          description: "Please select a patient for this prescription.",
          variant: "destructive",
        });
        return;
      }
    }



    if (items.some(item => !item.medicineName)) {
      toast({
        title: "Medicine names required",
        description: "Please enter names for all medicines.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const payload = { 
      patientId, 
      prescriberName, 
      prescriberRegNo, 
      diagnosis, 
      advice, 
      followUpDate: followUpDate || undefined, 
      items 
    };
    
    try {
      const res = await fetch('/api/prescriptions', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (res.ok) {
        const created = await res.json();
        toast({
          title: "Prescription created",
          description: "Prescription has been created successfully.",
        });
        router.push(`/dashboard/prescriptions/${created.id}`);
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create prescription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <p className="text-gray-600 mt-2">Create a prescription with voice assistance</p>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Patient Entry Mode Toggle */}
                <div className="flex items-center space-x-4">
                  <Label className="text-sm font-medium">Patient Entry Mode:</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={patientEntryMode === 'select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPatientEntryMode('select')}
                    >
                      Select Existing
                    </Button>
                    <Button
                      type="button"
                      variant={patientEntryMode === 'manual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPatientEntryMode('manual')}
                    >
                      Enter New Patient
                    </Button>
                  </div>
                </div>

                {patientEntryMode === 'select' ? (
                  <div>
                    <Label htmlFor="patient">Select Patient *</Label>
                    <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {(patients || []).map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} - {patient.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPatientFirstName">First Name *</Label>
                      <AutocompleteInput
                        id="newPatientFirstName"
                        value={newPatientFirstName}
                        onChange={setNewPatientFirstName}
                        placeholder="John"
                        fieldType="patientFirstName"
                        onVoiceInput={() => currentField === 'newPatientFirstName' ? stopListening() : startListening('newPatientFirstName')}
                        isListening={currentField === 'newPatientFirstName'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPatientLastName">Last Name *</Label>
                      <AutocompleteInput
                        id="newPatientLastName"
                        value={newPatientLastName}
                        onChange={setNewPatientLastName}
                        placeholder="Doe"
                        fieldType="patientLastName"
                        onVoiceInput={() => currentField === 'newPatientLastName' ? stopListening() : startListening('newPatientLastName')}
                        isListening={currentField === 'newPatientLastName'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPatientEmail">Email</Label>
                      <Input
                        id="newPatientEmail"
                        type="email"
                        value={newPatientEmail}
                        onChange={(e) => setNewPatientEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPatientPhone">Phone</Label>
                      <Input
                        id="newPatientPhone"
                        type="tel"
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>



          {/* Diagnosis and Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <AutocompleteInput
                    id="diagnosis"
                    value={diagnosis}
                    onChange={setDiagnosis}
                    placeholder="Primary diagnosis"
                    fieldType="diagnosis"
                    onVoiceInput={() => currentField === 'diagnosis' ? stopListening() : startListening('diagnosis')}
                    isListening={currentField === 'diagnosis'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Medicines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Medicine {index + 1}</Badge>
                        {items.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="ml-auto"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Medicine Name *</Label>
                          <AutocompleteInput
                            id={`medicine_${index}_name`}
                            placeholder="e.g., Paracetamol"
                            value={item.medicineName}
                            onChange={(value) => updateItem(index, 'medicineName', value)}
                            fieldType="medicineName"
                            onVoiceInput={() => currentField === `medicine_${index}_medicineName` ? stopListening() : startListening(`medicine_${index}_medicineName`)}
                            isListening={currentField === `medicine_${index}_medicineName`}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Strength</Label>
                          <AutocompleteInput
                            id={`medicine_${index}_strength`}
                            placeholder="e.g., 500mg"
                            value={item.strength || ''}
                            onChange={(value) => updateItem(index, 'strength', value)}
                            fieldType="medicineStrength"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <AutocompleteInput
                            id={`medicine_${index}_dosage`}
                            placeholder="e.g., 1-0-1"
                            value={item.dosage || ''}
                            onChange={(value) => updateItem(index, 'dosage', value)}
                            fieldType="medicineDosage"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <AutocompleteInput
                            id={`medicine_${index}_frequency`}
                            placeholder="e.g., TID"
                            value={item.frequency || ''}
                            onChange={(value) => updateItem(index, 'frequency', value)}
                            fieldType="medicineFrequency"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          <AutocompleteInput
                            id={`medicine_${index}_instructions`}
                            placeholder="e.g., Take after meals"
                            value={item.instructions || ''}
                            onChange={(value) => updateItem(index, 'instructions', value)}
                            fieldType="medicineInstructions"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Button variant="outline" onClick={addItem} className="w-full">
                  Add Medicine
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advice */}
          <Card>
            <CardHeader>
              <CardTitle>Advice & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="advice">Advice/Notes</Label>
                <AutocompleteInput
                  id="advice"
                  value={advice}
                  onChange={setAdvice}
                  placeholder="Additional advice for the patient..."
                  fieldType="advice"
                  onVoiceInput={() => currentField === 'advice' ? stopListening() : startListening('advice')}
                  isListening={currentField === 'advice'}
                  as="textarea"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prescriberName">Prescriber Name *</Label>
                  <AutocompleteInput
                    id="prescriberName"
                    value={prescriberName}
                    onChange={setPrescriberName}
                    placeholder="Dr. John Doe"
                    fieldType="prescriberName"
                    onVoiceInput={() => currentField === 'prescriberName' ? stopListening() : startListening('prescriberName')}
                    isListening={currentField === 'prescriberName'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prescriberRegNo">Registration No</Label>
                  <Input
                    id="prescriberRegNo"
                    value={prescriberRegNo}
                    onChange={(e) => setPrescriberRegNo(e.target.value)}
                    placeholder="MD12345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Creating...' : 'Create Prescription'}
            </Button>
          </div>
        </div>

        {/* Voice Assistant Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>Use voice commands to quickly fill prescription details:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>&ldquo;Paracetamol 500mg tablet one tablet three times daily&rdquo;</li>
                  <li>&ldquo;Hypertension management&rdquo;</li>
                  <li>&ldquo;Take after meals with plenty of water&rdquo;</li>
                </ul>
              </div>

              {isListening && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Listening... Speak now
                  </div>
                  {transcript && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <p className="text-sm text-gray-700">{transcript}</p>
                    </div>
                  )}
                </div>
              )}

              {currentField && !isListening && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Voice input applied to: <strong>{currentField.replace('_', ' ')}</strong>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant={isListening ? 'destructive' : 'default'}
                  onClick={isListening ? stopListening : () => startListening('general')}
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Voice Input
                    </>
                  )}
                </Button>
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
                onClick={() => {
                  setItems([{ medicineName: 'Paracetamol', strength: '500mg', dosage: '1-0-1', frequency: 'TID', route: 'Oral', durationDays: 5, instructions: 'Take after meals' }]);
                }}
                className="w-full justify-start"
              >
                Common Medicine Template
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDiagnosis('Upper respiratory tract infection');
                  setAdvice('Rest well, drink plenty of fluids, avoid cold foods');
                }}
                className="w-full justify-start"
              >
                Common Diagnosis Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
