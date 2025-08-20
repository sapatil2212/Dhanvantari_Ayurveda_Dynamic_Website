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
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Share2, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy,
  Globe,
  Lock,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate, getTimeAgo } from '@/lib/utils';

type SharedPrescription = {
  id: string;
  shareCode: string;
  accessCode?: string;
  expiresAt?: string;
  maxViews?: number;
  currentViews: number;
  isActive: boolean;
  allowDownload: boolean;
  allowPrint: boolean;
  shareType: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  createdAt: string;
  prescription: {
    id: string;
    number: string;
    date: string;
    patient: {
      firstName: string;
      lastName: string;
      medicalRecordNumber: string;
    };
  };
};

export default function SharedPrescriptionsPage() {
  const [sharedPrescriptions, setSharedPrescriptions] = useState<SharedPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchSharedPrescriptions();
  }, []);

  const fetchSharedPrescriptions = async () => {
    try {
      const response = await fetch('/api/shared-prescriptions');
      if (response.ok) {
        const data = await response.json();
        setSharedPrescriptions(data);
      } else {
        toast.error('Failed to fetch shared prescriptions');
      }
    } catch (error) {
      toast.error('Error fetching shared prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (shareCode: string, accessCode?: string) => {
    const baseUrl = window.location.origin;
    const shareUrl = accessCode 
      ? `${baseUrl}/shared-prescription/${shareCode}?accessCode=${accessCode}`
      : `${baseUrl}/shared-prescription/${shareCode}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };

  const filteredSharedPrescriptions = sharedPrescriptions.filter(shared => {
    const matchesSearch = 
      shared.prescription.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shared.prescription.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shared.prescription.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shared.shareCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || 
      (statusFilter === 'active' && shared.isActive) ||
      (statusFilter === 'inactive' && !shared.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (shared: SharedPrescription) => {
    if (!shared.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (shared.expiresAt && new Date() > new Date(shared.expiresAt)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getShareTypeIcon = (shareType: string) => {
    switch (shareType) {
      case 'PUBLIC':
        return <Globe className="h-4 w-4" />;
      case 'PRIVATE':
        return <Lock className="h-4 w-4" />;
      case 'RESTRICTED':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading shared prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Prescriptions</h1>
          <p className="text-muted-foreground">
            Manage and track shared prescription links
          </p>
        </div>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Share Prescription
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, prescription, or share code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="text-sm text-muted-foreground">
                {filteredSharedPrescriptions.length} of {sharedPrescriptions.length} shared prescriptions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shared Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Shared Prescriptions ({filteredSharedPrescriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Prescription</TableHead>
                <TableHead>Share Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSharedPrescriptions.map((shared) => (
                <TableRow key={shared.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {shared.prescription.patient.firstName} {shared.prescription.patient.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        MR# {shared.prescription.patient.medicalRecordNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{shared.prescription.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(shared.prescription.date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {shared.shareCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShareLink(shared.shareCode, shared.accessCode)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getShareTypeIcon(shared.shareType)}
                      <span className="text-sm capitalize">{shared.shareType.toLowerCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {shared.currentViews}
                        {shared.maxViews && ` / ${shared.maxViews}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(shared)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(shared.createdAt)}</div>
                      <div className="text-muted-foreground">
                        {getTimeAgo(shared.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/shared-prescription/${shared.shareCode}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSharedPrescriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No shared prescriptions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
