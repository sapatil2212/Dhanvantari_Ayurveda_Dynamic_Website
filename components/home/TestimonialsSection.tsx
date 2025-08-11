'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

const testimonials = [
  {
    name: 'Yogesh Shewale',
    location: 'Ojhar',
    condition: 'Fertility Treatment',
    rating: 5,
    testimonial: "Today I am so happy to announce that my wife is pregnant. We are taking treatment from Dr Rahul patil sir from last 3 months and so happy today. He has Magic in ayurved treatments. We were trying and taking treatment from many other doctors but no use and just loss of money. I will tell everyone directly go and visit Dhanvantari Ayurved Ojhar for all your problems. No lengthy treatments and 100% results to all your problems. Thanks to Dr Rahul patil sir and dhanvantari Ayurveda team Ojhar.",
    initials: 'YS'
  },
  {
    name: 'Gayatri Patil',
    location: 'Ojhar',
    condition: 'Panchakarma & Swarnaprashan',
    rating: 5,
    testimonial: "Best panchakarma service is provided here. So relaxing and peaceful it is. Thank-you at dhanvantari Ayurveda. Also there product swarnaprashan is so helpful and effective. It gives tremendous and best results to babies. I personally observed it in my baby. Thankyou so much to Dr Shital patil madam for such a Beautiful products.",
    initials: 'GP'
  },
  {
    name: 'Saumya Shah',
    location: 'Nashik',
    condition: 'Acidity & Skin Treatment',
    rating: 5,
    testimonial: "When you visit Dhanvantari Ayurveda Clinic, the first thing that will make you a great impression is incredible cleanliness and comfort. The clinic is very clean and beautiful, the interior is fresh and the staff is very caring! The staff and doctor are really helpful and gave us a lot of useful advices too. I was coming for acidity treatment and skin treatment from 3 months. Now i feel complete relief from acidity. Also my pimples are gone and recovering from skin issues. Will surely recommend dhanvantari ayurveda. Complete and pure ayurvedic solution for all your health problems.",
    initials: 'SS'
  },
  {
    name: 'Vishal Sonawane',
    location: 'Malegaon',
    condition: 'Knee Pain Treatment',
    rating: 5,
    testimonial: "Me malegaon varun ithe treatment sati yeto. Majya nakache haad vadle hote mala operation suggest karnyat aala hota. Pan doctor rahul patil siran kade treatment ghetli ani operation chi garaj bhasli nahi. Ithe purn ayurvedic treatment dili jate ani kahi pathya palaichi asta pan result 100% aahe. Kahihi tras aslyas nakki bhet dya dhanvantari ayurveda ozhar ithe. Dr Rahul patil sir thank you.",
    initials: 'VS'
  },
  {
    name: 'Mahi Jagwani',
    location: 'Nashik',
    condition: 'Swarnaprashan Drops',
    rating: 5,
    testimonial: "Suvarna prashan drops given by you are very effective and the result after using this I have noticed and my kid loves too as these drops are good for immunity and they are helpful in cold and cough. Thanks once again Shital for suggesting and giving Suvarna prashan Drops.",
    initials: 'MJ'
  },
  {
    name: 'Pankaj Suralke',
    location: 'Muktai Nagar',
    condition: 'General Health',
    rating: 5,
    testimonial: "Overall solution to all your health problem. I came from muktai nagar for treatment. Also treatment was not so lengthy and Dr rahul patil treat you in very simple way. Best doctor i have ever visited.",
    initials: 'PS'
  },
  {
    name: 'Deepak Kadam',
    location: 'Nashik',
    condition: 'Knee Pain Treatment',
    rating: 5,
    testimonial: "Best Doctor and Hospital I have ever seen. My Mother Was referred to operation by other doctors but when I started treatment here doctor Rahul said no need of operation and within few months I made it true. Now she can walk very well only by taking medicine and panchkarma therapy. Best doctor in world.",
    initials: 'DK'
  },
  {
    name: 'Kapil Gunjal',
    location: 'Kalwan',
    condition: 'Acidity & Mental Health',
    rating: 5,
    testimonial: "Me kalwan varun ithe treatment sati yeto. Aata mala purn pane farak vattoy me acidity ani manechya mankya sati treatment ghet hoto. Doctor rahul patil yanchya kade saglya aajarancha upay aahe nakki bhet dya dhanvantari ayurveda ozar dr rahul patil yanna.",
    initials: 'KG'
  },
  {
    name: 'Khushal Patil',
    location: 'Nashik',
    condition: 'Hyper Acidity',
    rating: 5,
    testimonial: "My mom was taking treatment for hyper acidity now she completely fine. Doctor is really best and hospital was made so good. Complete solution for health problems and best panchkarma in nasik.",
    initials: 'KP'
  },
  {
    name: 'Nana Pagar',
    location: 'Khadak Ojhar',
    condition: 'Knee Pain Treatment',
    rating: 5,
    testimonial: "मी खडक ओझर वरून येतो. गुडघे दुःखी ची ट्रीटमेंट सुरू होती आता पूर्ण आराम आहे. ऑपरेशन ची गरज भासली नाही बाकी डॉक्टर्स ने ऑपरेशन चा सल्ला दिला होता. डॉक्टर राहुल पाटील पूर्ण आयुर्वेद उपचार करतात आणि खूप छान डॉक्टर आहेत. काही गरज वाटली तर नक्की भेट द्या धन्वंतरी आयुर्वेद ओझर येथे. धन्यवाद राहुल सर.",
    initials: 'NP'
  },
  {
    name: 'Narendra Patil',
    location: 'Nashik',
    condition: 'Skin & Hair Problems',
    rating: 5,
    testimonial: "I will surely recommend Dr rahul patil sir. I was facing skin and hair problem and got complete relief from it. Its one and only solution for all your health problem and thats also without any side effects a pure ayurvedic treatment.",
    initials: 'NP'
  },
  {
    name: 'Hemkant More',
    location: 'Nashik',
    condition: 'Knee Pain Treatment',
    rating: 5,
    testimonial: "सर, आपल्या आयुर्वेद ट्रीटमेंट मुळे माझ्या गुडघे दुःखी चा 10ते 11 महिन्यात बऱ्यापैकी फरक पडतो आहे, आपल्या धन्वंतरी आयुर्वेद आणि आपल्या सगळ्या टीम साठी मनापासून धन्यवाद, आणि आभार व्यक्त करतो. धन्यवाद.",
    initials: 'HM'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Badge variant="outline" className="border-emerald-200 text-emerald-700 mb-4">
            Patient Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
            Healing Stories from Our Patients
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from people who found relief and healing through our 
            authentic Ayurvedic treatments
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className={`max-w-4xl mx-auto mb-12 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <Card className="p-8 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 relative overflow-hidden">
            <div className="absolute top-6 right-6 text-emerald-200">
              <Quote className="w-16 h-16" />
            </div>
            
            <CardContent className="p-0 relative">
              <div className="flex items-center mb-6">
                <Avatar className="w-16 h-16 border-2 border-emerald-200">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                    {testimonials[currentIndex].initials}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-emerald-800">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-emerald-600">{testimonials[currentIndex].location}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>
                </div>
              </div>

              <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{testimonials[currentIndex].testimonial}&rdquo;
              </blockquote>

              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Treated for: {testimonials[currentIndex].condition}
              </Badge>
            </CardContent>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentIndex ? 'bg-emerald-600' : 'bg-emerald-200'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Testimonial Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {testimonials.filter((_, index) => index !== currentIndex).slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Avatar className="border-2 border-emerald-200">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h4 className="font-semibold text-emerald-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.testimonial.substring(0, 120)}...&rdquo;
                </blockquote>
                
                <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                  {testimonial.condition}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="bg-emerald-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Join Hundreds of Satisfied Patients
            </h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Experience the healing power of authentic Ayurveda. Book your consultation 
              today and start your journey towards optimal health and wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button className="bg-white text-emerald-800 hover:bg-emerald-50">
                  Book Your Consultation
                </Button>
              </Link>
              <Link href="/testimonials">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-800">
                  Read More Stories
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