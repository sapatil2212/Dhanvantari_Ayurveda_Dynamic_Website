import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Droplets, Wind, Leaf, Zap, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ayurvedic Services & Panchkarma Treatments | Dhanvantari Clinic',
  description: 'Explore our comprehensive range of authentic Panchkarma treatments including Vaman, Virechan, Basti, Nasya, and specialized therapies.',
};

const panchkarmaServices = [
  {
    name: 'Vaman (Therapeutic Vomiting)',
    icon: <Droplets className="w-8 h-8" />,
    description: 'Controlled therapeutic vomiting to eliminate excess Kapha dosha and toxins from the upper respiratory tract and stomach.',
    benefits: ['Respiratory disorders', 'Skin diseases', 'Diabetes', 'Obesity', 'Digestive issues'],
    duration: '3-5 days',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Virechan (Purgation Therapy)',
    icon: <Wind className="w-8 h-8" />,
    description: 'Medicated purgation therapy to eliminate excess Pitta dosha and cleanse the small intestine.',
    benefits: ['Liver disorders', 'Skin problems', 'Chronic fever', 'Hyperacidity', 'Constipation'],
    duration: '5-7 days',
    color: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600'
  },
  {
    name: 'Basti (Medicated Enema)',
    icon: <Leaf className="w-8 h-8" />,
    description: 'Medicated enema therapy, considered the most important treatment for Vata disorders.',
    benefits: ['Joint pain', 'Arthritis', 'Paralysis', 'Neurological disorders', 'Constipation'],
    duration: '8-15 days',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600'
  },
  {
    name: 'Nasya (Nasal Therapy)',
    icon: <Zap className="w-8 h-8" />,
    description: 'Administration of medicated oils or powders through nasal passages to treat head and neck disorders.',
    benefits: ['Sinusitis', 'Headaches', 'Hair problems', 'Mental disorders', 'Cervical spondylosis'],
    duration: '7-14 days',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Raktamokshan (Bloodletting)',
    icon: <Heart className="w-8 h-8" />,
    description: 'Controlled blood purification therapy to eliminate blood-borne toxins and treat Pitta disorders.',
    benefits: ['Skin diseases', 'Blood disorders', 'Gout', 'Hypertension', 'Chronic wounds'],
    duration: '1-3 sessions',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600'
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Panchkarma & Ayurvedic Services
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Authentic traditional therapies for complete mind-body wellness
          </p>
        </div>
      </section>

      {/* Panchkarma Services */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Panchkarma Treatments</h2>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              The five traditional detoxification and rejuvenation therapies of Ayurveda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {panchkarmaServices.map((service, index) => (
              <Card key={index} className={`p-6 hover:shadow-lg transition-all duration-300 ${service.color}`}>
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-4 ${service.iconColor}`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-emerald-800">{service.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    <Clock className="w-3 h-3 mr-1" />
                    {service.duration}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-emerald-800 mb-2 text-sm">Beneficial for:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.benefits.map((benefit, i) => (
                        <li key={i}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Additional Therapies</h2>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              Specialized treatments for targeted wellness and rejuvenation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
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
    </div>
  );
}