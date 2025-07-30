import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, PackageCheck, PackageX, AlertTriangle } from 'lucide-react';
import type { Medicine } from '@/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  medicine: Medicine;
}

const stockStatusMap = {
  'In Stock': {
    icon: <PackageCheck className="h-5 w-5 text-green-500" />,
    badge: <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>,
    textColor: 'text-green-500',
  },
  'Low Stock': {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    badge: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>,
    textColor: 'text-yellow-500',
  },
  'Out of Stock': {
    icon: <PackageX className="h-5 w-5 text-red-500" />,
    badge: <Badge variant="destructive">Out of Stock</Badge>,
    textColor: 'text-red-500',
  },
};

export function MedicineCard({ medicine }: MedicineCardProps) {
  const stockInfo = stockStatusMap[medicine.stock.status];
  const isOutOfStock = medicine.stock.status === 'Out of Stock';

  return (
    <Link href={`/medicine/${medicine.id}`} className="group">
      <Card className={cn("h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary", isOutOfStock && "bg-muted/50")}>
        <CardHeader>
          <CardTitle className="text-primary group-hover:text-primary-dark transition-colors">
            {medicine.name}
          </CardTitle>
          <CardDescription>Batch: {medicine.batchNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            {stockInfo.badge}
          </div>
        </CardContent>
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
