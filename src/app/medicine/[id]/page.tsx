
"use client";

import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SideEffects from '@/components/SideEffects';
import { Calendar, Factory, Package, Pill, PackageCheck, AlertTriangle, PackageX, Boxes, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const stockStatusMap = {
  'In Stock': {
    icon: PackageCheck,
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  'Low Stock': {
    icon: AlertTriangle,
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  'Out of Stock': {
    icon: PackageX,
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
};

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const { medicines, isInitialized } = useMedicineStore();
  const [medicine, setMedicine] = useState<Medicine | undefined>(undefined);
  const { id } = params;

  useEffect(() => {
    if (isInitialized) {
      const foundMedicine = medicines.find((m) => m.id === id);
      setMedicine(foundMedicine);
    }
  }, [id, medicines, isInitialized]);

  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Loading Medicine Details...</p>
        </div>
    )
  }
  
  if (!medicine) {
    // This can happen briefly while the useEffect runs
    // Or if the medicine is not found
    // To avoid flashing notFound(), we can show a loader
    // If it's still not found after initialization, we could redirect
    // For now, if we're initialized and there's no medicine, it's a 404.
     if (isInitialized) {
        notFound();
     }
     return (
         <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Finding Medicine...</p>
        </div>
     )
  }

  const isExpired = new Date(medicine.expiryDate) < new Date();
  const stockInfo = stockStatusMap[medicine.stock.status];
  const StockIcon = stockInfo.icon;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <div className="relative w-full aspect-square">
                    <Image
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        fill
                        className="object-cover"
                        data-ai-hint="medicine product shot"
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
                    <p className="font-semibold">{medicine.batchNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <div className="font-semibold flex items-center gap-2">
                      <span>
                        {new Date(medicine.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
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
                    <p className="font-semibold">{medicine.stock.quantity} units</p>
                  </div>
                </div>
                <div className="sm:col-span-2 flex items-center gap-4 p-4 rounded-lg bg-secondary">
                  <div className={cn("p-2 rounded-full", stockInfo.bgColor)}>
                    <StockIcon className={cn("h-6 w-6", stockInfo.textColor)} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Status</p>
                    <p className={cn("font-bold", stockInfo.textColor)}>{medicine.stock.status}</p>
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
