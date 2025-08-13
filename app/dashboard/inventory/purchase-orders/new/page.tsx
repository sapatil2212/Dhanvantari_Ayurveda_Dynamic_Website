'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
  costPrice: number;
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
}

interface PurchaseOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState({
    supplier: '',
    supplierId: '',
    customSupplier: '',
    expectedDelivery: '',
    notes: '',
  });
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [useCustomSupplier, setUseCustomSupplier] = useState(false);

  // Load inventory items
  const loadInventoryItems = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory items');
      
      const data = await response.json();
      setInventoryItems(data.items || []);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory items',
        variant: 'destructive',
      });
    }
  };

  // Load suppliers
  const loadSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers?activeOnly=true');
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      
      const data = await response.json();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadInventoryItems();
    loadSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item to the order',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      
      const response = await fetch('/api/inventory/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier: useCustomSupplier ? formData.customSupplier : formData.supplier,
          supplierId: useCustomSupplier ? null : formData.supplierId,
          expectedDelivery: formData.expectedDelivery,
          notes: formData.notes,
          items: orderItems,
          totalAmount,
          status: 'pending',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create purchase order');
      }

      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });

      router.push('/dashboard/inventory/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create purchase order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        itemId: '',
        name: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If itemId changed, update the name and unit price
    if (field === 'itemId') {
      const selectedItem = inventoryItems.find(item => item.id === value);
      if (selectedItem) {
        updatedItems[index].name = selectedItem.name;
        updatedItems[index].unitPrice = selectedItem.costPrice;
      }
    }
    
    setOrderItems(updatedItems);
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory/purchase-orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Purchase Order</h1>
          <p className="text-muted-foreground">Create a new purchase order for inventory items</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existingSupplier"
                      checked={!useCustomSupplier}
                      onChange={() => setUseCustomSupplier(false)}
                      className="rounded"
                    />
                    <Label htmlFor="existingSupplier" className="text-sm">Select from existing suppliers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="customSupplier"
                      checked={useCustomSupplier}
                      onChange={() => setUseCustomSupplier(true)}
                      className="rounded"
                    />
                    <Label htmlFor="customSupplier" className="text-sm">Enter custom supplier name</Label>
                  </div>
                </div>
                
                {!useCustomSupplier ? (
                  <Select 
                    value={formData.supplierId} 
                    onValueChange={(value) => {
                      const selectedSupplier = suppliers.find(s => s.id === value);
                      setFormData({ 
                        ...formData, 
                        supplierId: value,
                        supplier: selectedSupplier?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          <div className="flex flex-col">
                            <span>{supplier.name}</span>
                            {supplier.contactPerson && (
                              <span className="text-xs text-muted-foreground">
                                Contact: {supplier.contactPerson}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="customSupplier"
                    value={formData.customSupplier}
                    onChange={(e) => setFormData({ ...formData, customSupplier: e.target.value })}
                    placeholder="Enter custom supplier name"
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special instructions or notes..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added. Click "Add Item" to start building your order.
              </div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                    <div className="col-span-4">
                      <Label>Item *</Label>
                      <Select
                        value={item.itemId}
                        onValueChange={(value) => updateItem(index, 'itemId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((invItem) => (
                            <SelectItem key={invItem.id} value={invItem.id}>
                              {invItem.name} ({invItem.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Unit Price (₹) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Total</Label>
                      <div className="p-2 bg-gray-50 rounded text-sm font-medium">
                        ₹{(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/inventory/purchase-orders">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || orderItems.length === 0}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
