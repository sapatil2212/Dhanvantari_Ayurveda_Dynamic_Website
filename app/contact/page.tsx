'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SocialIcon } from 'react-social-icons';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: '',
    details: ['Dhanvantari Ayurveda Building', 'Saikheda Phata, near Khanderao mandir', 'Ojhar, Maharashtra 422206'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Call Us',
    details: ['+91 99211 18724', '+91 87654 32109'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    layout: 'horizontal'
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email Us',
    details: ['dhanvantariayurvedansk@gmail.com'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Opening Hours',
    details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 2:00 PM', 'Emergency: 24/7 Available'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  }
];

const services = [
  'General Consultation',
  'Panchkarma Treatment',
  'Chronic Pain Management',
  'Digestive Disorders',
  'Skin Problems',
  'Stress & Anxiety',
  'Weight Management',
  'Other'
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: 'WEBSITE_CONTACT'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: "Message Sent Successfully!",
        description: "We'll contact you within 24 hours to schedule your consultation.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-emerald-800/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 1000+ Patients
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-6 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-emerald-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start your journey towards holistic wellness. Our expert team is here to guide you every step of the way.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-emerald-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Expert Ayurvedic Physicians</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Personalized Treatment Plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-emerald-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-emerald-800 mb-3">Send us a Message</h2>
                  <p className="text-emerald-600 text-lg">We'll respond within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-emerald-800 font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-emerald-800 font-medium">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-emerald-800 font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-2 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service" className="text-emerald-800 font-medium">Service of Interest</Label>
                      <Select value={formData.service} onValueChange={handleSelectChange}>
                        <SelectTrigger className="mt-2 h-12 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service.toLowerCase().replace(' ', '-')}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-emerald-800 font-medium">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-2 min-h-[140px] border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Please describe your health concerns or questions..."
                    />
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-emerald-800 font-semibold mb-2">What happens next?</h3>
                        <ul className="text-emerald-700 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                            We'll review your message within 24 hours
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                            Our team will call you to discuss your needs
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                            Schedule a convenient consultation time
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                            Begin your personalized treatment plan
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-emerald-800 mb-4">Contact Information</h2>
                  <p className="text-emerald-600 text-base mb-6">
                    Reach out to us through any of these channels. We're here to help you on your wellness journey.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-emerald-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`${info.bgColor} p-3 rounded-xl ${info.color}`}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-emerald-800 mb-2 text-lg">{info.title}</h3>
                            {info.layout === 'horizontal' ? (
                              <div className="flex flex-wrap gap-4">
                                {info.details.map((detail, i) => (
                                  <p key={i} className="text-emerald-700 leading-relaxed">
                                    {info.title === 'Call Us' ? (
                                      <button
                                        onClick={() => window.open(`tel:${detail.replace(/\s+/g, '')}`, '_self')}
                                        className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors duration-200 cursor-pointer"
                                      >
                                        {detail}
                                      </button>
                                    ) : (
                                      detail
                                    )}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              info.details.map((detail, i) => (
                                <p key={i} className={`${info.title === 'Opening Hours' ? 'text-sm' : ''} text-emerald-700 leading-relaxed`}>
                                  {info.title === '' ? (
                                    <button
                                      onClick={() => window.open('https://maps.google.com/?q=Dhanvantari+Ayurvedic+Clinic+and+Panchkarma+Centre+ozhar+branch', '_blank')}
                                      className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors duration-200 cursor-pointer"
                                    >
                                      {detail}
                                    </button>
                                  ) : info.title === 'Email Us' ? (
                                    <button
                                      onClick={() => window.open(`mailto:${detail}`, '_self')}
                                      className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors duration-200 cursor-pointer"
                                    >
                                      {detail}
                                    </button>
                                  ) : (
                                    detail
                                  )}
                                </p>
                              ))
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* WhatsApp Contact */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <SocialIcon 
                          url="https://wa.me/919921118724?text=Hello! I would like to know more about your Ayurvedic treatments and consultation services. Please provide me with information about available treatments and appointment scheduling."
                          network="whatsapp"
                          bgColor="transparent"
                          fgColor="#25D366"
                          style={{ width: 24, height: 24 }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800 mb-1">WhatsApp Support</h3>
                        <p className="text-emerald-600 text-sm mb-3">Quick responses & instant help</p>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-6"
                          onClick={() => window.open('https://wa.me/919921118724?text=Hello! I would like to know more about your Ayurvedic treatments and consultation services. Please provide me with information about available treatments and appointment scheduling.', '_blank')}
                        >
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">Find Us</h2>
            <p className="text-xl text-emerald-600 max-w-2xl mx-auto">
              Visit our peaceful clinic in the heart of Ozhar. We're conveniently located near Khanderao mandir.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-xl border-emerald-200">
                <div className="aspect-[4/3]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.1023411644637!2d73.92333037469!3d20.088003719425398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddc38daaaaaa9f%3A0x52bf1659016d013!2sDhanvantari%20Ayurvedic%20Clinic%20and%20Panchkarma%20Centre%2C%20ozhar%20branch!5e0!3m2!1sen!2sin!4v1755607474828!5m2!1sen!2sin" 
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-emerald-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">Location Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-emerald-800">Dhanvantari Ayurvedic Clinic</p>
                        <p className="text-emerald-600 text-sm">Saikheda Phata, near Khanderao mandir</p>
                        <p className="text-emerald-600 text-sm">Ojhar, Maharashtra 422206</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-emerald-800">Opening Hours</p>
                        <p className="text-emerald-600 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
                        <p className="text-emerald-600 text-sm">Sunday: 10:00 AM - 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Get Directions</h3>
                  <p className="text-emerald-100 mb-4">
                    Use Google Maps to get turn-by-turn directions to our clinic.
                  </p>
                  <Button 
                    className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-semibold"
                    onClick={() => window.open('https://maps.google.com/?q=Dhanvantari+Ayurvedic+Clinic+and+Panchkarma+Centre+ozhar+branch', '_blank')}
                  >
                    Open in Google Maps
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}