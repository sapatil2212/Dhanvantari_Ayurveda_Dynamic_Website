import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Weight, Leaf, Heart, Brain, Users, Calendar, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Weight Management Solutions - Ayurvedic Weight Loss Programs | Dhanvantari Clinic',
  description: 'Discover natural Ayurvedic weight management solutions including Medohara therapy, Kapha balancing, diet consultation, and lifestyle guidance for sustainable weight loss.',
};

const weightManagementPrograms = [
  {
    name: 'Medohara Therapy',
    description: 'Traditional Ayurvedic therapy specifically designed to reduce excess fat and improve metabolism through natural methods.',
    icon: <Weight className="w-8 h-8" />,
    image: '/assets/hero_images/4.webp',
    duration: '21-45 days',
    benefits: [
      'Reduces excess body fat',
      'Improves metabolism',
      'Enhances digestion',
      'Increases energy levels',
      'Balances Kapha dosha',
      'Promotes healthy weight loss'
    ],
    treatments: [
      'Herbal medicines',
      'Therapeutic massages',
      'Steam therapy',
      'Dietary modifications',
      'Lifestyle guidance',
      'Regular monitoring'
    ],
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    gradient: 'from-orange-500/20 to-orange-600/20'
  },
  {
    name: 'Kapha Balancing Program',
    description: 'Comprehensive program to balance Kapha dosha, which is often associated with weight gain and slow metabolism.',
    icon: <Leaf className="w-8 h-8" />,
    image: '/assets/hero_images/5.webp',
    duration: '30-60 days',
    benefits: [
      'Balances Kapha dosha',
      'Accelerates metabolism',
      'Reduces water retention',
      'Improves energy levels',
      'Enhances mental clarity',
      'Promotes active lifestyle'
    ],
    treatments: [
      'Dosha-specific herbs',
      'Therapeutic exercises',
      'Dietary recommendations',
      'Lifestyle modifications',
      'Stress management',
      'Regular follow-ups'
    ],
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    name: 'Metabolic Enhancement',
    description: 'Focused program to boost metabolism and improve the body\'s natural fat-burning capabilities.',
    icon: <TrendingDown className="w-8 h-8" />,
    image: '/assets/hero_images/6.webp',
    duration: '21-30 days',
    benefits: [
      'Boosts metabolism',
      'Increases fat burning',
      'Improves digestion',
      'Enhances energy',
      'Reduces cravings',
      'Supports weight maintenance'
    ],
    treatments: [
      'Metabolic herbs',
      'Digestive therapies',
      'Exercise guidance',
      'Nutritional support',
      'Hormonal balance',
      'Progress tracking'
    ],
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Lifestyle Transformation',
    description: 'Holistic program that addresses all aspects of weight management including diet, exercise, and lifestyle changes.',
    icon: <Heart className="w-8 h-8" />,
    image: '/assets/hero_images/7.webp',
    duration: '60-90 days',
    benefits: [
      'Sustainable weight loss',
      'Lifestyle transformation',
      'Long-term health benefits',
      'Improved self-discipline',
      'Better sleep quality',
      'Enhanced well-being'
    ],
    treatments: [
      'Comprehensive assessment',
      'Personalized diet plan',
      'Exercise program',
      'Stress management',
      'Sleep optimization',
      'Ongoing support'
    ],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/20'
  }
];

const supportingTherapies = [
  {
    name: 'Abhyanga with Medicated Oils',
    description: 'Therapeutic massage using weight-reducing herbal oils',
    duration: '45-60 minutes',
    benefits: ['Fat reduction', 'Improved circulation', 'Lymphatic drainage', 'Relaxation']
  },
  {
    name: 'Swedana (Steam Therapy)',
    description: 'Herbal steam therapy to eliminate toxins and excess fat',
    duration: '15-20 minutes',
    benefits: ['Toxin elimination', 'Fat breakdown', 'Improved metabolism', 'Relaxation']
  },
  {
    name: 'Udwartana (Herbal Powder Massage)',
    description: 'Dry powder massage using weight-reducing herbs',
    duration: '30-45 minutes',
    benefits: ['Fat reduction', 'Skin toning', 'Improved circulation', 'Cellulite reduction']
  },
  {
    name: 'Herbal Supplements',
    description: 'Natural supplements to support weight loss and metabolism',
    duration: 'Daily intake',
    benefits: ['Metabolism boost', 'Appetite control', 'Fat burning', 'Energy enhancement']
  }
];

