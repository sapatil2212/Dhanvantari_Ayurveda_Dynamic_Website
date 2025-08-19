import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Brain, Shield, Leaf, Heart, Users, Calendar, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Memory & Immunity Boosting Therapies - Cognitive Enhancement | Dhanvantari Clinic',
  description: 'Enhance memory, cognitive function, and immune system strength through authentic Ayurvedic therapies including Shirodhara, Medhya Rasayana, and immunity boosters.',
};

const memoryImmunityTherapies = [
  {
    name: 'Shirodhara',
    description: 'Traditional therapy involving continuous pouring of medicated oil on the forehead to enhance mental clarity, memory, and cognitive function.',
    icon: <Brain className="w-8 h-8" />,
    image: '/assets/hero_images/5.webp',
    duration: '30-45 minutes',
    benefits: [
      'Enhances memory and concentration',
      'Reduces stress and anxiety',
      'Improves sleep quality',
      'Strengthens nervous system',
      'Promotes mental clarity',
      'Balances Vata dosha'
    ],
    indications: [
      'Memory problems',
      'Stress and anxiety',
      'Insomnia',
      'Headaches',
      'Mental fatigue',
      'Concentration issues'
    ],
    procedure: [
      'Pre-treatment consultation',
      'Gentle head massage',
      'Medicated oil preparation',
      'Continuous oil pouring',
      'Relaxation period',
      'Post-treatment care'
    ],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Medhya Rasayana',
    description: 'Specialized herbal formulations and therapies designed to enhance cognitive function and memory through natural brain tonics.',
    icon: <Zap className="w-8 h-8" />,
    image: '/assets/hero_images/6.webp',
    duration: 'Program-based',
    benefits: [
      'Improves cognitive function',
      'Enhances memory retention',
      'Increases mental alertness',
      'Reduces mental fatigue',
      'Promotes learning ability',
      'Strengthens brain function'
    ],
    indications: [
      'Poor memory',
      'Learning difficulties',
      'Mental fatigue',
      'Cognitive decline',
      'Concentration problems',
      'Brain fog'
    ],
    procedure: [
      'Cognitive assessment',
      'Herbal medicine prescription',
      'Dietary recommendations',
      'Lifestyle modifications',
      'Regular monitoring',
      'Progress evaluation'
    ],
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Immunity Boosters',
    description: 'Comprehensive therapies to strengthen the immune system and enhance the body\'s natural defense mechanisms.',
    icon: <Shield className="w-8 h-8" />,
    image: '/assets/hero_images/7.webp',
    duration: 'Program-based',
    benefits: [
      'Strengthens immune system',
      'Reduces infection risk',
      'Improves overall health',
      'Enhances vitality',
      'Promotes healing',
      'Increases resistance'
    ],
    indications: [
      'Frequent infections',
      'Weak immunity',
      'Slow recovery',
      'Chronic fatigue',
      'Seasonal illnesses',
      'General weakness'
    ],
    procedure: [
      'Immunity assessment',
      'Herbal supplements',
      'Dietary modifications',
      'Lifestyle guidance',
      'Regular monitoring',
      'Preventive care'
    ],
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    name: 'Cognitive Enhancement',
    description: 'Advanced therapies combining multiple approaches to optimize brain function and mental performance.',
    icon: <Brain className="w-8 h-8" />,
    image: '/assets/hero_images/1.webp',
    duration: '45-60 minutes',
    benefits: [
      'Optimizes brain function',
      'Enhances mental performance',
      'Improves focus and attention',
      'Reduces mental stress',
      'Promotes creativity',
      'Increases mental stamina'
    ],
    indications: [
      'Work-related stress',
      'Academic pressure',
      'Creative blocks',
      'Mental exhaustion',
      'Performance anxiety',
      'Focus issues'
    ],
    procedure: [
      'Mental health assessment',
      'Therapeutic interventions',
      'Cognitive exercises',
      'Stress management',
      'Performance tracking',
      'Ongoing support'
    ],
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500/20 to-indigo-600/20'
  }
];

const supportingTherapies = [
  {
    name: 'Nasya Therapy',
    description: 'Nasal administration of medicated oils for brain health',
    duration: '15-20 minutes',
    benefits: ['Brain nourishment', 'Sinus health', 'Mental clarity', 'Headache relief']
  },
  {
    name: 'Shirobasti',
    description: 'Oil pooling therapy for head and spine strengthening',
    duration: '30-45 minutes',
    benefits: ['Nervous system strength', 'Memory enhancement', 'Headache relief', 'Mental relaxation']
  },
  {
    name: 'Herbal Supplements',
    description: 'Natural supplements for memory and immunity',
    duration: 'Daily intake',
    benefits: ['Cognitive support', 'Immune enhancement', 'Mental clarity', 'Overall wellness']
  },
  {
    name: 'Meditation & Yoga',
    description: 'Mind-body practices for mental wellness',
    duration: '30-60 minutes',
    benefits: ['Stress reduction', 'Mental clarity', 'Focus improvement', 'Emotional balance']
  }
];

