import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, Clock } from 'lucide-react';
import type { Medicine } from '@/types/medicine';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const isOutOfStock = medicine.stock.status === 'Out of Stock';

  return (
    <Link href={`/medicine/${medicine.id}`} className="group">
      <Card className={cn("h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:border-primary/50 group-hover:shadow-primary/10", isOutOfStock && "bg-muted/50 opacity-70 hover:opacity-100")}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                {medicine.name}
              </CardTitle>
              <CardDescription>Batch: {medicine.batchNo}</CardDescription>
            </div>
             <Badge className={cn("shrink-0", medicine.onChain ? "bg-green-500/80" : "bg-yellow-500/80")}>
                {medicine.onChain ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                {medicine.onChain ? 'On-Chain' : 'Pending'}
              </Badge>
          </div>
        </CardHeader>
        <CardFooter className="mt-auto pt-4 flex justify-end">
          <Button variant="outline" size="sm" className="text-muted-foreground group-hover:text-primary group-hover:border-primary/50 group-hover:bg-primary/5">
            View Details
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