const dietaryGuidelines = [
  {
    category: 'Recommended Foods',
    items: [
      'Fresh vegetables and fruits',
      'Whole grains and legumes',
      'Lean proteins',
      'Herbs and spices',
      'Warm water and herbal teas',
      'Light, easily digestible foods'
    ]
  },
  {
    category: 'Foods to Avoid',
    items: [
      'Heavy, oily foods',
      'Processed and packaged foods',
      'Cold and frozen foods',
      'Excessive sweets',
      'Dairy products (in excess)',
      'Late night eating'
    ]
  },
  {
    category: 'Lifestyle Recommendations',
    items: [
      'Early morning exercise',
      'Regular meal timings',
      'Adequate sleep (7-8 hours)',
      'Stress management',
      'Mindful eating',
      'Regular physical activity'
    ]
  }
];

export default function WeightManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-orange-200 text-orange-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Natural Weight Management
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-800 mb-8 leading-tight">
            Weight Management{' '}
            <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>
          <p className="text-lg md:text-xl text-orange-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover sustainable weight management through authentic Ayurvedic approaches that address 
            the root cause of weight issues and promote lasting health transformation
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-orange-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Natural Methods
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Sustainable Results
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Holistic Approach
            </div>
          </div>
        </div>
      </section>

      {/* What is Ayurvedic Weight Management */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="border-orange-200 text-orange-700 mb-4 px-4 py-2 text-sm font-medium">
                <Weight className="w-4 h-4 mr-2" />
                Holistic Weight Loss
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-6">
                What is Ayurvedic Weight Management?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Ayurvedic weight management is a comprehensive approach that addresses the root cause of weight issues 
                rather than just focusing on calorie counting. It considers individual body constitution (dosha), 
                metabolism, and lifestyle factors.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Unlike fad diets, Ayurvedic weight management promotes sustainable weight loss through natural methods, 
                balanced nutrition, and lifestyle modifications that work in harmony with your body's natural processes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">Natural Methods</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">Sustainable Results</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">Holistic Approach</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">Long-term Health</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/hero_images/4.webp"
                alt="Weight Management"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Expert Guidance</p>
                    <p className="text-xs text-gray-600">Personalized Programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weight Management Programs */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-orange-200 text-orange-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Comprehensive Programs
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-6">
              Our Weight Management Programs
            </h2>
            <p className="text-orange-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Choose from our range of specialized weight management programs designed to address different 
              needs and provide sustainable results through natural Ayurvedic methods
            </p>
          </div>

          <div className="space-y-12">
            {weightManagementPrograms.map((program, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${program.color} overflow-hidden border-2 hover:border-orange-300`}>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.name}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60`}></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-orange-800 border-0 px-3 py-1 text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {program.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center mb-6 ${program.iconColor} shadow-lg`}>
                      {program.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-orange-800 mb-4">{program.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {program.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                          <Leaf className="w-4 h-4 mr-2" />
                          Treatments Include
                        </h4>
                        <ul className="space-y-2">
                          {program.treatments.map((treatment, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {treatment}
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
            <Badge variant="outline" className="border-orange-200 text-orange-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Complementary Therapies
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-6">
              Supporting Therapies
            </h2>
            <p className="text-orange-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Additional therapies that enhance the effectiveness of weight management programs 
              and accelerate your journey to a healthier weight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportingTherapies.map((therapy, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-orange-100">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">{therapy.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{therapy.description}</p>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {therapy.duration}
                  </Badge>
                  <ul className="space-y-1">
                    {therapy.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
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

      {/* Dietary Guidelines */}
      <section className="py-20 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-orange-200 text-orange-700 mb-4 px-4 py-2 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Lifestyle Guidance
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-6">
              Dietary & Lifestyle Guidelines
            </h2>
            <p className="text-orange-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Essential guidelines to support your weight management journey and maintain long-term results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {dietaryGuidelines.map((guideline, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-orange-100">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4">{guideline.category}</h3>
                  <ul className="space-y-2">
                    {guideline.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Ayurvedic Weight Management */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-orange-200 text-orange-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Natural Approach
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-800 mb-6">
              Why Choose Ayurvedic Weight Management?
            </h2>
            <p className="text-orange-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience the benefits of natural weight management that works with your body, not against it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Weight className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Natural Methods</h3>
              <p className="text-gray-600 text-sm">Uses natural herbs and therapies without harmful side effects</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Sustainable Results</h3>
              <p className="text-gray-600 text-sm">Focuses on long-term lifestyle changes for lasting weight loss</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Holistic Approach</h3>
              <p className="text-gray-600 text-sm">Addresses physical, mental, and emotional aspects of weight</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Personalized Care</h3>
              <p className="text-gray-600 text-sm">Tailored programs based on your unique body constitution</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-6">
                Ready to Start Your Weight Management Journey?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                Book a consultation with our weight management experts to get a personalized program 
                that will help you achieve sustainable weight loss and improved health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment">
                  <Button className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Weight Management Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 text-lg px-8 py-6 rounded-xl transition-all duration-300">
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
