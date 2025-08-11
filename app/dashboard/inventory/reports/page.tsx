'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Download, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
  overview: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalCostValue: number;
    totalSellingValue: number;
    potentialProfit: number;
  };
  recentTransactions: any[];
}

interface StockValueData {
  items: any[];
  categoryTotals: any;
  summary: {
    totalItems: number;
    totalCostValue: number;
    totalSellingValue: number;
    totalPotentialProfit: number;
  };
}

interface MovementsData {
  transactions: any[];
  movementsByType: any;
  totalsByType: any;
  movementsByDate: any[];
}

interface CategoriesData {
  categories: any[];
  summary: {
    totalCategories: number;
    totalItems: number;
    totalStock: number;
    totalCostValue: number;
    totalSellingValue: number;
    totalPotentialProfit: number;
  };
}

export default function InventoryReportsPage() {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | StockValueData | MovementsData | CategoriesData | null>(null);

  // Mock data for demonstration
  const mockOverviewData: ReportData = {
    overview: {
      totalItems: 156,
      lowStockItems: 12,
      outOfStockItems: 3,
      totalCostValue: 125000,
      totalSellingValue: 187500,
      potentialProfit: 62500
    },
    recentTransactions: [
      {
        id: '1',
        type: 'IN',
        quantity: 50,
        item: { name: 'Ashwagandha Powder', sku: 'ASH-001' },
        createdBy: { name: 'Dr. Sharma' },
        transactionDate: new Date()
      },
      {
        id: '2',
        type: 'OUT',
        quantity: 10,
        item: { name: 'Turmeric Capsules', sku: 'TUR-002' },
        createdBy: { name: 'Nurse Patel' },
        transactionDate: new Date(Date.now() - 86400000)
      }
    ]
  };

  const mockStockValueData: StockValueData = {
    items: [
      {
        id: '1',
        name: 'Ashwagandha Powder',
        sku: 'ASH-001',
        category: 'Herbs',
        currentStock: 50,
        costPrice: 500,
        sellingPrice: 800,
        costValue: 25000,
        sellingValue: 40000,
        potentialProfit: 15000
      },
      {
        id: '2',
        name: 'Turmeric Capsules',
        sku: 'TUR-002',
        category: 'Supplements',
        currentStock: 5,
        costPrice: 200,
        sellingPrice: 350,
        costValue: 1000,
        sellingValue: 1750,
        potentialProfit: 750
      }
    ],
    categoryTotals: {
      'Herbs': {
        totalItems: 45,
        totalCostValue: 45000,
        totalSellingValue: 72000,
        totalPotentialProfit: 27000
      },
      'Supplements': {
        totalItems: 32,
        totalCostValue: 32000,
        totalSellingValue: 56000,
        totalPotentialProfit: 24000
      }
    },
    summary: {
      totalItems: 156,
      totalCostValue: 125000,
      totalSellingValue: 187500,
      totalPotentialProfit: 62500
    }
  };

  const mockMovementsData: MovementsData = {
    transactions: [
      {
        id: '1',
        type: 'IN',
        quantity: 50,
        item: { name: 'Ashwagandha Powder', sku: 'ASH-001', category: 'Herbs' },
        createdBy: { name: 'Dr. Sharma' },
        transactionDate: new Date()
      },
      {
        id: '2',
        type: 'OUT',
        quantity: 10,
        item: { name: 'Turmeric Capsules', sku: 'TUR-002', category: 'Supplements' },
        createdBy: { name: 'Nurse Patel' },
        transactionDate: new Date(Date.now() - 86400000)
      }
    ],
    movementsByType: {
      'IN': [
        {
          id: '1',
          type: 'IN',
          quantity: 50,
          item: { name: 'Ashwagandha Powder', sku: 'ASH-001', category: 'Herbs' },
          createdBy: { name: 'Dr. Sharma' },
          transactionDate: new Date()
        }
      ],
      'OUT': [
        {
          id: '2',
          type: 'OUT',
          quantity: 10,
          item: { name: 'Turmeric Capsules', sku: 'TUR-002', category: 'Supplements' },
          createdBy: { name: 'Nurse Patel' },
          transactionDate: new Date(Date.now() - 86400000)
        }
      ]
    },
    totalsByType: {
      'IN': 50,
      'OUT': 10,
      'ADJUSTMENT': 0
    },
    movementsByDate: [
      {
        date: new Date().toISOString().split('T')[0],
        IN: 50,
        OUT: 0,
        ADJUSTMENT: 0
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        IN: 0,
        OUT: 10,
        ADJUSTMENT: 0
      }
    ]
  };

  const mockCategoriesData: CategoriesData = {
    categories: [
      {
        category: 'Herbs',
        totalItems: 45,
        totalStock: 1250,
        totalCostValue: 45000,
        totalSellingValue: 72000,
        totalPotentialProfit: 27000,
        averageStock: 28,
        averageCostValue: 1000,
        averageSellingValue: 1600,
        potentialProfit: 27000,
        statusCounts: {
          active: 40,
          low_stock: 3,
          out_of_stock: 1,
          expired: 1
        }
      },
      {
        category: 'Supplements',
        totalItems: 32,
        totalStock: 800,
        totalCostValue: 32000,
        totalSellingValue: 56000,
        totalPotentialProfit: 24000,
        averageStock: 25,
        averageCostValue: 1000,
        averageSellingValue: 1750,
        potentialProfit: 24000,
        statusCounts: {
          active: 28,
          low_stock: 2,
          out_of_stock: 1,
          expired: 1
        }
      }
    ],
    summary: {
      totalCategories: 5,
      totalItems: 156,
      totalStock: 3200,
      totalCostValue: 125000,
      totalSellingValue: 187500,
      totalPotentialProfit: 62500
    }
  };

  const loadReport = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      switch (reportType) {
        case 'overview':
          setReportData(mockOverviewData);
          break;
        case 'stock_value':
          setReportData(mockStockValueData);
          break;
        case 'movements':
          setReportData(mockMovementsData);
          break;
        case 'categories':
          setReportData(mockCategoriesData);
          break;
        default:
          setReportData(mockOverviewData);
      }
      
      toast.success('Report loaded successfully');
    } catch (error) {
      console.error('Error loading report:', error);
      toast.error('Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'low_stock':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportReport = () => {
    toast.success('Report export started');
    // In a real implementation, this would generate and download a CSV/PDF
  };

  const renderOverviewReport = () => {
    if (!reportData || !('overview' in reportData)) return null;
    const data = reportData as ReportData;

    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.overview.totalItems)}</div>
              <p className="text-xs text-muted-foreground">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{formatNumber(data.overview.lowStockItems)}</div>
              <p className="text-xs text-muted-foreground">
                Below minimum stock level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatNumber(data.overview.outOfStockItems)}</div>
              <p className="text-xs text-muted-foreground">
                Zero stock items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.totalSellingValue)}</div>
              <p className="text-xs text-muted-foreground">
                At selling price
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Value Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.totalCostValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selling Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.totalSellingValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Potential Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(data.overview.potentialProfit)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'IN' ? 'default' : 'secondary'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.item.name}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.createdBy.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStockValueReport = () => {
    if (!reportData || !('items' in reportData)) return null;
    const data = reportData as StockValueData;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.summary.totalItems)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.summary.totalCostValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selling Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.summary.totalSellingValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalPotentialProfit)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Totals */}
        <Card>
          <CardHeader>
            <CardTitle>Category Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Cost Value</TableHead>
                  <TableHead>Selling Value</TableHead>
                  <TableHead>Potential Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(data.categoryTotals).map(([category, totals]: [string, any]) => (
                  <TableRow key={category}>
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell>{formatNumber(totals.totalItems)}</TableCell>
                    <TableCell>{formatCurrency(totals.totalCostValue)}</TableCell>
                    <TableCell>{formatCurrency(totals.totalSellingValue)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(totals.totalPotentialProfit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Cost Value</TableHead>
                  <TableHead>Selling Value</TableHead>
                  <TableHead>Potential Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatNumber(item.currentStock)}</TableCell>
                    <TableCell>{formatCurrency(item.costValue)}</TableCell>
                    <TableCell>{formatCurrency(item.sellingValue)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(item.potentialProfit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMovementsReport = () => {
    if (!reportData || !('transactions' in reportData)) return null;
    const data = reportData as MovementsData;

    return (
      <div className="space-y-6">
        {/* Movement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock In</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatNumber(data.totalsByType.IN || 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatNumber(data.totalsByType.OUT || 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatNumber(data.totalsByType.ADJUSTMENT || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'IN' ? 'default' : 'secondary'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.item.name}</TableCell>
                    <TableCell>{transaction.item.category}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.createdBy.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCategoriesReport = () => {
    if (!reportData || !('categories' in reportData)) return null;
    const data = reportData as CategoriesData;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.summary.totalCategories)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.summary.totalItems)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.summary.totalStock)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.summary.totalSellingValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Stock</TableHead>
                  <TableHead>Avg Stock</TableHead>
                  <TableHead>Cost Value</TableHead>
                  <TableHead>Selling Value</TableHead>
                  <TableHead>Potential Profit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.categories.map((category) => (
                  <TableRow key={category.category}>
                    <TableCell className="font-medium">{category.category}</TableCell>
                    <TableCell>{formatNumber(category.totalItems)}</TableCell>
                    <TableCell>{formatNumber(category.totalStock)}</TableCell>
                    <TableCell>{formatNumber(category.averageStock)}</TableCell>
                    <TableCell>{formatCurrency(category.totalCostValue)}</TableCell>
                    <TableCell>{formatCurrency(category.totalSellingValue)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(category.potentialProfit)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs">
                          Active: {category.statusCounts.active}
                        </div>
                        <div className="text-xs text-yellow-600">
                          Low: {category.statusCounts.low_stock}
                        </div>
                        <div className="text-xs text-red-600">
                          Out: {category.statusCounts.out_of_stock}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for inventory management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={loadReport} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Report Type:</span>
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="stock_value">Stock Value</SelectItem>
                <SelectItem value="movements">Stock Movements</SelectItem>
                <SelectItem value="categories">Category Analysis</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading report...</p>
          </div>
        </div>
      )}

      {/* Report Content */}
      {!isLoading && reportData && (
        <>
          {reportType === 'overview' && renderOverviewReport()}
          {reportType === 'stock_value' && renderStockValueReport()}
          {reportType === 'movements' && renderMovementsReport()}
          {reportType === 'categories' && renderCategoriesReport()}
        </>
      )}
    </div>
  );
}
