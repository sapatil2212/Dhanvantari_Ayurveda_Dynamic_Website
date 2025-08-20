'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Stethoscope,
  Pill
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    monthly: Array<{ month: string; amount: number }>;
    daily: Array<{ date: string; amount: number }>;
  };
  patients: {
    new: Array<{ month: string; count: number }>;
    returning: Array<{ month: string; count: number }>;
    demographics: Array<{ age: string; count: number }>;
  };
  appointments: {
    status: Array<{ status: string; count: number }>;
    daily: Array<{ date: string; scheduled: number; completed: number }>;
  };
  prescriptions: {
    monthly: Array<{ month: string; count: number }>;
    categories: Array<{ category: string; count: number }>;
  };
  performance: {
    doctorEfficiency: Array<{ doctor: string; patients: number; rating: number }>;
    roomUtilization: Array<{ room: string; utilization: number }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdvancedAnalytics({ data }: { data: AnalyticsData }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  // Calculate real values from data
  const totalRevenue = data.revenue.monthly.reduce((sum, item) => sum + item.amount, 0);
  const totalPatients = data.patients.new.reduce((sum, item) => sum + item.count, 0);
  const totalAppointments = data.appointments.status.reduce((sum, item) => sum + item.count, 0);
  const totalPrescriptions = data.prescriptions.monthly.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentage changes (simplified calculation)
  const revenueChange = data.revenue.monthly.length > 1 
    ? ((data.revenue.monthly[data.revenue.monthly.length - 1].amount - data.revenue.monthly[data.revenue.monthly.length - 2].amount) / data.revenue.monthly[data.revenue.monthly.length - 2].amount * 100).toFixed(1)
    : '0.0';
  
  const patientChange = data.patients.new.length > 1
    ? ((data.patients.new[data.patients.new.length - 1].count - data.patients.new[data.patients.new.length - 2].count) / data.patients.new[data.patients.new.length - 2].count * 100).toFixed(1)
    : '0.0';

  // Calculate appointment change from daily data
  const appointmentChange = data.appointments.daily.length > 1
    ? ((data.appointments.daily[data.appointments.daily.length - 1].scheduled - data.appointments.daily[data.appointments.daily.length - 2].scheduled) / data.appointments.daily[data.appointments.daily.length - 2].scheduled * 100).toFixed(1)
    : '0.0';

  const prescriptionChange = data.prescriptions.monthly.length > 1
    ? ((data.prescriptions.monthly[data.prescriptions.monthly.length - 1].count - data.prescriptions.monthly[data.prescriptions.monthly.length - 2].count) / data.prescriptions.monthly[data.prescriptions.monthly.length - 2].count * 100).toFixed(1)
    : '0.0';

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: `${parseFloat(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
      trend: parseFloat(revenueChange) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Patients',
      value: totalPatients.toLocaleString(),
      change: `${parseFloat(patientChange) >= 0 ? '+' : ''}${patientChange}%`,
      trend: parseFloat(patientChange) >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments Today',
      value: totalAppointments.toString(),
      change: appointmentChange,
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Prescriptions',
      value: totalPrescriptions.toString(),
      change: `${parseFloat(prescriptionChange) >= 0 ? '+' : ''}${prescriptionChange}%`,
      trend: parseFloat(prescriptionChange) >= 0 ? 'up' : 'down',
      icon: Pill,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.revenue.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.patients.demographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ age, percent }) => `${age} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.patients.demographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.revenue.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New vs Returning Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.patients.new}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Patients</span>
                    <Badge variant="secondary">+23 this month</Badge>
                  </div>
                  <Progress value={75} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Returning Patients</span>
                    <Badge variant="secondary">+45 this month</Badge>
                  </div>
                  <Progress value={85} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <Badge variant="secondary">4.8/5.0</Badge>
                  </div>
                  <Progress value={96} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.appointments.status}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.appointments.status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.appointments.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scheduled" fill="#8884d8" />
                    <Bar dataKey="completed" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.doctorEfficiency.map((doctor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.doctor}</p>
                          <p className="text-sm text-gray-500">{doctor.patients} patients</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{doctor.rating}/5</span>
                          <div className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full mx-0.5 ${
                                  i < Math.floor(doctor.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.roomUtilization.map((room, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{room.room}</span>
                        <span>{room.utilization}%</span>
                      </div>
                      <Progress value={room.utilization} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
