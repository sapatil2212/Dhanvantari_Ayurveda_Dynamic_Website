'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Pill, 
  Check, 
  ChevronsUpDown,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  isPrescription: boolean;
  isControlled: boolean;
};

interface MedicineSearchProps {
  value?: string;
  onSelect: (medicine: Medicine | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  category?: string;
  type?: string;
}

export default function MedicineSearch({
  value,
  onSelect,
  placeholder = "Search medicines...",
  className,
  disabled = false,
  category,
  type
}: MedicineSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setLoading(true);
      
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce search
      timeoutRef.current = setTimeout(() => {
        searchMedicines();
      }, 300);
    } else {
      setMedicines([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, category, type]);

  const searchMedicines = async () => {
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '10',
      });

      if (category) {
        params.append('category', category);
      }

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`/api/medicines/search?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      } else {
        console.error('Failed to search medicines');
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error searching medicines:', error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setSearchQuery(medicine.name);
    setOpen(false);
    onSelect(medicine);
  };

  const handleClear = () => {
    setSelectedMedicine(null);
    setSearchQuery('');
    setMedicines([]);
    onSelect(null);
  };

  const getMedicineDisplayName = (medicine: Medicine) => {
    let displayName = medicine.name;
    
    if (medicine.strength) {
      displayName += ` (${medicine.strength})`;
    }
    
    if (medicine.genericName && medicine.genericName !== medicine.name) {
      displayName += ` - ${medicine.genericName}`;
    }
    
    return displayName;
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedMedicine ? (
                <>
                  <Pill className="h-4 w-4 text-primary" />
                  <span className="truncate">
                    {getMedicineDisplayName(selectedMedicine)}
                  </span>
                  {selectedMedicine.isPrescription && (
                    <Badge variant="outline" className="text-xs">Rx</Badge>
                  )}
                  {selectedMedicine.isControlled && (
                    <Badge variant="destructive" className="text-xs">Controlled</Badge>
                  )}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search medicines..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0"
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : searchQuery.length < 2 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Type at least 2 characters to search
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No medicines found
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {medicines.map((medicine) => (
                  <CommandItem
                    key={medicine.id}
                    value={medicine.name}
                    onSelect={() => handleSelect(medicine)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Pill className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getMedicineDisplayName(medicine)}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {medicine.category} • {medicine.type}
                          {medicine.manufacturer && ` • ${medicine.manufacturer}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {medicine.isPrescription && (
                          <Badge variant="outline" className="text-xs">Rx</Badge>
                        )}
                        {medicine.isControlled && (
                          <Badge variant="destructive" className="text-xs">Controlled</Badge>
                        )}
                      </div>
                    </div>
                    {selectedMedicine?.id === medicine.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedMedicine && (
        <div className="mt-2">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{selectedMedicine.name}</h4>
                    {selectedMedicine.isPrescription && (
                      <Badge variant="outline" className="text-xs">Prescription Required</Badge>
                    )}
                    {selectedMedicine.isControlled && (
                      <Badge variant="destructive" className="text-xs">Controlled Substance</Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    {selectedMedicine.genericName && (
                      <div><strong>Generic:</strong> {selectedMedicine.genericName}</div>
                    )}
                    {selectedMedicine.category && (
                      <div><strong>Category:</strong> {selectedMedicine.category}</div>
                    )}
                    {selectedMedicine.type && (
                      <div><strong>Type:</strong> {selectedMedicine.type}</div>
                    )}
                    {selectedMedicine.route && (
                      <div><strong>Route:</strong> {selectedMedicine.route}</div>
                    )}
                    {selectedMedicine.manufacturer && (
                      <div><strong>Manufacturer:</strong> {selectedMedicine.manufacturer}</div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
