import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Flower, Heart, Sparkles, Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Kerala Beauty Therapies - Traditional Ayurvedic Beauty Treatments | Dhanvantari Clinic',
  description: 'Experience authentic Kerala beauty therapies including Ubtan therapy, herbal facials, body polishing, and aromatherapy for natural radiance and rejuvenation.',
};

const beautyTherapies = [
  {
    name: 'Ubtan Therapy',
    description: 'Traditional herbal paste therapy using natural ingredients like turmeric, sandalwood, and gram flour for deep cleansing and skin brightening.',
    icon: <Flower className="w-8 h-8" />,
    image: '/assets/hero_images/3.webp',
    duration: '60-75 minutes',
    benefits: [
      'Deep skin cleansing',
      'Natural skin brightening',
      'Removes dead skin cells',
      'Improves skin texture',
      'Reduces pigmentation',
      'Natural glow enhancement'
    ],
    ingredients: [
      'Turmeric powder',
      'Sandalwood paste',
      'Gram flour',
      'Rose water',
      'Milk cream',
      'Honey'
    ],
    procedure: [
      'Skin analysis and consultation',
      'Gentle cleansing with herbal cleanser',
      'Application of Ubtan paste',
      'Gentle massage and exfoliation',
      'Warm water rinse',
      'Moisturizing with herbal cream'
    ],
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
    gradient: 'from-pink-500/20 to-pink-600/20'
  },
  {
    name: 'Herbal Facial',
    description: 'Comprehensive facial treatment using pure herbal extracts and natural ingredients for skin rejuvenation and anti-aging benefits.',
    icon: <Heart className="w-8 h-8" />,
    image: '/assets/hero_images/4.webp',
    duration: '75-90 minutes',
    benefits: [
      'Skin rejuvenation',
      'Anti-aging effects',
      'Deep hydration',
      'Reduces fine lines',
      'Improves skin elasticity',
      'Natural radiance'
    ],
    ingredients: [
      'Aloe vera gel',
      'Cucumber extract',
      'Green tea',
      'Vitamin E oil',
      'Jojoba oil',
      'Essential oils'
    ],
    procedure: [
      'Double cleansing',
      'Steam therapy',
      'Herbal mask application',
      'Facial massage',
      'Toner application',
      'Moisturizing treatment'
    ],
    color: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    gradient: 'from-rose-500/20 to-rose-600/20'
  },
  {
    name: 'Body Polishing',
    description: 'Exfoliating body treatment using natural scrubs and herbal ingredients for smooth, glowing skin from head to toe.',
    icon: <Sparkles className="w-8 h-8" />,
    image: '/assets/hero_images/5.webp',
    duration: '90-120 minutes',
    benefits: [
      'Body exfoliation',
      'Smooth skin texture',
      'Improved blood circulation',
      'Cellulite reduction',
      'Skin tightening',
      'Natural glow'
    ],
    ingredients: [
      'Sea salt scrub',
      'Coffee grounds',
      'Coconut oil',
      'Essential oils',
      'Herbal extracts',
      'Natural moisturizers'
    ],
    procedure: [
      'Body cleansing',
      'Dry brushing',
      'Scrub application',
      'Gentle massage',
      'Warm shower',
      'Moisturizing treatment'
    ],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Aromatherapy',
    description: 'Therapeutic treatment using essential oils and aromatic compounds for relaxation, stress relief, and emotional well-being.',
    icon: <Flower className="w-8 h-8" />,
    image: '/assets/hero_images/6.webp',
    duration: '60-75 minutes',
    benefits: [
      'Deep relaxation',
      'Stress relief',
      'Emotional balance',
      'Improved sleep',
      'Mood enhancement',
      'Mental clarity'
    ],
    ingredients: [
      'Lavender oil',
      'Rose oil',
      'Sandalwood oil',
      'Jasmine oil',
      'Ylang-ylang oil',
      'Chamomile oil'
    ],
    procedure: [
      'Aroma consultation',
      'Oil selection',
      'Gentle massage',
      'Aromatherapy session',
      'Relaxation period',
      'Post-treatment care'
    ],
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500/20 to-indigo-600/20'
  }
];

const additionalTreatments = [
  {
    name: 'Hair Care Therapy',
    description: 'Natural hair treatments using herbal oils and traditional methods',
    duration: '45-60 minutes',
    benefits: ['Hair strengthening', 'Scalp health', 'Natural shine', 'Hair growth']
  },
  {
    name: 'Hand & Foot Care',
    description: 'Specialized treatments for hands and feet using natural ingredients',
    duration: '45-60 minutes',
    benefits: ['Soft skin', 'Nail health', 'Relaxation', 'Improved circulation']
  },
  {
    name: 'Eye Care Therapy',
    description: 'Gentle treatments around the eyes for reducing dark circles and puffiness',
    duration: '30-45 minutes',
    benefits: ['Reduces dark circles', 'Reduces puffiness', 'Brightens eyes', 'Relieves strain']
  },
  {
    name: 'Lip Care Therapy',
    description: 'Natural lip treatments for soft, healthy, and naturally colored lips',
    duration: '20-30 minutes',
    benefits: ['Soft lips', 'Natural color', 'Moisturization', 'Healing']
  }
];

