'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface PurchaseOrder {
  id: string;
  number: string;
  supplier: string;
  supplierId?: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
}

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [useCustomSupplier, setUseCustomSupplier] = useState(false);

  // Load purchase orders
  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory/purchase-orders');
      if (!response.ok) throw new Error('Failed to fetch purchase orders');
      
      const data = await response.json();
      setPurchaseOrders(data.purchaseOrders || []);
    } catch (error) {
      console.error('Error loading purchase orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load purchase orders',
        variant: 'destructive',
      });
      setPurchaseOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Delete purchase order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      setDeletingOrder(orderId);
      const response = await fetch(`/api/inventory/purchase-orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete purchase order');

      toast({
        title: 'Success',
        description: 'Purchase order deleted successfully',
      });

      // Reload orders
      await loadPurchaseOrders();
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete purchase order',
        variant: 'destructive',
      });
    } finally {
      setDeletingOrder(null);
    }
  };

  // Handle view order
  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Handle edit order
  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder({ ...order });
    setUseCustomSupplier(!order.supplierId);
    setEditModalOpen(true);
  };

  // Handle save order
  const handleSaveOrder = async () => {
    if (!editingOrder) return;

    try {
      setSavingOrder(true);
      const response = await fetch(`/api/inventory/purchase-orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingOrder),
      });

      if (!response.ok) throw new Error('Failed to update order');

      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
      });

      setEditModalOpen(false);
      setEditingOrder(null);
      await loadPurchaseOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update purchase order',
        variant: 'destructive',
      });
    } finally {
      setSavingOrder(false);
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

  // Load data on component mount
  useEffect(() => {
    loadPurchaseOrders();
    loadSuppliers();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      ordered: { color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
      received: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredOrders = (purchaseOrders || []).filter(order => {
    const matchesSearch = order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage inventory purchase orders and suppliers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadPurchaseOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/dashboard/inventory/purchase-orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading purchase orders...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.number}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell>₹{Number(order.totalAmount).toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingOrder === order.id}
                              >
                                {deletingOrder === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                  <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this purchase order?
                                </AlertDialogDescription>
                                <p className="text-sm text-red-600 mt-2">
                                  This action cannot be undone.
                                </p>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex justify-center gap-3 !justify-center">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  disabled={deletingOrder === order.id}
                                >
                                  {deletingOrder === order.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Purchase Order</DialogTitle>
            <DialogDescription>
              Detailed information about the purchase order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order Number</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedOrder.number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Supplier</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-muted-foreground">₹{Number(selectedOrder.totalAmount).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Delivery</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.expectedDelivery ? new Date(selectedOrder.expectedDelivery).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <Label className="text-sm font-medium">Order Items</Label>
                <div className="mt-2 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>₹{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Update the purchase order information
            </DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="editExistingSupplier"
                        checked={!useCustomSupplier}
                        onChange={() => setUseCustomSupplier(false)}
                        className="rounded"
                      />
                      <Label htmlFor="editExistingSupplier" className="text-sm">Select from existing suppliers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="editCustomSupplier"
                        checked={useCustomSupplier}
                        onChange={() => setUseCustomSupplier(true)}
                        className="rounded"
                      />
                      <Label htmlFor="editCustomSupplier" className="text-sm">Enter custom supplier name</Label>
                    </div>
                  </div>
                  
                  {!useCustomSupplier ? (
                    <Select 
                      value={editingOrder.supplierId || ''} 
                      onValueChange={(value) => {
                        const selectedSupplier = suppliers.find(s => s.id === value);
                        setEditingOrder({ 
                          ...editingOrder, 
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
                      id="editCustomSupplier"
                      value={editingOrder.supplier}
                      onChange={(e) => setEditingOrder({ ...editingOrder, supplier: e.target.value, supplierId: undefined })}
                      placeholder="Enter custom supplier name"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={editingOrder.status} onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                  <Input
                    id="expectedDelivery"
                    type="date"
                    value={editingOrder.expectedDelivery ? editingOrder.expectedDelivery.split('T')[0] : ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, expectedDelivery: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={editingOrder.totalAmount}
                    onChange={(e) => setEditingOrder({ ...editingOrder, totalAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Order Items */}
              <div>
                <Label className="text-sm font-medium">Order Items</Label>
                <div className="mt-2 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editingOrder.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={item.name}
                              onChange={(e) => {
                                const newItems = [...editingOrder.items];
                                newItems[index] = { ...item, name: e.target.value };
                                setEditingOrder({ ...editingOrder, items: newItems });
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...editingOrder.items];
                                newItems[index] = { ...item, quantity: parseInt(e.target.value) || 0 };
                                setEditingOrder({ ...editingOrder, items: newItems });
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const newItems = [...editingOrder.items];
                                newItems[index] = { ...item, unitPrice: parseFloat(e.target.value) || 0 };
                                setEditingOrder({ ...editingOrder, items: newItems });
                              }}
                            />
                          </TableCell>
                          <TableCell>₹{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOrder} disabled={savingOrder}>
              {savingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
