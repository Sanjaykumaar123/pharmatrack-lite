
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import type { Medicine } from '@/types/medicine';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { CheckoutDialog } from './CheckoutDialog';


interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const isOutOfStock = medicine.stockStatus === 'Out of Stock';
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCheckoutOpen(true);
  };

  return (
    <>
    <Card className={cn("h-full flex flex-col transition-all duration-300 ease-in-out group hover:shadow-xl hover:border-primary/50 hover:shadow-primary/10", isOutOfStock && "bg-muted/50 opacity-70")}>
      <CardHeader>
        <Link href={`/medicine/${medicine.id}`} className="group/link">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-foreground group-hover/link:text-primary transition-colors">
                  {medicine.name}
                </CardTitle>
                <CardDescription>Batch: {medicine.batchNo}</CardDescription>
              </div>
              <Badge className={cn("shrink-0", "bg-green-100 text-green-800")}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  On-Chain
              </Badge>
            </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
          <Link href={`/medicine/${medicine.id}`} className="block">
              <p className="text-2xl font-bold text-primary mb-2">₹{medicine.price.toFixed(2)}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                  <p>Qty: {medicine.quantity} &bull; Status: <span className={cn(
                      medicine.stockStatus === 'In Stock' && 'text-green-600',
                      medicine.stockStatus === 'Low Stock' && 'text-yellow-600',
                      medicine.stockStatus === 'Out of Stock' && 'text-red-600'
                  )}>{medicine.stockStatus}</span></p>
              </div>
          </Link>
      </CardContent>
      <CardFooter className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={handleAddToCart} size="sm" variant="outline" className="w-full" disabled={isOutOfStock}>
              <ShoppingCart className="mr-2 h-4 w-4"/> Add to Cart
          </Button>
          <Button onClick={handleBuyNow} size="sm" className="w-full" disabled={isOutOfStock}>
              Buy Now
          </Button>
      </CardFooter>
    </Card>
    <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[{ ...medicine, quantity: 1 }]}
      />
    </>
  );
}
