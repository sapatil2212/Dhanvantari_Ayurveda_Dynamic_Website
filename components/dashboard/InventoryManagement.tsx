'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Users,
  BarChart3,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier?: string;
  expiryDate?: string;
  location?: string;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface PurchaseOrder {
  id: string;
  number: string;
  supplier: string;
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
}

export default function InventoryManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [viewOrderModalOpen, setViewOrderModalOpen] = useState(false);
  const [editOrderModalOpen, setEditOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Load inventory items
  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/inventory?${params.toString()}`);
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
    } finally {
      setLoading(false);
    }
  };

  // Load purchase orders
  const loadPurchaseOrders = async () => {
    try {
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
    }
  };

  // Delete inventory item
  const handleDeleteItem = async (itemId: string) => {
    try {
      setDeletingItem(itemId);
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully',
      });

      // Reload items
      await loadInventoryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive',
      });
    } finally {
      setDeletingItem(null);
    }
  };

  // Handle view item
  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  // Handle edit item
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setEditModalOpen(true);
  };

  // Handle save item
  const handleSaveItem = async () => {
    if (!editingItem) return;

    try {
      setSavingItem(true);
      const response = await fetch(`/api/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (!response.ok) throw new Error('Failed to update item');

      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });

      setEditModalOpen(false);
      setEditingItem(null);
      await loadInventoryItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inventory item',
        variant: 'destructive',
      });
    } finally {
      setSavingItem(false);
    }
  };

  // Handle view order
  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewOrderModalOpen(true);
  };

  // Handle edit order
  const handleEditOrder = (order: PurchaseOrder) => {
    setEditingOrder({ ...order });
    setEditOrderModalOpen(true);
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

      setEditOrderModalOpen(false);
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

  // Handle barcode scanner item found
  const handleBarcodeItemFound = (item: any) => {
    console.log('Barcode item found:', item);
    setSelectedItem(item);
  };

  // Load data on component mount
  useEffect(() => {
    loadInventoryItems();
    loadPurchaseOrders();
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadInventoryItems();
  }, [searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      out_of_stock: { color: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { color: 'bg-gray-100 text-gray-800', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const filteredItems = (inventoryItems || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage Ayurvedic medicines, herbs, and medical supplies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadInventoryItems} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/dashboard/inventory/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Herbs">Herbs</SelectItem>
                  <SelectItem value="Supplements">Supplements</SelectItem>
                  <SelectItem value="Oils">Oils</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading inventory items...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.sku}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.currentStock} {item.unit}</span>
                            <span className="text-muted-foreground">
                              {getStockPercentage(item.currentStock, item.maxStock)}%
                            </span>
                          </div>
                          <Progress 
                            value={getStockPercentage(item.currentStock, item.maxStock)} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>₹{item.costPrice.toLocaleString()}</TableCell>
                      <TableCell>₹{item.sellingPrice.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingItem === item.id}
                              >
                                {deletingItem === item.id ? (
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
                                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this inventory item?
                                </AlertDialogDescription>
                                <p className="text-sm text-red-600 mt-2">
                                  This action cannot be undone.
                                </p>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex justify-center gap-3 !justify-center">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={deletingItem === item.id}
                                >
                                  {deletingItem === item.id ? 'Deleting...' : 'Delete'}
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

      {/* Purchase Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Orders</CardTitle>
            <Link href="/dashboard/inventory/purchase-orders">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </Link>
          </div>
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
                {!purchaseOrders || purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.number}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell>₹{Number(order.totalAmount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'received' ? 'default' : 'secondary'}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </TableCell>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/inventory/add">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Plus className="h-6 w-6 mb-2" />
                <span>Add Item</span>
              </Button>
            </Link>
            <Link href="/dashboard/inventory/purchase-orders">
              <Button variant="outline" className="h-20 flex-col w-full">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>Purchase Orders</span>
              </Button>
            </Link>
            <Link href="/dashboard/inventory/alerts">
              <Button variant="outline" className="h-20 flex-col w-full">
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span>Stock Alerts</span>
              </Button>
            </Link>
            <Link href="/dashboard/inventory/suppliers">
              <Button variant="outline" className="h-20 flex-col w-full">
                <Building2 className="h-6 w-6 mb-2" />
                <span>Suppliers</span>
              </Button>
            </Link>
            <Link href="/dashboard/inventory/reports">
              <Button variant="outline" className="h-20 flex-col w-full">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* View Item Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Inventory Item</DialogTitle>
            <DialogDescription>
              Detailed information about the inventory item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">SKU</Label>
                <p className="text-sm text-muted-foreground font-mono">{selectedItem.sku}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Unit</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.unit}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Stock</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.currentStock}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Min Stock</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.minStock}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Max Stock</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.maxStock}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Cost Price</Label>
                <p className="text-sm text-muted-foreground">₹{selectedItem.costPrice.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Selling Price</Label>
                <p className="text-sm text-muted-foreground">₹{selectedItem.sellingPrice.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Supplier</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.supplier || '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">{selectedItem.location || '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Expiry Date</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedItem.expiryDate ? new Date(selectedItem.expiryDate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Created At</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedItem.createdAt).toLocaleDateString()}
                </p>
              </div>
              {selectedItem.description && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
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

      {/* Edit Item Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the inventory item information
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={editingItem.sku}
                  onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="herb">Herb</SelectItem>
                    <SelectItem value="supplement">Supplement</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="supply">Supply</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={editingItem.unit} onValueChange={(value) => setEditingItem({ ...editingItem, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                    <SelectItem value="kilograms">Kilograms</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="milliliters">Milliliters</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={editingItem.currentStock}
                  onChange={(e) => setEditingItem({ ...editingItem, currentStock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="minStock">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={editingItem.minStock}
                  onChange={(e) => setEditingItem({ ...editingItem, minStock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Max Stock</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={editingItem.maxStock}
                  onChange={(e) => setEditingItem({ ...editingItem, maxStock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={editingItem.costPrice}
                  onChange={(e) => setEditingItem({ ...editingItem, costPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  value={editingItem.sellingPrice}
                  onChange={(e) => setEditingItem({ ...editingItem, sellingPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={editingItem.supplier || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={editingItem.expiryDate ? editingItem.expiryDate.split('T')[0] : ''}
                  onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={savingItem}>
              {savingItem ? (
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

      {/* View Order Modal */}
      <Dialog open={viewOrderModalOpen} onOpenChange={setViewOrderModalOpen}>
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
                  <div className="mt-1">
                    <Badge variant={selectedOrder.status === 'received' ? 'default' : 'secondary'}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                  </div>
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
            <Button variant="outline" onClick={() => setViewOrderModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={editOrderModalOpen} onOpenChange={setEditOrderModalOpen}>
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
                  <Input
                    id="supplier"
                    value={editingOrder.supplier}
                    onChange={(e) => setEditingOrder({ ...editingOrder, supplier: e.target.value })}
                  />
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
            <Button variant="outline" onClick={() => setEditOrderModalOpen(false)}>
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
