const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleMedicines = [
  {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    brandName: 'Tylenol',
    category: 'Analgesic',
    type: 'Tablet',
    strength: '500mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Pain reliever and fever reducer',
    indications: 'fever, headache, pain relief, inflammation',
    contraindications: 'liver disease, alcohol use',
    sideEffects: 'nausea, stomach upset, liver damage in high doses',
    interactions: 'alcohol, warfarin',
    dosage: '500mg-1g QID as needed',
    storage: 'Store at room temperature',
    isPrescription: false,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    brandName: 'Amoxil',
    category: 'Antibiotic',
    type: 'Capsule',
    strength: '500mg',
    dosageForm: 'Capsule',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Broad-spectrum antibiotic',
    indications: 'bacterial infections, UTI, respiratory infections',
    contraindications: 'allergy to penicillin, pregnancy',
    sideEffects: 'nausea, diarrhea, allergic reactions',
    interactions: 'oral contraceptives, antacids',
    dosage: '500mg-1g TID for 7-14 days',
    storage: 'Store at room temperature',
    isPrescription: true,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandName: 'Advil',
    category: 'Analgesic',
    type: 'Tablet',
    strength: '400mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Non-steroidal anti-inflammatory drug',
    indications: 'pain relief, fever, inflammation',
    contraindications: 'peptic ulcer, kidney disease, pregnancy',
    sideEffects: 'stomach upset, bleeding, kidney problems',
    interactions: 'aspirin, warfarin, blood pressure medications',
    dosage: '400mg-800mg TID as needed',
    storage: 'Store at room temperature',
    isPrescription: false,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Metformin',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    category: 'Antidiabetic',
    type: 'Tablet',
    strength: '500mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Oral diabetes medication',
    indications: 'diabetes, blood sugar control',
    contraindications: 'kidney disease, liver disease, heart failure',
    sideEffects: 'nausea, diarrhea, lactic acidosis',
    interactions: 'alcohol, contrast dye',
    dosage: '500mg-1g BID with meals',
    storage: 'Store at room temperature',
    isPrescription: true,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Amlodipine',
    genericName: 'Amlodipine',
    brandName: 'Norvasc',
    category: 'Antihypertensive',
    type: 'Tablet',
    strength: '5mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Calcium channel blocker for blood pressure',
    indications: 'high blood pressure, hypertension, chest pain',
    contraindications: 'severe hypotension, pregnancy',
    sideEffects: 'dizziness, swelling, headache',
    interactions: 'grapefruit juice, other blood pressure medications',
    dosage: '5-10mg daily',
    storage: 'Store at room temperature',
    isPrescription: true,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Ashwagandha',
    genericName: 'Withania somnifera',
    brandName: 'Ayurvedic',
    category: 'Ayurvedic',
    type: 'Capsule',
    strength: '500mg',
    dosageForm: 'Capsule',
    route: 'Oral',
    manufacturer: 'Ayurvedic',
    description: 'Traditional Ayurvedic herb for stress and immunity',
    indications: 'stress, anxiety, immunity, general wellness',
    contraindications: 'pregnancy, thyroid disorders',
    sideEffects: 'drowsiness, stomach upset',
    interactions: 'sedatives, thyroid medications',
    dosage: '500mg-1g BID',
    storage: 'Store in cool, dry place',
    isPrescription: false,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    brandName: 'Generic',
    category: 'Vitamin',
    type: 'Capsule',
    strength: '1000IU',
    dosageForm: 'Capsule',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Vitamin D supplement for bone health',
    indications: 'vitamin D deficiency, bone health, immunity',
    contraindications: 'hypercalcemia, kidney stones',
    sideEffects: 'nausea, constipation, kidney problems',
    interactions: 'calcium supplements, thiazide diuretics',
    dosage: '1000-2000IU daily',
    storage: 'Store at room temperature',
    isPrescription: false,
    isControlled: false,
    isActive: true,
  },
  {
    name: 'Warfarin',
    genericName: 'Warfarin',
    brandName: 'Coumadin',
    category: 'Anticoagulant',
    type: 'Tablet',
    strength: '5mg',
    dosageForm: 'Tablet',
    route: 'Oral',
    manufacturer: 'Generic',
    description: 'Blood thinner to prevent clots',
    indications: 'blood clots, stroke prevention, heart conditions',
    contraindications: 'bleeding disorders, pregnancy, recent surgery',
    sideEffects: 'bleeding, bruising, hair loss',
    interactions: 'aspirin, NSAIDs, vitamin K, many medications',
    dosage: '2-10mg daily based on INR',
    storage: 'Store at room temperature',
    isPrescription: true,
    isControlled: false,
    isActive: true,
  },
];

async function addSampleMedicines() {
  try {
    console.log('Adding sample medicines to database...');
    
    for (const medicine of sampleMedicines) {
      const existing = await prisma.medicine.findFirst({
        where: { name: medicine.name }
      });
      
      if (!existing) {
        await prisma.medicine.create({
          data: medicine
        });
        console.log(`✅ Added: ${medicine.name}`);
      } else {
        console.log(`⏭️  Skipped: ${medicine.name} (already exists)`);
      }
    }
    
    const totalMedicines = await prisma.medicine.count();
    console.log(`\n🎉 Database now contains ${totalMedicines} medicines`);
    console.log('The AI system should now be able to generate suggestions!');
    
  } catch (error) {
    console.error('Error adding sample medicines:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleMedicines();
