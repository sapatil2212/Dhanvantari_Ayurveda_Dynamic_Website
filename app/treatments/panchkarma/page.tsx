import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Leaf, Droplets, Wind, Zap, Heart, CheckCircle, AlertCircle, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Panchkarma Treatments - Traditional Ayurvedic Detoxification | Dhanvantari Clinic',
  description: 'Experience authentic Panchkarma treatments including Vaman, Virechan, Basti, Nasya, and Raktamokshan. Complete detoxification and rejuvenation therapies.',
};

const panchkarmaTreatments = [
  {
    name: 'Vaman (Therapeutic Vomiting)',
    description: 'Vaman is the first and most important therapy of Panchkarma, designed to eliminate excess Kapha dosha and toxins from the upper respiratory tract and stomach.',
    icon: <Droplets className="w-8 h-8" />,
    image: '/assets/hero_images/1.webp',
    duration: '3-5 days',
    benefits: [
      'Eliminates excess Kapha dosha',
      'Treats respiratory disorders',
      'Improves skin conditions',
      'Helps with diabetes management',
      'Reduces obesity',
      'Enhances digestive function'
    ],
    indications: [
      'Bronchial asthma',
      'Chronic sinusitis',
      'Skin diseases',
      'Diabetes mellitus',
      'Obesity',
      'Indigestion'
    ],
    procedure: [
      'Pre-treatment preparation (Purvakarma)',
      'Internal oleation with medicated ghee',
      'External oleation with medicated oils',
      'Steam therapy (Swedana)',
      'Therapeutic vomiting with herbal decoctions',
      'Post-treatment care and diet'
    ],
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Virechan (Purgation Therapy)',
    description: 'Virechan is a medicated purgation therapy that eliminates excess Pitta dosha and cleanses the small intestine, liver, and blood.',
    icon: <Wind className="w-8 h-8" />,
    image: '/assets/hero_images/2.webp',
    duration: '5-7 days',
    benefits: [
      'Eliminates excess Pitta dosha',
      'Purifies blood and liver',
      'Treats skin problems',
      'Reduces chronic fever',
      'Improves hyperacidity',
      'Relieves constipation'
    ],
    indications: [
      'Liver disorders',
      'Skin diseases',
      'Chronic fever',
      'Hyperacidity',
      'Constipation',
      'Blood disorders'
    ],
    procedure: [
      'Pre-treatment preparation',
      'Internal oleation with medicated ghee',
      'External oleation with medicated oils',
      'Steam therapy',
      'Medicated purgation',
      'Post-treatment care'
    ],
    color: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
    gradient: 'from-yellow-500/20 to-yellow-600/20'
  },
  {
    name: 'Basti (Medicated Enema)',
    description: 'Basti is considered the most important treatment for Vata disorders, involving medicated enemas that nourish and strengthen the body.',
    icon: <Leaf className="w-8 h-8" />,
    image: '/assets/hero_images/3.webp',
    duration: '8-15 days',
    benefits: [
      'Balances Vata dosha',
      'Strengthens nervous system',
      'Relieves joint pain',
      'Improves mobility',
      'Enhances immunity',
      'Promotes longevity'
    ],
    indications: [
      'Joint pain and arthritis',
      'Neurological disorders',
      'Paralysis',
      'Constipation',
      'Back pain',
      'General weakness'
    ],
    procedure: [
      'Pre-treatment preparation',
      'Internal oleation',
      'External oleation',
      'Steam therapy',
      'Medicated enema administration',
      'Post-treatment care'
    ],
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    name: 'Nasya (Nasal Therapy)',
    description: 'Nasya involves the administration of medicated oils or powders through nasal passages to treat head and neck disorders.',
    icon: <Zap className="w-8 h-8" />,
    image: '/assets/hero_images/4.webp',
    duration: '7-14 days',
    benefits: [
      'Treats head and neck disorders',
      'Improves sinus conditions',
      'Enhances hair health',
      'Relieves headaches',
      'Improves mental clarity',
      'Strengthens sense organs'
    ],
    indications: [
      'Sinusitis',
      'Headaches and migraines',
      'Hair problems',
      'Mental disorders',
      'Cervical spondylosis',
      'Eye disorders'
    ],
    procedure: [
      'Pre-treatment preparation',
      'Facial massage',
      'Steam therapy',
      'Nasal administration of medicines',
      'Post-treatment care',
      'Dietary recommendations'
    ],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Raktamokshan (Bloodletting)',
    description: 'Raktamokshan is a controlled blood purification therapy that eliminates blood-borne toxins and treats Pitta disorders.',
    icon: <Heart className="w-8 h-8" />,
    image: '/assets/hero_images/5.webp',
    duration: '1-3 sessions',
    benefits: [
      'Purifies blood',
      'Eliminates blood toxins',
      'Treats skin diseases',
      'Reduces inflammation',
      'Improves circulation',
      'Relieves pain'
    ],
    indications: [
      'Skin diseases',
      'Blood disorders',
      'Gout',
      'Hypertension',
      'Chronic wounds',
      'Inflammatory conditions'
    ],
    procedure: [
      'Patient assessment',
      'Selection of appropriate method',
      'Bloodletting procedure',
      'Wound care',
      'Post-treatment monitoring',
      'Follow-up care'
    ],
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    gradient: 'from-red-500/20 to-red-600/20'
  }
];

