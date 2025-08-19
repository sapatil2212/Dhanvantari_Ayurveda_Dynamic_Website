import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Clock, Leaf, Users, Shield, Star, CheckCircle, Baby } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Garbhsanskar – Healthy Pregnancy Care - Dhanvantari Ayurveda',
  description: 'Discover our comprehensive Garbhsanskar program for healthy pregnancy care. Experience ancient Ayurvedic wisdom for maternal and fetal wellness during pregnancy.',
}

const garbhsanskarPrograms = [
  {
    id: 'first-trimester',
    name: 'First Trimester Care',
    description: 'Essential care and support during the crucial first three months',
    icon: Heart,
    image: '/assets/treatments/first-trimester.webp',
    duration: '3 months',
    benefits: [
      'Supports healthy fetal development',
      'Reduces pregnancy complications',
      'Manages morning sickness naturally',
      'Strengthens maternal health',
      'Prepares for healthy pregnancy journey'
    ],
    treatments: [
      'Pregnancy nutrition guidance',
      'Herbal supplements for pregnancy',
      'Morning sickness management',
      'Stress reduction techniques',
      'Fetal development support'
    ]
  },
  {
    id: 'second-trimester',
    name: 'Second Trimester Care',
    description: 'Comprehensive care during the golden period of pregnancy',
    icon: Baby,
    image: '/assets/treatments/second-trimester.webp',
    duration: '3 months',
    benefits: [
      'Enhances fetal growth and development',
      'Improves maternal energy levels',
      'Supports healthy weight gain',
      'Reduces pregnancy discomforts',
      'Prepares for childbirth'
    ],
    treatments: [
      'Enhanced nutrition programs',
      'Gentle pregnancy exercises',
      'Fetal bonding activities',
      'Pregnancy yoga and meditation',
      'Childbirth preparation'
    ]
  },
  {
    id: 'third-trimester',
    name: 'Third Trimester Care',
    description: 'Final preparation and care for safe delivery',
    icon: Shield,
    image: '/assets/treatments/third-trimester.webp',
    duration: '3 months',
    benefits: [
      'Prepares for safe delivery',
      'Reduces delivery complications',
      'Enhances maternal strength',
      'Supports optimal fetal position',
      'Prepares for postpartum care'
    ],
    treatments: [
      'Delivery preparation',
      'Labor support techniques',
      'Postpartum care planning',
      'Breastfeeding preparation',
      'Newborn care guidance'
    ]
  }
]

const garbhsanskarPractices = [
  {
    category: 'Physical Care',
    practices: [
      'Gentle pregnancy exercises',
      'Pregnancy yoga and meditation',
      'Proper posture and body mechanics',
      'Rest and relaxation techniques',
      'Safe massage therapies',
      'Breathing exercises'
    ]
  },
  {
    category: 'Nutritional Care',
    practices: [
      'Balanced pregnancy diet',
      'Herbal supplements and tonics',
      'Hydration and fluid intake',
      'Pregnancy superfoods',
      'Meal timing and frequency',
      'Food safety guidelines'
    ]
  },
  {
    category: 'Mental & Emotional Care',
    practices: [
      'Stress management techniques',
      'Positive thinking practices',
      'Fetal bonding activities',
      'Meditation and mindfulness',
      'Emotional support counseling',
      'Spiritual practices'
    ]
  }
]

const treatmentBenefits = [
  {
    icon: Heart,
    title: 'Holistic Care',
    description: 'Comprehensive care for mother and baby throughout pregnancy'
  },
  {
    icon: Shield,
    title: 'Safe & Natural',
    description: 'Time-tested Ayurvedic practices with proven benefits'
  },
  {
    icon: Baby,
    title: 'Fetal Development',
    description: 'Supports optimal growth and development of the baby'
  },
  {
    icon: Star,
    title: 'Personalized Care',
    description: 'Customized care plans based on individual needs'
  }
]

const PregnancyCarePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Garbhsanskar – Healthy Pregnancy Care
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the ancient wisdom of Garbhsanskar for a healthy and joyful pregnancy journey. 
              Our comprehensive care program supports both mother and baby throughout this special time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Pregnancy Care
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Baby className="w-4 h-4 mr-2" />
                Fetal Development
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Care
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What is Garbhsanskar Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is Garbhsanskar?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Garbhsanskar is an ancient Ayurvedic practice that focuses on the holistic care of 
                pregnant women and their unborn babies. This comprehensive program combines physical, 
                mental, emotional, and spiritual care to ensure a healthy pregnancy and optimal fetal development.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our Garbhsanskar program includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Comprehensive pregnancy care and monitoring</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Nutritional guidance for maternal and fetal health</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Mental and emotional support throughout pregnancy</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Preparation for safe delivery and postpartum care</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/garbhsanskar-hero.webp"
                  alt="Garbhsanskar Pregnancy Care"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trimester-wise Care */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trimester-wise Pregnancy Care
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Garbhsanskar program provides specialized care for each trimester, addressing 
              the unique needs and challenges of each stage of pregnancy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {garbhsanskarPrograms.map((program) => {
              const IconComponent = program.icon
              return (
                <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={program.image}
                      alt={program.name}
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
                    <CardTitle className="text-xl text-gray-900">{program.name}</CardTitle>
                    <CardDescription className="text-gray-600">{program.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {program.duration}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {program.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Included Care:</h4>
                      <div className="flex flex-wrap gap-1">
                        {program.treatments.map((treatment, index) => (
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

      {/* Garbhsanskar Practices */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Garbhsanskar Practices
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive Garbhsanskar program incorporates traditional practices designed 
              to support maternal health and optimal fetal development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {garbhsanskarPractices.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.practices.map((practice, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {practice}
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Garbhsanskar Care?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Garbhsanskar program offers a unique combination of ancient wisdom and modern care 
              for comprehensive pregnancy support and optimal fetal development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentBenefits.map((benefit) => {
              const IconComponent = benefit.icon
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pregnancy Journey */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Pregnancy Journey with Garbhsanskar
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our comprehensive care process designed to support you and your baby 
              throughout the beautiful journey of pregnancy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Initial Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive health evaluation and pregnancy planning
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Care Planning</h3>
              <p className="text-sm text-gray-600">
                Personalized Garbhsanskar care protocols for each trimester
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ongoing Care</h3>
              <p className="text-sm text-gray-600">
                Regular monitoring and support throughout pregnancy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Support</h3>
              <p className="text-sm text-gray-600">
                Preparation for safe delivery and postpartum care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutrition & Lifestyle */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nutrition & Lifestyle Guidance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your Garbhsanskar care with our comprehensive nutrition and lifestyle guidance 
              for optimal maternal and fetal health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Pregnancy Nutrition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive nutritional guidance for healthy pregnancy and fetal development.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Balanced pregnancy diet plans</li>
                  <li>• Essential nutrients and supplements</li>
                  <li>• Pregnancy superfoods</li>
                  <li>• Hydration and fluid intake</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-pink-600" />
                  Lifestyle Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lifestyle modifications to support healthy pregnancy and maternal wellness.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Safe pregnancy exercises</li>
                  <li>• Stress management techniques</li>
                  <li>• Sleep optimization</li>
                  <li>• Environmental safety</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Herbal Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Safe herbal supplements and tonics for pregnancy support.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pregnancy-safe herbs</li>
                  <li>• Natural supplements</li>
                  <li>• Herbal tonics</li>
                  <li>• Safety guidelines</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Begin Your Pregnancy Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Book your consultation today and discover how our Garbhsanskar program can support 
            you and your baby throughout this beautiful pregnancy journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-pink-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PregnancyCarePage
