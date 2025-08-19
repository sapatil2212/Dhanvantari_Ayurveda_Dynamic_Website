import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Droplets, Wind, Leaf, Zap, Heart, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import TreatmentImage from '@/components/ui/TreatmentImage';

export const metadata: Metadata = {
  title: 'Ayurvedic Treatments & Panchkarma Therapies | Dhanvantari Clinic',
  description: 'Explore our comprehensive range of authentic Ayurvedic treatments including Panchkarma, Seasonal Therapies, Kerala Beauty Therapies, Weight Management, and specialized wellness solutions.',
};

const panchkarmaServices = [
  {
    name: 'Vaman (Therapeutic Vomiting)',
    icon: <Droplets className="w-8 h-8" />,
    description: 'Controlled therapeutic vomiting to eliminate excess Kapha dosha and toxins from the upper respiratory tract and stomach.',
    benefits: ['Respiratory disorders', 'Skin diseases', 'Diabetes', 'Obesity', 'Digestive issues'],
    duration: '3-5 days',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    image: '/assets/hero_images/1.webp',
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Virechan (Purgation Therapy)',
    icon: <Wind className="w-8 h-8" />,
    description: 'Medicated purgation therapy to eliminate excess Pitta dosha and cleanse the small intestine.',
    benefits: ['Liver disorders', 'Skin problems', 'Chronic fever', 'Hyperacidity', 'Constipation'],
    duration: '5-7 days',
    color: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
    image: '/assets/hero_images/2.webp',
    gradient: 'from-yellow-500/20 to-yellow-600/20'
  },
  {
    name: 'Basti (Medicated Enema)',
    icon: <Leaf className="w-8 h-8" />,
    description: 'Medicated enema therapy, considered the most important treatment for Vata disorders.',
    benefits: ['Joint pain', 'Arthritis', 'Paralysis', 'Neurological disorders', 'Constipation'],
    duration: '8-15 days',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    image: '/assets/hero_images/3.webp',
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    name: 'Nasya (Nasal Therapy)',
    icon: <Zap className="w-8 h-8" />,
    description: 'Administration of medicated oils or powders through nasal passages to treat head and neck disorders.',
    benefits: ['Sinusitis', 'Headaches', 'Hair problems', 'Mental disorders', 'Cervical spondylosis'],
    duration: '7-14 days',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    image: '/assets/hero_images/4.webp',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Raktamokshan (Bloodletting)',
    icon: <Heart className="w-8 h-8" />,
    description: 'Controlled blood purification therapy to eliminate blood-borne toxins and treat Pitta disorders.',
    benefits: ['Skin diseases', 'Blood disorders', 'Gout', 'Hypertension', 'Chronic wounds'],
    duration: '1-3 sessions',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    image: '/assets/hero_images/5.webp',
    gradient: 'from-red-500/20 to-red-600/20'
  }
];

const additionalServices = [
  {
    name: 'Abhyanga',
    description: 'Full body oil massage with medicated oils',
    duration: '45-60 mins'
  },
  {
    name: 'Shirodhara',
    description: 'Continuous pouring of medicated oil on forehead',
    duration: '30-45 mins'
  },
  {
    name: 'Swedana (Steam Therapy)',
    description: 'Herbal steam therapy for detoxification',
    duration: '15-20 mins'
  },
  {
    name: 'Shirobasti',
    description: 'Oil pooling therapy for head and spine',
    duration: '30-45 mins'
  },
  {
    name: 'Karnpuran',
    description: 'Ear therapy with medicated oils',
    duration: '20-30 mins'
  },
  {
    name: 'Netradhara',
    description: 'Eye therapy for vision and eye health',
    duration: '20-30 mins'
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Authentic Ayurvedic Healing
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 mb-8 leading-tight">
            Ayurvedic{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Treatments & Therapies
            </span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive wellness solutions through authentic Ayurvedic practices, 
            combining ancient wisdom with modern healthcare approaches
          </p>
        </div>
      </section>

      {/* Panchkarma Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Traditional Healing Methods
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Panchkarma Treatments
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              The five traditional detoxification and rejuvenation therapies of Ayurveda, 
              practiced for thousands of years to restore health and vitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {panchkarmaServices.map((service, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${service.color} overflow-hidden border-2 hover:border-emerald-300 group`}>
                <div className="relative h-48 overflow-hidden">
                  <TreatmentImage 
                    src={service.image}
                    fallbackSrc="/assets/hero_images/1.webp"
                    alt={service.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    icon={service.icon}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-emerald-800 border-0 px-3 py-1 text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-4 ${service.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-emerald-800 font-bold">{service.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                                     <div className="mb-6">
                     <span className="text-sm font-semibold text-emerald-700 mb-3 block">Beneficial for:</span>
                     <div className="flex flex-wrap gap-2">
                       {service.benefits.map((benefit, i) => (
                         <div key={i} className="flex items-center text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded-full">
                           <div className="w-1 h-1 bg-emerald-400 rounded-full mr-1"></div>
                           {benefit}
                         </div>
                       ))}
                     </div>
                   </div>
                  
                  <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50 group-hover:border-emerald-300 transition-all duration-300">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Treatments */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Holistic Wellness Solutions
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Specialized Treatments
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Targeted therapies for specific health concerns and wellness goals, 
              designed to address individual needs and promote overall well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Seasonal Ayurvedic Therapies</h3>
                <p className="text-gray-600 text-sm mb-3">Season-specific treatments to maintain dosha balance throughout the year</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Varies by season
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Kerala Beauty Therapies</h3>
                <p className="text-gray-600 text-sm mb-3">Traditional beauty treatments for radiant skin and natural glow</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  60-90 mins
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Weight Management Solutions</h3>
                <p className="text-gray-600 text-sm mb-3">Natural approaches to healthy weight loss and metabolism optimization</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Program-based
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Memory & Immunity Boosting</h3>
                <p className="text-gray-600 text-sm mb-3">Therapies to enhance cognitive function and strengthen immune system</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  30-45 mins
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Infertility (Uttarbasti) Treatment</h3>
                <p className="text-gray-600 text-sm mb-3">Specialized reproductive health treatments for fertility enhancement</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Program-based
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Hair & Skin Care</h3>
                <p className="text-gray-600 text-sm mb-3">Natural solutions for hair fall, premature greying and skin health</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  45-60 mins
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Garbhsanskar – Pregnancy Care</h3>
                <p className="text-gray-600 text-sm mb-3">Holistic care for healthy pregnancy and fetal development</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Program-based
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Menstrual Disorder Treatments</h3>
                <p className="text-gray-600 text-sm mb-3">Natural therapies for menstrual health and hormonal balance</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Program-based
                </Badge>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Weakness Remedies</h3>
                <p className="text-gray-600 text-sm mb-3">Solutions for physical and mental weakness through natural therapies</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Program-based
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Therapies */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
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
              Complementary treatments for enhanced wellness and rejuvenation, 
              designed to support your healing journey and promote overall vitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300 group bg-white">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Healing Journey?</h2>
          <p className="text-emerald-100 mb-8">
            Book a consultation to discover which treatments are best suited for your health needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button className="bg-white text-emerald-800 hover:bg-emerald-50">
                Book Consultation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-gray-200 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 mb-6">
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                Book a consultation with our experienced Ayurvedic physicians to get a 
                personalized treatment plan based on your unique health needs and constitution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-appointment">
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Book Consultation
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