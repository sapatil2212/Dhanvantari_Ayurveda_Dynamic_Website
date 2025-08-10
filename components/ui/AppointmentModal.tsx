'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppointment } from '@/contexts/AppointmentContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Appointments capture both date and time

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
  // Online Consultation option removed as requested
];

export default function AppointmentModal() {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = useAppointment();
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [dupPrompt, setDupPrompt] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setAppointmentData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Duplicate check
      const params = new URLSearchParams();
      if (appointmentData.email) params.set('email', appointmentData.email);
      if (appointmentData.phone) params.set('phone', appointmentData.phone);
      if (appointmentData.name) params.set('name', appointmentData.name);
      const existingRes = await fetch(`/api/appointments?${params.toString()}`, { cache: 'no-store' });
      const existing = existingRes.ok ? await existingRes.json() : { items: [] };
      if (existing.items && existing.items.length > 0) {
        setDupPrompt({ open: true, message: `We found ${existing.items.length} appointment(s) with the same details. Proceed with another booking?` });
        return;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to book appointment');
      }

      setShowSuccess(true);

      // Reset form and close modal
      setStep(1);
      setAppointmentData({
        consultationType: '',
        preferredDate: '',
        preferredTime: '',
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
    } catch (err: any) {
      toast({ title: 'Booking failed', description: err.message || 'Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setAppointmentData({
      consultationType: '',
      preferredDate: '',
      preferredTime: '',
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
    <>
    <Dialog open={isAppointmentModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-white">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-emerald-800">
            Book Your Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 max-w-sm mx-auto">
              <span>Details</span>
              <span>Medical</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Step 1: Consultation, Date & Time, Personal Information */}
          {step === 1 && (
            <div>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-emerald-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Consultation & Personal Details
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-6">
                  {/* Consultation Type */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consultationType">Consultation Type *</Label>
                      <Select value={appointmentData.consultationType} onValueChange={handleSelectChange('consultationType')}>
                        <SelectTrigger id="consultationType" className="mt-2">
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {consultationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-1 gap-4">
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
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
                      <div>
                        <Label htmlFor="preferredTime">Preferred Time *</Label>
                        <div className="flex items-center mt-2">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <Input
                            id="preferredTime"
                            name="preferredTime"
                            type="time"
                            value={appointmentData.preferredTime}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

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
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={nextStep}
                    disabled={
                      !appointmentData.consultationType ||
                      !appointmentData.preferredDate ||
                      !appointmentData.preferredTime ||
                      !appointmentData.name ||
                      !appointmentData.email ||
                      !appointmentData.phone
                    }
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 2: Medical Information */}
          {step === 2 && (
            <div>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-emerald-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Medical Information
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-6">
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

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!appointmentData.chiefComplaint}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm Your Appointment
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <div className="space-y-4 text-sm">
                  {/* Appointment Summary */}
                  <Card className="p-4 bg-emerald-50 border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-2 text-base">Appointment Summary</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
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
                        <span className="font-medium">{appointmentData.preferredTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{getSelectedConsultationType()?.duration}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Patient Information */}
                  <Card className="p-4">
                    <h3 className="font-semibold text-emerald-800 mb-2 text-base">Patient Information</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
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
                        <h4 className="font-medium text-amber-800 mb-2 text-sm">Important Notes:</h4>
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
    {/* Duplicate confirm overlay */}
    {dupPrompt.open && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
        <div className="w-full max-w-sm rounded-md bg-white p-4 text-center shadow-lg">
          <div className="text-base font-semibold">Possible duplicate</div>
          <div className="mt-1 text-sm text-gray-600">{dupPrompt.message}</div>
          <div className="mt-3 flex justify-center gap-2">
            <button className="h-9 rounded-md border px-3 text-sm" onClick={() => setDupPrompt({ open: false, message: '' })}>No</button>
            <button
              className="h-9 rounded-md bg-emerald-600 px-3 text-sm text-white hover:bg-emerald-700"
              onClick={async () => {
                setDupPrompt({ open: false, message: '' });
                setIsSubmitting(true);
                try {
                  const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData),
                  });
                  if (!res.ok) throw new Error('Failed to book appointment');
                  setShowSuccess(true);
                  setStep(1);
                  setAppointmentData({
                    consultationType: '', preferredDate: '', preferredTime: '', name: '', email: '', phone: '', age: '', gender: '', chiefComplaint: '', previousTreatment: '', medications: '', additionalNotes: ''
                  });
                  setIsAppointmentModalOpen(false);
                } catch (e: any) {
                  toast({ title: 'Booking failed', description: e.message || 'Please try again later.' });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Yes, proceed
            </button>
          </div>
        </div>
      </div>
    )}
    {showSuccess && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
        <div className="w-full max-w-xs rounded-md bg-white p-4 text-center shadow-lg">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="text-base font-semibold">Appointment booked</div>
          <div className="mt-1 text-sm text-gray-600">A confirmation email has been sent to your inbox.</div>
          <div className="mt-3 flex justify-center">
            <button className="h-9 rounded-md bg-emerald-600 px-3 text-sm text-white hover:bg-emerald-700" onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
