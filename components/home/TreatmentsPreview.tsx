'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Droplets, Wind, Leaf, Zap, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppointment } from '@/contexts/AppointmentContext';

// Custom animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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
`;

const treatments = [
  {
    name: 'Vaman Therapy',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Therapeutic vomiting to eliminate toxins and excess Kapha dosha',
    benefits: 'Respiratory issues, skin problems, obesity',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    image: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Virechan Therapy',
    icon: <Wind className="w-6 h-6" />,
    description: 'Purgation therapy to cleanse the digestive system and eliminate Pitta',
    benefits: 'Liver disorders, acidity, skin diseases',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    image: 'https://images.pexels.com/photos/3985166/pexels-photo-3985166.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Basti Treatment',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Medicated enema therapy for Vata disorders and joint problems',
    benefits: 'Arthritis, back pain, neurological issues',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    image: 'https://images.pexels.com/photos/3985170/pexels-photo-3985170.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Nasya Therapy',
    icon: <Zap className="w-6 h-6" />,
    description: 'Nasal administration of medicines for head and neck disorders',
    benefits: 'Sinusitis, headaches, hair problems',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    image: 'https://images.pexels.com/photos/4498310/pexels-photo-4498310.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Raktamokshan',
    icon: <Heart className="w-6 h-6" />,
    description: 'Blood purification therapy for treating blood-related disorders',
    benefits: 'Skin diseases, hypertension, gout',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    image: 'https://images.pexels.com/photos/4498311/pexels-photo-4498311.jpeg?auto=compress&cs=tinysrgb&w=600'
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
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
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
      <section ref={sectionRef} className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4">
            Our Specialized Treatments
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
            Authentic Panchkarma Therapies
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the five traditional detoxification and rejuvenation therapies 
            that form the foundation of Ayurvedic healing
          </p>
        </div>

        {/* Treatments Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {treatments.map((treatment, index) => (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 cursor-pointer group ${treatment.color} overflow-hidden`}>
              <div className="relative h-48 mb-4">
                <img 
                  src={treatment.image}
                  alt={treatment.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${treatment.color} rounded-xl flex items-center justify-center mb-4 ${treatment.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  {treatment.icon}
                </div>
                <CardTitle className="text-xl text-emerald-800">{treatment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {treatment.description}
                </p>
                <div className="mb-4">
                  <span className="text-xs font-medium text-emerald-700">Beneficial for:</span>
                  <p className="text-xs text-gray-600 mt-1">{treatment.benefits}</p>
                </div>
                <div className="flex items-center text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  <span className="text-sm font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Additional Treatments Card */}
          <Card className="p-6 bg-emerald-100 border-emerald-200 flex items-center justify-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">& Many More</h3>
              <p className="text-sm text-emerald-700 mb-4">
                Abhyanga, Shirodhara, Swedana, and other specialized treatments
              </p>
              <div className="flex items-center justify-center text-emerald-600 group-hover:text-emerald-700">
                <span className="text-sm font-medium">View All Treatments</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">
              Not sure which treatment is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Book a consultation with our experienced Ayurvedic physicians to get a 
              personalized treatment plan based on your unique health needs and constitution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6"
              >
                Book Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/services">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
                  View All Treatments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}