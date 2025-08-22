"use client";

import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types/medicine';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SideEffects from '@/components/SideEffects';
import { Calendar, Factory, Package, Pill, Boxes, Loader2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function MedicineDetailPage() {
  const { medicines, isInitialized, loading, fetchMedicines } = useMedicineStore();
  const [medicine, setMedicine] = useState<Medicine | undefined>(undefined);
  const params = useParams();
  const id = params.id as string;
  
  useEffect(() => {
    if (!isInitialized) {
      fetchMedicines();
    }
  }, [isInitialized, fetchMedicines]);

  useEffect(() => {
    if (isInitialized) {
      const foundMedicine = medicines.find((m) => m.id === id);
      setMedicine(foundMedicine);
    }
  }, [id, medicines, isInitialized]);

  if (loading && !isInitialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Loading Medicine Details from Ledger...</p>
        </div>
    )
  }
  
  if (isInitialized && !medicine) {
      notFound();
  }

  if (!medicine) {
     return (
         <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Finding Medicine on Ledger...</p>
        </div>
     )
  }

  const isExpired = new Date(medicine.expDate) < new Date();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <div className="relative w-full aspect-square">
                    <Image
                        src={medicine.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={medicine.name}
                        fill
                        className="object-cover"
                        data-ai-hint={`${medicine.name} product shot`}
                    />
                </div>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5 h-full">
              <CardHeader className="bg-primary/10">
                <div className="flex items-center gap-4">
                  <Pill className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground">
                      {medicine.name}
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {medicine.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <Factory className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-semibold">{medicine.manufacturer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Package className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Batch Number</p>
                    <p className="font-semibold">{medicine.batchNo}</p>
                  </div>
                </div>
                 <div className="flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                    <p className="font-semibold">{new Date(medicine.mfgDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <div className="font-semibold flex items-center gap-2">
                      <span>{new Date(medicine.expDate).toLocaleDateString()}</span>
                      {isExpired && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Boxes className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Quantity</p>
                    <p className="font-semibold">{medicine.quantity} units</p>
                  </div>
                </div>
                <div className={cn("sm:col-span-2 flex items-center gap-4 p-4 rounded-lg", medicine.onChain ? 'bg-green-500/10' : 'bg-yellow-500/10')}>
                  {medicine.onChain ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                   ) : (
                    <Clock className="h-6 w-6 text-yellow-500" />
                   )}
                  <div>
                    <p className="text-sm text-muted-foreground">Ledger Status</p>
                    <p className={cn("font-bold", medicine.onChain ? 'text-green-600' : 'text-yellow-600')}>
                      {medicine.onChain ? 'Confirmed On-Chain' : 'Pending Confirmation'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        <div className="mt-8">
          <SideEffects medicineName={medicine.name} />
        </div>
      </div>
    </div>
  );
}

