import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Atom as Stomach, Palette, Heart, Scale, User, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions We Treat | Ayurvedic Treatment in Nashik | Dhanvantari Clinic',
  description: 'Effective Ayurvedic treatments for chronic pain, digestive disorders, skin problems, stress, obesity, and more at Dhanvantari Ayurvedic Clinic.',
};

const conditions = [
  {
    name: 'Chronic Pain & Joint Disorders',
    icon: <User className="w-8 h-8" />,
    description: 'Comprehensive Ayurvedic approach to managing persistent pain and joint-related issues.',
    conditions: [
      'Arthritis (Rheumatoid & Osteoarthritis)',
      'Cervical & Lumbar Spondylosis',
      'Sciatica & Disc Problems',
      'Fibromyalgia',
      'Chronic Back Pain',
      'Knee & Shoulder Pain'
    ],
    treatments: ['Panchkarma', 'Abhyanga', 'Basti', 'Specialized Massage'],
    successRate: '92%',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Digestive Disorders',
    icon: <Stomach className="w-8 h-8" />,
    description: 'Restore digestive fire (Agni) and treat various gastrointestinal conditions naturally.',
    conditions: [
      'Irritable Bowel Syndrome (IBS)',
      'Chronic Constipation',
      'Hyperacidity & GERD',
      'Peptic Ulcers',
      'Inflammatory Bowel Disease',
      'Food Allergies & Intolerances'
    ],
    treatments: ['Virechan', 'Herbal Medicines', 'Dietary Counseling', 'Lifestyle Modifications'],
    successRate: '88%',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600'
  },
  {
    name: 'Skin & Hair Problems',
    icon: <Palette className="w-8 h-8" />,
    description: 'Natural solutions for various dermatological conditions and hair-related issues.',
    conditions: [
      'Eczema & Dermatitis',
      'Psoriasis',
      'Acne & Pimples',
      'Hair Fall & Premature Graying',
      'Dandruff & Scalp Issues',
      'Chronic Skin Allergies'
    ],
    treatments: ['Raktamokshan', 'Herbal Therapy', 'Specialized Oils', 'Dietary Changes'],
    successRate: '85%',
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600'
  },
  {
    name: 'Stress, Anxiety & Mental Health',
    icon: <Brain className="w-8 h-8" />,
    description: 'Holistic approach to mental wellness through Ayurvedic principles and therapies.',
    conditions: [
      'Chronic Stress & Anxiety',
      'Depression & Mood Disorders',
      'Insomnia & Sleep Disorders',
      'Memory & Concentration Issues',
      'Panic Attacks',
      'Burnout Syndrome'
    ],
    treatments: ['Shirodhara', 'Meditation Therapy', 'Nasya', 'Herbal Supplements'],
    successRate: '90%',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Obesity & Weight Management',
    icon: <Scale className="w-8 h-8" />,
    description: 'Sustainable weight management through metabolic correction and lifestyle changes.',
    conditions: [
      'Obesity & Overweight',
      'Metabolic Syndrome',
      'Thyroid Disorders',
      'PCOS-related Weight Gain',
      'Post-pregnancy Weight',
      'Stubborn Fat Deposits'
    ],
    treatments: ['Udwartana', 'Dietary Planning', 'Herbal Medicines', 'Lifestyle Counseling'],
    successRate: '78%',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600'
  },
  {
    name: 'Lifestyle & Chronic Diseases',
    icon: <Heart className="w-8 h-8" />,
    description: 'Management of lifestyle-related chronic conditions through Ayurvedic interventions.',
    conditions: [
      'Diabetes & Pre-diabetes',
      'Hypertension',
      'High Cholesterol',
      'Fatty Liver',
      'Chronic Fatigue Syndrome',
      'Hormonal Imbalances'
    ],
    treatments: ['Customized Panchkarma', 'Herbal Formulations', 'Yoga Therapy', 'Diet Modifications'],
    successRate: '82%',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600'
  }
];

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Conditions We Treat
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Comprehensive Ayurvedic solutions for a wide range of health conditions
          </p>
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5 mr-2" />
            Natural • Effective • Holistic
          </div>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {conditions.map((condition, index) => (
              <Card key={index} className={`p-8 hover:shadow-xl transition-all duration-300 ${condition.color}`}>
                <CardHeader className="pb-6">
                  <div className={`w-16 h-16 ${condition.color} rounded-full flex items-center justify-center mb-4 ${condition.iconColor}`}>
                    {condition.icon}
                  </div>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-emerald-800 flex-1">{condition.name}</CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-800 ml-4">
                      {condition.successRate} Success
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{condition.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-3">Conditions Treated:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {condition.conditions.map((cond, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {cond}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-3">Treatment Approach:</h4>
                    <div className="flex flex-wrap gap-2">
                      {condition.treatments.map((treatment, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {treatment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Learn More About Treatment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Our Treatment Process</h2>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              A systematic approach to healing that addresses root causes, not just symptoms
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Initial Consultation',
                description: 'Detailed assessment including pulse diagnosis, prakriti analysis, and health history'
              },
              {
                step: '02',
                title: 'Personalized Plan',
                description: 'Customized treatment protocol based on your unique constitution and condition'
              },
              {
                step: '03',
                title: 'Treatment Phase',
                description: 'Implementation of therapies, medicines, and lifestyle modifications'
              },
              {
                step: '04',
                title: 'Follow-up Care',
                description: 'Regular monitoring, adjustments, and long-term wellness guidance'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Condition Listed?</h2>
          <p className="text-emerald-100 mb-8">
            We treat many more conditions through Ayurveda. Contact us to discuss your specific health concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button className="bg-white text-emerald-800 hover:bg-emerald-50">
                Book Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-800">
                Ask Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}