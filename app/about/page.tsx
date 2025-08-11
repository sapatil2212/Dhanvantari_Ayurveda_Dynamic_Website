import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Award, Users, Clock, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Dhanvantari Ayurvedic Clinic | Expert Ayurvedic Doctors',
  description: 'Learn about our experienced Ayurvedic doctors and holistic healing philosophy at Dhanvantari Ayurvedic Clinic in Nashik.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            About Dhanvantari Ayurvedic Clinic
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Dedicated to preserving and practicing authentic Ayurvedic healing traditions
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-emerald-200">
              <CardContent className="p-0">
                <Heart className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-semibold text-emerald-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To provide authentic Ayurvedic treatments and Panchkarma therapies that restore 
                  natural balance, promote holistic wellness, and help individuals achieve optimal 
                  health through time-tested healing practices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 border-emerald-200">
              <CardContent className="p-0">
                <Award className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-semibold text-emerald-800 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading Ayurvedic wellness center in Maharashtra, known for our 
                  commitment to traditional healing methods, personalized care, and helping 
                  people embrace Ayurveda as a complete lifestyle.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-800">2000+</div>
              <div className="text-gray-600">Patients Treated</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-800">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-800">50+</div>
              <div className="text-gray-600">Treatments</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-800">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Meet Our Expert</h2>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              Our experienced Ayurvedic physician combines traditional wisdom with modern healthcare practices
            </p>
          </div>

          <Card className="max-w-4xl mx-auto p-8">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="w-48 h-48 bg-emerald-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-emerald-600 text-6xl font-semibold">Dr</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Chief Ayurvedic Physician
                  </Badge>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">Dr. [Doctor Name]</h3>
                  <p className="text-emerald-600 mb-4">BAMS, MD (Ayurveda), Panchkarma Specialist</p>
                  
                  <div className="space-y-3 text-gray-600">
                    <p>
                      With over 15 years of dedicated practice in Ayurvedic medicine and Panchkarma 
                      treatments, Dr. [Name] brings extensive experience in treating chronic conditions 
                      through natural healing methods.
                    </p>
                    <p>
                      Specialized in traditional Panchkarma therapies, chronic pain management, 
                      digestive disorders, and lifestyle diseases. Committed to providing personalized 
                      treatment plans based on individual constitution and health needs.
                    </p>
                  </div>

                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-emerald-800">Education:</strong>
                      <ul className="text-gray-600 mt-1">
                        <li>• BAMS - Ayurvedic Medicine</li>
                        <li>• MD - Panchkarma</li>
                        <li>• Certified Pulse Diagnosis</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-emerald-800">Specializations:</strong>
                      <ul className="text-gray-600 mt-1">
                        <li>• Panchkarma Therapies</li>
                        <li>• Chronic Pain Management</li>
                        <li>• Digestive Disorders</li>
                        <li>• Stress & Lifestyle Issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <h2 className="text-3xl font-bold text-emerald-800 mb-8">Our Philosophy</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              At Dhanvantari Ayurvedic Clinic, we believe in the fundamental principle of Ayurveda - 
              that health is not merely the absence of disease, but a state of complete physical, 
              mental, and spiritual well-being.
            </p>
            <p>
              We follow the ancient wisdom of treating the root cause rather than just symptoms, 
              focusing on restoring natural balance through personalized treatments, dietary guidance, 
              and lifestyle modifications.
            </p>
            <p className="text-emerald-700 font-semibold italic">
              &ldquo;Swasthasya swasthya rakshanam aturasya vikara prashamanam&rdquo;
              <br />
              <span className="text-sm font-normal">
                (Preserve health of the healthy and cure diseases of the diseased)
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}