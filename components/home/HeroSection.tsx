'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Heart, Users, Award } from 'lucide-react';
import Image from 'next/image';
import { useAppointment } from '@/contexts/AppointmentContext';

// Custom animation styles
const animationStyles = `
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
  
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounceIn {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
  
  @keyframes rotateIn {
    from {
      opacity: 0;
      transform: rotate(-180deg) scale(0.3);
    }
    to {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }
  
  .animate-badge-1 { animation: slideInFromLeft 0.6s ease-out 0.1s both; }
  .animate-title-1 { animation: fadeInUp 0.8s ease-out 0.3s both; }
  .animate-subtitle-1 { animation: slideInFromRight 0.7s ease-out 0.5s both; }
  .animate-button-1-1 { animation: fadeInUp 0.6s ease-out 0.7s both; }
  .animate-button-1-2 { animation: slideInFromRight 0.6s ease-out 0.9s both; }
  
  .animate-badge-2 { animation: zoomIn 0.6s ease-out 0.1s both; }
  .animate-title-2 { animation: slideInFromRight 0.8s ease-out 0.3s both; }
  .animate-subtitle-2 { animation: fadeInUp 0.7s ease-out 0.5s both; }
  .animate-button-2-1 { animation: slideInFromLeft 0.6s ease-out 0.7s both; }
  .animate-button-2-2 { animation: zoomIn 0.6s ease-out 0.9s both; }
  
  .animate-badge-3 { animation: fadeInUp 0.6s ease-out 0.1s both; }
  .animate-title-3 { animation: bounceIn 0.8s ease-out 0.3s both; }
  .animate-subtitle-3 { animation: slideInFromLeft 0.7s ease-out 0.5s both; }
  .animate-button-3-1 { animation: zoomIn 0.6s ease-out 0.7s both; }
  .animate-button-3-2 { animation: fadeInUp 0.6s ease-out 0.9s both; }
`;

const heroContent = [
  {
    badge: {
      icon: Leaf,
      text: "Authentic Ayurvedic Healing Since 2009"
    },
    title: {
      main: "Healing Through",
      highlight: "Ayurveda & Panchkarma"
    },
    subtitle: "Experience authentic Ayurvedic treatment and traditional Panchkarma therapies at Dhanvantari Clinic. Restore your natural balance and achieve optimal wellness through time-tested healing practices.",
    buttons: [
      {
        text: "Book Consultation",
        href: "/book-appointment",
        variant: "primary",
        icon: ArrowRight
      },
      {
        text: "Explore Treatments",
        href: "/services",
        variant: "outline"
      }
    ]
  },
  {
    badge: {
      icon: Heart,
      text: "Holistic Wellness & Natural Healing"
    },
    title: {
      main: "Transform Your",
      highlight: "Health Naturally"
    },
    subtitle: "Discover the power of natural healing with our comprehensive Ayurvedic treatments. From chronic pain relief to wellness optimization, we provide personalized care for your complete well-being.",
    buttons: [
      {
        text: "Start Your Journey",
        href: "/book-appointment",
        variant: "primary",
        icon: ArrowRight
      },
      {
        text: "Learn More",
        href: "/about",
        variant: "outline"
      }
    ]
  },
  {
    badge: {
      icon: Award,
      text: "Expert Ayurvedic Physicians"
    },
    title: {
      main: "Expert Care for",
      highlight: "Complete Wellness"
    },
    subtitle: "Trust our experienced Ayurvedic doctors to guide you on your path to optimal health. We combine ancient wisdom with modern understanding to deliver exceptional healing results.",
    buttons: [
      {
        text: "Meet Our Doctors",
        href: "/about",
        variant: "primary",
        icon: ArrowRight
      },
      {
        text: "View Treatments",
        href: "/services",
        variant: "outline"
      }
    ]
  }
];

const cardImages = {
  treatment: [
    {
      src: "/assets/hero_images/1.webp",
      alt: "Panchkarma Therapy",
      title: "Panchkarma Therapy",
      subtitle: "Traditional detoxification"
    },
    {
      src: "/assets/hero_images/2.webp",
      alt: "Ayurvedic Massage",
      title: "Abhyanga Massage",
      subtitle: "Therapeutic oil massage"
    },
    {
      src: "/assets/hero_images/3.webp",
      alt: "Shirodhara Treatment",
      title: "Shirodhara",
      subtitle: "Oil pouring therapy"
    }
  ],
  herbs: [
    {
      src: "/assets/hero_images/4.webp",
      alt: "Ayurvedic Herbs",
      title: "Natural Healing",
      subtitle: "Pure herbal medicines"
    },
    {
      src: "/assets/hero_images/5.webp",
      alt: "Medicinal Plants",
      title: "Herbal Remedies",
      subtitle: "Traditional formulations"
    },
    {
      src: "/assets/hero_images/6.webp",
      alt: "Ayurvedic Oils",
      title: "Medicated Oils",
      subtitle: "Therapeutic applications"
    }
  ],
  consultation: [
    {
      src: "/assets/hero_images/7.webp",
      alt: "Doctor Consultation",
      title: "Expert Care",
      subtitle: "Personalized consultation"
    },
    {
      src: "/assets/hero_images/2.webp",
      alt: "Pulse Diagnosis",
      title: "Pulse Diagnosis",
      subtitle: "Traditional assessment"
    },
    {
      src: "/assets/hero_images/1.webp",
      alt: "Health Assessment",
      title: "Health Evaluation",
      subtitle: "Comprehensive checkup"
    }
  ],
  wellness: [
    {
      src: "/assets/hero_images/2.webp",
      alt: "Wellness and Relaxation",
      title: "Holistic Wellness",
      subtitle: "Complete mind-body healing"
    },
    {
      src: "/assets/hero_images/1.webp",
      alt: "Meditation and Yoga",
      title: "Mind-Body Balance",
      subtitle: "Meditation practices"
    },
    {
      src: "/assets/hero_images/2.webp",
      alt: "Lifestyle Guidance",
      title: "Lifestyle Wellness",
      subtitle: "Daily routine guidance"
    }
  ]
};

