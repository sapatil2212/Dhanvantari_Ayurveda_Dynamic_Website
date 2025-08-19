'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Droplets, Wind, Leaf, Zap, Heart, Clock, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppointment } from '@/contexts/AppointmentContext';
import TreatmentImage from '@/components/ui/TreatmentImage';

// Custom animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInFromLeft 0.8s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slideInFromRight 0.8s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .image-hover {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover .image-hover {
    transform: scale(1.05);
  }
`;

const treatments = [
  {
    name: 'Vaman Therapy',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Therapeutic vomiting to eliminate toxins and excess Kapha dosha from the upper respiratory tract and stomach.',
    benefits: ['Respiratory disorders', 'Skin diseases', 'Diabetes', 'Obesity'],
    duration: '3-5 days',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    image: '/assets/hero_images/1.webp',
    fallbackImage: '/assets/hero_images/2.webp',
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    name: 'Virechan Therapy',
    icon: <Wind className="w-6 h-6" />,
    description: 'Purgation therapy to cleanse the digestive system and eliminate excess Pitta dosha.',
    benefits: ['Liver disorders', 'Skin problems', 'Chronic fever', 'Hyperacidity'],
    duration: '5-7 days',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    image: '/assets/hero_images/2.webp',
    fallbackImage: '/assets/hero_images/3.webp',
    gradient: 'from-orange-500/20 to-orange-600/20'
  },
  {
    name: 'Basti Treatment',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Medicated enema therapy for Vata disorders and joint problems, considered the most important treatment.',
    benefits: ['Joint pain', 'Arthritis', 'Paralysis', 'Neurological disorders'],
    duration: '8-15 days',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    image: '/assets/hero_images/3.webp',
    fallbackImage: '/assets/hero_images/4.webp',
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    name: 'Nasya Therapy',
    icon: <Zap className="w-6 h-6" />,
    description: 'Nasal administration of medicines for head and neck disorders through nasal passages.',
    benefits: ['Sinusitis', 'Headaches', 'Hair problems', 'Mental disorders'],
    duration: '7-14 days',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    image: '/assets/hero_images/4.webp',
    fallbackImage: '/assets/hero_images/5.webp',
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    name: 'Raktamokshan',
    icon: <Heart className="w-6 h-6" />,
    description: 'Blood purification therapy for treating blood-related disorders and Pitta conditions.',
    benefits: ['Skin diseases', 'Blood disorders', 'Gout', 'Hypertension'],
    duration: '1-3 sessions',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    image: '/assets/hero_images/5.webp',
    fallbackImage: '/assets/hero_images/1.webp',
    gradient: 'from-red-500/20 to-red-600/20'
  }
];

export default function TreatmentsPreview() {
  const { setIsAppointmentModalOpen } = useAppointment();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <section ref={sectionRef} className="py-24 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-6 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Our Specialized Treatments
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-8 leading-tight">
              Authentic Panchkarma Therapies
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Experience the five traditional detoxification and rejuvenation therapies 
              that form the foundation of Ayurvedic healing, practiced for thousands of years
            </p>
          </div>

          {/* Treatments Grid */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {treatments.map((treatment, index) => (
              <Card 
                key={index} 
                className={`card-hover ${treatment.color} overflow-hidden border-2 hover:border-emerald-300 relative group`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <TreatmentImage 
                    src={treatment.image}
                    fallbackSrc={treatment.fallbackImage}
                    alt={treatment.name}
                    className="image-hover object-cover"
                    icon={treatment.icon}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${treatment.gradient} opacity-60`}></div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-emerald-800 border-0 px-2 py-1 text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {treatment.duration}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3 pt-4">
                  <div className={`w-12 h-12 ${treatment.color} rounded-xl flex items-center justify-center mb-3 ${treatment.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {treatment.icon}
                  </div>
                  <CardTitle className="text-lg md:text-xl text-emerald-800 font-bold">{treatment.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {treatment.description}
                  </p>
                  
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-emerald-700 mb-2 block">Beneficial for:</span>
                    <div className="flex flex-wrap gap-2">
                      {treatment.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full mr-1"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-emerald-600 group-hover:text-emerald-700 transition-colors font-medium">
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Additional Treatments Card */}
            <Card className="card-hover p-6 bg-gradient-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-0 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-2">& Many More</h3>
                <p className="text-sm text-emerald-700 mb-4 leading-relaxed">
                  Abhyanga, Shirodhara, Swedana, Shirobasti, Karnpuran, Netradhara and other specialized treatments
                </p>
                <div className="flex items-center justify-center text-emerald-600 group-hover:text-emerald-700 font-medium">
                  <span className="text-sm">View All Treatments</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </section>
    </>
  );
}