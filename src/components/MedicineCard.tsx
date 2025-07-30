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
import { ChevronRight, PackageCheck, AlertTriangle, PackageX } from 'lucide-react';
import type { Medicine } from '@/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  medicine: Medicine;
}

const stockStatusMap = {
  'In Stock': {
    icon: <PackageCheck className="h-5 w-5 text-green-400" />,
    badge: <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">In Stock</Badge>,
    textColor: 'text-green-400',
  },
  'Low Stock': {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    badge: <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Low Stock</Badge>,
    textColor: 'text-yellow-400',
  },
  'Out of Stock': {
    icon: <PackageX className="h-5 w-5 text-red-400" />,
    badge: <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">Out of Stock</Badge>,
    textColor: 'text-red-400',
  },
};

export function MedicineCard({ medicine }: MedicineCardProps) {
  const stockInfo = stockStatusMap[medicine.stock.status];
  const isOutOfStock = medicine.stock.status === 'Out of Stock';

  return (
    <Link href={`/medicine/${medicine.id}`} className="group">
      <Card className={cn("h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary/50 group-hover:shadow-primary/10", isOutOfStock && "bg-secondary/50 opacity-60 hover:opacity-100")}>
        <CardHeader>
          <CardTitle className="text-foreground group-hover:text-primary transition-colors">
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