export default function KeralaBeautyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-pink-200 text-pink-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Traditional Beauty Wisdom
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pink-800 mb-8 leading-tight">
            Kerala Beauty{' '}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Therapies
            </span>
          </h1>
          <p className="text-lg md:text-xl text-pink-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the ancient secrets of Kerala beauty through traditional Ayurvedic treatments 
            that enhance natural radiance and promote holistic wellness
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-pink-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              Natural Ingredients
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              Traditional Methods
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
              Holistic Beauty
            </div>
          </div>
        </div>
      </section>

      {/* What are Kerala Beauty Therapies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="border-pink-200 text-pink-700 mb-4 px-4 py-2 text-sm font-medium">
                <Flower className="w-4 h-4 mr-2" />
                Ancient Beauty Secrets
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-pink-800 mb-6">
                What are Kerala Beauty Therapies?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kerala Beauty Therapies are traditional Ayurvedic beauty treatments that have been practiced 
                for centuries in the southern state of Kerala, India. These therapies combine natural ingredients, 
                traditional techniques, and holistic wellness principles.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Unlike modern beauty treatments that focus only on external appearance, Kerala Beauty Therapies 
                address the root cause of beauty issues by balancing the doshas and promoting overall wellness.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-pink-600 mr-2" />
                  <span className="text-sm text-gray-700">Natural Ingredients</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-pink-600 mr-2" />
                  <span className="text-sm text-gray-700">Traditional Methods</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-pink-600 mr-2" />
                  <span className="text-sm text-gray-700">Holistic Approach</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-pink-600 mr-2" />
                  <span className="text-sm text-gray-700">Long-lasting Results</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/hero_images/3.webp"
                alt="Kerala Beauty Therapy"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-pink-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Expert Therapists</p>
                    <p className="text-xs text-gray-600">Traditional Training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beauty Therapies */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-pink-200 text-pink-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Traditional Beauty Treatments
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-800 mb-6">
              Our Beauty Therapies
            </h2>
            <p className="text-pink-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience the authentic beauty treatments of Kerala, designed to enhance your natural radiance 
              and promote overall wellness through traditional Ayurvedic methods
            </p>
          </div>

          <div className="space-y-12">
            {beautyTherapies.map((therapy, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${therapy.color} overflow-hidden border-2 hover:border-pink-300`}>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <Image
                      src={therapy.image}
                      alt={therapy.name}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${therapy.gradient} opacity-60`}></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-pink-800 border-0 px-3 py-1 text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {therapy.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className={`w-16 h-16 ${therapy.color} rounded-2xl flex items-center justify-center mb-6 ${therapy.iconColor} shadow-lg`}>
                      {therapy.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-pink-800 mb-4">{therapy.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{therapy.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-pink-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {therapy.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-pink-700 mb-3 flex items-center">
                          <Flower className="w-4 h-4 mr-2" />
                          Natural Ingredients
                        </h4>
                        <ul className="space-y-2">
                          {therapy.ingredients.map((ingredient, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {ingredient}
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

      {/* Additional Treatments */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-pink-200 text-pink-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Complementary Beauty Care
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-800 mb-6">
              Additional Beauty Treatments
            </h2>
            <p className="text-pink-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Specialized treatments that complement our main beauty therapies and address specific beauty concerns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalTreatments.map((treatment, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-pink-100">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <Flower className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-pink-800 mb-3">{treatment.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{treatment.description}</p>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {treatment.duration}
                  </Badge>
                  <ul className="space-y-1">
                    {treatment.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-pink-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
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

      {/* Why Choose Kerala Beauty Therapies */}
      <section className="py-20 px-4 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-pink-200 text-pink-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Authentic Beauty Care
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-pink-800 mb-6">
              Why Choose Kerala Beauty Therapies?
            </h2>
            <p className="text-pink-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience the difference that traditional Ayurvedic beauty treatments can make in your life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Flower className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Natural Ingredients</h3>
              <p className="text-gray-600 text-sm">Pure herbal extracts and natural ingredients without harmful chemicals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Holistic Approach</h3>
              <p className="text-gray-600 text-sm">Addresses both external beauty and internal wellness for lasting results</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Expert Therapists</h3>
              <p className="text-gray-600 text-sm">Trained professionals with deep knowledge of traditional techniques</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Proven Results</h3>
              <p className="text-gray-600 text-sm">Centuries-old methods that have stood the test of time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-pink-800 mb-6">
                Ready to Experience Natural Beauty?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                Book a consultation with our beauty therapists to discover which Kerala Beauty Therapies 
                are perfect for enhancing your natural radiance and promoting overall wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment">
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Beauty Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 text-lg px-8 py-6 rounded-xl transition-all duration-300">
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
