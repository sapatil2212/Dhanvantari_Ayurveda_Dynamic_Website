import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { 
  CalendarDays, 
  Download, 
  Users as UsersIcon, 
  Stethoscope, 
  DoorOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign,
  Activity,
  BarChart3,
  Package,
  FileText,
  Bell
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { hasPermission, Permission, Role } from '@/lib/permissions';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  // Fetch real data from database
  const [
    totalPatients,
    totalAppointments,
    totalInvoices,
    totalPrescriptions,
    recentAppointments,
    lowStockItems,
    pendingPayments,
    todayAppointments
  ] = await Promise.all([
    prisma.patient.count({ where: { isActive: true } }),
    prisma.appointment.count(),
    prisma.invoice.count(),
    prisma.prescription.count({ where: { isActive: true } }),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { patient: true }
    }),
    prisma.inventoryItem.count({ where: { status: { in: ['low_stock', 'out_of_stock'] } } }),
    prisma.invoice.count({ where: { status: 'PENDING' } }),
    prisma.appointment.count({
      where: {
        preferredDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    })
  ]);

  // Calculate revenue for current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const currentMonthInvoices = await prisma.invoice.findMany({
    where: {
      createdAt: { gte: currentMonth },
      status: { in: ['PAID', 'PARTIAL'] }
    },
    include: { payments: true }
  });

  const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => {
    const paidAmount = invoice.payments.reduce((paymentSum, payment) => 
      paymentSum + Number(payment.amount), 0
    );
    return sum + paidAmount;
  }, 0);

  // Get user role for permission-based dashboard
  let userRole: Role | undefined;
  
  if (session.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });
    userRole = user?.role as Role;
  }

  const stats = [
    { 
      label: 'Total Patients', 
      value: totalPatients, 
      change: '+10.3%', 
      trend: 'up',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Today\'s Appointments', 
      value: todayAppointments, 
      change: '+15.3%', 
      trend: 'up',
      icon: CalendarDays,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Monthly Revenue', 
      value: `₹${currentMonthRevenue.toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Active Prescriptions', 
      value: totalPrescriptions, 
      change: '+5.7%', 
      trend: 'up',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Role-specific stats
  if (userRole && hasPermission(userRole, Permission.VIEW_ANALYTICS)) {
    stats.push(
      { 
        label: 'Low Stock Items', 
        value: lowStockItems, 
        change: '-2.1%', 
        trend: 'down',
        icon: Package,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      }
    );
  }

  if (userRole && hasPermission(userRole, Permission.VIEW_FINANCIAL_REPORTS)) {
    stats.push(
      { 
        label: 'Pending Payments', 
        value: pendingPayments, 
        change: '+8.9%', 
        trend: 'up',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    );
  }

  const data = Array.from({ length: 12 }).map((_, i) => ({
    name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    patients: Math.floor(20 + Math.random() * 80),
    appointments: Math.floor(15 + Math.random() * 60),
    revenue: Math.floor(50000 + Math.random() * 200000),
  }));

  const PatientStatistics = dynamic(() => import('@/components/dashboard/PatientStatistics'), { ssr: false });
  const AdvancedAnalytics = dynamic(() => import('@/components/dashboard/AdvancedAnalytics'), { ssr: false });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      MISSED: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back{session.user?.name ? `, ${session.user.name}` : ''}!</h1>
          <p className="text-sm text-gray-500">Here's what's happening in your clinic today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </Button>
          {userRole && hasPermission(userRole, Permission.EXPORT_REPORTS) && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((s, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                  <div className="flex items-center mt-2">
                    {s.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${s.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {s.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${s.bgColor} ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PatientStatistics data={data} />
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-3 rounded-md border p-3">
                      <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">
                          {appointment.patient ? 
                            `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
                            appointment.name
                          }
                        </div>
                        <div className="text-gray-500">
                          {new Date(appointment.preferredDate).toLocaleDateString()} · {appointment.preferredTime}
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {userRole && hasPermission(userRole, Permission.VIEW_ANALYTICS) ? (
            <AdvancedAnalytics data={{
              revenue: {
                monthly: data.map(d => ({ month: d.name, amount: d.revenue })),
                daily: []
              },
              patients: {
                new: data.map(d => ({ month: d.name, count: d.patients })),
                returning: [],
                demographics: []
              },
              appointments: {
                status: [
                  { status: 'Confirmed', count: 45 },
                  { status: 'Pending', count: 23 },
                  { status: 'Completed', count: 67 },
                  { status: 'Cancelled', count: 12 }
                ],
                daily: []
              },
              prescriptions: {
                monthly: data.map(d => ({ month: d.name, count: Math.floor(d.patients * 0.8) })),
                categories: []
              },
              performance: {
                doctorEfficiency: [
                  { doctor: 'Dr. Sharma', patients: 45, rating: 4.8 },
                  { doctor: 'Dr. Patel', patients: 38, rating: 4.6 },
                  { doctor: 'Dr. Kumar', patients: 42, rating: 4.9 }
                ],
                roomUtilization: [
                  { room: 'Room 1', utilization: 85 },
                  { room: 'Room 2', utilization: 72 },
                  { room: 'Room 3', utilization: 68 }
                ]
              }
            }} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">You don't have permission to view analytics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAppointments.slice(0, 10).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {appointment.patient ? 
                            `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
                            appointment.name
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.consultationType} • {appointment.preferredTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(appointment.status)}
                      <div className="text-sm text-gray-500 mt-1">
                        Room {appointment.roomNumber || 'TBD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-3 p-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <UsersIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {appointment.patient ? 
                            `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
                            appointment.name
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(appointment.preferredDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {userRole && hasPermission(userRole, Permission.CREATE_APPOINTMENTS) && (
                    <Button variant="outline" className="justify-start">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  )}
                  {userRole && hasPermission(userRole, Permission.CREATE_PATIENTS) && (
                    <Button variant="outline" className="justify-start">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  )}
                  {userRole && hasPermission(userRole, Permission.CREATE_PRESCRIPTIONS) && (
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      New Prescription
                    </Button>
                  )}
                  {userRole && hasPermission(userRole, Permission.CREATE_INVOICES) && (
                    <Button variant="outline" className="justify-start">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Create Invoice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


