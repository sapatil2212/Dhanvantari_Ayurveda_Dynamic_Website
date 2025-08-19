import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Clock, Leaf, Users, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Infertility (Uttarbasti) Treatment - Dhanvantari Ayurveda',
  description: 'Discover our specialized Uttarbasti treatment for infertility issues. Experience ancient Ayurvedic wisdom combined with modern care for reproductive health and fertility enhancement.',
}

const uttarbastiTreatments = [
  {
    id: 'uttarbasti-therapy',
    name: 'Uttarbasti Therapy',
    description: 'Ancient Ayurvedic treatment for reproductive health and fertility',
    icon: Heart,
    image: '/assets/treatments/uttarbasti-therapy.webp',
    duration: '7-14 days per cycle',
    benefits: [
      'Improves reproductive organ health',
      'Enhances fertility naturally',
      'Balances reproductive hormones',
      'Strengthens reproductive tissues',
      'Supports healthy conception'
    ],
    procedures: [
      'Herbal oil administration',
      'Medicated decoction therapy',
      'Reproductive organ strengthening',
      'Hormonal balance restoration',
      'Fertility enhancement protocols'
    ]
  },
  {
    id: 'fertility-enhancement',
    name: 'Fertility Enhancement Program',
    description: 'Comprehensive approach to improve fertility and reproductive health',
    icon: Users,
    image: '/assets/treatments/fertility-enhancement.webp',
    duration: '3-6 months',
    benefits: [
      'Optimizes reproductive health',
      'Improves egg and sperm quality',
      'Enhances uterine health',
      'Balances menstrual cycles',
      'Increases conception chances'
    ],
    procedures: [
      'Comprehensive health assessment',
      'Herbal fertility supplements',
      'Lifestyle and diet guidance',
      'Stress management techniques',
      'Regular monitoring and support'
    ]
  },
  {
    id: 'hormonal-balance',
    name: 'Hormonal Balance Therapy',
    description: 'Natural approach to balance reproductive hormones',
    icon: Shield,
    image: '/assets/treatments/hormonal-balance.webp',
    duration: '2-4 months',
    benefits: [
      'Regulates menstrual cycles',
      'Balances reproductive hormones',
      'Improves ovulation',
      'Reduces hormonal imbalances',
      'Supports overall reproductive health'
    ],
    procedures: [
      'Hormonal assessment',
      'Herbal hormone regulators',
      'Dietary modifications',
      'Stress reduction techniques',
      'Regular health monitoring'
    ]
  }
]

const infertilityCauses = [
  {
    category: 'Female Factors',
    causes: [
      'Ovulation disorders',
      'Uterine fibroids',
      'Endometriosis',
      'Polycystic ovary syndrome (PCOS)',
      'Blocked fallopian tubes',
      'Age-related fertility decline'
    ]
  },
  {
    category: 'Male Factors',
    causes: [
      'Low sperm count',
      'Poor sperm motility',
      'Abnormal sperm morphology',
      'Erectile dysfunction',
      'Hormonal imbalances',
      'Genetic factors'
    ]
  },
  {
    category: 'Lifestyle Factors',
    causes: [
      'Stress and anxiety',
      'Poor diet and nutrition',
      'Lack of exercise',
      'Smoking and alcohol',
      'Environmental toxins',
      'Sleep disturbances'
    ]
  }
]

const treatmentBenefits = [
  {
    icon: Heart,
    title: 'Natural Approach',
    description: 'Uses ancient Ayurvedic wisdom with natural herbs and therapies'
  },
  {
    icon: Shield,
    title: 'Safe & Effective',
    description: 'Time-tested treatments with minimal side effects'
  },
  {
    icon: Users,
    title: 'Holistic Care',
    description: 'Addresses physical, mental, and emotional aspects of fertility'
  },
  {
    icon: Star,
    title: 'Personalized Treatment',
    description: 'Customized approach based on individual health assessment'
  }
]

const InfertilityTreatmentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Infertility (Uttarbasti) Treatment
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the ancient wisdom of Uttarbasti therapy combined with modern Ayurvedic care 
              for reproductive health and fertility enhancement.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Fertility Care
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Treatment
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Proven Results
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What is Uttarbasti Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is Uttarbasti Treatment?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Uttarbasti is an ancient Ayurvedic treatment specifically designed for reproductive health 
                and fertility issues. This specialized therapy involves the administration of medicated oils 
                and decoctions through the reproductive tract to strengthen and nourish reproductive organs.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our Uttarbasti treatment program includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Comprehensive fertility assessment and diagnosis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Personalized Uttarbasti therapy protocols</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Herbal supplements for reproductive health</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Lifestyle and dietary guidance for fertility</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/uttarbasti-hero.webp"
                  alt="Uttarbasti Treatment"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Fertility Treatment Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our comprehensive fertility treatment programs designed to address 
              various aspects of reproductive health and enhance natural conception.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uttarbastiTreatments.map((treatment) => {
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
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Treatment Procedures:</h4>
                      <div className="flex flex-wrap gap-1">
                        {treatment.procedures.map((procedure, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {procedure}
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

      {/* Common Causes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Infertility Causes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Infertility can result from various factors affecting both men and women. 
              Understanding these causes helps in developing targeted treatment approaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {infertilityCauses.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.causes.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Fertility Treatment?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Uttarbasti treatment offers a unique combination of ancient wisdom and modern care 
              for comprehensive fertility enhancement.
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

      {/* Treatment Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Fertility Treatment Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our comprehensive treatment process designed to enhance your reproductive health 
              and improve fertility outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Initial Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive health evaluation and fertility assessment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
              <p className="text-sm text-gray-600">
                Personalized Uttarbasti therapy and fertility enhancement protocols
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Therapy Sessions</h3>
              <p className="text-sm text-gray-600">
                Regular treatment sessions with herbal therapies and guidance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ongoing Support</h3>
              <p className="text-sm text-gray-600">
                Continuous monitoring, guidance, and support throughout your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle & Diet Guidance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supporting Lifestyle & Diet
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your Uttarbasti treatment with our comprehensive lifestyle and dietary guidance 
              for optimal fertility enhancement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Fertility Diet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Nutrition guidance specifically designed to enhance reproductive health and fertility.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fertility-boosting foods</li>
                  <li>• Hormone-balancing nutrition</li>
                  <li>• Antioxidant-rich diet</li>
                  <li>• Proper meal timing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-pink-600" />
                  Lifestyle Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Lifestyle changes to support fertility and reproductive health.
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
                  Natural herbal supplements to support fertility and reproductive health.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Fertility-enhancing herbs</li>
                  <li>• Hormone-balancing formulas</li>
                  <li>• Reproductive health boosters</li>
                  <li>• Stress-reducing supplements</li>
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
            Ready to Begin Your Fertility Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Book your consultation today and discover how our Uttarbasti treatment can help 
            enhance your reproductive health and fertility naturally.
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

export default InfertilityTreatmentPage
