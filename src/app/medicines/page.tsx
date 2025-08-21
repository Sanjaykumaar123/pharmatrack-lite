// ===================================================================================
// BACKEND (Server-Side) & FRONTEND (Client-Side)
// ===================================================================================
// This file demonstrates the "use client" directive in Next.js.
// By default, all components in the Next.js App Router are Server Components,
// meaning they run on the server (backend).
// However, because this page requires user interactivity (like typing in a search
// bar and filtering results), we add the "use client" directive at the top.
// This tells Next.js to also run this component's code in the browser (frontend),
// allowing for interactive user experiences.
// ===================================================================================

"use client";

import { useState, useMemo, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ScanLine, X } from 'lucide-react';
import { MedicineCard } from '@/components/MedicineCard';
// BLOCKCHAIN INTEGRATION POINT:
// In a real application, you would remove this import.
import { allMedicines } from '@/lib/data';
import type { Medicine } from '@/types';

function MedicinesPageContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(initialStatus);

  // BLOCKCHAIN INTEGRATION POINT:
  // The 'allMedicines' array would be replaced with state that is loaded from your blockchain API.
  // For example:
  // const [medicines, setMedicines] = useState<Medicine[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  //
  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     setIsLoading(true);
  //     try {
  //       // This is where you would call your blockchain backend API.
  //       const response = await fetch('https://your-blockchain-api.com/medicines');
  //       const data = await response.json();
  //       setMedicines(data);
  //     } catch (error) {
  //       console.error("Failed to fetch medicines from blockchain:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchMedicines();
  // }, []);


  const filteredMedicines = useMemo(() => {
    // This filtering logic would remain the same, but it would operate on the
    // state fetched from the API (e.g., 'medicines') instead of 'allMedicines'.
    return allMedicines.filter((med) => {
      const searchMatch =
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = selectedStatus ? med.stock.status === selectedStatus : true;

      return searchMatch && statusMatch;
    });
  }, [searchTerm, selectedStatus]); // Add 'medicines' to dependency array in a real implementation.

  const handleClearFilter = () => {
    setSelectedStatus(null);
    window.history.pushState({}, '', '/medicines');
  }

  // In a real implementation, you would add a loading state here.
  // if (isLoading) {
  //   return <div>Loading inventory from the ledger...</div>;
  // }

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
    <Suspense fallback={<div>Loading...</div>}>
      <MedicinesPageContent />
    </Suspense>
  )
}
