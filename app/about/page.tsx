'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Target, Eye, Gem, HeartHandshake, Award, Sparkles, Leaf, UserRound,
  ShieldCheck, BedDouble, BellRing, Thermometer, Ruler, Wifi, Tv2, 
  Landmark, Mountain, GanttChart, Plane, Clock, Star, Heart, Zap,
  Droplets, Wind, Calendar, Users, MapPin, Phone, Mail, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useAppointment } from '@/contexts/AppointmentContext';

const clinicFeatures = [
  { 
    id: 'authentic', 
    name: 'Authentic Ayurvedic Treatments', 
    icon: <Leaf className="text-emerald-500 text-xl" />,
    description: 'Traditional Panchkarma therapies practiced for thousands of years'
  },
  { 
    id: 'expert', 
    name: 'Expert Physicians', 
    icon: <UserRound className="text-emerald-500 text-xl" />,
    description: 'Experienced doctors with 15+ years in Ayurvedic medicine'
  },
  { 
    id: 'personalized', 
    name: 'Personalized Care', 
    icon: <Heart className="text-emerald-500 text-xl" />,
    description: 'Individual treatment plans based on your unique constitution'
  },
  { 
    id: 'natural', 
    name: '100% Natural Healing', 
    icon: <Gem className="text-emerald-500 text-xl" />,
    description: 'Chemical-free treatments using pure herbs and natural methods'
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Wellness',
    icon: <Target className="text-emerald-500 text-xl" />,
    description: 'Holistic approach addressing root causes of health issues'
  },
  {
    id: 'modern',
    name: 'Modern Facilities',
    icon: <Sparkles className="text-emerald-500 text-xl" />,
    description: 'Clean, comfortable environment with modern amenities'
  }
];

const treatmentAmenities = [
  { 
    id: 'panchkarma', 
    name: 'Panchkarma Suite', 
    icon: <Droplets className="text-green-500 text-xl" />,
    description: 'Dedicated space for traditional detoxification therapies'
  },
  { 
    id: 'consultation', 
    name: 'Private Consultation', 
    icon: <Users className="text-green-500 text-xl" />,
    description: 'One-on-one sessions with experienced Ayurvedic doctors'
  },
  { 
    id: 'herbs', 
    name: 'Herbal Pharmacy', 
    icon: <Leaf className="text-green-500 text-xl" />,
    description: 'Pure, authentic herbs and formulations prepared in-house'
  },
  { 
    id: 'equipment', 
    name: 'Modern Equipment', 
    icon: <Thermometer className="text-green-500 text-xl" />,
    description: 'Advanced diagnostic tools combined with traditional methods'
  },
  {
    id: 'comfort',
    name: 'Comfortable Environment',
    icon: <BedDouble className="text-green-500 text-xl" />,
    description: 'Peaceful, healing atmosphere for optimal treatment experience'
  },
  { 
    id: 'hygiene', 
    name: 'Sterile Standards', 
    icon: <ShieldCheck className="text-green-500 text-xl" />,
    description: 'Maintaining highest standards of cleanliness and hygiene'
  }
];



const visionMissionCards = [
  {
    icon: <Eye className="w-6 h-6" strokeWidth={1.5} />,
    title: "Our Vision",
    content: "To become the most trusted Ayurvedic healing center, providing authentic treatments that restore health and promote wellness through ancient wisdom and modern care.",
    bgColor: "bg-white",
    borderColor: "border-emerald-200"
  },
  {
    icon: <Target className="w-6 h-6" strokeWidth={1.5} />,
    title: "Our Mission",
    content: "To deliver personalized Ayurvedic care that addresses the root cause of health issues, empowering individuals to achieve optimal wellness through natural healing methods.",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  }
];

const coreValues = [
  {
    icon: <UserRound className="w-5 h-5 text-emerald-600" />,
    title: "Patient First",
    description: "We prioritize the health and well-being of our patients in everything we do."
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
    title: "Authenticity",
    description: "We maintain the purity and authenticity of traditional Ayurvedic practices."
  },
  {
    icon: <Award className="w-5 h-5 text-purple-600" />,
    title: "Excellence",
    description: "We strive for excellence in diagnosis, treatment, and patient care."
  },
  {
    icon: <Sparkles className="w-5 h-5 text-yellow-600" />,
    title: "Innovation",
    description: "We combine ancient wisdom with modern understanding for better results."
  },
  {
    icon: <Leaf className="w-5 h-5 text-green-600" />,
    title: "Natural Healing",
    description: "We believe in the power of natural remedies and holistic wellness."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-red-600" />,
    title: "Trust",
    description: "We build lasting relationships based on trust, care, and proven results."
  }
];

