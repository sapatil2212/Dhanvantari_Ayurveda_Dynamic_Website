'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  CalendarDays,
  Bell
} from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  message?: string;
  status: string;
  source: string;
  priority: string;
  assignedTo?: string;
  assignedUser?: {
    id: string;
    name: string;
    email: string;
  };
  notes?: string;
  followUpDate?: string;
  convertedToPatient?: string;
  convertedToAppointment?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    medicalRecordNumber: string;
  };
  appointment?: {
    id: string;
    name: string;
    preferredDate: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EnquiryResponse {
  items: Enquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    assignedTo: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  const { toast } = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.source !== 'all' && { source: filters.source }),
        ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/enquiries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch enquiries');
      
      const data: EnquiryResponse = await response.json();
      setEnquiries(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch enquiries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [pagination.page, filters]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      toast({
        title: 'Success',
        description: 'Enquiry status updated successfully'
      });
      
      fetchEnquiries();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update enquiry status',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete enquiry');
      
      toast({
        title: 'Success',
        description: 'Enquiry deleted successfully'
      });
      
      fetchEnquiries();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete enquiry',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { color: 'bg-blue-100 text-blue-800', icon: Bell },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONTACTED: { color: 'bg-purple-100 text-purple-800', icon: Phone },
      CONVERTED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      SPAM: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800' },
      normal: { color: 'bg-blue-100 text-blue-800' },
      high: { color: 'bg-orange-100 text-orange-800' },
      urgent: { color: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge className={config.color}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Enquiries Management</h1>
          <p className="text-sm text-gray-500">Manage and track all incoming enquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            {pagination.total} Total Enquiries
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search enquiries..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
                         <div>
               <label className="text-sm font-medium">Status</label>
               <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                 <SelectTrigger className="mt-1">
                   <SelectValue placeholder="All statuses" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All statuses</SelectItem>
                   <SelectItem value="NEW">New</SelectItem>
                   <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                   <SelectItem value="CONTACTED">Contacted</SelectItem>
                   <SelectItem value="CONVERTED">Converted</SelectItem>
                   <SelectItem value="CLOSED">Closed</SelectItem>
                   <SelectItem value="SPAM">Spam</SelectItem>
                 </SelectContent>
               </Select>
             </div>

                         <div>
               <label className="text-sm font-medium">Source</label>
               <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                 <SelectTrigger className="mt-1">
                   <SelectValue placeholder="All sources" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All sources</SelectItem>
                   <SelectItem value="WEBSITE_CONTACT">Website Contact</SelectItem>
                   <SelectItem value="WEBSITE_APPOINTMENT">Website Appointment</SelectItem>
                   <SelectItem value="PHONE">Phone</SelectItem>
                   <SelectItem value="EMAIL">Email</SelectItem>
                   <SelectItem value="WALK_IN">Walk In</SelectItem>
                   <SelectItem value="REFERRAL">Referral</SelectItem>
                   <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </div>

            <div>
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No enquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{enquiry.name}</h3>
                        {getStatusBadge(enquiry.status)}
                        {getPriorityBadge(enquiry.priority)}
                      </div>
                      
                      <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {enquiry.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {enquiry.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(enquiry.createdAt)}
                        </div>
                        {enquiry.service && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {enquiry.service}
                          </div>
                        )}
                      </div>

                      {enquiry.message && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {enquiry.message}
                        </p>
                      )}

                      {enquiry.assignedUser && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          Assigned to: {enquiry.assignedUser.name}
                        </div>
                      )}

                      {(enquiry.patient || enquiry.appointment) && (
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          {enquiry.patient && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Converted to Patient: {enquiry.patient.firstName} {enquiry.patient.lastName}
                            </div>
                          )}
                          {enquiry.appointment && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <CalendarDays className="h-4 w-4" />
                              Converted to Appointment: {formatDate(enquiry.appointment.preferredDate)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Enquiry Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <p className="text-sm text-gray-600">{enquiry.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-gray-600">{enquiry.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <p className="text-sm text-gray-600">{enquiry.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Service</label>
                                <p className="text-sm text-gray-600">{enquiry.service || 'Not specified'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="mt-1">{getStatusBadge(enquiry.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Priority</label>
                                <div className="mt-1">{getPriorityBadge(enquiry.priority)}</div>
                              </div>
                            </div>
                            
                            {enquiry.message && (
                              <div>
                                <label className="text-sm font-medium">Message</label>
                                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{enquiry.message}</p>
                              </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium">Created</label>
                                <p className="text-sm text-gray-600">{formatDate(enquiry.createdAt)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Last Updated</label>
                                <p className="text-sm text-gray-600">{formatDate(enquiry.updatedAt)}</p>
                              </div>
                            </div>

                            {enquiry.assignedUser && (
                              <div>
                                <label className="text-sm font-medium">Assigned To</label>
                                <p className="text-sm text-gray-600">{enquiry.assignedUser.name} ({enquiry.assignedUser.email})</p>
                              </div>
                            )}

                            {enquiry.notes && (
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{enquiry.notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Select
                        value={enquiry.status}
                        onValueChange={(value) => handleStatusChange(enquiry.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="CONVERTED">Converted</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                          <SelectItem value="SPAM">Spam</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(enquiry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} enquiries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
