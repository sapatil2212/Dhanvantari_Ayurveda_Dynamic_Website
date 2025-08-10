'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  AlertTriangle, 
  Clock, 
  Package, 
  TrendingDown, 
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Filter,
  Download
} from 'lucide-react';

interface StockAlert {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  daysUntilExpiry?: number;
  expiryDate?: string;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
}

export default function StockAlertsPage() {
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data
  const stockAlerts: StockAlert[] = [
    {
      id: '1',
      itemName: 'Ashwagandha Powder',
      sku: 'HERB-001',
      category: 'Herbs',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'kg',
      alertType: 'low_stock',
      lastUpdated: '2025-01-15',
      priority: 'high'
    },
    {
      id: '2',
      itemName: 'Turmeric Capsules',
      sku: 'SUPP-002',
      category: 'Supplements',
      currentStock: 0,
      minStock: 50,
      maxStock: 200,
      unit: 'bottles',
      alertType: 'out_of_stock',
      lastUpdated: '2025-01-10',
      priority: 'high'
    },
    {
      id: '3',
      itemName: 'Neem Oil',
      sku: 'OIL-003',
      category: 'Oils',
      currentStock: 45,
      minStock: 10,
      maxStock: 80,
      unit: 'liters',
      alertType: 'expiring_soon',
      daysUntilExpiry: 30,
      expiryDate: '2025-02-15',
      lastUpdated: '2025-01-12',
      priority: 'medium'
    },
    {
      id: '4',
      itemName: 'Sesame Oil',
      sku: 'OIL-004',
      category: 'Oils',
      currentStock: 5,
      minStock: 15,
      maxStock: 60,
      unit: 'liters',
      alertType: 'expired',
      expiryDate: '2025-01-05',
      lastUpdated: '2025-01-05',
      priority: 'high'
    }
  ];

  const getAlertBadge = (alertType: string) => {
    const alertConfig = {
      low_stock: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      out_of_stock: { color: 'bg-red-100 text-red-800', icon: Package },
      expiring_soon: { color: 'bg-orange-100 text-orange-800', icon: Clock },
      expired: { color: 'bg-red-100 text-red-800', icon: TrendingDown }
    };
    
    const config = alertConfig[alertType as keyof typeof alertConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {alertType.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const filteredAlerts = stockAlerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.alertType === filterType;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    
    return matchesType && matchesPriority;
  });

  const highPriorityAlerts = stockAlerts.filter(alert => alert.priority === 'high');
  const lowStockItems = stockAlerts.filter(alert => alert.alertType === 'low_stock' || alert.alertType === 'out_of_stock');
  const expiringItems = stockAlerts.filter(alert => alert.alertType === 'expiring_soon' || alert.alertType === 'expired');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Stock Alerts</h1>
          <p className="text-sm text-gray-500">Monitor low stock, expired items, and inventory alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{stockAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringItems.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Alert Types</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>

            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Expiry Info</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.itemName}</div>
                        <div className="text-sm text-gray-500">ID: {alert.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{alert.sku}</TableCell>
                    <TableCell>{alert.category}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{alert.currentStock} {alert.unit}</span>
                          <span className="text-gray-500">/ {alert.maxStock}</span>
                        </div>
                        <Progress 
                          value={(alert.currentStock / alert.maxStock) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500">
                          Min: {alert.minStock} {alert.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getAlertBadge(alert.alertType)}</TableCell>
                    <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                    <TableCell>
                      {alert.expiryDate ? (
                        <div>
                          <div className="text-sm">
                            {new Date(alert.expiryDate).toLocaleDateString()}
                          </div>
                          {alert.daysUntilExpiry !== undefined && (
                            <div className="text-xs text-gray-500">
                              {alert.daysUntilExpiry > 0 
                                ? `${alert.daysUntilExpiry} days left`
                                : 'Expired'
                              }
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(alert.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span>Create Purchase Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <RefreshCw className="h-6 w-6 mb-2" />
              <span>Update Stock Levels</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Configure Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
