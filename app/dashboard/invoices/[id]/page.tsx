'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Invoice = {
  id: string;
  number: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: any;
  patient: {
    firstName: string;
    lastName: string;
  };
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    paidAt: string;
    notes?: string;
  }>;
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);

  useEffect(() => {
    // Check if user was redirected from invoices list for payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'true') {
      setShowPaymentPrompt(true);
      // Remove the parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoice');
    } finally {
      setLoading(false);
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

  // Handle both old and new invoice structures
  const itemsData = invoice.items as any;
  const items = Array.isArray(itemsData) ? itemsData : itemsData?.items || [];
  const gstApplicable = itemsData?.gstApplicable || false;
  const gstPercentage = itemsData?.gstPercentage || 0;
  const offerApplicable = itemsData?.offerApplicable || false;
  const offerPercentage = itemsData?.offerPercentage || 0;
  const amountAfterDiscount = itemsData?.amountAfterDiscount || Number(invoice.subtotal);
  
  const totalPaid = invoice.payments.reduce((s, p) => s + Number(p.amount), 0);
  const balance = Number(invoice.total) - totalPaid;
  
  return (
    <div className="space-y-6">
      {showPaymentPrompt && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Please add payment details below to complete the payment and update the invoice status to PAID.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Invoice #{invoice.number}</h1>
            <div className="text-sm text-gray-500">Patient: {invoice.patient.firstName} {invoice.patient.lastName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={invoice.status} />
        </div>
      </div>
      
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="shadow-sm">
           <CardContent className="p-6">
             <div className="text-sm">
               <div className="mb-2 font-medium">Items</div>
               <div className="space-y-1">
                 {items.map((it: any, i: number) => (
                   <div key={i} className="grid grid-cols-6 gap-2">
                     <div className="col-span-3">{it.description}</div>
                     <div>{it.qty}</div>
                     <div>₹{Number(it.price).toFixed(2)}</div>
                     <div className="text-right">₹{(Number(it.qty) * Number(it.price)).toFixed(2)}</div>
                   </div>
                 ))}
               </div>
               
               <div className="mt-3 border-t pt-3 text-right space-y-1">
                 <div>Subtotal: ₹{Number(invoice.subtotal).toFixed(2)}</div>
                 
                 {offerApplicable && offerPercentage > 0 && (
                   <>
                     <div className="text-red-600">Discount ({offerPercentage}%): -₹{Number(invoice.discount).toFixed(2)}</div>
                     <div>After Discount: ₹{amountAfterDiscount.toFixed(2)}</div>
                   </>
                 )}
                 
                 {gstApplicable && gstPercentage > 0 && (
                   <div className="text-blue-600">GST ({gstPercentage}%): +₹{Number(invoice.tax).toFixed(2)}</div>
                 )}
                 
                 <Separator className="my-2" />
                 <div className="text-base font-semibold">Total: ₹{Number(invoice.total).toFixed(2)}</div>
                 <div className="text-emerald-700">Paid: ₹{totalPaid.toFixed(2)}</div>
                 <div className="text-rose-700">Balance: ₹{balance.toFixed(2)}</div>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <PaymentForm 
           invoiceId={invoice.id} 
           disabled={balance <= 0 || invoice.status === 'CANCELLED'} 
           onPaymentAdded={fetchInvoice}
         />
       </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { label: 'Paid', variant: 'default', icon: CheckCircle, className: 'bg-green-100 text-green-800' };
      case 'PARTIAL':
        return { label: 'Partial', variant: 'secondary', icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800' };
      case 'PENDING':
        return { label: 'Pending', variant: 'outline', icon: Clock, className: 'bg-gray-100 text-gray-800' };
      case 'CANCELLED':
        return { label: 'Cancelled', variant: 'destructive', icon: XCircle, className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, variant: 'outline', icon: Clock, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}



function PaymentForm({ 
  invoiceId, 
  disabled, 
  onPaymentAdded 
}: { 
  invoiceId: string; 
  disabled: boolean;
  onPaymentAdded: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !method) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('method', method);
      if (notes) formData.append('notes', notes);

      const response = await fetch(`/api/invoices/${invoiceId}/payments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      toast.success('Payment recorded successfully!');

      // Check if this payment completes the invoice
      const paymentAmount = parseFloat(amount);
      const currentInvoice = await fetch(`/api/invoices/${invoiceId}`);
      if (currentInvoice.ok) {
        const invoiceData = await currentInvoice.json();
        const totalPaid = invoiceData.payments.reduce((s: number, p: any) => s + Number(p.amount), 0) + paymentAmount;
        const balance = Number(invoiceData.total) - totalPaid;
        
        // If balance is zero or negative, automatically update status to PAID
        if (balance <= 0 && invoiceData.status !== 'PAID') {
          const statusResponse = await fetch(`/api/invoices/${invoiceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'PAID' }),
          });
          
          if (statusResponse.ok) {
            toast.success('Payment completed! Invoice status automatically updated to PAID.');
          }
        }
      }

      // Reset form
      setAmount('');
      setMethod('');
      setNotes('');
      onPaymentAdded();
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input 
              id="amount"
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
              disabled={disabled || submitting} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod} disabled={disabled || submitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card (Credit/Debit)</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input 
              id="notes"
              placeholder="Payment notes..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={disabled || submitting} 
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={disabled || submitting || !amount || !method}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </div>
        </form>
        
        {disabled && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Cannot add payment to this invoice
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}


