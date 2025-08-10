'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  FileText,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

type PaymentData = {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
  invoiceNumber: string;
  patientName: string;
  status: string;
};

type ChartData = {
  name: string;
  value: number;
  color: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Enhanced fetchPayments with better error handling and logging
  const fetchPayments = useCallback(async (showLoading = true, isAutoRefresh = false) => {
    if (showLoading) setLoading(true);
    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/payments?days=${timeRange}&method=${selectedMethod}&_t=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
        setLastRefresh(new Date());
        console.log(`Payments refreshed at ${new Date().toLocaleTimeString()}, got ${data.length} payments`);
        
        // Show notification for auto-refresh
        if (isAutoRefresh && !showLoading) {
          setNotification({
            message: `Data automatically refreshed • ${data.length} payments loaded`,
            type: 'info'
          });
          // Clear notification after 3 seconds
          setTimeout(() => setNotification(null), 3000);
        }
      } else {
        console.error('Failed to fetch payments:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [timeRange, selectedMethod]);

  // Initial load
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Set mounted to true after hydration to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-refresh when user returns to the page (visibility change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing payments data...');
        fetchPayments(false, true); // Don't show loading indicator for background refresh
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchPayments]);

  // Periodic refresh every 30 seconds to ensure data stays current
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Periodic refresh triggered...');
      fetchPayments(false, true); // Don't show loading indicator for background refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchPayments]);

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      let fileName = `payments-export-${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'pdf':
          generatePDF();
          break;
        
        case 'excel':
          downloadFile(generateCSVContent(), 'text/csv', `${fileName}.csv`);
          break;
        
        case 'csv':
          downloadFile(generateCSVContent(), 'text/csv', `${fileName}.csv`);
          break;
        
        default:
          throw new Error('Unsupported export format');
      }

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const downloadFile = (content: string, mimeType: string, fileName: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const timeRangeText = timeRange === '7' ? 'Last 7 days' : 
                         timeRange === '30' ? 'Last 30 days' : 
                         timeRange === '90' ? 'Last 90 days' : 'Last year';
    const methodText = selectedMethod === 'all' ? 'All Methods' : selectedMethod;

    // Set font styles
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Payments Analytics Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${currentDate}`, 105, 30, { align: 'center' });

    // Report filters
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Report Filters', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Time Range: ${timeRangeText}`, 20, 55);
    doc.text(`Payment Method: ${methodText}`, 20, 62);
    doc.text(`Total Records: ${payments.length} payments`, 20, 69);

    // Key metrics
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Metrics', 20, 85);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: ₹${totalAmount.toLocaleString()}`, 20, 95);
    doc.text(`Total Payments: ${totalPayments}`, 20, 102);
    doc.text(`Average Payment: ₹${averageAmount.toFixed(0)}`, 20, 109);

    // Payment methods breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Methods Breakdown', 20, 125);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 135;
    Object.entries(methodBreakdown).forEach(([method, amount]) => {
      const percentage = ((amount / totalAmount) * 100).toFixed(1);
      doc.text(`${method}: ₹${amount.toLocaleString()} (${percentage}%)`, 20, yPos);
      yPos += 7;
    });

    // Payment details table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 20, yPos + 10);

    // Prepare table data
    const tableData = payments.map(payment => [
      new Date(payment.paidAt).toLocaleDateString(),
      payment.patientName,
      payment.invoiceNumber,
      `₹${payment.amount.toLocaleString()}`,
      payment.method,
      payment.status
    ]);

    // Add table using autoTable
    autoTable(doc, {
      startY: yPos + 20,
      head: [['Date', 'Patient Name', 'Invoice #', 'Amount', 'Method', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 40 }, // Patient Name
        2: { cellWidth: 30 }, // Invoice #
        3: { cellWidth: 25 }, // Amount
        4: { cellWidth: 25 }, // Method
        5: { cellWidth: 20 }  // Status
      }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Report generated by Dhanvantari Ayurveda System', 105, finalY, { align: 'center' });
    doc.text('For any queries, please contact the system administrator', 105, finalY + 7, { align: 'center' });

    // Save the PDF
    doc.save(`payments-export-${new Date().toISOString().split('T')[0]}.pdf`);
  };



  const generateCSVContent = () => {
    const headers = ['Date', 'Patient Name', 'Invoice Number', 'Amount (₹)', 'Payment Method', 'Status'];
    const csvRows = [headers.join(',')];
    
    payments.forEach(payment => {
      const row = [
        new Date(payment.paidAt).toLocaleDateString(),
        payment.patientName,
        payment.invoiceNumber,
        payment.amount,
        payment.method,
        payment.status
      ].map(field => `"${field}"`).join(',');
      csvRows.push(row);
    });

    // Add summary section
    csvRows.push('');
    csvRows.push('Summary');
    csvRows.push(`"Total Revenue","₹${totalAmount.toLocaleString()}"`);
    csvRows.push(`"Total Payments","${totalPayments}"`);
    csvRows.push(`"Average Payment","₹${averageAmount.toFixed(0)}"`);
    csvRows.push('');
    csvRows.push('Payment Methods Breakdown');
    
    Object.entries(methodBreakdown).forEach(([method, amount]) => {
      csvRows.push(`"${method}","₹${amount.toLocaleString()}","${((amount / totalAmount) * 100).toFixed(1)}%"`);
    });

    return csvRows.join('\n');
  };

  const generateJSONContent = () => {
    const exportData = {
      reportInfo: {
        title: "Payments Analytics Report",
        generatedAt: new Date().toISOString(),
        filters: {
          timeRange: timeRange === '7' ? 'Last 7 days' : 
                    timeRange === '30' ? 'Last 30 days' : 
                    timeRange === '90' ? 'Last 90 days' : 'Last year',
          method: selectedMethod === 'all' ? 'All Methods' : selectedMethod,
        },
        totalRecords: payments.length
      },
      summary: {
        totalAmount: totalAmount,
        totalPayments: totalPayments,
        averageAmount: averageAmount,
        methodBreakdown: methodBreakdown
      },
      payments: payments.map(payment => ({
        date: new Date(payment.paidAt).toLocaleDateString(),
        patientName: payment.patientName,
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        method: payment.method,
        status: payment.status
      }))
    };

    return JSON.stringify(exportData, null, 2);
  };

  // Calculate analytics
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPayments = payments.length;
  const averageAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;

  // Payment method breakdown
  const methodBreakdown = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const methodChartData: ChartData[] = Object.entries(methodBreakdown).map(([method, amount], index) => ({
    name: method,
    value: amount,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]
  }));

  // Daily payment trends
  const dailyTrends = payments.reduce((acc, payment) => {
    const date = new Date(payment.paidAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const trendChartData = Object.entries(dailyTrends)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-7)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }));

  // Recent payments
  const recentPayments = payments.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments Analytics</h1>
          <p className="text-gray-600">Track and analyze payment performance</p>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-green-600">
              ✅ Auto-refresh enabled{mounted && ` • Last updated: ${lastRefresh.toLocaleTimeString()}`}
            </p>
            <p className="text-sm text-amber-600">
              💡 Payment amounts are automatically updated when invoice totals are modified
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => fetchPayments(true)} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-3 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{notification.message}</div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Revenue</p>
                <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">+12.5% from last month</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Payments</p>
                <p className="text-3xl font-bold">{totalPayments}</p>
                <p className="text-green-100 text-sm">+8.2% from last month</p>
              </div>
              <Activity className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Average Payment</p>
                <p className="text-3xl font-bold">₹{averageAmount.toFixed(0)}</p>
                <p className="text-purple-100 text-sm">+5.3% from last month</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payment Methods Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {methodChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{item.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {((item.value / totalAmount) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Daily Payment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendChartData.map((item, index) => (
                    <div key={item.date} className="flex items-center justify-between">
                      <span className="font-medium">{item.date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(item.amount / Math.max(...trendChartData.map(d => d.amount))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(methodBreakdown).map(([method, amount]) => {
              const percentage = ((amount / totalAmount) * 100).toFixed(1);
              const icon = getMethodIcon(method);
              const color = getMethodColor(method);
              
              return (
                <Card key={method} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${color.bg}`}>
                        {icon}
                      </div>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method}</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {payments.filter(p => p.method === method).length} payments
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Payment Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Weekly Comparison */}
                <div>
                  <h4 className="font-semibold mb-4">Weekly Comparison</h4>
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      const dayPayments = payments.filter(p => 
                        new Date(p.paidAt).toDateString() === date.toDateString()
                      );
                      const dayTotal = dayPayments.reduce((sum, p) => sum + p.amount, 0);
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="text-sm text-gray-500 mb-2">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="bg-blue-100 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-900">
                              ₹{dayTotal.toLocaleString()}
                            </div>
                            <div className="text-xs text-blue-600">
                              {dayPayments.length} payments
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Growth Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">Growth Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">+15.3%</div>
                    <div className="text-sm text-green-600">vs last period</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Peak Day</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">Wednesday</div>
                    <div className="text-sm text-blue-600">Most active day</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">Top Method</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">UPI</div>
                    <div className="text-sm text-purple-600">Most preferred</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getMethodColor(payment.method).bg}`}>
                        {getMethodIcon(payment.method)}
                      </div>
                      <div>
                        <div className="font-semibold">{payment.patientName}</div>
                        <div className="text-sm text-gray-500">
                          Invoice #{payment.invoiceNumber} • {new Date(payment.paidAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">₹{payment.amount.toLocaleString()}</div>
                      <Badge variant="outline" className="capitalize">{payment.method}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function getMethodIcon(method: string) {
  const iconClass = "h-5 w-5";
  switch (method.toLowerCase()) {
    case 'cash':
      return <Banknote className={iconClass} />;
    case 'upi':
      return <Smartphone className={iconClass} />;
    case 'card':
      return <CreditCard className={iconClass} />;
    case 'net banking':
      return <Activity className={iconClass} />;
    case 'cheque':
      return <DollarSign className={iconClass} />;
    default:
      return <DollarSign className={iconClass} />;
  }
}

function getMethodColor(method: string) {
  switch (method.toLowerCase()) {
    case 'cash':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'upi':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'card':
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    case 'net banking':
      return { bg: 'bg-orange-100', text: 'text-orange-600' };
    case 'cheque':
      return { bg: 'bg-red-100', text: 'text-red-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
}
