import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Clock, Leaf, Shield, Star, CheckCircle, Zap, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Physical & Mental Weakness Remedies - Dhanvantari Ayurveda',
  description: 'Discover our comprehensive Ayurvedic remedies for physical and mental weakness. Experience natural solutions for energy enhancement, vitality, and mental clarity.',
}

const weaknessRemedies = [
  {
    id: 'physical-weakness',
    name: 'Physical Weakness Treatment',
    description: 'Natural remedies to restore physical strength and vitality',
    icon: Zap,
    image: '/assets/treatments/physical-weakness.webp',
    duration: '2-4 months',
    benefits: [
      'Increases physical strength',
      'Improves energy levels',
      'Enhances stamina and endurance',
      'Boosts immunity',
      'Promotes muscle development'
    ],
    treatments: [
      'Strength-building therapies',
      'Energy enhancement treatments',
      'Immunity boosters',
      'Muscle strengthening',
      'Vitality restoration'
    ]
  },
  {
    id: 'mental-weakness',
    name: 'Mental Weakness Treatment',
    description: 'Natural solutions for mental clarity and cognitive enhancement',
    icon: Brain,
    image: '/assets/treatments/mental-weakness.webp',
    duration: '3-6 months',
    benefits: [
      'Improves mental clarity',
      'Enhances memory and focus',
      'Reduces mental fatigue',
      'Boosts cognitive function',
      'Promotes emotional balance'
    ],
    treatments: [
      'Cognitive enhancement therapies',
      'Memory improvement treatments',
      'Mental clarity boosters',
      'Stress reduction techniques',
      'Brain health optimization'
    ]
  },
  {
    id: 'general-debility',
    name: 'General Debility Treatment',
    description: 'Comprehensive care for overall weakness and fatigue',
    icon: Heart,
    image: '/assets/treatments/general-debility.webp',
    duration: '3-6 months',
    benefits: [
      'Restores overall vitality',
      'Improves quality of life',
      'Enhances daily functioning',
      'Boosts confidence',
      'Promotes healthy aging'
    ],
    treatments: [
      'Vitality restoration therapy',
      'Holistic wellness programs',
      'Lifestyle optimization',
      'Nutritional support',
      'Energy enhancement'
    ]
  },
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Treatment',
    description: 'Natural remedies for persistent fatigue and low energy',
    icon: Shield,
    image: '/assets/treatments/chronic-fatigue.webp',
    duration: '4-8 months',
    benefits: [
      'Reduces chronic fatigue',
      'Improves sleep quality',
      'Enhances daily energy',
      'Boosts motivation',
      'Restores natural vitality'
    ],
    treatments: [
      'Fatigue management therapy',
      'Sleep optimization',
      'Energy restoration',
      'Stress management',
      'Lifestyle rehabilitation'
    ]
  }
]

const weaknessCauses = [
  {
    category: 'Physical Causes',
    causes: [
      'Nutritional deficiencies',
      'Chronic illnesses',
      'Post-illness recovery',
      'Aging and muscle loss',
      'Lack of physical activity',
      'Poor sleep patterns'
    ]
  },
  {
    category: 'Mental Causes',
    causes: [
      'Chronic stress and anxiety',
      'Mental overwork',
      'Emotional exhaustion',
      'Poor concentration',
      'Memory problems',
      'Depression and mood issues'
    ]
  },
  {
    category: 'Lifestyle Factors',
    causes: [
      'Poor diet and nutrition',
      'Lack of exercise',
      'Inadequate sleep',
      'Excessive stress',
      'Environmental factors',
      'Sedentary lifestyle'
    ]
  }
]

const treatmentBenefits = [
  {
    icon: Leaf,
    title: 'Natural Approach',
    description: 'Uses ancient Ayurvedic wisdom with natural herbs and therapies'
  },
  {
    icon: Shield,
    title: 'Safe & Effective',
    description: 'Time-tested treatments with proven results'
  },
  {
    icon: Brain,
    title: 'Holistic Care',
    description: 'Addresses both physical and mental aspects of weakness'
  },
  {
    icon: Star,
    title: 'Personalized Treatment',
    description: 'Customized approach based on individual health assessment'
  }
]

const WeaknessRemediesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Physical & Mental Weakness Remedies
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our comprehensive Ayurvedic remedies for physical and mental weakness. 
              Experience natural solutions for energy enhancement, vitality, and mental clarity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Energy Enhancement
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Mental Clarity
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Remedies
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What We Treat Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Comprehensive Weakness Treatment
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our specialized treatments address both physical and mental weakness using ancient Ayurvedic wisdom 
                combined with modern understanding of vitality and wellness. We focus on restoring natural energy 
                and strength from within.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive care includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Physical strength and vitality restoration</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Mental clarity and cognitive enhancement</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Energy enhancement and fatigue management</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Overall wellness and quality of life improvement</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/weakness-remedies-hero.webp"
                  alt="Physical & Mental Weakness Remedies"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Programs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Weakness Remedy Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our specialized treatment programs designed to address various types of weakness 
              and restore natural vitality for optimal health and wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {weaknessRemedies.map((remedy) => {
              const IconComponent = remedy.icon
              return (
                <Card key={remedy.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={remedy.image}
                      alt={remedy.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{remedy.name}</CardTitle>
                    <CardDescription className="text-gray-600">{remedy.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {remedy.duration}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {remedy.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Included Treatments:</h4>
                      <div className="flex flex-wrap gap-1">
                        {remedy.treatments.map((treatment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {treatment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" variant="default">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Common Causes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Weakness Causes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Weakness can result from various factors affecting both physical and mental health. 
              Understanding these causes helps in developing targeted treatment approaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {weaknessCauses.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.causes.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Weakness Remedies?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our treatments offer a unique combination of ancient wisdom and modern care 
              for comprehensive weakness treatment and vitality restoration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentBenefits.map((benefit) => {
              const IconComponent = benefit.icon
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Vitality Restoration Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our comprehensive treatment process designed to restore and enhance 
              your physical and mental vitality naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive evaluation of physical and mental health status
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
              <p className="text-sm text-gray-600">
                Personalized vitality restoration protocols
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Therapy Sessions</h3>
              <p className="text-sm text-gray-600">
                Regular treatment sessions with natural therapies
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
              <p className="text-sm text-gray-600">
                Ongoing care and guidance for sustained vitality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle & Diet Guidance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supporting Lifestyle & Diet
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your treatments with our comprehensive lifestyle and dietary guidance 
              for optimal vitality and wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Energy-Boosting Diet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Nutritional guidance specifically designed to enhance energy and vitality.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Energy-boosting foods</li>
                  <li>• Vitality-enhancing nutrition</li>
                  <li>• Strength-building foods</li>
                  <li>• Proper meal timing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-blue-600" />
                  Lifestyle Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lifestyle changes to support vitality and energy enhancement.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Exercise and physical activity</li>
                  <li>• Stress management techniques</li>
                  <li>• Sleep optimization</li>
                  <li>• Energy conservation strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-indigo-600" />
                  Herbal Supplements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Natural herbal supplements to support vitality and energy enhancement.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Energy-enhancing herbs</li>
                  <li>• Vitality boosters</li>
                  <li>• Strength-building formulas</li>
                  <li>• Mental clarity herbs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Restore Your Vitality?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your consultation today and discover how our natural remedies can help 
            restore your physical and mental strength naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WeaknessRemediesPage