const supportingTherapies = [
  {
    name: 'Abhyanga (Oil Massage)',
    description: 'Full body oil massage with medicated oils to prepare the body for Panchkarma',
    duration: '45-60 minutes',
    benefits: ['Relaxes muscles', 'Improves circulation', 'Prepares body for detoxification']
  },
  {
    name: 'Swedana (Steam Therapy)',
    description: 'Herbal steam therapy to open channels and facilitate toxin elimination',
    duration: '15-20 minutes',
    benefits: ['Opens body channels', 'Facilitates detoxification', 'Relieves stiffness']
  },
  {
    name: 'Shirodhara',
    description: 'Continuous pouring of medicated oil on forehead for mental relaxation',
    duration: '30-45 minutes',
    benefits: ['Mental relaxation', 'Stress relief', 'Improves sleep quality']
  },
  {
    name: 'Shirobasti',
    description: 'Oil pooling therapy for head and spine to strengthen nervous system',
    duration: '30-45 minutes',
    benefits: ['Strengthens nervous system', 'Improves memory', 'Relieves headaches']
  }
];

export default function PanchkarmaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Traditional Ayurvedic Detoxification
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 mb-8 leading-tight">
            Panchkarma{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Treatments
            </span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the ancient wisdom of Panchkarma - the five traditional detoxification and rejuvenation therapies 
            that restore health, balance, and vitality through natural healing methods
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Complete Detoxification
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Dosha Balance
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Natural Healing
            </div>
          </div>
        </div>
      </section>

      {/* What is Panchkarma */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
                <Leaf className="w-4 h-4 mr-2" />
                Ancient Healing Science
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-6">
                What is Panchkarma?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Panchkarma is the cornerstone of Ayurvedic medicine, consisting of five therapeutic procedures 
                designed to eliminate toxins from the body and restore the natural balance of the three doshas 
                (Vata, Pitta, and Kapha).
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                These treatments have been practiced for thousands of years and are considered the most 
                comprehensive approach to detoxification and rejuvenation in Ayurvedic medicine.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm text-gray-700">Complete Detoxification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm text-gray-700">Dosha Balance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm text-gray-700">Natural Healing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className="text-sm text-gray-700">Long-term Benefits</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/hero_images/1.webp"
                alt="Panchkarma Treatment"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Expert Care</p>
                    <p className="text-xs text-gray-600">Experienced Therapists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panchkarma Treatments */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Five Traditional Therapies
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              The Five Panchkarma Treatments
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Each of the five Panchkarma treatments targets specific doshas and health concerns, 
              providing comprehensive detoxification and rejuvenation
            </p>
          </div>

          <div className="space-y-12">
            {panchkarmaTreatments.map((treatment, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${treatment.color} overflow-hidden border-2 hover:border-emerald-300`}>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <Image
                      src={treatment.image}
                      alt={treatment.name}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${treatment.gradient} opacity-60`}></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-emerald-800 border-0 px-3 py-1 text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {treatment.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className={`w-16 h-16 ${treatment.color} rounded-2xl flex items-center justify-center mb-6 ${treatment.iconColor} shadow-lg`}>
                      {treatment.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">{treatment.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{treatment.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {treatment.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Indications
                        </h4>
                        <ul className="space-y-2">
                          {treatment.indications.map((indication, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {indication}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting Therapies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Complementary Healing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Supporting Therapies
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Additional therapies that enhance the effectiveness of Panchkarma treatments 
              and promote overall wellness and relaxation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportingTherapies.map((therapy, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-3">{therapy.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{therapy.description}</p>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {therapy.duration}
                  </Badge>
                  <ul className="space-y-1">
                    {therapy.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Treatment Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Your Panchkarma Journey
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              A comprehensive treatment process designed to ensure optimal results and lasting wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Initial Consultation</h3>
              <p className="text-gray-600 text-sm">Comprehensive health assessment and dosha analysis to create personalized treatment plan</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Treatment Phase</h3>
              <p className="text-gray-600 text-sm">Undergo selected Panchkarma treatments with expert care and monitoring</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Recovery & Follow-up</h3>
              <p className="text-gray-600 text-sm">Post-treatment care, dietary guidance, and follow-up consultations for lasting results</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-6">
                Ready to Experience Panchkarma?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                Book a consultation with our experienced Ayurvedic physicians to determine 
                which Panchkarma treatments are best suited for your health needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment">
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Panchkarma Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 text-lg px-8 py-6 rounded-xl transition-all duration-300">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
