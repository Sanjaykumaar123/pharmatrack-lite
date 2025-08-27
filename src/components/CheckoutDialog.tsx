
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useOrderStore } from '@/hooks/useOrderStore';
import { useCartStore } from '@/hooks/useCartStore';
import { useToast } from '@/hooks/use-toast';
import type { CartItem } from '@/types/medicine';
import { useState } from 'react';

const formSchema = z.object({
  shippingAddress: z.string().min(10, 'Please enter a valid address.'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
}

export function CheckoutDialog({ isOpen, onClose, items }: CheckoutDialogProps) {
  const router = useRouter();
  const { addOrder } = useOrderStore();
  const { clearCart } = useCartStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: '',
      mobileNumber: '',
    },
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.05;
  const finalTotal = total + tax;

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(res => setTimeout(res, 500));

    addOrder({
      customerName: 'Guest Customer', // Simulated user
      items: items.map(item => ({ medicineId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
      total: finalTotal,
      status: 'Pending',
      shippingAddress: values.shippingAddress,
      mobileNumber: values.mobileNumber,
    });

    toast({
      title: "Order Placed!",
      description: "Your order has been successfully submitted.",
    });

    // Clear the whole cart if checkout is successful from cart page
    if(router.pathname === '/cart') {
      clearCart();
    }
    
    form.reset();
    onClose();
    setLoading(false);
    router.push('/medicines');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Please provide your shipping details to place the order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Main St, Anytown, USA 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order (₹{finalTotal.toFixed(2)})
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