export default function AboutPage() {
  const { setIsAppointmentModalOpen } = useAppointment();
  
  return (
    <div className="pt-0 px-0 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-32">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16 pt-8">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Since 2009
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-6 leading-tight">
                About{' '}
                <span className="text-emerald-600">
                  Dhanvantari
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-800">Dhanvantari Ayurvedic Clinic</span> - Your trusted partner in authentic Ayurvedic healing and wellness.
              </p>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Welcome to Dhanvantari Ayurvedic Clinic, where ancient wisdom meets modern healthcare. For over 15 years, we have been dedicated to providing authentic Ayurvedic treatments and Panchkarma therapies that restore health and promote wellness naturally.
              </p>
              

            </div>
          </div>

          {/* Right side - Image */}
          <div className="order-1 lg:order-2 lg:pl-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/home_about/Untitled-1.webp"
                alt="Dhanvantari Ayurvedic Clinic"
                className="object-cover w-full h-full max-h-[500px] rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Our Foundation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">Vision & Mission</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The guiding principles that drive our commitment to authentic Ayurvedic healing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {visionMissionCards.map((card, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-8 border ${card.bgColor} ${card.borderColor} hover:shadow-lg transition-all duration-300 h-full flex flex-col`}
              >
                <div className={`w-14 h-14 rounded-2xl ${card.bgColor.replace('50', '100')} flex items-center justify-center mb-6`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-700 leading-relaxed flex-grow">{card.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinic Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              What Sets Us Apart
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">Clinic Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive facilities and services for your complete wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg flex items-start space-x-4 group"
              >
                <div className="bg-emerald-50 p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">{feature.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Amenities Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Treatment Facilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">Treatment Amenities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              State-of-the-art facilities designed for authentic Ayurvedic treatments
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatmentAmenities.map((amenity) => (
              <div 
                key={amenity.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg flex items-start space-x-4 group"
              >
                <div className="bg-green-50 p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">{amenity.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-8 border border-emerald-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Our Core Values</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide every aspect of our practice and patient care
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      {value.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900">{value.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-20">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">
              Ready to Start Your Healing Journey?
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              Experience the power of authentic Ayurvedic healing at Dhanvantari Clinic. 
              Book your consultation today and take the first step towards natural wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Book Consultation
                <Calendar className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 text-lg px-8 py-6 rounded-xl transition-all duration-300">
                  Contact Us
                  <Phone className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Meet Our Doctor Section */}
        <section className="py-5 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-5">
                <h2 className="text-2xl sm:text-5xl font-bold text-gray-900 leading-tight">
                  Meet <span className="text-emerald-600">Dr. Rahul Patil</span>
                </h2>

                <p className="text-xs sm:text-lg text-gray-600 leading-relaxed">
                  Chief Ayurvedic Physician and Panchkarma Specialist with over 15 years of experience in traditional healing. 
                  Dr. Patil combines ancient wisdom with modern medical understanding to provide comprehensive care.
                </p>

                <div className="space-y-5">
                  {[
                    {
                      icon: "🎓",
                      title: "Educational Excellence",
                      description: "BAMS, MD (Ayurveda), Panchkarma Specialist from prestigious institutions."
                    },
                    {
                      icon: "🏆",
                      title: "Professional Experience",
                      description: "15+ years treating 2000+ patients with 98% success rate in chronic conditions."
                    },
                    {
                      icon: "🌿",
                      title: "Specializations",
                      description: "Panchkarma therapies, chronic pain, digestive disorders, lifestyle diseases."
                    },
                    {
                      icon: "💝",
                      title: "Patient Care Philosophy",
                      description: "Personalized treatment plans based on individual constitution and health goals."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                      <div className="flex-shrink-0 text-xl bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-[10px] sm:text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Doctor Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center bg-emerald-50 p-4 rounded-xl border border-emerald-200 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-emerald-600">15+</div>
                    <div className="text-xs text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center bg-emerald-50 p-4 rounded-xl border border-emerald-200 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-emerald-600">2000+</div>
                    <div className="text-xs text-gray-600">Patients Treated</div>
                  </div>
                  <div className="text-center bg-emerald-50 p-4 rounded-xl border border-emerald-200 hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-emerald-600">98%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-4 pt-2">
                  <Button 
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="group relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span className='font-medium text-sm sm:text-base'>Book Consultation</span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </div>
              </div>
              
              {/* Interactive Doctor Image with Animated Elements */}
              <div className="relative group">
                {/* Main doctor image */}
                <div className="relative overflow-hidden rounded-xl h-[400px] sm:h-[600px] w-[320px] sm:w-[600px] bg-gradient-to-br from-emerald-100 to-emerald-200">
                                      <img
                      src="/assets/hero_images/1.webp"
                      alt="Dr. Rahul Patil - Chief Ayurvedic Physician"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  
                  {/* Floating Experience Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">15+</div>
                      <div className="text-xs text-gray-600">Years</div>
                    </div>
                  </div>

                  {/* Floating Success Rate Badge */}
                  <div className="absolute bottom-6 left-6 bg-emerald-600/90 backdrop-blur-sm p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-center text-white">
                      <div className="text-lg font-bold">98%</div>
                      <div className="text-xs">Success</div>
                    </div>
                  </div>

                  {/* Animated Pulse Ring */}
                  <div className="absolute inset-0 rounded-xl border-2 border-emerald-400/30 group-hover:border-emerald-400/60 transition-all duration-500"></div>
                  <div className="absolute inset-0 rounded-xl border-2 border-emerald-400/20 animate-pulse"></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -right-6 -bottom-6 w-28 h-28 border-2 border-emerald-400 rounded-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                
                {/* Floating herbs decoration */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-emerald-100 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                
                {/* Floating certificate decoration */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-100 rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}