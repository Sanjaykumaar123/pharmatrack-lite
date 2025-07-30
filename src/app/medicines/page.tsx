
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ScanLine } from 'lucide-react';
import { MedicineCard } from '@/components/MedicineCard';
import { allMedicines } from '@/lib/data';
import type { Medicine } from '@/types';

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = useMemo(() => {
    if (!searchTerm.trim()) {
      return allMedicines;
    }
    return allMedicines.filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
          Your Medicines
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for medicine"
            />
          </div>
          <Link href="/scanner" passHref>
            <Button size="lg" className="w-full sm:w-auto">
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
          <div className="text-center py-10 px-6 bg-card rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-foreground">No Results Found</h3>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t find any medicine matching your search. Please check the spelling or try a different term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
