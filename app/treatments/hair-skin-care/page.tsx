import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Scissors, Clock, Leaf, Sparkles, Shield, Star, CheckCircle, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hair Fall, Premature Greying & Skin Care - Dhanvantari Ayurveda',
  description: 'Discover our comprehensive Ayurvedic treatments for hair fall, premature greying, and skin care. Experience natural solutions for healthy hair and radiant skin.',
}

const hairTreatments = [
  {
    id: 'hair-fall-treatment',
    name: 'Hair Fall Treatment',
    description: 'Natural Ayurvedic solutions for hair loss and thinning',
    icon: Scissors,
    image: '/assets/treatments/hair-fall-treatment.webp',
    duration: '3-6 months',
    benefits: [
      'Strengthens hair follicles',
      'Reduces hair fall significantly',
      'Promotes new hair growth',
      'Improves scalp health',
      'Enhances hair texture and shine'
    ],
    treatments: [
      'Shirodhara with medicated oils',
      'Scalp massage therapy',
      'Herbal hair masks',
      'Hair strengthening treatments',
      'Nutritional supplements'
    ]
  },
  {
    id: 'premature-greying',
    name: 'Premature Greying Treatment',
    description: 'Natural remedies to prevent and reverse premature greying',
    icon: Sparkles,
    image: '/assets/treatments/premature-greying.webp',
    duration: '4-8 months',
    benefits: [
      'Prevents premature greying',
      'Restores natural hair color',
      'Strengthens hair roots',
      'Improves hair quality',
      'Enhances melanin production'
    ],
    treatments: [
      'Herbal color restoration',
      'Melanin-boosting therapies',
      'Scalp rejuvenation',
      'Antioxidant treatments',
      'Hair nutrition therapy'
    ]
  },
  {
    id: 'hair-rejuvenation',
    name: 'Hair Rejuvenation Program',
    description: 'Comprehensive hair care for overall hair health',
    icon: Heart,
    image: '/assets/treatments/hair-rejuvenation.webp',
    duration: '2-4 months',
    benefits: [
      'Improves hair density',
      'Enhances hair growth rate',
      'Restores hair vitality',
      'Prevents damage and breakage',
      'Maintains healthy scalp'
    ],
    treatments: [
      'Hair growth stimulation',
      'Scalp health improvement',
      'Hair strengthening protocols',
      'Damage repair treatments',
      'Preventive care guidance'
    ]
  }
]

const skinTreatments = [
  {
    id: 'skin-rejuvenation',
    name: 'Skin Rejuvenation Therapy',
    description: 'Natural skin care for radiant and healthy complexion',
    icon: Sparkles,
    image: '/assets/treatments/skin-rejuvenation.webp',
    duration: '2-3 months',
    benefits: [
      'Improves skin texture',
      'Reduces fine lines and wrinkles',
      'Enhances skin glow',
      'Treats acne and blemishes',
      'Promotes even skin tone'
    ],
    treatments: [
      'Herbal facial treatments',
      'Skin detoxification',
      'Anti-aging therapies',
      'Acne treatment protocols',
      'Skin brightening treatments'
    ]
  },
  {
    id: 'acne-treatment',
    name: 'Acne & Blemish Treatment',
    description: 'Natural solutions for clear and healthy skin',
    icon: Shield,
    image: '/assets/treatments/acne-treatment.webp',
    duration: '3-6 months',
    benefits: [
      'Reduces acne breakouts',
      'Heals existing blemishes',
      'Prevents future breakouts',
      'Improves skin texture',
      'Reduces inflammation'
    ],
    treatments: [
      'Herbal acne treatments',
      'Skin purification therapy',
      'Anti-inflammatory care',
      'Scar reduction treatments',
      'Preventive skin care'
    ]
  },
  {
    id: 'anti-aging',
    name: 'Anti-Aging Skin Care',
    description: 'Natural anti-aging treatments for youthful skin',
    icon: Star,
    image: '/assets/treatments/anti-aging.webp',
    duration: '3-6 months',
    benefits: [
      'Reduces fine lines',
      'Improves skin elasticity',
      'Enhances skin firmness',
      'Promotes collagen production',
      'Maintains youthful glow'
    ],
    treatments: [
      'Collagen-boosting therapies',
      'Skin firming treatments',
      'Wrinkle reduction protocols',
      'Age-defying care',
      'Youthful skin maintenance'
    ]
  }
]

