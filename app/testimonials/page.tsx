import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Patient Testimonials | Success Stories | Dhanvantari Ayurvedic Clinic',
  description: 'Read authentic patient testimonials and success stories from Dhanvantari Ayurvedic Clinic. Real experiences with Panchkarma and Ayurvedic treatments.',
};

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    condition: 'Chronic Joint Pain',
    treatment: 'Panchkarma & Basti Therapy',
    rating: 5,
    testimonial: "After suffering from severe joint pain for 8 years, I was skeptical about any treatment. But Dr. [Name]'s Panchkarma therapy has given me a new life. I can now walk without pain and sleep peacefully. The staff is incredibly caring and the treatments are authentic.",
    duration: '3 months treatment',
    initials: 'PS'
  },
  {
    name: 'Rajesh Patil',
    location: 'Nashik, Maharashtra',
    condition: 'Digestive Disorders',
    treatment: 'Virechan & Herbal Medicines',
    rating: 5,
    testimonial: "I had severe acidity and digestive issues for years. Multiple doctors couldn't help me permanently. The Virechan therapy and personalized diet plan from Dhanvantari Clinic completely cured my problems. I feel energetic and healthy now.",
    duration: '2 months treatment',
    initials: 'RP'
  },
  {
    name: 'Meera Desai',
    location: 'Pune, Maharashtra',
    condition: 'Skin Problems & Stress',
    treatment: 'Raktamokshan & Shirodhara',
    rating: 5,
    testimonial: "My chronic eczema and stress-related issues were affecting my entire life. The combination of Raktamokshan for my skin and Shirodhara for stress relief worked wonderfully. My skin is clear and I feel mentally peaceful.",
    duration: '4 months treatment',
    initials: 'MD'
  },
  {
    name: 'Amit Kumar',
    location: 'Aurangabad, Maharashtra',
    condition: 'Diabetes & Weight Management',
    treatment: 'Lifestyle Counseling & Herbal Treatment',
    rating: 5,
    testimonial: "The holistic approach here is amazing. They didn't just treat my diabetes but guided me towards a complete lifestyle change. My sugar levels are controlled naturally now, and I've lost 15 kg healthily.",
    duration: '6 months treatment',
    initials: 'AK'
  },
  {
    name: 'Sunita Joshi',
    location: 'Nashik, Maharashtra',
    condition: 'Thyroid & Hormonal Issues',
    treatment: 'Customized Panchkarma',
    rating: 5,
    testimonial: "I was on thyroid medication for 5 years with no improvement. The personalized Panchkarma treatment plan helped balance my hormones naturally. My thyroid levels are normal now without any side effects.",
    duration: '5 months treatment',
    initials: 'SJ'
  },
  {
    name: 'Vikram Singh',
    location: 'Thane, Maharashtra',
    condition: 'Chronic Back Pain',
    treatment: 'Kati Basti & Massage Therapy',
    rating: 5,
    testimonial: "Years of desk job caused severe lower back pain. I couldn't sit or stand comfortably. The Kati Basti treatment and specialized massage therapy have completely relieved my pain. The doctors here truly understand the root cause.",
    duration: '2 months treatment',
    initials: 'VS'
  },
  {
    name: 'Kavita Reddy',
    location: 'Nagpur, Maharashtra',
    condition: 'Anxiety & Sleep Disorders',
    treatment: 'Shirodhara & Nasya',
    rating: 5,
    testimonial: "I was struggling with severe anxiety and insomnia. The Shirodhara sessions were incredibly relaxing, and the Nasya treatment helped clear my mind. I sleep peacefully now and feel mentally strong.",
    duration: '3 months treatment',
    initials: 'KR'
  },
  {
    name: 'Manoj Agarwal',
    location: 'Nashik, Maharashtra',
    condition: 'High Blood Pressure',
    treatment: 'Meditation Therapy & Herbs',
    rating: 5,
    testimonial: "My blood pressure was consistently high despite medications. The combination of meditation therapy, dietary changes, and herbal medicines has naturally controlled my BP. I feel more energetic and peaceful.",
    duration: '4 months treatment',
    initials: 'MA'
  },
  {
    name: 'Pooja Gupta',
    location: 'Mumbai, Maharashtra',
    condition: 'PCOS & Weight Issues',
    treatment: 'Udwartana & Hormonal Balance',
    rating: 5,
    testimonial: "PCOS was affecting my entire life - irregular periods, weight gain, mood swings. The specialized Udwartana treatment and hormonal balancing herbs have regulated my cycles and helped me lose weight naturally.",
    duration: '6 months treatment',
    initials: 'PG'
  }
];

const stats = [
  { number: '2000+', label: 'Happy Patients' },
  { number: '95%', label: 'Success Rate' },
  { number: '15+', label: 'Years Experience' },
  { number: '4.9/5', label: 'Average Rating' }
];

export default function TestimonialsPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Patient Testimonials
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Real stories from patients who found healing through Ayurveda
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-emerald-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-emerald-100">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border-2 border-emerald-200">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-emerald-800">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <Quote className="w-6 h-6 text-emerald-200 flex-shrink-0" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{testimonial.testimonial}&rdquo;
                  </blockquote>

                  {/* Footer */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {testimonial.condition}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                        {testimonial.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-600">
                      Treatment: {testimonial.treatment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Healing Journey?</h2>
          <p className="text-emerald-100 mb-8">
            Join thousands of patients who have found relief through authentic Ayurvedic treatments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3 rounded-md font-semibold transition-colors">
              Book Your Consultation
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-emerald-800 px-6 py-3 rounded-md font-semibold transition-colors">
              Call Us Today
            </button>
          </div>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-16 px-4 bg-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Share Your Experience</h2>
          <p className="text-emerald-600 mb-8">
            Help others by sharing your healing journey with us
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-md font-semibold transition-colors">
            Write a Review
          </button>
        </div>
      </section>
    </div>
  );
}