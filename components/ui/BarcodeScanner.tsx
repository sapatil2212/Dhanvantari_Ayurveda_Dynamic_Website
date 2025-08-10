'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Camera, X, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onItemFound: (item: any) => void;
  onScanError?: (error: string) => void;
  placeholder?: string;
  className?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  status: string;
  location?: string;
  expiryDate?: string;
}

export default function BarcodeScanner({ 
  onItemFound, 
  onScanError, 
  placeholder = "Scan barcode or enter SKU...",
  className 
}: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock barcode data for demonstration
  const mockBarcodeData: { [key: string]: InventoryItem } = {
    '123456789': {
      id: '1',
      name: 'Ashwagandha Powder',
      sku: 'ASH-001',
      category: 'Herbs',
      currentStock: 50,
      minStock: 10,
      unit: 'kg',
      costPrice: 500,
      sellingPrice: 800,
      status: 'active',
      location: 'Shelf A1'
    },
    '987654321': {
      id: '2',
      name: 'Turmeric Capsules',
      sku: 'TUR-002',
      category: 'Supplements',
      currentStock: 5,
      minStock: 20,
      unit: 'bottles',
      costPrice: 200,
      sellingPrice: 350,
      status: 'low_stock',
      location: 'Shelf B2'
    },
    '456789123': {
      id: '3',
      name: 'Sesame Oil',
      sku: 'OIL-003',
      category: 'Oils',
      currentStock: 0,
      minStock: 5,
      unit: 'liters',
      costPrice: 300,
      sellingPrice: 500,
      status: 'out_of_stock',
      location: 'Shelf C3'
    }
  };

  // Handle manual barcode input
  const handleBarcodeInput = async (value: string) => {
    setBarcode(value);
    
    if (value.length >= 3) {
      await searchByBarcode(value);
    } else {
      setSearchResults([]);
    }
  };

  // Search by barcode/SKU
  const searchByBarcode = async (code: string) => {
    setIsSearching(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      const results = Object.values(mockBarcodeData).filter(item =>
        item.sku.toLowerCase().includes(code.toLowerCase()) ||
        item.name.toLowerCase().includes(code.toLowerCase())
      );
      
      setSearchResults(results);
      
      // If exact match found, auto-select
      const exactMatch = results.find(item => item.sku === code);
      if (exactMatch) {
        handleItemSelect(exactMatch);
      }
    } catch (error) {
      console.error('Error searching barcode:', error);
      toast.error('Error searching for item');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle item selection
  const handleItemSelect = (item: InventoryItem) => {
    onItemFound(item);
    setBarcode('');
    setSearchResults([]);
    setIsDialogOpen(false);
    toast.success(`Found: ${item.name}`);
  };

  // Start camera for barcode scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera');
      onScanError?.('Camera access denied');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle dialog close
  const handleDialogClose = () => {
    stopCamera();
    setIsDialogOpen(false);
    setBarcode('');
    setSearchResults([]);
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

  return (
    <div className={className}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            {placeholder}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Barcode or Search Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Manual Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter SKU or Item Name</label>
              <div className="flex gap-2">
                <Input
                  value={barcode}
                  onChange={(e) => handleBarcodeInput(e.target.value)}
                  placeholder="Enter barcode, SKU, or item name..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => searchByBarcode(barcode)}
                  disabled={!barcode.trim() || isSearching}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Camera Scanner */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Scan Barcode</label>
              <div className="relative">
                {!isScanning ? (
                  <Button
                    variant="outline"
                    onClick={startCamera}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera Scanner
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 bg-gray-100 rounded-md"
                    />
                    <Button
                      variant="outline"
                      onClick={stopCamera}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Stop Camera
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Results</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleItemSelect(item)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>SKU: {item.sku}</div>
                              <div>Stock: {item.currentStock} {item.unit}</div>
                              <div>Location: {item.location || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(item.status)}
                            {item.currentStock <= item.minStock && (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {barcode && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-4 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No items found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}

            {/* Loading */}
            {isSearching && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
