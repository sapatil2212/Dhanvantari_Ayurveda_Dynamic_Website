import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Leaf, Sun, Moon, Wind, Droplets } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Seasonal Ayurvedic Therapies - Dhanvantari Ayurveda',
  description: 'Discover our seasonal Ayurvedic therapies designed to harmonize your body with nature\'s rhythms. Experience treatments tailored to each season for optimal health and wellness.',
}

const seasonalTherapies = [
  {
    id: 'spring-therapies',
    name: 'Spring (Vasant) Therapies',
    description: 'Detoxification and rejuvenation treatments for the spring season',
    icon: Leaf,
    image: '/assets/treatments/spring-therapy.webp',
    duration: '21-28 days',
    benefits: [
      'Removes accumulated Kapha dosha',
      'Boosts metabolism and energy',
      'Improves respiratory health',
      'Enhances skin complexion',
      'Strengthens immunity'
    ],
    treatments: [
      'Vaman (Therapeutic Vomiting)',
      'Nasya (Nasal Therapy)',
      'Herbal Steam Therapy',
      'Light Diet Regimen',
      'Morning Exercise Routine'
    ],
    procedures: [
      'Pre-treatment assessment and preparation',
      'Daily herbal decoctions and supplements',
      'Therapeutic massage with warming oils',
      'Steam therapy sessions',
      'Dietary modifications and lifestyle guidance'
    ]
  },
  {
    id: 'summer-therapies',
    name: 'Summer (Grishma) Therapies',
    description: 'Cooling and pacifying treatments for the hot summer months',
    icon: Sun,
    image: '/assets/treatments/summer-therapy.webp',
    duration: '14-21 days',
    benefits: [
      'Pacifies Pitta dosha',
      'Provides natural cooling effect',
      'Prevents heat-related disorders',
      'Improves digestion',
      'Enhances mental clarity'
    ],
    treatments: [
      'Sheetali Pranayama',
      'Cooling Herbal Baths',
      'Pitta Pacifying Massage',
      'Moonlight Therapy',
      'Cooling Diet Plan'
    ],
    procedures: [
      'Cooling oil massage with coconut oil',
      'Herbal cooling baths and compresses',
      'Breathing exercises for heat management',
      'Moonlight exposure therapy',
      'Cooling food and beverage recommendations'
    ]
  },
  {
    id: 'monsoon-therapies',
    name: 'Monsoon (Varsha) Therapies',
    description: 'Immunity-boosting and digestive treatments for the rainy season',
    icon: Droplets,
    image: '/assets/treatments/monsoon-therapy.webp',
    duration: '21-28 days',
    benefits: [
      'Strengthens immune system',
      'Improves digestive fire (Agni)',
      'Prevents monsoon-related diseases',
      'Enhances joint health',
      'Boosts energy levels'
    ],
    treatments: [
      'Agni Deepana (Digestive Fire Enhancement)',
      'Immunity Boosting Therapies',
      'Joint Care Treatments',
      'Herbal Steam Therapy',
      'Seasonal Diet Guidance'
    ],
    procedures: [
      'Digestive fire enhancement therapies',
      'Immunity-boosting herbal preparations',
      'Joint lubrication and strengthening',
      'Steam therapy for respiratory health',
      'Season-appropriate dietary recommendations'
    ]
  },
  {
    id: 'autumn-therapies',
    name: 'Autumn (Sharad) Therapies',
    description: 'Pitta-balancing and rejuvenation treatments for autumn',
    icon: Wind,
    image: '/assets/treatments/autumn-therapy.webp',
    duration: '14-21 days',
    benefits: [
      'Balances Pitta dosha',
      'Improves skin health',
      'Enhances mental clarity',
      'Strengthens vision',
      'Promotes emotional balance'
    ],
    treatments: [
      'Pitta Pacifying Therapies',
      'Eye Care Treatments',
      'Skin Rejuvenation',
      'Mental Clarity Enhancement',
      'Emotional Balance Therapies'
    ],
    procedures: [
      'Pitta-balancing oil treatments',
      'Eye care with cooling herbs',
      'Skin rejuvenation therapies',
      'Meditation and breathing exercises',
      'Emotional balance through aromatherapy'
    ]
  },
  {
    id: 'winter-therapies',
    name: 'Winter (Hemant/Shishira) Therapies',
    description: 'Warming and strengthening treatments for the cold winter months',
    icon: Moon,
    image: '/assets/treatments/winter-therapy.webp',
    duration: '28-35 days',
    benefits: [
      'Strengthens Vata dosha',
      'Improves bone and joint health',
      'Enhances muscle strength',
      'Boosts immunity',
      'Promotes deep sleep'
    ],
    treatments: [
      'Abhyanga (Warm Oil Massage)',
      'Bone Strengthening Therapies',
      'Muscle Building Treatments',
      'Immunity Enhancement',
      'Sleep Improvement Therapies'
    ],
    procedures: [
      'Daily warm oil massage',
      'Bone-strengthening herbal preparations',
      'Muscle-building therapies',
      'Immunity-boosting supplements',
      'Sleep-enhancing treatments'
    ]
  }
]

const SeasonalTherapiesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Seasonal Ayurvedic Therapies
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Harmonize your body with nature's rhythms through our specialized seasonal treatments. 
              Each season brings unique health challenges and opportunities for healing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Seasonal Alignment
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Natural Healing
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Timed Treatments
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* What are Seasonal Therapies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What are Seasonal Ayurvedic Therapies?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ayurveda recognizes that our bodies are deeply connected to the natural cycles of the seasons. 
                Each season affects our doshas (Vata, Pitta, Kapha) differently, creating unique health challenges 
                and opportunities for healing.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our seasonal therapies are designed to:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Balance doshas according to seasonal changes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Prevent seasonal health issues before they arise</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Enhance natural immunity and vitality</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Optimize your body's natural healing processes</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/treatments/seasonal-therapies-hero.webp"
                  alt="Seasonal Ayurvedic Therapies"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Therapies Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Seasonal Treatment Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the wisdom of Ayurveda through our comprehensive seasonal therapy programs, 
              each designed to address the unique challenges and opportunities of its season.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seasonalTherapies.map((therapy) => {
              const IconComponent = therapy.icon
              return (
                <Card key={therapy.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={therapy.image}
                      alt={therapy.name}
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
                    <CardTitle className="text-xl text-gray-900">{therapy.name}</CardTitle>
                    <CardDescription className="text-gray-600">{therapy.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {therapy.duration}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {therapy.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Included Treatments:</h4>
                      <div className="flex flex-wrap gap-1">
                        {therapy.treatments.map((treatment, index) => (
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

      {/* Supporting Therapies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supporting Therapies & Lifestyle
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complement your seasonal treatments with our supporting therapies and lifestyle guidance 
              for optimal results and long-term wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-6 h-6 mr-2 text-green-600" />
                  Herbal Supplements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Season-specific herbal formulations to support your treatment goals and maintain balance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Customized herbal decoctions</li>
                  <li>• Seasonal immunity boosters</li>
                  <li>• Digestive support formulas</li>
                  <li>• Energy enhancement supplements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  Lifestyle Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Personalized lifestyle recommendations aligned with seasonal changes and your constitution.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Daily routine adjustments</li>
                  <li>• Exercise recommendations</li>
                  <li>• Sleep optimization</li>
                  <li>• Stress management techniques</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="w-6 h-6 mr-2 text-purple-600" />
                  Dietary Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Seasonal dietary recommendations to support your treatment and maintain dosha balance.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Season-appropriate foods</li>
                  <li>• Dosha-balancing recipes</li>
                  <li>• Meal timing guidance</li>
                  <li>• Hydration recommendations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Your Seasonal Journey Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Seasonal Wellness Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Embark on a transformative journey through the seasons with our comprehensive 
              seasonal therapy programs designed for lasting health and vitality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600">
                Comprehensive evaluation of your current health status and seasonal needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Treatment</h3>
              <p className="text-sm text-gray-600">
                Personalized seasonal therapies and supporting treatments
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Guidance</h3>
              <p className="text-sm text-gray-600">
                Lifestyle and dietary recommendations for seasonal balance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
              <p className="text-sm text-gray-600">
                Ongoing support and seasonal adjustments for continued wellness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience Seasonal Wellness?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Book your consultation today and discover how seasonal Ayurvedic therapies 
            can transform your health and align you with nature's rhythms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SeasonalTherapiesPage
