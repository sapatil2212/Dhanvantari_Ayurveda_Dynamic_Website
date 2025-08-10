'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, AlertCircle, CheckCircle, Percent } from 'lucide-react';
import { SuccessModal } from '@/components/ui/SuccessModal';

type Item = { 
  description: string; 
  qty: number; 
  price: number; 
};

type FormErrors = {
  items?: string[];
  general?: string;
};

export default function NewInvoicePage() {
  const { id: patientId } = useParams<{ id: string }>();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([{ description: '', qty: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // GST Settings
  const [gstApplicable, setGstApplicable] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(18);
  
  // Offer/Discount Settings
  const [offerApplicable, setOfferApplicable] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState(0);

  const subtotal = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);
  const discountAmount = offerApplicable ? (subtotal * offerPercentage) / 100 : 0;
  const amountAfterDiscount = subtotal - discountAmount;
  const gstAmount = gstApplicable ? (amountAfterDiscount * gstPercentage) / 100 : 0;
  const total = amountAfterDiscount + gstAmount;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const itemErrors: string[] = [];

    // Validate items
    items.forEach((item, index) => {
      if (!item.description.trim()) {
        itemErrors[index] = 'Description is required';
      }
      if (item.qty <= 0) {
        itemErrors[index] = itemErrors[index] ? `${itemErrors[index]}, Quantity must be greater than 0` : 'Quantity must be greater than 0';
      }
      if (item.price < 0) {
        itemErrors[index] = itemErrors[index] ? `${itemErrors[index]}, Price cannot be negative` : 'Price cannot be negative';
      }
    });

    if (itemErrors.some(error => error)) {
      newErrors.items = itemErrors;
    }

    // Validate GST percentage
    if (gstApplicable && (gstPercentage < 0 || gstPercentage > 100)) {
      newErrors.general = 'GST percentage must be between 0 and 100';
    }

    // Validate offer percentage
    if (offerApplicable && (offerPercentage < 0 || offerPercentage > 100)) {
      newErrors.general = 'Discount percentage must be between 0 and 100';
    }

    if (subtotal <= 0) {
      newErrors.general = 'Invoice must have at least one item with a positive amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    
    try {
      const payload = {
        patientId,
        items: items.filter(item => item.description.trim() && item.qty > 0 && item.price >= 0),
        subtotal,
        gstApplicable,
        gstPercentage: gstApplicable ? gstPercentage : 0,
        gstAmount,
        offerApplicable,
        offerPercentage: offerApplicable ? offerPercentage : 0,
        discountAmount,
        amountAfterDiscount,
        total,
        notes: notes.trim() || null,
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create invoice');
      }

      const created = await res.json();
      setShowSuccessModal(true);
      
      // Redirect after modal closes
      setTimeout(() => {
        router.push(`/dashboard/invoices/${created.id}`);
      }, 3000);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', qty: 1, price: 0 }]);
    setErrors({});
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      setErrors({});
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    setItems(items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    setErrors({});
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create New Invoice</h1>
          <p className="text-sm text-gray-600">Add items and details for the patient invoice</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Invoice Created!"
        message="Invoice created successfully! You will be redirected to view the invoice."
        duration={3000}
      />

      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Unit Price (₹)</div>
            <div className="col-span-2">Total (₹)</div>
            <div className="col-span-1"></div>
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-5 space-y-1">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className={errors.items?.[index] ? 'border-red-500' : ''}
                />
                {errors.items?.[index] && (
                  <p className="text-xs text-red-500">{errors.items[index]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                  className={errors.items?.[index] ? 'border-red-500' : ''}
                />
              </div>
              
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  className={errors.items?.[index] ? 'border-red-500' : ''}
                />
              </div>
              
              <div className="col-span-2 flex items-center h-10 px-3 text-sm font-medium">
                ₹{(item.qty * item.price).toFixed(2)}
              </div>
              
              <div className="col-span-1">
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
             </Card>

       {/* GST and Offer Settings */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* GST Settings */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Percent className="h-5 w-5" />
               GST Settings
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <Label htmlFor="gst-toggle" className="text-sm font-medium">
                 GST Applicable
               </Label>
               <Switch
                 id="gst-toggle"
                 checked={gstApplicable}
                 onCheckedChange={setGstApplicable}
               />
             </div>
             
             {gstApplicable && (
               <div className="space-y-2">
                 <Label htmlFor="gst-percentage">GST Percentage (%)</Label>
                 <Input
                   id="gst-percentage"
                   type="number"
                   min="0"
                   max="100"
                   step="0.01"
                   value={gstPercentage}
                   onChange={(e) => setGstPercentage(parseFloat(e.target.value) || 0)}
                   placeholder="18"
                 />
                 <p className="text-xs text-gray-500">
                   GST will be calculated on the amount after discount (if any)
                 </p>
               </div>
             )}
           </CardContent>
         </Card>

         {/* Offer/Discount Settings */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Percent className="h-5 w-5" />
               Offer/Discount Settings
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
               <Label htmlFor="offer-toggle" className="text-sm font-medium">
                 Offer Applicable
               </Label>
               <Switch
                 id="offer-toggle"
                 checked={offerApplicable}
                 onCheckedChange={setOfferApplicable}
               />
             </div>
             
             {offerApplicable && (
               <div className="space-y-2">
                 <Label htmlFor="offer-percentage">Discount Percentage (%)</Label>
                 <Input
                   id="offer-percentage"
                   type="number"
                   min="0"
                   max="100"
                   step="0.01"
                   value={offerPercentage}
                   onChange={(e) => setOfferPercentage(parseFloat(e.target.value) || 0)}
                   placeholder="10"
                 />
                 <p className="text-xs text-gray-500">
                   Discount will be applied to the subtotal before GST calculation
                 </p>
               </div>
             )}
           </CardContent>
         </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Invoice Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or instructions for this invoice..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
                     <CardContent className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-gray-600">Subtotal:</span>
               <span className="font-medium">₹{subtotal.toFixed(2)}</span>
             </div>
             
             {offerApplicable && offerPercentage > 0 && (
               <>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Discount ({offerPercentage}%):</span>
                   <span className="font-medium text-red-600">-₹{discountAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">After Discount:</span>
                   <span className="font-medium">₹{amountAfterDiscount.toFixed(2)}</span>
                 </div>
               </>
             )}
             
             {gstApplicable && gstPercentage > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">GST ({gstPercentage}%):</span>
                 <span className="font-medium text-blue-600">+₹{gstAmount.toFixed(2)}</span>
               </div>
             )}
             
             <Separator />
             <div className="flex justify-between text-base font-semibold">
               <span>Total:</span>
               <span className="text-emerald-600">₹{total.toFixed(2)}</span>
             </div>
           </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={save} 
          disabled={saving || subtotal <= 0}
          className="min-w-[140px]"
        >
          {saving ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </div>
  );
}


