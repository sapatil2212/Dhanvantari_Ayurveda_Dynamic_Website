'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Address',
            details: ['Dhanvantari Ayurveda Building', 'Saikheda Phata, near Khanderao mandir', 'Ojhar, Maharashtra 422206'],
    color: 'text-blue-600'
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone',
            details: ['+91 99211 18724', '+91 87654 32109'],
    color: 'text-green-600'
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
            details: ['dhanvantariayurvedansk@gmail.com'],
    color: 'text-purple-600'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Hours',
    details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 2:00 PM', 'Emergency: 24/7 Available'],
    color: 'text-orange-600'
  }
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-emerald-600 mb-8">
            Get in touch to start your journey towards holistic wellness
          </p>
        </div>
      </section>

      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="p-4 border-emerald-100">
                      <CardContent className="p-0">
                        <div className="flex items-start space-x-4">
                          <div className={`${info.color} mt-1`}>
                            {info.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-emerald-800 mb-2">{info.title}</h3>
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-gray-600 text-sm leading-relaxed">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* WhatsApp Contact */}
                <Card className="mt-6 p-4 bg-green-50 border-green-200">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-800 mb-1">WhatsApp Support</h3>
                        <p className="text-gray-600 text-sm mb-2">Quick responses & instant help</p>
                        <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl text-emerald-800">Send us a Message</CardTitle>
                  <p className="text-emerald-600">We'll respond within 24 hours</p>
                </CardHeader>

                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-2"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service">Service of Interest</Label>
                        <Select value={formData.service} onValueChange={handleSelectChange}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">General Consultation</SelectItem>
                            <SelectItem value="panchkarma">Panchkarma Treatment</SelectItem>
                            <SelectItem value="chronic-pain">Chronic Pain Management</SelectItem>
                            <SelectItem value="digestive">Digestive Disorders</SelectItem>
                            <SelectItem value="skin">Skin Problems</SelectItem>
                            <SelectItem value="stress">Stress & Anxiety</SelectItem>
                            <SelectItem value="weight">Weight Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-2 min-h-[120px]"
                        placeholder="Please describe your health concerns or questions..."
                      />
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-emerald-800 font-medium">What happens next?</p>
                          <ul className="text-xs text-emerald-700 mt-1 space-y-1">
                            <li>• We'll review your message within 24 hours</li>
                            <li>• Our team will call you to discuss your needs</li>
                            <li>• Schedule a convenient consultation time</li>
                            <li>• Begin your personalized treatment plan</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 px-4 bg-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">Find Us</h2>
            <p className="text-emerald-600">Visit our peaceful clinic in the heart of Ozhar</p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="aspect-video bg-emerald-100 flex items-center justify-center">
              <div className="text-center text-emerald-700">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-semibold">Interactive Map</p>
                <p className="text-sm">Dhanvantari Ayurvedic Clinic</p>
                <p className="text-sm">Saikheda Phata, Ojhar, Maharashtra 422206</p>
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}