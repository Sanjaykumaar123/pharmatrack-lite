
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Medicine } from '@/types/medicine';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  manufacturer: z.string().min(2, { message: 'Manufacturer must be at least 2 characters.' }),
  batchNumber: z.string().min(1, { message: 'Batch number is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  expiryDate: z.date({ required_error: 'An expiry date is required.' }),
  stock: z.object({
    quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
  medicine: Medicine | null;
}

export function AddEditMedicineDialog({ isOpen, onClose, onSave, medicine }: AddEditMedicineDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      batchNumber: '',
      description: '',
      expiryDate: undefined,
      stock: {
        quantity: 0,
      },
    },
  });

  useEffect(() => {
    if (medicine) {
      form.reset({
        name: medicine.name,
        manufacturer: medicine.manufacturer,
        batchNumber: medicine.batchNumber,
        description: medicine.description,
        expiryDate: new Date(medicine.expiryDate),
        stock: {
          quantity: medicine.stock.quantity,
        },
      });
    } else {
      form.reset({
        name: '',
        manufacturer: '',
        batchNumber: '',
        description: '',
        expiryDate: undefined,
        stock: {
          quantity: 0,
        },
      });
    }
  }, [medicine, form, isOpen]);

  const onSubmit = (values: FormValues) => {
    let status: Medicine['stock']['status'] = 'Out of Stock';
    if (values.stock.quantity > 50) {
        status = 'In Stock';
    } else if (values.stock.quantity > 0) {
        status = 'Low Stock';
    }

    const newOrUpdatedMedicine: Medicine = {
      id: medicine?.id || new Date().toISOString(), // Use existing ID or generate a new one
      ...values,
      expiryDate: format(values.expiryDate, 'yyyy-MM-dd'),
      imageUrl: medicine?.imageUrl || 'https://placehold.co/600x400.png',
      stock: {
        quantity: values.stock.quantity,
        status: status,
      },
    };
    onSave(newOrUpdatedMedicine);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
          <DialogDescription>
            {medicine ? 'Update the details of this medicine.' : 'Fill in the form to add a new medicine to the inventory.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pharma Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
               <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. P12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="stock.quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                             <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
