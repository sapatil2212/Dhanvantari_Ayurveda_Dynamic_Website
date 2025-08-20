'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  Lightbulb,
  Shield,
  Clock,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIPrescriptionAssistantProps {
  patientId?: string;
  patientAge?: number;
  patientGender?: string;
  onMedicineSelect?: (medicine: any) => void;
  onDosageSelect?: (dosage: any) => void;
  className?: string;
}

interface MedicineSuggestion {
  name: string;
  genericName?: string;
  category: string;
  type: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  durationDays?: number;
  instructions?: string;
  confidence: number;
  reasoning: string;
  contraindications?: string[];
  sideEffects?: string[];
}

interface DosageSuggestion {
  dosage: string;
  frequency: string;
  route: string;
  durationDays: number;
  instructions: string;
  confidence: number;
  reasoning: string;
  warnings?: string[];
}

interface DrugInteractionWarning {
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CONTRAINDICATED';
  description: string;
  recommendation: string;
  evidence: string;
}

export default function AIPrescriptionAssistant({
  patientId,
  patientAge,
  patientGender,
  onMedicineSelect,
  onDosageSelect,
  className = ''
}: AIPrescriptionAssistantProps) {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [medicineSuggestions, setMedicineSuggestions] = useState<MedicineSuggestion[]>([]);
  const [dosageSuggestions, setDosageSuggestions] = useState<DosageSuggestion[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteractionWarning[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [currentMedications, setCurrentMedications] = useState<string[]>([]);

  const categories = [
    'Antibiotic',
    'Analgesic',
    'Antihypertensive',
    'Antidiabetic',
    'Antidepressant',
    'Ayurvedic',
    'Homeopathic',
    'Vitamin',
    'Mineral',
    'Other'
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      case 'MODERATE': return 'bg-orange-100 text-orange-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'CONTRAINDICATED': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleGetSuggestions = async () => {
    if (!diagnosis && !symptoms) {
      toast({
        title: "Input Required",
        description: "Please enter either a diagnosis or symptoms to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        diagnosis: diagnosis || undefined,
        symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : undefined,
        category: selectedCategory || undefined,
        patientAge,
        patientGender,
        existingMedications: currentMedications,
      };

      const response = await fetch('/api/ai/medicine-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicineSuggestions(data.suggestions);
        toast({
          title: "AI Suggestions Generated",
          description: `Found ${data.count} medicine suggestions based on your input.`,
        });
      } else {
        throw new Error('Failed to get suggestions');
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDosageSuggestions = async (medicineName: string) => {
    setLoading(true);
    try {
      const requestBody = {
        medicineName,
        patientAge,
        patientGender,
        existingMedications: currentMedications,
      };

      const response = await fetch('/api/ai/dosage-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setDosageSuggestions(data.suggestions);
        setSelectedMedicine(medicineName);
        setActiveTab('dosage');
        toast({
          title: "Dosage Suggestions",
          description: `Generated ${data.count} dosage recommendations for ${medicineName}.`,
        });
      } else {
        throw new Error('Failed to get dosage suggestions');
      }
    } catch (error) {
      console.error('Error getting dosage suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get dosage suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInteractions = async (medications: string[]) => {
    if (medications.length < 2) {
      toast({
        title: "Multiple Medications Required",
        description: "Please add at least 2 medications to check for interactions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/drug-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications,
          patientId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDrugInteractions(data.warnings);
        setActiveTab('interactions');
        
        if (data.hasInteractions) {
          toast({
            title: "Drug Interactions Found",
            description: `Found ${data.count} potential drug interactions.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "No Interactions",
            description: "No drug interactions detected.",
          });
        }
      } else {
        throw new Error('Failed to check interactions');
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      toast({
        title: "Error",
        description: "Failed to check drug interactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineSelect = (medicine: MedicineSuggestion) => {
    if (onMedicineSelect) {
      onMedicineSelect({
        medicineName: medicine.name,
        strength: medicine.strength,
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        route: medicine.route,
        durationDays: medicine.durationDays,
        instructions: medicine.instructions,
      });
    }
    
    // Add to current medications for interaction checking
    setCurrentMedications(prev => [...prev, medicine.name]);
    
    toast({
      title: "Medicine Selected",
      description: `${medicine.name} has been added to your prescription.`,
    });
  };

  const handleDosageSelect = (dosage: DosageSuggestion) => {
    if (onDosageSelect) {
      onDosageSelect(dosage);
    }
    
    toast({
      title: "Dosage Selected",
      description: `Dosage recommendation applied: ${dosage.dosage} ${dosage.frequency}`,
    });
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Prescription Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="dosage" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Dosage
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Interactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="e.g., Hypertension, Diabetes"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                <Input
                  id="symptoms"
                  placeholder="e.g., fever, headache, nausea"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Medicine Category (Optional)</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGetSuggestions} 
              disabled={loading || (!diagnosis && !symptoms)}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {medicineSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  AI Medicine Suggestions
                </h3>
                {medicineSuggestions.map((medicine, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{medicine.name}</h4>
                        {medicine.genericName && (
                          <p className="text-sm text-gray-600">Generic: {medicine.genericName}</p>
                        )}
                      </div>
                      <Badge variant="outline">{medicine.category}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>Type: {medicine.type}</div>
                      <div>Strength: {medicine.strength || 'N/A'}</div>
                      <div>Route: {medicine.route}</div>
                      <div>Duration: {medicine.durationDays} days</div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Suggested Dosage:</strong> {medicine.dosage} {medicine.frequency}
                      </p>
                      <p className="text-sm text-gray-600">{medicine.instructions}</p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Confidence:</span>
                        <span className={`text-sm font-semibold ${getConfidenceColor(medicine.confidence)}`}>
                          {Math.round(medicine.confidence * 100)}%
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGetDosageSuggestions(medicine.name)}
                        >
                          Dosage Options
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMedicineSelect(medicine)}
                        >
                          Select Medicine
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      <strong>Reasoning:</strong> {medicine.reasoning}
                    </div>

                    {medicine.contraindications && medicine.contraindications.length > 0 && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Contraindications:</strong> {medicine.contraindications.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dosage" className="space-y-4">
            {selectedMedicine && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  Dosage Suggestions for {selectedMedicine}
                </h3>
                
                {dosageSuggestions.map((dosage, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">
                          {dosage.dosage} {dosage.frequency}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Route: {dosage.route} | Duration: {dosage.durationDays} days
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Confidence:</span>
                        <span className={`text-sm font-semibold ${getConfidenceColor(dosage.confidence)}`}>
                          {Math.round(dosage.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700">{dosage.instructions}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Reasoning:</strong> {dosage.reasoning}
                      </p>
                    </div>

                    {dosage.warnings && dosage.warnings.length > 0 && (
                      <Alert className="mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Warnings:</strong> {dosage.warnings.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleDosageSelect(dosage)}
                      className="w-full"
                    >
                      Apply This Dosage
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {!selectedMedicine && (
              <div className="text-center py-8 text-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a medicine from the suggestions tab to get dosage recommendations.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <div className="space-y-2">
              <Label>Current Medications (for interaction checking)</Label>
              <div className="flex flex-wrap gap-2">
                {currentMedications.map((med, index) => (
                  <Badge key={index} variant="secondary">
                    {med}
                  </Badge>
                ))}
              </div>
              {currentMedications.length >= 2 && (
                <Button
                  onClick={() => handleCheckInteractions(currentMedications)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Interactions...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Check Drug Interactions
                    </>
                  )}
                </Button>
              )}
            </div>

            {drugInteractions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Drug Interaction Warnings</h3>
                {drugInteractions.map((interaction, index) => (
                  <Alert key={index} className="border-l-4 border-l-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(interaction.severity)}>
                          {interaction.severity}
                        </Badge>
                      </div>
                      <p className="font-semibold mb-1">{interaction.description}</p>
                      <p className="text-sm mb-1">
                        <strong>Recommendation:</strong> {interaction.recommendation}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Evidence:</strong> {interaction.evidence}
                      </p>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {drugInteractions.length === 0 && currentMedications.length >= 2 && (
              <div className="text-center py-8 text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                <p>No drug interactions detected!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