export default function HeroSection() {
  const { setIsAppointmentModalOpen } = useAppointment();
  const [currentIndices, setCurrentIndices] = useState({
    treatment: 0,
    herbs: 0,
    consultation: 0,
    wellness: 0
  });
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    // Content rotation interval
    const contentInterval = setInterval(() => {
      setCurrentContentIndex(prev => (prev + 1) % heroContent.length);
    }, 5000); // Change content every 5 seconds

    // Image rotation intervals
    const intervals = Object.keys(cardImages).map((cardType) => {
      return setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          [cardType]: (prev[cardType as keyof typeof prev] + 1) % cardImages[cardType as keyof typeof cardImages].length
        }));
      }, 3000 + Math.random() * 2000); // Random delay between 3-5 seconds for each card
    });

    return () => {
      clearInterval(contentInterval);
      intervals.forEach(clearInterval);
    };
  }, []);

  const goToImage = (cardType: keyof typeof cardImages, index: number) => {
    setCurrentIndices(prev => ({
      ...prev,
      [cardType]: index
    }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 border border-emerald-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-emerald-400 rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-emerald-200 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-emerald-300 rounded-full"></div>
      </div>

      <div className="container mx-auto max-w-7xl pt-0 pb-4 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="relative space-y-8">
            {heroContent.map((content, index) => {
              const IconComponent = content.badge.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-1000 ease-in-out ${
                    index === currentContentIndex
                      ? 'opacity-100 transform translate-y-0 relative'
                      : 'opacity-0 transform translate-y-4 absolute top-0 left-0 w-full'
                  }`}
                >
                  <div className={`inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-8 ${
                    index === currentContentIndex ? `animate-badge-${index + 1}` : ''
                  }`}>
                    <IconComponent className="w-4 h-4 mr-2" />
                    {content.badge.text}
                  </div>
                  
                  <div className="mb-8">
                    <h1 className={`text-4xl md:text-6xl font-bold text-emerald-900 leading-tight mb-8 ${
                      index === currentContentIndex ? `animate-title-${index + 1}` : ''
                    }`}>
                      {content.title.main}
                      <span className="text-emerald-600 block">{content.title.highlight}</span>
                    </h1>
                    <p className={`text-base text-gray-600 leading-relaxed max-w-xl ${
                      index === currentContentIndex ? `animate-subtitle-${index + 1}` : ''
                    }`}>
                      {content.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {content.buttons.map((button, btnIndex) => {
                      const ButtonIcon = button.icon;
                      return (
                        <Button 
                          key={btnIndex}
                          onClick={() => {
                            if (button.href === '/book-appointment') {
                              setIsAppointmentModalOpen(true);
                            } else {
                              window.location.href = button.href;
                            }
                          }}
                          className={`px-8 py-6 text-lg rounded-xl transition-all ${
                            button.variant === 'primary' 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl' 
                              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          } ${
                            index === currentContentIndex ? `animate-button-${index + 1}-${btnIndex + 1}` : ''
                          }`}
                        >
                          {button.text}
                          {ButtonIcon && <ButtonIcon className="ml-2 w-5 h-5" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-emerald-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-800">2000+</div>
                <div className="text-sm text-gray-600">Patients Healed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-800">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-800">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Hero Image Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              
              {/* Treatment Card */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 group">
                <div className="relative h-64">
                  {cardImages.treatment.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndices.treatment
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm text-emerald-100">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                  {/* Card Indicators */}
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cardImages.treatment.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage('treatment', index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndices.treatment
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Herbs Card */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 translate-y-8 group">
                <div className="relative h-64">
                  {cardImages.herbs.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndices.herbs
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm text-green-100">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                  {/* Card Indicators */}
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cardImages.herbs.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage('herbs', index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndices.herbs
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Consultation Card */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 group">
                <div className="relative h-64">
                  {cardImages.consultation.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndices.consultation
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm text-teal-100">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                  {/* Card Indicators */}
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cardImages.consultation.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage('consultation', index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndices.consultation
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Wellness Card */}
              <div className="relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 translate-y-8 group">
                <div className="relative h-64">
                  {cardImages.wellness.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentIndices.wellness
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm text-amber-100">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                  {/* Card Indicators */}
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cardImages.wellness.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage('wellness', index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndices.wellness
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    </>
  );
}