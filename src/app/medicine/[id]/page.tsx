import { allMedicines } from '@/lib/data';
import type { Medicine } from '@/types';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SideEffects from '@/components/SideEffects';
import { Calendar, Factory, Package, Pill } from 'lucide-react';

export default function MedicineDetailPage({ params }: { params: { id: string } }) {
  const medicine: Medicine | undefined = allMedicines.find((m) => m.id === params.id);

  if (!medicine) {
    notFound();
  }

  const isExpired = new Date(medicine.expiryDate) < new Date();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
              <Pill className="h-8 w-8" />
              {medicine.name}
            </CardTitle>
            <CardDescription className="text-lg">
              {medicine.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <Factory className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-semibold">{medicine.manufacturer}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Package className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Batch Number</p>
                <p className="font-semibold">{medicine.batchNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-semibold flex items-center gap-2">
                  {new Date(medicine.expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {isExpired && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <SideEffects medicineName={medicine.name} />
        </div>
      </div>
    </div>
  );
}
