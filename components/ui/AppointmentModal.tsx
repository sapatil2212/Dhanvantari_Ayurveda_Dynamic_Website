'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppointment } from '@/contexts/AppointmentContext';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  X
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
    description: 'Comprehensive assessment including pulse diagnosis and treatment planning'
  },
  {
    id: 'follow-up',
    name: 'Follow-up Consultation',
    duration: '30 minutes',
    fee: '₹500',
    description: 'Progress review and treatment adjustments'
  },
  {
    id: 'panchkarma-consultation',
    name: 'Panchkarma Consultation',
    duration: '60 minutes',
    fee: '₹1000',
    description: 'Detailed evaluation for Panchkarma therapy planning'
  },
  {
    id: 'online-consultation',
    name: 'Online Consultation',
    duration: '30 minutes',
    fee: '₹600',
    description: 'Virtual consultation via video call'
  }
];

export default function AppointmentModal() {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = useAppointment();
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

    // Simulate appointment booking
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Appointment Booked Successfully!",
      description: "We'll send you a confirmation email shortly with all the details.",
    });

    // Reset form and close modal
    setStep(1);
    setAppointmentData({
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
    setIsSubmitting(false);
    setIsAppointmentModalOpen(false);
  };

  const handleClose = () => {
    setStep(1);
    setAppointmentData({
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
    setIsAppointmentModalOpen(false);
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

  return (
    <Dialog open={isAppointmentModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-white">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-emerald-800">
              Book Your Appointment
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 max-w-md mx-auto">
              <span>Service</span>
              <span>Date & Time</span>
              <span>Details</span>
              <span>Confirm</span>
            </div>
          </div>

                     {/* Step 1: Select Service */}
           {step === 1 && (
             <div>
               <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-xl text-emerald-800 flex items-center">
                   <User className="w-5 h-5 mr-2" />
                   Select Consultation Type
                 </CardTitle>
               </CardHeader>

               <CardContent className="px-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {consultationTypes.map((type) => (
                     <Card 
                       key={type.id}
                       className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                         appointmentData.consultationType === type.id
                           ? 'border-emerald-500 bg-emerald-50'
                           : 'border-gray-200'
                       }`}
                       onClick={() => setAppointmentData(prev => ({ ...prev, consultationType: type.id }))}
                     >
                       <div className="flex flex-col h-full">
                         <div className="flex-1">
                           <h3 className="font-semibold text-emerald-800 mb-2">{type.name}</h3>
                           <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                           <div className="flex items-center text-xs text-gray-500">
                             <Clock className="w-3 h-3 mr-1" />
                             {type.duration}
                           </div>
                         </div>
                       </div>
                     </Card>
                   ))}
                 </div>

                 <div className="flex justify-end mt-6">
                   <Button 
                     onClick={nextStep}
                     disabled={!appointmentData.consultationType}
                     className="bg-emerald-600 hover:bg-emerald-700"
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
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-emerald-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Choose Date & Time
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={appointmentData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2"
                      required
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="mt-2 space-y-4">
                      {Object.entries(timeSlots).map(([period, slots]) => (
                        <div key={period}>
                          <h4 className="text-sm font-medium text-emerald-700 mb-2 capitalize">
                            {period}
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((time) => (
                              <Button
                                key={time}
                                variant={appointmentData.timeSlot === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAppointmentData(prev => ({ ...prev, timeSlot: time }))}
                                className={appointmentData.timeSlot === time ? "bg-emerald-600 hover:bg-emerald-700" : ""}
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

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!appointmentData.preferredDate || !appointmentData.timeSlot}
                    className="bg-emerald-600 hover:bg-emerald-700"
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
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-emerald-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Your Details
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={appointmentData.name}
                          onChange={handleInputChange}
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={appointmentData.email}
                          onChange={handleInputChange}
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={appointmentData.phone}
                          onChange={handleInputChange}
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={appointmentData.age}
                          onChange={handleInputChange}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={appointmentData.gender} onValueChange={handleSelectChange('gender')}>
                          <SelectTrigger className="mt-2">
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
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4">Medical Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="chiefComplaint">Chief Complaint / Main Health Concern *</Label>
                        <Textarea
                          id="chiefComplaint"
                          name="chiefComplaint"
                          value={appointmentData.chiefComplaint}
                          onChange={handleInputChange}
                          className="mt-2"
                          placeholder="Please describe your main health concern or reason for consultation"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="previousTreatment">Previous Treatments (if any)</Label>
                        <Textarea
                          id="previousTreatment"
                          name="previousTreatment"
                          value={appointmentData.previousTreatment}
                          onChange={handleInputChange}
                          className="mt-2"
                          placeholder="Please mention any previous treatments or consultations for this condition"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medications">Current Medications</Label>
                        <Textarea
                          id="medications"
                          name="medications"
                          value={appointmentData.medications}
                          onChange={handleInputChange}
                          className="mt-2"
                          placeholder="List any medications or supplements you are currently taking"
                        />
                      </div>
                      <div>
                        <Label htmlFor="additionalNotes">Additional Notes</Label>
                        <Textarea
                          id="additionalNotes"
                          name="additionalNotes"
                          value={appointmentData.additionalNotes}
                          onChange={handleInputChange}
                          className="mt-2"
                          placeholder="Any additional information you'd like to share"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!appointmentData.name || !appointmentData.email || !appointmentData.phone || !appointmentData.chiefComplaint}
                    className="bg-emerald-600 hover:bg-emerald-700"
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
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm Your Appointment
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-6">
                  {/* Appointment Summary */}
                  <Card className="p-4 bg-emerald-50 border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Consultation Type:</span>
                        <span className="font-medium">{getSelectedConsultationType()?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{formatDate(appointmentData.preferredDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{appointmentData.timeSlot}</span>
                      </div>
                                             <div className="flex justify-between">
                         <span>Duration:</span>
                         <span className="font-medium">{getSelectedConsultationType()?.duration}</span>
                       </div>
                    </div>
                  </Card>

                  {/* Patient Information */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-emerald-800 mb-3">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{appointmentData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{appointmentData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{appointmentData.phone}</span>
                      </div>
                      {appointmentData.age && (
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium">{appointmentData.age} years</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Terms and Conditions */}
                  <Card className="p-4 border-amber-200 bg-amber-50">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-2">Important Notes:</h4>
                        <ul className="text-xs text-amber-700 space-y-1">
                          <li>• Please arrive 10 minutes before your scheduled time</li>
                          <li>• Bring any previous medical reports or test results</li>
                          <li>• Consultation fee is payable at the time of visit</li>
                          <li>• Cancellations must be made 24 hours in advance</li>
                          <li>• We'll call you a day before to confirm your appointment</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 min-w-[150px]"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
