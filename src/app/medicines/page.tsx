"use client";

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ScanLine, X, Loader2 } from 'lucide-react';
import { MedicineCard } from '@/components/MedicineCard';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types/medicine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function MedicinesPageContent() {
  const { medicines, loading, error, isInitialized, fetchMedicines } = useMedicineStore();
  
  useEffect(() => {
    if (!isInitialized) {
      fetchMedicines();
    }
  }, [isInitialized, fetchMedicines]);

  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      return med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             med.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, medicines]);

  if (loading && !isInitialized) {
      return (
          <div className="flex h-full flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">Connecting to the Ledger...</p>
          </div>
      )
  }

  if (error) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                    Could not connect to the Solana devnet. Please check your connection and try again.
                </AlertDescription>
            </Alert>
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
              We couldn't find any medicine matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MedicinesPageContent />
    </Suspense>
  )
}
