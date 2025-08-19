import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Clock, Leaf, Shield, Star, CheckCircle, Calendar, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Menstrual Disorder Treatments - Dhanvantari Ayurveda',
  description: 'Discover our comprehensive Ayurvedic treatments for menstrual disorders. Experience natural solutions for irregular periods, PCOS, and other menstrual health issues.',
}

const menstrualTreatments = [
  {
    id: 'irregular-periods',
    name: 'Irregular Periods Treatment',
    description: 'Natural solutions for menstrual cycle regulation',
    icon: Calendar,
    image: '/assets/treatments/irregular-periods.webp',
    duration: '3-6 months',
    benefits: [
      'Regulates menstrual cycles',
      'Balances hormonal levels',
      'Reduces menstrual pain',
      'Improves overall health',
      'Enhances fertility'
    ],
    treatments: [
      'Hormonal balance therapy',
      'Herbal menstrual regulators',
      'Dietary modifications',
      'Stress management',
      'Lifestyle guidance'
    ]
  },
  {
    id: 'pcos-treatment',
    name: 'PCOS Treatment',
    description: 'Comprehensive care for Polycystic Ovary Syndrome',
    icon: Shield,
    image: '/assets/treatments/pcos-treatment.webp',
    duration: '6-12 months',
    benefits: [
      'Manages PCOS symptoms',
      'Regulates menstrual cycles',
      'Improves insulin sensitivity',
      'Reduces weight gain',
      'Enhances fertility'
    ],
    treatments: [
      'PCOS-specific therapies',
      'Weight management programs',
      'Hormonal balance treatments',
      'Insulin resistance management',
      'Fertility enhancement'
    ]
  },
  {
    id: 'painful-periods',
    name: 'Painful Periods Treatment',
    description: 'Natural relief for menstrual pain and discomfort',
    icon: Heart,
    image: '/assets/treatments/painful-periods.webp',
    duration: '2-4 months',
    benefits: [
      'Reduces menstrual pain',
      'Alleviates cramps',
      'Improves energy levels',
      'Reduces bloating',
      'Enhances mood'
    ],
    treatments: [
      'Pain relief therapies',
      'Anti-inflammatory treatments',
      'Relaxation techniques',
      'Dietary recommendations',
      'Stress reduction'
    ]
  },
  {
    id: 'heavy-bleeding',
    name: 'Heavy Bleeding Treatment',
    description: 'Natural management for excessive menstrual bleeding',
    icon: Zap,
    image: '/assets/treatments/heavy-bleeding.webp',
    duration: '3-6 months',
    benefits: [
      'Reduces heavy bleeding',
      'Prevents anemia',
      'Improves energy levels',
      'Regulates flow',
      'Enhances overall health'
    ],
    treatments: [
      'Flow regulation therapy',
      'Iron supplementation',
      'Herbal astringents',
      'Dietary modifications',
      'Energy enhancement'
    ]
  }
]

const commonDisorders = [
  {
    category: 'Hormonal Imbalances',
    disorders: [
      'Irregular menstrual cycles',
      'Amenorrhea (absence of periods)',
      'Oligomenorrhea (infrequent periods)',
      'Polymenorrhea (frequent periods)',
      'Hormonal acne',
      'Mood swings and PMS'
    ]
  },
  {
    category: 'Pain & Discomfort',
    disorders: [
      'Dysmenorrhea (painful periods)',
      'Severe menstrual cramps',
      'Lower back pain',
      'Abdominal bloating',
      'Breast tenderness',
      'Headaches during periods'
    ]
  },
  {
    category: 'Flow Issues',
    disorders: [
      'Menorrhagia (heavy bleeding)',
      'Hypomenorrhea (light bleeding)',
      'Spotting between periods',
      'Clotting during periods',
      'Prolonged periods',
      'Short periods'
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
    description: 'Time-tested treatments with minimal side effects'
  },
  {
    icon: Heart,
    title: 'Holistic Care',
    description: 'Addresses root causes for lasting results'
  },
  {
    icon: Star,
    title: 'Personalized Treatment',
    description: 'Customized approach based on individual health assessment'
  }
]

const MenstrualDisordersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Menstrual Disorder Treatments
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our comprehensive Ayurvedic treatments for menstrual disorders. 
              Experience natural solutions for irregular periods, PCOS, and other menstrual health issues.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Cycle Regulation
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Pain Relief
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Treatment
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
                Comprehensive Menstrual Health Care
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our specialized treatments address various menstrual disorders using ancient Ayurvedic wisdom 
                combined with modern understanding of women's health. We focus on treating the root causes 
                rather than just managing symptoms.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive care includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Natural regulation of menstrual cycles</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>PCOS management and treatment</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Pain relief for menstrual discomfort</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Hormonal balance restoration</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/menstrual-disorders-hero.webp"
                  alt="Menstrual Disorder Treatments"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Menstrual Disorder Treatment Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our specialized treatment programs designed to address various menstrual disorders 
              and restore natural hormonal balance for optimal women's health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {menstrualTreatments.map((treatment) => {
              const IconComponent = treatment.icon
              return (
                <Card key={treatment.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={treatment.image}
                      alt={treatment.name}
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
                    <CardTitle className="text-xl text-gray-900">{treatment.name}</CardTitle>
                    <CardDescription className="text-gray-600">{treatment.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {treatment.duration}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {treatment.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Included Treatments:</h4>
                      <div className="flex flex-wrap gap-1">
                        {treatment.treatments.map((treatment_item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {treatment_item}
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

      {/* Common Disorders */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Menstrual Disorders We Treat
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive treatment approach addresses various menstrual disorders 
              that affect women's health and quality of life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commonDisorders.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.disorders.map((disorder, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {disorder}
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Menstrual Disorder Treatment?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our treatments offer a unique combination of ancient wisdom and modern care 
              for comprehensive menstrual health improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentBenefits.map((benefit) => {
              const IconComponent = benefit.icon
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-rose-600" />
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
              Your Menstrual Health Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our comprehensive treatment process designed to restore and maintain 
              healthy menstrual cycles naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive evaluation of menstrual health and hormonal balance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
              <p className="text-sm text-gray-600">
                Personalized care protocols for specific menstrual disorders
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
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
                Ongoing care and guidance for lasting results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle & Diet Guidance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supporting Lifestyle & Diet
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your treatments with our comprehensive lifestyle and dietary guidance 
              for optimal menstrual health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Hormone-Balancing Diet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Nutritional guidance specifically designed to support hormonal balance and menstrual health.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hormone-balancing foods</li>
                  <li>• Anti-inflammatory nutrition</li>
                  <li>• Iron-rich foods</li>
                  <li>• Proper meal timing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-rose-600" />
                  Lifestyle Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lifestyle changes to support menstrual health and hormonal balance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stress management techniques</li>
                  <li>• Regular exercise routines</li>
                  <li>• Sleep optimization</li>
                  <li>• Environmental toxin avoidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Herbal Supplements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Natural herbal supplements to support menstrual health and hormonal balance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hormone-regulating herbs</li>
                  <li>• Pain-relieving formulas</li>
                  <li>• Iron supplements</li>
                  <li>• Stress-reducing herbs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Restore Your Menstrual Health?
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            Book your consultation today and discover how our natural treatments can help 
            restore your menstrual health and hormonal balance naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-rose-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MenstrualDisordersPage
