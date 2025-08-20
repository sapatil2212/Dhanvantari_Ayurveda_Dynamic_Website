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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

type Medicine = {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  category: string;
  type: string;
  strength?: string;
  dosageForm?: string;
  route?: string;
  manufacturer?: string;
  description?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  interactions?: string;
  dosage?: string;
  storage?: string;
  isActive: boolean;
  isPrescription: boolean;
  isControlled: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: 'Other',
    type: 'Other',
    strength: '',
    dosageForm: '',
    route: '',
    manufacturer: '',
    description: '',
    indications: '',
    contraindications: '',
    sideEffects: '',
    interactions: '',
    dosage: '',
    storage: '',
    isPrescription: true,
    isControlled: false,
  });

  const categories = [
    'Antibiotic',
    'Analgesic',
    'Antihypertensive',
    'Antidiabetic',
    'Antidepressant',
    'Ayurvedic',
    'Homeopathic',
    'Vitamin',
    'Mineral',
    'Other'
  ];

  const types = [
    'Tablet',
    'Capsule',
    'Syrup',
    'Injection',
    'Ointment',
    'Cream',
    'Gel',
    'Drops',
    'Inhaler',
    'Powder',
    'Other'
  ];

  const routes = [
    'Oral',
    'Topical',
    'Intravenous',
    'Intramuscular',
    'Subcutaneous',
    'Inhalation',
    'Nasal',
    'Ophthalmic',
    'Otic',
    'Rectal',
    'Vaginal'
  ];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch('/api/medicines');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      } else {
        toast.error('Failed to fetch medicines');
      }
    } catch (error) {
      toast.error('Error fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingMedicine 
        ? `/api/medicines/${editingMedicine.id}`
        : '/api/medicines';
      
      const method = editingMedicine ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          editingMedicine 
            ? 'Medicine updated successfully' 
            : 'Medicine added successfully'
        );
        setIsDialogOpen(false);
        resetForm();
        fetchMedicines();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save medicine');
      }
    } catch (error) {
      toast.error('Error saving medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    
    setDeletingId(id);
    
    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } else {
        toast.error('Failed to delete medicine');
      }
    } catch (error) {
      toast.error('Error deleting medicine');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName || '',
      brandName: medicine.brandName || '',
      category: medicine.category,
      type: medicine.type,
      strength: medicine.strength || '',
      dosageForm: medicine.dosageForm || '',
      route: medicine.route || '',
      manufacturer: medicine.manufacturer || '',
      description: medicine.description || '',
      indications: medicine.indications || '',
      contraindications: medicine.contraindications || '',
      sideEffects: medicine.sideEffects || '',
      interactions: medicine.interactions || '',
      dosage: medicine.dosage || '',
      storage: medicine.storage || '',
      isPrescription: medicine.isPrescription,
      isControlled: medicine.isControlled,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      category: 'Other',
      type: 'Other',
      strength: '',
      dosageForm: '',
      route: '',
      manufacturer: '',
      description: '',
      indications: '',
      contraindications: '',
      sideEffects: '',
      interactions: '',
      dosage: '',
      storage: '',
      isPrescription: true,
      isControlled: false,
    });
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || medicine.category === categoryFilter;
    const matchesType = !typeFilter || typeFilter === 'all' || medicine.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading medicines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medicine Database</h1>
          <p className="text-muted-foreground">
            Manage and search the comprehensive medicine database
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
                     <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
             <DialogHeader className="pb-4">
               <DialogTitle className="text-xl font-semibold">
                 {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
               </DialogTitle>
             </DialogHeader>
             <form onSubmit={handleSubmit} className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="space-y-1.5">
                   <Label htmlFor="name" className="text-sm font-medium">Medicine Name *</Label>
                   <Input
                     id="name"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     required
                     className="h-9 text-sm"
                   />
                 </div>
                 
                 <div className="space-y-1.5">
                   <Label htmlFor="genericName" className="text-sm font-medium">Generic Name</Label>
                   <Input
                     id="genericName"
                     value={formData.genericName}
                     onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                     className="h-9 text-sm"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="brandName" className="text-sm font-medium">Brand Name</Label>
                   <Input
                     id="brandName"
                     value={formData.brandName}
                     onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                     className="h-9 text-sm"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                   <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                     <SelectTrigger className="h-9 text-sm">
                       <SelectValue placeholder="Select category" />
                     </SelectTrigger>
                     <SelectContent>
                       {categories.map(category => (
                         <SelectItem key={category} value={category}>{category}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                   <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                     <SelectTrigger className="h-9 text-sm">
                       <SelectValue placeholder="Select type" />
                     </SelectTrigger>
                     <SelectContent>
                       {types.map(type => (
                         <SelectItem key={type} value={type}>{type}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="strength" className="text-sm font-medium">Strength</Label>
                   <Input
                     id="strength"
                     value={formData.strength}
                     onChange={(e) => setFormData({...formData, strength: e.target.value})}
                     placeholder="e.g., 500mg"
                     className="h-9 text-sm"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="dosageForm" className="text-sm font-medium">Dosage Form</Label>
                   <Input
                     id="dosageForm"
                     value={formData.dosageForm}
                     onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
                     placeholder="e.g., 500mg tablet"
                     className="h-9 text-sm"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="route" className="text-sm font-medium">Route</Label>
                   <Select value={formData.route} onValueChange={(value) => setFormData({...formData, route: value})}>
                     <SelectTrigger className="h-9 text-sm">
                       <SelectValue placeholder="Select route" />
                     </SelectTrigger>
                     <SelectContent>
                       {routes.map(route => (
                         <SelectItem key={route} value={route}>{route}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="manufacturer" className="text-sm font-medium">Manufacturer</Label>
                   <Input
                     id="manufacturer"
                     value={formData.manufacturer}
                     onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                     className="h-9 text-sm"
                   />
                 </div>
               </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                   <Textarea
                     id="description"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="Brief description of the medicine..."
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="indications" className="text-sm font-medium">Indications</Label>
                   <Textarea
                     id="indications"
                     value={formData.indications}
                     onChange={(e) => setFormData({...formData, indications: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="What it's used for..."
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label htmlFor="contraindications" className="text-sm font-medium">Contraindications</Label>
                   <Textarea
                     id="contraindications"
                     value={formData.contraindications}
                     onChange={(e) => setFormData({...formData, contraindications: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="When not to use..."
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="sideEffects" className="text-sm font-medium">Side Effects</Label>
                   <Textarea
                     id="sideEffects"
                     value={formData.sideEffects}
                     onChange={(e) => setFormData({...formData, sideEffects: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="Common side effects..."
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label htmlFor="interactions" className="text-sm font-medium">Drug Interactions</Label>
                   <Textarea
                     id="interactions"
                     value={formData.interactions}
                     onChange={(e) => setFormData({...formData, interactions: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="Known drug interactions..."
                   />
                 </div>

                 <div className="space-y-1.5">
                   <Label htmlFor="dosage" className="text-sm font-medium">Standard Dosage</Label>
                   <Textarea
                     id="dosage"
                     value={formData.dosage}
                     onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                     rows={2}
                     className="text-sm resize-none"
                     placeholder="Standard dosage information..."
                   />
                 </div>
               </div>

               <div className="space-y-1.5">
                 <Label htmlFor="storage" className="text-sm font-medium">Storage Instructions</Label>
                 <Textarea
                   id="storage"
                   value={formData.storage}
                   onChange={(e) => setFormData({...formData, storage: e.target.value})}
                   rows={2}
                   className="text-sm resize-none"
                   placeholder="Storage and handling instructions..."
                 />
               </div>

                             <div className="flex items-center justify-between pt-2 border-t">
                 <div className="flex items-center space-x-6">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="isPrescription"
                       checked={formData.isPrescription}
                       onChange={(e) => setFormData({...formData, isPrescription: e.target.checked})}
                       className="h-4 w-4"
                     />
                     <Label htmlFor="isPrescription" className="text-sm font-medium">Requires Prescription</Label>
                   </div>
                   
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="isControlled"
                       checked={formData.isControlled}
                       onChange={(e) => setFormData({...formData, isControlled: e.target.checked})}
                       className="h-4 w-4"
                     />
                     <Label htmlFor="isControlled" className="text-sm font-medium">Controlled Substance</Label>
                   </div>
                 </div>

                 <div className="flex justify-end space-x-2">
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={() => setIsDialogOpen(false)}
                     disabled={isSubmitting}
                     size="sm"
                   >
                     Cancel
                   </Button>
                   <Button type="submit" disabled={isSubmitting} size="sm">
                     {isSubmitting ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         {editingMedicine ? 'Updating...' : 'Adding...'}
                       </>
                     ) : (
                       editingMedicine ? 'Update Medicine' : 'Add Medicine'
                     )}
                   </Button>
                 </div>
               </div>
            </form>
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                                 <SelectContent>
                   <SelectItem value="all">All categories</SelectItem>
                   {categories.map(category => (
                     <SelectItem key={category} value={category}>{category}</SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                                 <SelectContent>
                   <SelectItem value="all">All types</SelectItem>
                   {types.map(type => (
                     <SelectItem key={type} value={type}>{type}</SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="text-sm text-muted-foreground">
                {filteredMedicines.length} of {medicines.length} medicines
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medicines ({filteredMedicines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{medicine.name}</div>
                      {medicine.genericName && (
                        <div className="text-sm text-muted-foreground">
                          {medicine.genericName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{medicine.category}</Badge>
                  </TableCell>
                  <TableCell>{medicine.type}</TableCell>
                  <TableCell>{medicine.strength || '-'}</TableCell>
                  <TableCell>{medicine.manufacturer || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {medicine.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {medicine.isPrescription && (
                        <Badge variant="outline" className="text-xs">Rx</Badge>
                      )}
                      {medicine.isControlled && (
                        <Badge variant="destructive" className="text-xs">Controlled</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(medicine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                                             <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleDelete(medicine.id)}
                         disabled={deletingId === medicine.id}
                       >
                         {deletingId === medicine.id ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                         ) : (
                           <Trash2 className="h-4 w-4" />
                         )}
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredMedicines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No medicines found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