const lifestyleRecommendations = [
  {
    category: 'Memory Enhancement',
    items: [
      'Regular mental exercises and puzzles',
      'Adequate sleep (7-8 hours)',
      'Brain-boosting foods',
      'Stress management techniques',
      'Regular reading and learning',
      'Social interaction and engagement'
    ]
  },
  {
    category: 'Immunity Strengthening',
    items: [
      'Balanced nutrition with immunity foods',
      'Regular exercise and physical activity',
      'Adequate hydration',
      'Stress reduction practices',
      'Good sleep hygiene',
      'Avoidance of harmful habits'
    ]
  },
  {
    category: 'Cognitive Wellness',
    items: [
      'Mindful meditation practices',
      'Creative activities and hobbies',
      'Regular nature walks',
      'Positive social connections',
      'Continuous learning',
      'Work-life balance'
    ]
  }
];

export default function MemoryImmunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-purple-200 text-purple-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Cognitive Enhancement & Immunity
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 mb-8 leading-tight">
            Memory & Immunity{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Boosting Therapies
            </span>
          </h1>
          <p className="text-lg md:text-xl text-purple-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Enhance your cognitive function, memory, and immune system strength through authentic Ayurvedic therapies 
            that promote mental clarity and overall wellness
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Cognitive Enhancement
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Immune Strengthening
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Mental Wellness
            </div>
          </div>
        </div>
      </section>

      {/* What are Memory & Immunity Therapies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="border-purple-200 text-purple-700 mb-4 px-4 py-2 text-sm font-medium">
                <Brain className="w-4 h-4 mr-2" />
                Mental & Physical Wellness
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
                What are Memory & Immunity Boosting Therapies?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Memory & Immunity Boosting Therapies are specialized Ayurvedic treatments designed to enhance 
                cognitive function, improve memory, and strengthen the body's natural defense mechanisms. 
                These therapies work holistically to promote mental and physical wellness.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                In today's fast-paced world, maintaining optimal cognitive function and a strong immune system 
                is essential for overall health and well-being. Our therapies address both aspects through 
                natural, time-tested methods.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-700">Cognitive Enhancement</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-700">Immune Strengthening</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-700">Natural Methods</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-700">Holistic Approach</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/hero_images/5.webp"
                alt="Memory & Immunity Therapy"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Expert Therapists</p>
                    <p className="text-xs text-gray-600">Specialized Training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memory & Immunity Therapies */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-purple-200 text-purple-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Specialized Treatments
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 mb-6">
              Our Memory & Immunity Therapies
            </h2>
            <p className="text-purple-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience our comprehensive range of therapies designed to enhance cognitive function, 
              improve memory, and strengthen your immune system through natural Ayurvedic methods
            </p>
          </div>

          <div className="space-y-12">
            {memoryImmunityTherapies.map((therapy, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${therapy.color} overflow-hidden border-2 hover:border-purple-300`}>
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
                      <Badge className="bg-white/90 text-purple-800 border-0 px-3 py-1 text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {therapy.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className={`w-16 h-16 ${therapy.color} rounded-2xl flex items-center justify-center mb-6 ${therapy.iconColor} shadow-lg`}>
                      {therapy.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">{therapy.name}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{therapy.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {therapy.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Indications
                        </h4>
                        <ul className="space-y-2">
                          {therapy.indications.map((indication, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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
            <Badge variant="outline" className="border-purple-200 text-purple-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Complementary Therapies
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 mb-6">
              Supporting Therapies
            </h2>
            <p className="text-purple-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Additional therapies that complement our main treatments and enhance the overall effectiveness 
              of memory and immunity enhancement programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportingTherapies.map((therapy, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-purple-100">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">{therapy.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{therapy.description}</p>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    {therapy.duration}
                  </Badge>
                  <ul className="space-y-1">
                    {therapy.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
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

      {/* Lifestyle Recommendations */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-purple-200 text-purple-700 mb-4 px-4 py-2 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Lifestyle Guidance
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 mb-6">
              Lifestyle Recommendations
            </h2>
            <p className="text-purple-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Essential lifestyle practices to support your memory enhancement and immunity strengthening journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {lifestyleRecommendations.map((recommendation, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-purple-100">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">{recommendation.category}</h3>
                  <ul className="space-y-2">
                    {recommendation.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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

      {/* Why Choose Memory & Immunity Therapies */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-purple-200 text-purple-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Natural Enhancement
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 mb-6">
              Why Choose Memory & Immunity Therapies?
            </h2>
            <p className="text-purple-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience the benefits of natural cognitive enhancement and immune strengthening
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Cognitive Enhancement</h3>
              <p className="text-gray-600 text-sm">Natural methods to improve memory and mental function</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Immune Strengthening</h3>
              <p className="text-gray-600 text-sm">Strengthen your body's natural defense mechanisms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Holistic Wellness</h3>
              <p className="text-gray-600 text-sm">Addresses both mental and physical aspects of health</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Expert Care</h3>
              <p className="text-gray-600 text-sm">Specialized therapists with deep knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">
                Ready to Enhance Your Memory & Immunity?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                Book a consultation with our cognitive enhancement and immunity specialists to get a personalized 
                program that will boost your mental function and strengthen your immune system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Memory & Immunity Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 text-lg px-8 py-6 rounded-xl transition-all duration-300">
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
