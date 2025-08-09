'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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

export default function CTASection() {
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
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-emerald-600 to-green-700">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Main CTA */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            Take the first step towards optimal health with personalized Ayurvedic care. 
            Our experienced doctors are here to guide you on your path to wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6">
                Book Consultation Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-6">
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Cards */}
        <div className={`grid md:grid-cols-3 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          
          {/* Call Us */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us Today</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Speak directly with our team for immediate assistance
              </p>
              <a 
                href="tel:+919921118724"
                className="text-lg font-semibold hover:underline"
              >
                +91 99211 18724
              </a>
              <p className="text-emerald-200 text-sm mt-2">Mon - Sat: 9 AM - 7 PM</p>
            </CardContent>
          </Card>

          {/* Visit Us */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Our Clinic</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Experience our peaceful healing environment
              </p>
                              <div className="text-sm">
                  <p>Dhanvantari Ayurveda Building</p>
                  <p>Saikheda Phata, near Khanderao mandir</p>
                  <p>Ojhar, Maharashtra 422206</p>
                </div>
              <Link href="/contact">
                <Button variant="ghost" className="text-white hover:bg-white/20 mt-2">
                  Get Directions
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Chat</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Get instant responses to your health queries
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  const phoneNumber = '919921118724';
                  const message = 'Hello! I would like to know more about your Ayurvedic treatments.';
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Start Chat
                <MessageCircle className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div className={`mt-12 text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <Card className="bg-amber-500/20 backdrop-blur-sm border-amber-300/30 max-w-lg mx-auto">
            <CardContent className="p-6 text-white">
              <Clock className="w-8 h-8 mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2">Emergency Consultation</h4>
              <p className="text-amber-100 text-sm">
                For urgent health concerns, we provide 24/7 emergency consultation services
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
    </>
  );
}