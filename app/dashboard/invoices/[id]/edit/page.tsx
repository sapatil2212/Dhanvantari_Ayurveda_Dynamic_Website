'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, AlertCircle, CheckCircle, Percent, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SuccessModal } from '@/components/ui/SuccessModal';

type Invoice = {
  id: string;
  number: string;
  patientId: string;
  date: string;
  status: string;
  items: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string | null;
  patient: {
    firstName: string;
    lastName: string;
  };
  payments?: Array<{
    id: string;
    amount: number;
    method: string;
    paidAt: string;
  }>;
};

type InvoiceStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED';

type InvoiceItem = {
  description: string;
  qty: number;
  price: number;
};

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  const [gstApplicable, setGstApplicable] = useState(false);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [offerApplicable, setOfferApplicable] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>('PENDING');

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    return sum + (qty * price);
  }, 0);
  const discountAmount = offerApplicable ? (subtotal * offerPercentage) / 100 : 0;
  const amountAfterDiscount = subtotal - discountAmount;
  const gstAmount = gstApplicable ? (amountAfterDiscount * gstPercentage) / 100 : 0;
  const total = amountAfterDiscount + gstAmount;

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (!response.ok) {
        throw new Error('Invoice not found');
      }
      const data = await response.json();
      setInvoice(data);

      // Parse items and metadata
      const itemsData = data.items as any;
      const invoiceItems = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];
      setItems(invoiceItems.length > 0 ? invoiceItems : [{ description: '', qty: 1, price: 0 }]);
      setNotes(data.notes || '');
      setGstApplicable(itemsData?.gstApplicable || false);
      setGstPercentage(itemsData?.gstPercentage || 0);
      setOfferApplicable(itemsData?.offerApplicable || false);
      setOfferPercentage(itemsData?.offerPercentage || 0);
      setInvoiceStatus(data.status || 'PENDING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    let processedValue = value;
    
    // Handle number fields
    if (field === 'qty' || field === 'price') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        processedValue = 0;
      } else if (field === 'qty' && numValue < 0) {
        processedValue = 0;
      } else if (field === 'price' && numValue < 0) {
        processedValue = 0;
      } else {
        processedValue = numValue;
      }
    }
    
    newItems[index] = { ...newItems[index], [field]: processedValue };
    setItems(newItems);
  };

  const validateForm = () => {
    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.description.trim()) {
        toast.error(`Item ${i + 1}: Description is required`);
        return false;
      }
      if (Number(item.qty) <= 0) {
        toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
      if (Number(item.price) < 0) {
        toast.error(`Item ${i + 1}: Price cannot be negative`);
        return false;
      }
    }

    // Validate percentages
    if (gstApplicable && (gstPercentage < 0 || gstPercentage > 100)) {
      toast.error('GST percentage must be between 0 and 100');
      return false;
    }
    if (offerApplicable && (offerPercentage < 0 || offerPercentage > 100)) {
      toast.error('Offer percentage must be between 0 and 100');
      return false;
    }

    // Validate subtotal
    if (subtotal <= 0) {
      toast.error('Invoice must have at least one item with a positive amount');
      return false;
    }

    return true;
  };

  const save = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        items: {
          items: items,
          gstApplicable,
          gstPercentage,
          gstAmount,
          offerApplicable,
          offerPercentage,
          discountAmount,
          amountAfterDiscount,
        },
        subtotal,
        tax: gstAmount,
        discount: discountAmount,
        total,
        notes: notes.trim() || null,
        status: invoiceStatus,
      };

      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      // Update the local invoice state to reflect changes
      setInvoice(prev => prev ? {
        ...prev,
        items: payload.items,
        subtotal,
        tax: gstAmount,
        discount: discountAmount,
        total,
        notes: notes.trim() || null,
        status: invoiceStatus,
      } : null);
      
      // Show success modal
      let message = 'Invoice updated successfully!';
      
      if (invoice && invoice.status !== invoiceStatus) {
        message = `Invoice updated successfully! Status changed from ${invoice.status} to ${invoiceStatus}`;
      } else if (invoice && invoice.status === 'PAID') {
        message = 'Paid invoice updated successfully! Changes have been saved.';
      }
      
      // Check if payment amounts were updated
      const totalPaid = invoice?.payments?.reduce((sum: any, p: any) => sum + Number(p.amount), 0) || 0;
      const oldTotal = Number(invoice?.total) || 0;
      const newTotal = total;
      
                      if (totalPaid >= oldTotal && Math.abs(newTotal - oldTotal) > 0.01) {
                  message += ' Payment amounts have been automatically updated to reflect the new invoice total.';
                  message += ' The Payments Analytics page will automatically show the updated amounts!';
                }
      
      setSuccessMessage(message);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading invoice...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Invoice not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Invoice #{invoice.number}</h1>
            <div className="text-sm text-gray-500">
              Patient: {invoice.patient.firstName} {invoice.patient.lastName}
            </div>
            <div className="text-sm text-gray-500">
              Date: {new Date(invoice.date).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={invoiceStatus} />
        </div>
      </div>

      {/* Warning for paid invoices */}
                      {invoice.status === 'PAID' && (
                  <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Note:</strong> This invoice has been marked as PAID. You can still edit the invoice details,
                      but please be aware that changes may affect payment records and financial reporting.
                      {invoice.payments && invoice.payments.length > 0 && (
                        <span className="block mt-1 text-sm">
                          💡 Payment amounts will be automatically updated to reflect any changes to the invoice total.
                          <br />
                          📊 <strong>Good news:</strong> The Payments Analytics page now has auto-refresh enabled and will automatically show updated amounts!
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

      {/* Original Invoice Summary for Reference */}
      {invoice.status === 'PAID' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Original Invoice Summary (Paid)
            </CardTitle>
          </CardHeader>
                     <CardContent className="space-y-2 text-sm">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <span className="font-medium text-blue-700">Original Subtotal:</span>
                 <span className="ml-2">₹{(Number(invoice.subtotal) || 0).toFixed(2)}</span>
               </div>
               <div>
                 <span className="font-medium text-blue-700">Original Tax:</span>
                 <span className="ml-2">₹{(Number(invoice.tax) || 0).toFixed(2)}</span>
               </div>
               <div>
                 <span className="font-medium text-blue-700">Original Discount:</span>
                 <span className="ml-2">₹{(Number(invoice.discount) || 0).toFixed(2)}</span>
               </div>
               <div>
                 <span className="font-medium text-blue-700">Original Total:</span>
                 <span className="ml-2 font-semibold">₹{(Number(invoice.total) || 0).toFixed(2)}</span>
               </div>
             </div>
            {invoice.notes && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <span className="font-medium text-blue-700">Original Notes:</span>
                <p className="mt-1 text-blue-600">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Invoice Updated!"
        message={successMessage}
        duration={3000}
      />

      <Card className={invoice.status === 'PAID' ? 'border-green-200 bg-green-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Invoice Items</span>
            <Badge variant="secondary" className="text-xs">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Badge>
            {invoice.status === 'PAID' && (
              <Badge variant="default" className="text-xs bg-green-600">
                Paid Invoice
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-700 border-b pb-2">
            <div className="col-span-3">Description</div>
            <div>Qty</div>
            <div>Price (₹)</div>
            <div className="text-right">Total (₹)</div>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center p-3 bg-gray-50 rounded-lg border">
              <div className="col-span-3">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  min="1"
                  value={item.qty || ''}
                  onChange={(e) => updateItem(index, 'qty', e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.price || ''}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                />
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <div className="text-sm font-medium text-green-700">
                  ₹{((Number(item.qty) || 0) * (Number(item.price) || 0)).toFixed(2)}
                </div>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed border-2 hover:border-solid">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">GST Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="gst-applicable"
                checked={gstApplicable}
                onCheckedChange={setGstApplicable}
              />
              <Label htmlFor="gst-applicable">GST Applicable</Label>
            </div>
            
            {gstApplicable && (
              <div className="space-y-2">
                <Label htmlFor="gst-percentage">GST Percentage (%)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="gst-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(Number(e.target.value))}
                    className="w-32"
                  />
                  <Percent className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Offer/Discount Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="offer-applicable"
                checked={offerApplicable}
                onCheckedChange={setOfferApplicable}
              />
              <Label htmlFor="offer-applicable">Offer/Discount Applicable</Label>
            </div>
            
            {offerApplicable && (
              <div className="space-y-2">
                <Label htmlFor="offer-percentage">Discount Percentage (%)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="offer-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={offerPercentage}
                    onChange={(e) => setOfferPercentage(Number(e.target.value))}
                    className="w-32"
                  />
                  <Percent className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

                 <Card className="lg:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg">Invoice Status</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="status-select">Current Status</Label>
               <Select value={invoiceStatus} onValueChange={(value: InvoiceStatus) => setInvoiceStatus(value)}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="PENDING">Pending</SelectItem>
                   <SelectItem value="PARTIAL">Partial</SelectItem>
                   <SelectItem value="PAID">Paid</SelectItem>
                   <SelectItem value="CANCELLED">Cancelled</SelectItem>
                 </SelectContent>
               </Select>
                               {invoice && invoice.status !== invoiceStatus && !showSuccessModal && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    Status will be updated from <strong>{invoice.status}</strong> to <strong>{invoiceStatus}</strong>
                  </div>
                )}
             </div>
           </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Any additional notes for this invoice..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Invoice Summary</span>
            {invoice.status === 'PAID' && (
              <span className="text-sm text-green-600 font-normal">
                (Editing paid invoice - changes will be saved)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          {offerApplicable && offerPercentage > 0 && (
            <>
              <div className="flex justify-between text-red-600">
                <span>Discount ({offerPercentage}%):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>After Discount:</span>
                <span>₹{amountAfterDiscount.toFixed(2)}</span>
              </div>
            </>
          )}
          
          {gstApplicable && gstPercentage > 0 && (
            <div className="flex justify-between text-blue-600">
              <span>GST ({gstPercentage}%):</span>
              <span>+₹{gstAmount.toFixed(2)}</span>
            </div>
          )}
          
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </>
          ) : (
            'Update Invoice'
          )}
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { label: 'Paid', variant: 'default' as const, className: 'bg-green-100 text-green-800' };
      case 'PARTIAL':
        return { label: 'Partial', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' };
      case 'PENDING':
        return { label: 'Pending', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' };
      case 'CANCELLED':
        return { label: 'Cancelled', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