const commonCauses = [
  {
    category: 'Hair Problems',
    causes: [
      'Hormonal imbalances',
      'Nutritional deficiencies',
      'Stress and anxiety',
      'Scalp infections',
      'Hair care practices',
      'Environmental factors'
    ]
  },
  {
    category: 'Skin Issues',
    causes: [
      'Poor diet and nutrition',
      'Hormonal changes',
      'Environmental pollution',
      'Stress and lifestyle',
      'Skincare products',
      'Genetic factors'
    ]
  },
  {
    category: 'Premature Greying',
    causes: [
      'Vitamin B12 deficiency',
      'Oxidative stress',
      'Genetic predisposition',
      'Lifestyle factors',
      'Medical conditions',
      'Environmental toxins'
    ]
  }
]

const treatmentBenefits = [
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    description: 'Uses pure Ayurvedic herbs and natural ingredients'
  },
  {
    icon: Shield,
    title: 'Safe & Effective',
    description: 'Time-tested treatments with proven results'
  },
  {
    icon: Sparkles,
    title: 'Holistic Approach',
    description: 'Addresses root causes for lasting results'
  },
  {
    icon: Star,
    title: 'Personalized Care',
    description: 'Customized treatment plans for individual needs'
  }
]

const HairSkinCarePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Hair Fall, Premature Greying & Skin Care
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our comprehensive Ayurvedic treatments for healthy hair and radiant skin. 
              Experience natural solutions that address the root causes of hair and skin concerns.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Scissors className="w-4 h-4 mr-2" />
                Hair Care
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Skin Care
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Treatment
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Comprehensive Hair & Skin Care
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our specialized treatments address the most common hair and skin concerns using 
                ancient Ayurvedic wisdom combined with modern understanding of hair and skin health.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our comprehensive care includes:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Natural hair fall prevention and treatment</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Premature greying reversal and prevention</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Skin rejuvenation and anti-aging treatments</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Acne and blemish treatment protocols</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/hair-skin-hero.webp"
                  alt="Hair and Skin Care"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hair Treatments */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hair Care Treatments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience our specialized hair care treatments designed to address hair fall, 
              premature greying, and overall hair health using natural Ayurvedic methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hairTreatments.map((treatment) => {
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
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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

      {/* Skin Treatments */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Skin Care Treatments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our natural skin care treatments designed to address various skin concerns 
              and promote healthy, radiant skin using Ayurvedic principles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skinTreatments.map((treatment) => {
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

      {/* Common Causes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Hair & Skin Issues
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hair and skin problems can result from various factors. Understanding these causes 
              helps in developing targeted treatment approaches for lasting results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commonCauses.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.causes.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Hair & Skin Care?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our treatments offer a unique combination of ancient wisdom and modern care 
              for comprehensive hair and skin health improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentBenefits.map((benefit) => {
              const IconComponent = benefit.icon
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-amber-600" />
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Hair & Skin Care Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow our comprehensive treatment process designed to restore and maintain 
              healthy hair and radiant skin naturally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive evaluation of hair and skin condition
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Treatment Plan</h3>
              <p className="text-sm text-gray-600">
                Personalized care protocols for hair and skin
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-rose-600" />
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

      {/* Home Care & Lifestyle */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Home Care & Lifestyle Guidance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your treatments with our comprehensive home care and lifestyle guidance 
              for optimal hair and skin health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Home Care Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Natural home care products and routines for daily hair and skin care.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Herbal hair oils and masks</li>
                  <li>• Natural skin care products</li>
                  <li>• Daily care routines</li>
                  <li>• Product application guidance</li>
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
                  Lifestyle changes to support hair and skin health improvement.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Stress management techniques</li>
                  <li>• Sleep optimization</li>
                  <li>• Exercise recommendations</li>
                  <li>• Environmental protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Dietary Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Nutrition guidance for healthy hair and skin from within.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hair-healthy foods</li>
                  <li>• Skin-nourishing nutrition</li>
                  <li>• Vitamin and mineral supplements</li>
                  <li>• Hydration recommendations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Hair & Skin?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Book your consultation today and discover how our natural treatments can help 
            restore your hair and skin health naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-amber-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HairSkinCarePage
