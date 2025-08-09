'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Users, Clock, Award } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Custom animation styles
const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
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
  
  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInFromLeft 0.8s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slideInFromRight 0.8s ease-out forwards;
  }
`;

export default function AboutPreview() {
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
        threshold: 0.3, // Trigger when 30% of the section is visible
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
      <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className={`space-y-6 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4">
                About Dhanvantari Clinic
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 leading-tight mb-6">
                Your Journey to Wellness Begins Here
              </h2>
              <p className="text-gray-600 text-sm sm:text-md  md:text-md lg:text-md leading-relaxed mb-6">
                At Dhanvantari Ayurvedic Clinic, we combine ancient wisdom with modern healthcare 
                practices to provide authentic, personalized healing solutions. Our experienced 
                practitioners are dedicated to helping you achieve optimal health through traditional 
                Ayurvedic principles.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-4">
              {[
                'Authentic Panchkarma treatments in a serene environment',
                'Personalized treatment plans based on individual constitution',
                'Experienced doctors with 15+ years of practice',
                'Chemical-free, natural healing approaches'
              ].map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/about">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

          {/* Image with Floating Elements */}
          <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/assets/home_about/Untitled-1.webp"
                alt="Dhanvantari Ayurvedic Clinic"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
            </div>
            
            {/* Floating Text Elements */}
            <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="text-sm font-semibold text-emerald-800">2000+ Patients</div>
              <div className="text-xs text-emerald-600">Successfully Treated</div>
            </div>
            
            <div className={`absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="text-sm font-semibold text-emerald-800">15+ Years</div>
              <div className="text-xs text-emerald-600">Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}