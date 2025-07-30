import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Link href={`/medicine/${medicine.id}`} className="group">
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary">
        <CardHeader>
          <CardTitle className="text-primary group-hover:text-primary-dark transition-colors">
            {medicine.name}
          </CardTitle>
          <CardDescription>Batch: {medicine.batchNumber}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto pt-0 flex justify-end">
          <Button variant="ghost" size="sm" className="text-muted-foreground group-hover:text-primary">
            View Details
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
