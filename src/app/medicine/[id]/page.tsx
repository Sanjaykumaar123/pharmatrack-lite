
"use client";

import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types/medicine';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SideEffects from '@/components/SideEffects';
import { Calendar, Factory, Package, Pill, Boxes, Loader2, CheckCircle, Clock, History, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function MedicineDetailPage() {
  const { medicines, isInitialized, fetchMedicines } = useMedicineStore();
  const [medicine, setMedicine] = useState<Medicine | null | undefined>(undefined); // undefined: loading, null: not found
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const router = useRouter();

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!medicine) return;
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!medicine) return;
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 });
    router.push('/cart');
  };
  
  useEffect(() => {
    const findMedicine = () => {
      if (medicines.length > 0) {
        const found = medicines.find((m) => m.id === id);
        setMedicine(found || null); // Set to null if not found
      }
    };

    if (!isInitialized) {
      fetchMedicines();
    } else {
      findMedicine();
    }
  }, [id, isInitialized, fetchMedicines, medicines]);


  if (medicine === undefined || !isInitialized) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Loading Medicine Details from Ledger...</p>
        </div>
    )
  }
  
  if (medicine === null) {
      notFound();
  }

  const isExpired = new Date(medicine.expDate) < new Date();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3">
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5 h-full">
              <CardHeader className="bg-primary/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  <div className="text-2xl font-bold text-primary self-start sm:self-center">
                    ₹{medicine.price.toFixed(2)}
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
                    <p className="font-semibold">{medicine.stock.quantity} units</p>
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
              <CardFooter className="bg-secondary/30 p-6 flex flex-col sm:flex-row gap-4">
                <Button onClick={handleAddToCart} size="lg" variant="outline" className="w-full sm:w-auto">
                    <ShoppingCart className="mr-2 h-5 w-5"/> Add to Cart
                </Button>
                <Button onClick={handleBuyNow} size="lg" className="w-full sm:w-auto">
                    Buy Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {medicine.history && medicine.history.length > 0 && (
          <div className="mt-8">
              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <History className="text-primary" />
                          Transaction History
                      </CardTitle>
                      <CardDescription>
                          A transparent and auditable log of all changes made to this medicine batch.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ul className="space-y-4">
                          {medicine.history.map((entry, index) => (
                              <li key={index} className="flex items-start gap-4">
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <Badge variant={entry.action === "CREATED" ? "default" : "secondary"}>
                                              {entry.action}
                                          </Badge>
                                          <p className="text-sm text-muted-foreground">
                                              {new Date(entry.timestamp).toLocaleString()}
                                          </p>
                                      </div>
                                      <p className="mt-1 font-medium">{entry.changes}</p>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  </CardContent>
              </Card>
          </div>
        )}
        
        <div className="mt-8">
          <SideEffects medicineName={medicine.name} />
        </div>
      </div>
    </div>
  );
}
