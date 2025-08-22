"use client";

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ScanLine, X, Loader2 } from 'lucide-react';
import { MedicineCard } from '@/components/MedicineCard';
import type { Medicine } from '@/types';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import Link from 'next/link';

function MedicinesPageContent() {
  const { medicines, isInitialized } = useMedicineStore();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(initialStatus);
  
  useEffect(() => {
    setSelectedStatus(searchParams.get('status'));
  }, [searchParams]);


  const filteredMedicines = useMemo(() => {
    if (!isInitialized) return [];
    return medicines.filter((med) => {
      const searchMatch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = selectedStatus ? med.stock.status === selectedStatus : true;

      return searchMatch && statusMatch;
    });
  }, [searchTerm, selectedStatus, medicines, isInitialized]);

  const handleClearFilter = () => {
    setSelectedStatus(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('status');
    window.history.pushState({}, '', newUrl);
  }

  if (!isInitialized) {
      return (
          <div className="flex h-full flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">Loading Inventory from the Ledger...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Digital Pharmacy
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or batch..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for medicine"
            />
          </div>
          <Link href="/scanner" passHref>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <ScanLine className="mr-2 h-5 w-5" />
              Scan QR Code
            </Button>
          </Link>
        </div>
      </div>
       {selectedStatus && (
        <div className="mb-6 flex items-center gap-4 bg-primary/10 p-4 rounded-lg">
          <p className="font-semibold text-foreground">
            Filtering by status: <span className="text-primary">{selectedStatus}</span>
          </p>
          <Button variant="ghost" size="icon" onClick={handleClearFilter} className="h-8 w-8">
            <X className="h-5 w-5" />
            <span className="sr-only">Clear filter</span>
          </Button>
        </div>
      )}


      <div>
        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((med: Medicine) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold text-foreground">No Results Found</h3>
            <p className="text-muted-foreground mt-2">
              We couldn't find any medicine matching your search or filter criteria. Please check the spelling or try a different term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="flex h-full flex-col items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-4 text-lg text-muted-foreground">Loading...</p></div>}>
      <MedicinesPageContent />
    </Suspense>
  )
}
