'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Percent, 
  Loader2,
  ArrowLeft,
  User,
  Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SuccessModal } from '@/components/ui/SuccessModal';

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  
  // GST and Offer states
  const [gstApplicable, setGstApplicable] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [offerApplicable, setOfferApplicable] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState(0);
  
  // Calculations
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [amountAfterDiscount, setAmountAfterDiscount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Validation states
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items, gstApplicable, gstPercentage, offerApplicable, offerPercentage]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        // Handle the API response structure: { items: Patient[], total: number }
        const patientsArray = data.items && Array.isArray(data.items) ? data.items : [];
        setPatients(patientsArray);
      } else {
        console.error('Failed to fetch patients:', response.statusText);
        toast.error('Failed to fetch patients');
        setPatients([]);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.error('Failed to fetch patients');
      setPatients([]);
    }
  };

  const calculateTotals = () => {
    // Calculate subtotal
    const newSubtotal = Math.round(items.reduce((sum, item) => sum + (item.amount || 0), 0) * 100) / 100;
    setSubtotal(newSubtotal);

    // Calculate discount
    const newDiscountAmount = offerApplicable ? Math.round((newSubtotal * offerPercentage) / 100 * 100) / 100 : 0;
    setDiscountAmount(newDiscountAmount);

    // Calculate amount after discount
    const newAmountAfterDiscount = Math.round((newSubtotal - newDiscountAmount) * 100) / 100;
    setAmountAfterDiscount(newAmountAfterDiscount);

    // Calculate GST
    const newGstAmount = gstApplicable ? Math.round((newAmountAfterDiscount * gstPercentage) / 100 * 100) / 100 : 0;
    setGstAmount(newGstAmount);

    // Calculate total
    const newTotal = Math.round((newAmountAfterDiscount + newGstAmount) * 100) / 100;
    setTotal(newTotal);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(String(value)) || 0 : newItems[index].quantity;
      const rate = field === 'rate' ? parseFloat(String(value)) || 0 : newItems[index].rate;
      newItems[index].amount = Math.round((quantity * rate) * 100) / 100; // Round to 2 decimal places
    }
    
    setItems(newItems);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!selectedPatientId) {
      newErrors.push('Please select a patient');
    }

    if (items.some(item => !item.description.trim())) {
      newErrors.push('All items must have a description');
    }

    if (items.some(item => item.quantity <= 0)) {
      newErrors.push('All items must have a quantity greater than 0');
    }

    if (items.some(item => item.rate < 0)) {
      newErrors.push('All items must have a non-negative rate');
    }

    if (subtotal <= 0) {
      newErrors.push('Invoice must have a total amount greater than 0');
    }

    if (gstApplicable && (gstPercentage < 0 || gstPercentage > 100)) {
      newErrors.push('GST percentage must be between 0 and 100');
    }

    if (offerApplicable && (offerPercentage < 0 || offerPercentage > 100)) {
      newErrors.push('Offer percentage must be between 0 and 100');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const save = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientId: selectedPatientId,
        items: items,
        subtotal,
        gstApplicable,
        gstPercentage,
        gstAmount,
        offerApplicable,
        offerPercentage,
        discountAmount,
        amountAfterDiscount,
        total,
        notes: notes.trim() || null,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const createdInvoice = await response.json();
      setShowSuccessModal(true);
      
      // Redirect after modal closes
      setTimeout(() => {
        router.push(`/dashboard/invoices/${createdInvoice.id}`);
      }, 3000);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients && patients.length > 0 ? patients.find(p => p.id === selectedPatientId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Invoice</h1>
            <p className="text-gray-600">Generate a new invoice for a patient</p>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Invoice Created!"
        message="Invoice created successfully! You will be redirected to view the invoice."
        duration={3000}
      />

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient">Select Patient *</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} - {patient.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPatient && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Patient:</h4>
                    <p className="text-sm text-gray-600">
                      <strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}<br />
                      <strong>Email:</strong> {selectedPatient.email}<br />
                      <strong>Phone:</strong> {selectedPatient.phone}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`description-${index}`}>Description *</Label>
                      <Input
                        id={`description-${index}`}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`quantity-${index}`}>Qty *</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`rate-${index}`}>Rate (₹) *</Label>
                      <Input
                        id={`rate-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                      />
                    </div>
                                         <div className="col-span-2">
                       <Label>Amount (₹)</Label>
                       <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                         ₹{item.amount ? item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                       </div>
                     </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional notes or instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="space-y-6">
          {/* GST Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                GST Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gst-toggle">Apply GST</Label>
                  <Switch
                    id="gst-toggle"
                    checked={gstApplicable}
                    onCheckedChange={setGstApplicable}
                  />
                </div>
                
                {gstApplicable && (
                  <div>
                    <Label htmlFor="gst-percentage">GST Percentage (%)</Label>
                    <Input
                      id="gst-percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Offer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Offer Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="offer-toggle">Apply Offer/Discount</Label>
                  <Switch
                    id="offer-toggle"
                    checked={offerApplicable}
                    onCheckedChange={setOfferApplicable}
                  />
                </div>
                
                {offerApplicable && (
                  <div>
                    <Label htmlFor="offer-percentage">Discount Percentage (%)</Label>
                    <Input
                      id="offer-percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={offerPercentage}
                      onChange={(e) => setOfferPercentage(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
                             <div className="space-y-3">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Subtotal:</span>
                   <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
                 
                 {offerApplicable && (
                   <>
                     <div className="flex justify-between text-green-600">
                       <span>Discount ({offerPercentage}%):</span>
                       <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">After Discount:</span>
                       <span className="font-medium">₹{amountAfterDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                     </div>
                   </>
                 )}
                 
                 {gstApplicable && (
                   <div className="flex justify-between text-blue-600">
                     <span>GST ({gstPercentage}%):</span>
                     <span>+₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   </div>
                 )}
                 
                 <Separator />
                 
                 <div className="flex justify-between text-lg font-bold">
                   <span>Total:</span>
                   <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
               </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={save} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                'Create Invoice'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.back()} 
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
