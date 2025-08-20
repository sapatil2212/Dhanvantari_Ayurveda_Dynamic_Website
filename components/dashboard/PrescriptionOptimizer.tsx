'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  Lightbulb,
  Shield,
  DollarSign,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  Pill
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PrescriptionOptimizerProps {
  patientId: string;
  currentPrescription: any;
  onOptimizationComplete?: (optimization: any) => void;
  className?: string;
}

interface PrescriptionOptimization {
  suggestions: string[];
  warnings: string[];
  improvements: string[];
  alternativeMedicines?: MedicineSuggestion[];
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

export default function PrescriptionOptimizer({
  patientId,
  currentPrescription,
  onOptimizationComplete,
  className = ''
}: PrescriptionOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [optimization, setOptimization] = useState<PrescriptionOptimization | null>(null);
  const [showOptimization, setShowOptimization] = useState(false);

  const handleOptimize = async () => {
    if (!diagnosis) {
      toast({
        title: "Diagnosis Required",
        description: "Please enter the diagnosis to optimize the prescription.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/prescription-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPrescription,
          patientId,
          diagnosis,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOptimization(data.optimization);
        setShowOptimization(true);
        
        if (onOptimizationComplete) {
          onOptimizationComplete(data.optimization);
        }

        toast({
          title: "Prescription Optimized",
          description: `Found ${data.optimization.suggestions.length} suggestions and ${data.optimization.warnings.length} warnings.`,
        });
      } else {
        throw new Error('Failed to optimize prescription');
      }
    } catch (error) {
      console.error('Error optimizing prescription:', error);
      toast({
        title: "Error",
        description: "Failed to optimize prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getWarningColor = (type: string) => {
    switch (type) {
      case 'suggestion':
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'improvement':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Prescription Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter the patient's diagnosis to optimize the prescription..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleOptimize} 
            disabled={loading || !diagnosis}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Prescription...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Optimize Prescription
              </>
            )}
          </Button>

          {optimization && showOptimization && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Optimization Results
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptimization(false)}
                >
                  Hide
                </Button>
              </div>

              {/* Warnings */}
              {optimization.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-4 w-4" />
                    Warnings ({optimization.warnings.length})
                  </h4>
                  {optimization.warnings.map((warning, index) => (
                    <Alert key={index} className={getWarningColor('warning')}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{warning}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {optimization.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-blue-700">
                    <Lightbulb className="h-4 w-4" />
                    Suggestions ({optimization.suggestions.length})
                  </h4>
                  {optimization.suggestions.map((suggestion, index) => (
                    <Alert key={index} className={getWarningColor('suggestion')}>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>{suggestion}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Improvements */}
              {optimization.improvements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-4 w-4" />
                    Improvements ({optimization.improvements.length})
                  </h4>
                  {optimization.improvements.map((improvement, index) => (
                    <Alert key={index} className={getWarningColor('improvement')}>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>{improvement}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Alternative Medicines */}
              {optimization.alternativeMedicines && optimization.alternativeMedicines.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-purple-700">
                    <Pill className="h-4 w-4" />
                    Alternative Medicines ({optimization.alternativeMedicines.length})
                  </h4>
                  <div className="grid gap-3">
                    {optimization.alternativeMedicines.map((medicine, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold">{medicine.name}</h5>
                            {medicine.genericName && (
                              <p className="text-sm text-gray-600">Generic: {medicine.genericName}</p>
                            )}
                          </div>
                          <Badge variant="outline">{medicine.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <div>Type: {medicine.type}</div>
                          <div>Strength: {medicine.strength || 'N/A'}</div>
                          <div>Route: {medicine.route}</div>
                          <div>Duration: {medicine.durationDays} days</div>
                        </div>

                        <div className="mb-2">
                          <p className="text-sm text-gray-700">
                            <strong>Suggested:</strong> {medicine.dosage} {medicine.frequency}
                          </p>
                          <p className="text-sm text-gray-600">{medicine.instructions}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Confidence:</span>
                            <span className={`text-sm font-semibold ${
                              medicine.confidence >= 0.8 ? 'text-green-600' : 
                              medicine.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {Math.round(medicine.confidence * 100)}%
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            Consider Alternative
                          </Button>
                        </div>

                        <div className="text-xs text-gray-600 mt-2">
                          <strong>Reasoning:</strong> {medicine.reasoning}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Optimization Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{optimization.warnings.length}</div>
                    <div className="text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{optimization.suggestions.length}</div>
                    <div className="text-gray-600">Suggestions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{optimization.improvements.length}</div>
                    <div className="text-gray-600">Improvements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimization.alternativeMedicines?.length || 0}
                    </div>
                    <div className="text-gray-600">Alternatives</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showOptimization && optimization && (
            <Button
              variant="outline"
              onClick={() => setShowOptimization(true)}
              className="w-full"
            >
              <Brain className="mr-2 h-4 w-4" />
              Show Optimization Results
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
