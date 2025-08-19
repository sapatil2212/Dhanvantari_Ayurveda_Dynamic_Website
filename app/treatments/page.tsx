import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, Leaf, Heart, Brain, Baby, Flower, Weight, Shield, Users, Moon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Ayurvedic Treatments & Therapies | Dhanvantari Ayurvedic Clinic',
  description: 'Discover our comprehensive range of authentic Ayurvedic treatments including Panchkarma, specialized therapies, and wellness solutions for complete health restoration.',
};

const treatmentCategories = [
  {
    id: 'panchkarma',
    name: 'Panchkarma',
    description: 'Traditional detoxification and rejuvenation therapies',
    icon: <Leaf className="w-8 h-8" />,
    image: '/assets/hero_images/1.webp',
    duration: '7-21 days',
    benefits: ['Complete detoxification', 'Dosha balance', 'Enhanced immunity', 'Natural healing'],
    color: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    gradient: 'from-emerald-500/20 to-emerald-600/20',
    treatments: ['Vaman', 'Virechan', 'Basti', 'Nasya', 'Raktamokshan']
  },
  {
    id: 'seasonal-therapies',
    name: 'Seasonal Ayurvedic Therapies',
    description: 'Season-specific treatments to maintain dosha balance',
    icon: <Moon className="w-8 h-8" />,
    image: '/assets/hero_images/2.webp',
    duration: 'Varies by season',
    benefits: ['Seasonal wellness', 'Dosha harmony', 'Preventive care', 'Natural adaptation'],
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-500/20 to-blue-600/20',
    treatments: ['Varsha Ritucharya', 'Sharad Ritucharya', 'Hemant Ritucharya', 'Vasant Ritucharya']
  },
  {
    id: 'kerala-beauty',
    name: 'Kerala Beauty Therapies',
    description: 'Traditional beauty treatments for radiant skin and natural glow',
    icon: <Flower className="w-8 h-8" />,
    image: '/assets/hero_images/3.webp',
    duration: '60-90 mins',
    benefits: ['Natural radiance', 'Skin rejuvenation', 'Anti-aging', 'Holistic beauty'],
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
    gradient: 'from-pink-500/20 to-pink-600/20',
    treatments: ['Ubtan Therapy', 'Herbal Facials', 'Body Polishing', 'Aromatherapy']
  },
  {
    id: 'weight-management',
    name: 'Weight Management Solutions',
    description: 'Natural approaches to healthy weight loss and metabolism optimization',
    icon: <Weight className="w-8 h-8" />,
    image: '/assets/hero_images/4.webp',
    duration: 'Program-based',
    benefits: ['Sustainable weight loss', 'Metabolism boost', 'Energy enhancement', 'Lifestyle balance'],
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    gradient: 'from-orange-500/20 to-orange-600/20',
    treatments: ['Medohara Therapy', 'Kapha Balancing', 'Diet Consultation', 'Exercise Guidance']
  },
  {
    id: 'memory-immunity',
    name: 'Memory & Immunity Boosting Therapies',
    description: 'Therapies to enhance cognitive function and strengthen immune system',
    icon: <Brain className="w-8 h-8" />,
    image: '/assets/hero_images/5.webp',
    duration: '30-45 mins',
    benefits: ['Enhanced memory', 'Stronger immunity', 'Mental clarity', 'Stress relief'],
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/20 to-purple-600/20',
    treatments: ['Shirodhara', 'Medhya Rasayana', 'Immunity Boosters', 'Cognitive Enhancement']
  },
  {
    id: 'infertility-treatment',
    name: 'Infertility (Uttarbasti) Treatment',
    description: 'Specialized reproductive health treatments for fertility enhancement',
    icon: <Heart className="w-8 h-8" />,
    image: '/assets/hero_images/6.webp',
    duration: 'Program-based',
    benefits: ['Fertility enhancement', 'Hormonal balance', 'Reproductive health', 'Natural conception'],
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    gradient: 'from-red-500/20 to-red-600/20',
    treatments: ['Uttarbasti', 'Vajikarana', 'Garbhasthapana', 'Reproductive Wellness']
  },
  {
    id: 'hair-skin-care',
    name: 'Hair Fall, Premature Greying & Skin Care',
    description: 'Natural solutions for hair fall, premature greying and skin health',
    icon: <Users className="w-8 h-8" />,
    image: '/assets/hero_images/7.webp',
    duration: '45-60 mins',
    benefits: ['Hair restoration', 'Skin rejuvenation', 'Natural color', 'Holistic beauty'],
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500/20 to-indigo-600/20',
    treatments: ['Keshya Therapy', 'Twachya Therapy', 'Natural Dyes', 'Scalp Care']
  },
  {
    id: 'pregnancy-care',
    name: 'Garbhsanskar – Healthy Pregnancy Care',
    description: 'Holistic care for healthy pregnancy and fetal development',
    icon: <Baby className="w-8 h-8" />,
    image: '/assets/hero_images/1.webp',
    duration: 'Program-based',
    benefits: ['Healthy pregnancy', 'Fetal development', 'Maternal wellness', 'Natural birth'],
    color: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600',
    gradient: 'from-teal-500/20 to-teal-600/20',
    treatments: ['Garbhsanskar', 'Prenatal Care', 'Nutrition Guidance', 'Wellness Support']
  },
  {
    id: 'menstrual-disorders',
    name: 'Menstrual Disorder Treatments',
    description: 'Natural therapies for menstrual health and hormonal balance',
    icon: <Moon className="w-8 h-8" />,
    image: '/assets/hero_images/2.webp',
    duration: 'Program-based',
    benefits: ['Hormonal balance', 'Menstrual health', 'Pain relief', 'Fertility support'],
    color: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    gradient: 'from-rose-500/20 to-rose-600/20',
    treatments: ['Artava Chikitsa', 'Yoni Pichu', 'Hormonal Balance', 'Pain Management']
  },
  {
    id: 'weakness-remedies',
    name: 'Physical & Mental Weakness Remedies',
    description: 'Solutions for physical and mental weakness through natural therapies',
    icon: <Shield className="w-8 h-8" />,
    image: '/assets/hero_images/3.webp',
    duration: 'Program-based',
    benefits: ['Strength building', 'Mental clarity', 'Energy boost', 'Vitality restoration'],
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    gradient: 'from-amber-500/20 to-amber-600/20',
    treatments: ['Balya Therapy', 'Medhya Rasayana', 'Strength Building', 'Energy Enhancement']
  }
];

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Authentic Ayurvedic Healing
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 mb-8 leading-tight">
            Complete{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Treatment Guide
            </span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of authentic Ayurvedic treatments, 
            each designed to address specific health concerns and promote holistic wellness
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Traditional Panchkarma
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Specialized Therapies
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Wellness Solutions
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Holistic Healing Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Treatment Categories
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Discover our comprehensive range of Ayurvedic treatments, 
              each category designed to address specific health concerns and wellness goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treatmentCategories.map((category, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${category.color} overflow-hidden border-2 hover:border-emerald-300 group`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-emerald-800 border-0 px-3 py-1 text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {category.duration}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-4 ${category.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-emerald-800 font-bold">{category.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {category.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-sm font-semibold text-emerald-700 mb-3 block">Key Benefits:</span>
                    <div className="flex flex-wrap gap-2">
                      {category.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full mr-1"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-sm font-semibold text-emerald-700 mb-3 block">Treatments Include:</span>
                    <div className="flex flex-wrap gap-2">
                      {category.treatments.map((treatment, i) => (
                        <div key={i} className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full border border-emerald-100">
                          {treatment}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Link href={`/treatments/${category.id}`}>
                    <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50 group-hover:border-emerald-300 transition-all duration-300">
                      <span>Explore {category.name}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Treatments */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Authentic Ayurvedic Care
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6">
              Why Choose Our Treatments?
            </h2>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience the authentic healing power of Ayurveda with our comprehensive treatment approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Traditional Methods</h3>
              <p className="text-gray-600 text-sm">Authentic Ayurvedic practices passed down through generations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Personalized Care</h3>
              <p className="text-gray-600 text-sm">Individualized treatment plans based on your unique constitution</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Natural Healing</h3>
              <p className="text-gray-600 text-sm">Pure herbal medicines and natural therapeutic approaches</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Expert Care</h3>
              <p className="text-gray-600 text-sm">Experienced Ayurvedic physicians with deep knowledge</p>
            </div>
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
