'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Stethoscope,
  FileText,
  Shield
} from 'lucide-react';

const timeSlots = {
  morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  afternoon: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'],
  evening: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM']
};

const consultationTypes = [
  {
    id: 'first-consultation',
    name: 'First Consultation',
    duration: '45-60 minutes',
    fee: '₹800',
    description: 'Comprehensive assessment including pulse diagnosis and treatment planning',
    icon: Stethoscope
  },
  {
    id: 'follow-up',
    name: 'Follow-up Consultation',
    duration: '30 minutes',
    fee: '₹500',
    description: 'Progress review and treatment adjustments',
    icon: FileText
  },
  {
    id: 'panchkarma-consultation',
    name: 'Panchkarma Consultation',
    duration: '60 minutes',
    fee: '₹1000',
    description: 'Detailed evaluation for Panchkarma therapy planning',
    icon: Shield
  },
  {
    id: 'online-consultation',
    name: 'Online Consultation',
    duration: '30 minutes',
    fee: '₹600',
    description: 'Virtual consultation via video call',
    icon: User
  }
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    consultationType: '',
    preferredDate: '',
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    chiefComplaint: '',
    previousTreatment: '',
    medications: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // First create an enquiry
      const enquiryResponse = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          service: appointmentData.consultationType,
          message: `Appointment request for ${appointmentData.consultationType}. Chief complaint: ${appointmentData.chiefComplaint}. Preferred date: ${appointmentData.preferredDate} at ${appointmentData.timeSlot}.`,
          source: 'WEBSITE_APPOINTMENT'
        }),
      });

      if (!enquiryResponse.ok) {
        console.error('Failed to create enquiry');
      }

      // Create the appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationType: appointmentData.consultationType,
          preferredDate: appointmentData.preferredDate,
          preferredTime: appointmentData.timeSlot,
          name: appointmentData.name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          age: appointmentData.age,
          gender: appointmentData.gender,
          chiefComplaint: appointmentData.chiefComplaint,
          previousTreatment: appointmentData.previousTreatment,
          medications: appointmentData.medications,
          additionalNotes: appointmentData.additionalNotes,
        }),
      });

      if (!appointmentResponse.ok) {
        const errorData = await appointmentResponse.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      toast({
        title: "Appointment Booked Successfully!",
        description: "We&apos;ll send you a confirmation email shortly with all the details.",
      });

      // Reset form and go to success step
      setStep(5);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedConsultationType = () => {
    return consultationTypes.find(type => type.id === appointmentData.consultationType);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
        <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              Appointment Booked Successfully!
            </h1>
            
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl mb-6 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3 text-base">Appointment Details:</h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="font-medium">Type:</span>
                  <span className="font-semibold">{getSelectedConsultationType()?.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="font-medium">Date:</span>
                  <span className="font-semibold">{formatDate(appointmentData.preferredDate)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="font-medium">Time:</span>
                  <span className="font-semibold">{appointmentData.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-emerald-100">
                  <span className="font-medium">Patient:</span>
                  <span className="font-semibold">{appointmentData.name}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium">Phone:</span>
                  <span className="font-semibold">{appointmentData.phone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 mb-8">
              <p className="text-base font-semibold text-emerald-800">
                What&apos;s next?
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You&apos;ll receive a confirmation email within 15 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Our team will call you 1 day before your appointment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Please arrive 10 minutes early for registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Bring any previous medical reports if available</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.href = '/'} 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Go to Homepage
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/contact'}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
              >
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">Book Your Appointment</h1>
          <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
            Schedule your consultation with our experienced Ayurvedic practitioners in just a few simple steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                    step > stepNum ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-600 max-w-md mx-auto font-medium">
            <span className={step >= 1 ? 'text-emerald-600' : ''}>Service</span>
            <span className={step >= 2 ? 'text-emerald-600' : ''}>Date & Time</span>
            <span className={step >= 3 ? 'text-emerald-600' : ''}>Details</span>
            <span className={step >= 4 ? 'text-emerald-600' : ''}>Confirm</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8">
            
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div>
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-2xl text-emerald-800 flex items-center">
                    <Stethoscope className="w-6 h-6 mr-3 text-emerald-600" />
                    Select Consultation Type
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">Choose the type of consultation that best suits your needs</p>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="grid gap-4">
                    {consultationTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Card 
                          key={type.id}
                          className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                            appointmentData.consultationType === type.id
                              ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                          onClick={() => setAppointmentData(prev => ({ ...prev, consultationType: type.id }))}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                appointmentData.consultationType === type.id
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-emerald-800 mb-1 text-base">{type.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {type.duration}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Badge className={`text-sm font-semibold px-3 py-1 ${
                              appointmentData.consultationType === type.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {type.fee}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={nextStep}
                      disabled={!appointmentData.consultationType}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {step === 2 && (
              <div>
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-2xl text-emerald-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-emerald-600" />
                    Choose Date & Time
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">Select your preferred appointment date and time slot</p>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <Label htmlFor="preferredDate" className="text-sm font-semibold text-gray-700 mb-3 block">Preferred Date</Label>
                      <Input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={appointmentData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-12 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">Please select a date at least 24 hours in advance</p>
                    </div>

                    {/* Time Slots */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">Available Time Slots</Label>
                      <div className="space-y-4">
                        {Object.entries(timeSlots).map(([period, slots]) => (
                          <div key={period}>
                            <h4 className="text-sm font-semibold text-emerald-700 mb-3 capitalize flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {period}
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                              {slots.map((time) => (
                                <Button
                                  key={time}
                                  variant={appointmentData.timeSlot === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setAppointmentData(prev => ({ ...prev, timeSlot: time }))}
                                  className={`text-xs h-9 font-medium transition-all duration-200 ${
                                    appointmentData.timeSlot === time 
                                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md" 
                                      : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                                  }`}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={prevStep} 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      disabled={!appointmentData.preferredDate || !appointmentData.timeSlot}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 3: Personal & Medical Details */}
            {step === 3 && (
              <div>
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-2xl text-emerald-800 flex items-center">
                    <User className="w-6 h-6 mr-3 text-emerald-600" />
                    Your Details
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">Please provide your personal and medical information</p>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-emerald-600" />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={appointmentData.name}
                            onChange={handleInputChange}
                            className="h-11 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={appointmentData.email}
                            onChange={handleInputChange}
                            className="h-11 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={appointmentData.phone}
                            onChange={handleInputChange}
                            className="h-11 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="age" className="text-sm font-semibold text-gray-700 mb-2 block">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            value={appointmentData.age}
                            onChange={handleInputChange}
                            className="h-11 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                            placeholder="Enter your age"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 mb-2 block">Gender</Label>
                          <Select value={appointmentData.gender} onValueChange={handleSelectChange('gender')}>
                            <SelectTrigger className="h-11 text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2 text-emerald-600" />
                        Medical Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chiefComplaint" className="text-sm font-semibold text-gray-700 mb-2 block">Chief Complaint / Main Health Concern *</Label>
                          <Textarea
                            id="chiefComplaint"
                            name="chiefComplaint"
                            value={appointmentData.chiefComplaint}
                            onChange={handleInputChange}
                            className="text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
                            placeholder="Please describe your main health concern or reason for consultation"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="previousTreatment" className="text-sm font-semibold text-gray-700 mb-2 block">Previous Treatments (if any)</Label>
                          <Textarea
                            id="previousTreatment"
                            name="previousTreatment"
                            value={appointmentData.previousTreatment}
                            onChange={handleInputChange}
                            className="text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
                            placeholder="Please mention any previous treatments or consultations for this condition"
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="medications" className="text-sm font-semibold text-gray-700 mb-2 block">Current Medications</Label>
                          <Textarea
                            id="medications"
                            name="medications"
                            value={appointmentData.medications}
                            onChange={handleInputChange}
                            className="text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
                            placeholder="List any medications or supplements you are currently taking"
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="additionalNotes" className="text-sm font-semibold text-gray-700 mb-2 block">Additional Notes</Label>
                          <Textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            value={appointmentData.additionalNotes}
                            onChange={handleInputChange}
                            className="text-sm border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg resize-none"
                            placeholder="Any additional information you'd like to share"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={prevStep} 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                      disabled={!appointmentData.name || !appointmentData.email || !appointmentData.phone || !appointmentData.chiefComplaint}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div>
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-2xl text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-600" />
                    Confirm Your Appointment
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">Please review your appointment details before confirming</p>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="space-y-6">
                    {/* Appointment Summary */}
                    <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                      <h3 className="font-semibold text-emerald-800 mb-4 text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Appointment Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                          <span className="font-medium text-gray-700">Consultation Type:</span>
                          <span className="font-semibold text-emerald-800">{getSelectedConsultationType()?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                          <span className="font-medium text-gray-700">Date:</span>
                          <span className="font-semibold text-emerald-800">{formatDate(appointmentData.preferredDate)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                          <span className="font-medium text-gray-700">Time:</span>
                          <span className="font-semibold text-emerald-800">{appointmentData.timeSlot}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                          <span className="font-medium text-gray-700">Duration:</span>
                          <span className="font-semibold text-emerald-800">{getSelectedConsultationType()?.duration}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 font-bold text-lg text-emerald-800">
                          <span>Consultation Fee:</span>
                          <span>{getSelectedConsultationType()?.fee}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Patient Information */}
                    <Card className="p-6 bg-white border-2 border-gray-200 rounded-xl">
                      <h3 className="font-semibold text-emerald-800 mb-4 text-lg flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Patient Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="font-semibold text-gray-800">{appointmentData.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Email:</span>
                          <span className="font-semibold text-gray-800">{appointmentData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Phone:</span>
                          <span className="font-semibold text-gray-800">{appointmentData.phone}</span>
                        </div>
                        {appointmentData.age && (
                          <div className="flex justify-between items-center py-2">
                            <span className="font-medium text-gray-700">Age:</span>
                            <span className="font-semibold text-gray-800">{appointmentData.age} years</span>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Terms and Conditions */}
                    <Card className="p-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-3 text-base">Important Notes:</h4>
                          <ul className="text-sm text-amber-700 space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Please arrive 10 minutes before your scheduled time</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Bring any previous medical reports or test results</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Consultation fee is payable at the time of visit</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Cancellations must be made 24 hours in advance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>We&apos;ll call you a day before to confirm your appointment</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline" 
                      onClick={prevStep} 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}