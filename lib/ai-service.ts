import { prisma } from './prisma';

export interface AISuggestionRequest {
  symptoms?: string[];
  diagnosis?: string;
  patientAge?: number;
  patientGender?: string;
  existingMedications?: string[];
  allergies?: string[];
  medicalHistory?: string;
  category?: string;
  medicineName?: string;
}

export interface MedicineSuggestion {
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

export interface DosageSuggestion {
  dosage: string;
  frequency: string;
  route: string;
  durationDays: number;
  instructions: string;
  confidence: number;
  reasoning: string;
  warnings?: string[];
}

export interface DrugInteractionWarning {
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CONTRAINDICATED';
  description: string;
  recommendation: string;
  evidence: string;
}

export interface PrescriptionOptimization {
  suggestions: string[];
  warnings: string[];
  improvements: string[];
  alternativeMedicines?: MedicineSuggestion[];
}

class AIService {
  private async getMedicineDatabase() {
    return await prisma.medicine.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        genericName: true,
        brandName: true,
        category: true,
        type: true,
        strength: true,
        dosageForm: true,
        route: true,
        manufacturer: true,
        description: true,
        indications: true,
        contraindications: true,
        sideEffects: true,
        interactions: true,
        dosage: true,
        storage: true,
        isPrescription: true,
        isControlled: true,
      },
    });
  }

  private async getPatientHistory(patientId: string) {
    return await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        allergies: true,
        medicalHistory: true,
        familyHistory: true,
        lifestyle: true,
        vitals: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
        encounters: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            prescriptions: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });
  }

  private createMedicineKnowledgeBase() {
    return {
      categories: {
        'Antibiotic': {
          commonUses: ['bacterial infections', 'UTI', 'respiratory infections'],
          typicalDosage: '500mg-1g TID for 7-14 days',
          contraindications: ['allergy to penicillin', 'pregnancy'],
        },
        'Analgesic': {
          commonUses: ['pain relief', 'fever', 'inflammation'],
          typicalDosage: '500mg-1g QID as needed',
          contraindications: ['peptic ulcer', 'kidney disease'],
        },
        'Antihypertensive': {
          commonUses: ['high blood pressure', 'hypertension'],
          typicalDosage: '5-10mg daily',
          contraindications: ['pregnancy', 'severe hypotension'],
        },
        'Antidiabetic': {
          commonUses: ['diabetes', 'blood sugar control'],
          typicalDosage: '500mg-1g BID with meals',
          contraindications: ['kidney disease', 'liver disease'],
        },
        'Ayurvedic': {
          commonUses: ['general wellness', 'digestive issues', 'immunity'],
          typicalDosage: '1-2 tablets BID',
          contraindications: ['pregnancy', 'liver disease'],
        },
        'Vitamin': {
          commonUses: ['vitamin deficiency', 'supplementation'],
          typicalDosage: '1 tablet daily',
          contraindications: ['hypervitaminosis'],
        },
      },
      interactions: {
        'Warfarin': ['Aspirin', 'NSAIDs', 'Vitamin K'],
        'ACE Inhibitors': ['Potassium supplements', 'Lithium'],
        'Beta Blockers': ['Calcium channel blockers', 'Digoxin'],
        'Statins': ['Grapefruit juice', 'Fibrates'],
        'Antibiotics': ['Oral contraceptives', 'Antacids'],
      },
    };
  }

  async suggestMedicines(request: AISuggestionRequest): Promise<MedicineSuggestion[]> {
    const medicines = await this.getMedicineDatabase();
    const knowledgeBase = this.createMedicineKnowledgeBase();
    const suggestions: MedicineSuggestion[] = [];

    // Filter medicines based on symptoms and diagnosis
    const relevantMedicines = medicines.filter(medicine => {
      if (request.diagnosis) {
        const diagnosisLower = request.diagnosis.toLowerCase();
        const indications = medicine.indications?.toLowerCase() || '';
        const description = medicine.description?.toLowerCase() || '';
        
        if (indications.includes(diagnosisLower) || description.includes(diagnosisLower)) {
          return true;
        }
      }

      if (request.symptoms && request.symptoms.length > 0) {
        const symptomsLower = request.symptoms.map(s => s.toLowerCase());
        const indications = medicine.indications?.toLowerCase() || '';
        const description = medicine.description?.toLowerCase() || '';
        
        return symptomsLower.some(symptom => 
          indications.includes(symptom) || description.includes(symptom)
        );
      }

      if (request.category && medicine.category === request.category) {
        return true;
      }

      return false;
    });

    // Generate suggestions with confidence scores
    for (const medicine of relevantMedicines.slice(0, 10)) {
      const category = knowledgeBase.categories[medicine.category as keyof typeof knowledgeBase.categories];
      let confidence = 0.5; // Base confidence
      let reasoning = '';

      // Increase confidence based on matches
      if (request.diagnosis && medicine.indications?.toLowerCase().includes(request.diagnosis.toLowerCase())) {
        confidence += 0.3;
        reasoning += 'Matches diagnosis. ';
      }

      if (request.symptoms && request.symptoms.some(s => 
        medicine.indications?.toLowerCase().includes(s.toLowerCase())
      )) {
        confidence += 0.2;
        reasoning += 'Addresses symptoms. ';
      }

      if (category) {
        reasoning += `Common ${medicine.category} medication. `;
      }

      // Check contraindications
      const contraindications: string[] = [];
      if (request.allergies && medicine.contraindications) {
        const contraindicationsLower = medicine.contraindications.toLowerCase();
        request.allergies.forEach(allergy => {
          if (contraindicationsLower.includes(allergy.toLowerCase())) {
            contraindications.push(allergy);
            confidence -= 0.4; // Reduce confidence for allergies
          }
        });
      }

      // Check age-related contraindications
      if (request.patientAge && request.patientAge < 18 && medicine.isControlled) {
        confidence -= 0.2;
        reasoning += 'Controlled substance for minor. ';
      }

      if (request.patientAge && request.patientAge > 65) {
        if (medicine.category === 'Antihypertensive' || medicine.category === 'Antidiabetic') {
          confidence += 0.1;
          reasoning += 'Age-appropriate medication. ';
        }
      }

             suggestions.push({
         name: medicine.name,
         genericName: medicine.genericName || undefined,
         category: medicine.category,
         type: medicine.type,
         strength: medicine.strength || undefined,
                 dosage: category?.typicalDosage || medicine.dosage || undefined,
         frequency: this.extractFrequency(category?.typicalDosage || medicine.dosage || ''),
         route: medicine.route || 'Oral',
         durationDays: this.extractDuration(category?.typicalDosage || medicine.dosage || ''),
         instructions: this.generateInstructions(medicine, request),
         confidence: Math.max(0, Math.min(1, confidence)),
         reasoning: reasoning || 'General recommendation based on category.',
         contraindications: contraindications.length > 0 ? contraindications : undefined,
         sideEffects: medicine.sideEffects ? medicine.sideEffects.split(',').map(s => s.trim()) : undefined,
      });
    }

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  async suggestDosage(medicineName: string, request: AISuggestionRequest): Promise<DosageSuggestion[]> {
    const medicines = await this.getMedicineDatabase();
    const medicine = medicines.find(m => 
      m.name.toLowerCase().includes(medicineName.toLowerCase()) ||
      m.genericName?.toLowerCase().includes(medicineName.toLowerCase())
    );

    if (!medicine) {
      return [];
    }

    const knowledgeBase = this.createMedicineKnowledgeBase();
    const category = knowledgeBase.categories[medicine.category as keyof typeof knowledgeBase.categories];
    const suggestions: DosageSuggestion[] = [];

         // Standard dosage suggestion
     const standardDosage: DosageSuggestion = {
       dosage: this.extractDosage(category?.typicalDosage || medicine.dosage || ''),
       frequency: this.extractFrequency(category?.typicalDosage || medicine.dosage || ''),
       route: medicine.route || 'Oral',
       durationDays: this.extractDuration(category?.typicalDosage || medicine.dosage || ''),
       instructions: this.generateInstructions(medicine, request),
       confidence: 0.8,
       reasoning: 'Standard dosage based on medication category and typical usage.',
       warnings: this.generateWarnings(medicine, request),
     };

    suggestions.push(standardDosage);

    // Age-adjusted dosage
    if (request.patientAge) {
      if (request.patientAge < 18) {
        suggestions.push({
          ...standardDosage,
          dosage: this.adjustDosageForAge(standardDosage.dosage, request.patientAge),
          confidence: 0.7,
          reasoning: 'Dosage adjusted for pediatric patient.',
          warnings: [...(standardDosage.warnings || []), 'Pediatric dosage - monitor closely'],
        });
      } else if (request.patientAge > 65) {
        suggestions.push({
          ...standardDosage,
          dosage: this.adjustDosageForElderly(standardDosage.dosage),
          confidence: 0.7,
          reasoning: 'Dosage adjusted for elderly patient.',
          warnings: [...(standardDosage.warnings || []), 'Elderly patient - start with lower dose'],
        });
      }
    }

         // Alternative dosage forms
     if (medicine.type !== 'Tablet') {
       suggestions.push({
         ...standardDosage,
         confidence: 0.6,
         reasoning: `Alternative ${medicine.type} formulation available.`,
       });
     }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  async checkDrugInteractions(medications: string[], patientId?: string): Promise<DrugInteractionWarning[]> {
    const medicines = await this.getMedicineDatabase();
    const knowledgeBase = this.createMedicineKnowledgeBase();
    const warnings: DrugInteractionWarning[] = [];

    // Check known interactions
    for (const med1 of medications) {
      for (const med2 of medications) {
        if (med1 !== med2) {
          const medicine1 = medicines.find(m => 
            m.name.toLowerCase().includes(med1.toLowerCase()) ||
            m.genericName?.toLowerCase().includes(med1.toLowerCase())
          );
          const medicine2 = medicines.find(m => 
            m.name.toLowerCase().includes(med2.toLowerCase()) ||
            m.genericName?.toLowerCase().includes(med2.toLowerCase())
          );

          if (medicine1 && medicine2) {
            const interaction = this.checkKnownInteractions(medicine1, medicine2, knowledgeBase);
            if (interaction) {
              warnings.push(interaction);
            }
          }
        }
      }
    }

    // Check patient-specific interactions if patientId provided
    if (patientId) {
      const patient = await this.getPatientHistory(patientId);
      if (patient) {
        const patientWarnings = this.checkPatientSpecificInteractions(medications, patient);
        warnings.push(...patientWarnings);
      }
    }

    return warnings;
  }

  async optimizePrescription(
    currentPrescription: any,
    patientId: string,
    diagnosis: string
  ): Promise<PrescriptionOptimization> {
    const patient = await this.getPatientHistory(patientId);
    const medicines = await this.getMedicineDatabase();
    const optimization: PrescriptionOptimization = {
      suggestions: [],
      warnings: [],
      improvements: [],
    };

    if (!patient) {
      return optimization;
    }

    // Check for duplicate medications
    const medicineNames = currentPrescription.items.map((item: any) => item.medicineName);
    const duplicates = medicineNames.filter((name: string, index: number) => 
      medicineNames.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      optimization.warnings.push(`Duplicate medications detected: ${duplicates.join(', ')}`);
    }

    // Check for drug interactions
    const interactions = await this.checkDrugInteractions(medicineNames, patientId);
    optimization.warnings.push(...interactions.map(i => `${i.severity}: ${i.description}`));

    // Suggest alternatives for expensive medications
    const expensiveMeds = currentPrescription.items.filter((item: any) => {
      const medicine = medicines.find(m => m.name === item.medicineName);
      return medicine && this.isExpensiveMedication(medicine);
    });

    if (expensiveMeds.length > 0) {
      optimization.suggestions.push('Consider generic alternatives for cost-effective treatment');
      optimization.improvements.push('Cost optimization opportunities available');
    }

         // Check for age-appropriate medications
     if (patient.dateOfBirth) {
       const age = Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
       const ageInappropriate = currentPrescription.items.filter((item: any) => {
         const medicine = medicines.find(m => m.name === item.medicineName);
         return medicine && this.isAgeInappropriate(medicine, age);
       });

       if (ageInappropriate.length > 0) {
         optimization.warnings.push('Some medications may not be age-appropriate');
       }
     }

         // Suggest complementary medications
     const patientAge = patient.dateOfBirth ? 
       Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
       undefined;
     
     const complementaryMeds = await this.suggestMedicines({
       diagnosis,
       patientAge,
       patientGender: patient.gender || undefined,
       existingMedications: medicineNames,
     });

    if (complementaryMeds.length > 0) {
      optimization.alternativeMedicines = complementaryMeds.slice(0, 3);
    }

    return optimization;
  }

  private extractDosage(dosageString?: string): string {
    if (!dosageString) return '500mg';
    const match = dosageString.match(/(\d+mg)/);
    return match ? match[1] : '500mg';
  }

  private extractFrequency(dosageString?: string): string {
    if (!dosageString) return 'TID';
    if (dosageString.includes('TID')) return 'TID';
    if (dosageString.includes('BID')) return 'BID';
    if (dosageString.includes('QID')) return 'QID';
    if (dosageString.includes('daily')) return 'Once daily';
    return 'TID';
  }

  private extractDuration(dosageString?: string): number {
    if (!dosageString) return 7;
    const match = dosageString.match(/(\d+)\s*days?/);
    return match ? parseInt(match[1]) : 7;
  }

  private generateInstructions(medicine: any, request: AISuggestionRequest): string {
    let instructions = `Take ${medicine.name}`;
    
    if (request.patientAge && request.patientAge < 18) {
      instructions += ' with food. Monitor for side effects.';
    } else if (request.patientAge && request.patientAge > 65) {
      instructions += ' with plenty of water. Take with or after meals.';
    } else {
      instructions += ' as directed.';
    }

    if (medicine.category === 'Antibiotic') {
      instructions += ' Complete the full course.';
    }

    return instructions;
  }

  private generateWarnings(medicine: any, request: AISuggestionRequest): string[] {
    const warnings: string[] = [];

    if (medicine.isControlled) {
      warnings.push('Controlled substance - monitor usage');
    }

    if (request.allergies && medicine.contraindications) {
      const contraindicationsLower = medicine.contraindications.toLowerCase();
      request.allergies.forEach(allergy => {
        if (contraindicationsLower.includes(allergy.toLowerCase())) {
          warnings.push(`Allergy warning: ${allergy}`);
        }
      });
    }

    if (medicine.category === 'Antibiotic') {
      warnings.push('May cause gastrointestinal upset');
    }

    return warnings;
  }

  private adjustDosageForAge(dosage: string, age: number): string {
    const baseDosage = parseInt(dosage.replace('mg', ''));
    if (age < 12) {
      return `${Math.round(baseDosage * 0.5)}mg`;
    } else if (age < 18) {
      return `${Math.round(baseDosage * 0.75)}mg`;
    }
    return dosage;
  }

  private adjustDosageForElderly(dosage: string): string {
    const baseDosage = parseInt(dosage.replace('mg', ''));
    return `${Math.round(baseDosage * 0.8)}mg`;
  }

  private checkKnownInteractions(med1: any, med2: any, knowledgeBase: any): DrugInteractionWarning | null {
    const interactions = knowledgeBase.interactions;
    
    for (const [drug, interactingDrugs] of Object.entries(interactions)) {
      if ((med1.name.includes(drug) || med2.name.includes(drug)) &&
          (interactingDrugs as string[]).some(d => med1.name.includes(d) || med2.name.includes(d))) {
        return {
          severity: 'MODERATE',
          description: `Potential interaction between ${med1.name} and ${med2.name}`,
          recommendation: 'Monitor closely and consider alternative medications',
          evidence: 'Known drug interaction in medical literature',
        };
      }
    }

    return null;
  }

  private checkPatientSpecificInteractions(medications: string[], patient: any): DrugInteractionWarning[] {
    const warnings: DrugInteractionWarning[] = [];

    // Check for allergies
    patient.allergies?.forEach((allergy: any) => {
      medications.forEach(med => {
        if (med.toLowerCase().includes(allergy.allergen.toLowerCase())) {
          warnings.push({
            severity: 'HIGH',
            description: `Patient has allergy to ${allergy.allergen}`,
            recommendation: 'Avoid this medication completely',
            evidence: `Allergy recorded on ${allergy.recordedAt}`,
          });
        }
      });
    });

    // Check for existing conditions
    if (patient.medicalHistory) {
      const conditions = patient.medicalHistory.map((h: any) => h.condition.toLowerCase());
      
      medications.forEach(med => {
        if (med.toLowerCase().includes('warfarin') && conditions.includes('bleeding disorder')) {
          warnings.push({
            severity: 'HIGH',
            description: 'Patient has bleeding disorder - warfarin contraindicated',
            recommendation: 'Use alternative anticoagulant',
            evidence: 'Medical history indicates bleeding disorder',
          });
        }
      });
    }

    return warnings;
  }

  private isExpensiveMedication(medicine: any): boolean {
    // This would typically check against a pricing database
    // For now, we'll use a simple heuristic
    const expensiveCategories = ['Biologic', 'Specialty', 'Oncology'];
    return expensiveCategories.some(cat => medicine.category.includes(cat));
  }

  private isAgeInappropriate(medicine: any, age: number): boolean {
    if (age < 18 && medicine.isControlled) return true;
    if (age > 65 && medicine.category === 'Antihypertensive') return false; // Actually appropriate
    return false;
  }
}

export const aiService = new AIService();
