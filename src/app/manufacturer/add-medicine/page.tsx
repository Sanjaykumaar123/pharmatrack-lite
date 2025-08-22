
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PackagePlus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useToast } from '@/hooks/use-toast';
import type { Medicine } from '@/types';

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

export default function AddMedicinePage() {
  const router = useRouter();
  const { addMedicine } = useMedicineStore();
  const { toast } = useToast();

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

  const onSubmit = (values: FormValues) => {
    let status: Medicine['stock']['status'] = 'Out of Stock';
    if (values.stock.quantity > 50) {
      status = 'In Stock';
    } else if (values.stock.quantity > 0) {
      status = 'Low Stock';
    }

    const newMedicine: Medicine = {
      id: new Date().toISOString(), // Generate a unique ID
      ...values,
      expiryDate: format(values.expiryDate, 'yyyy-MM-dd'),
      stock: {
        quantity: values.stock.quantity,
        status: status,
      },
       imageUrl: 'https://placehold.co/600x400.png',
    };

    addMedicine(newMedicine);

    toast({
      title: 'Medicine Added to Ledger',
      description: `${newMedicine.name} has been successfully registered in the inventory.`,
    });

    router.push('/admin/stock');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-8">
            <Link href="/manufacturer/dashboard" passHref>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Register New Medicine Batch
            </h1>
            <p className="text-muted-foreground">Fill out the form below to register a new medicine on the decentralized ledger.</p>
            </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Details</CardTitle>
          <CardDescription>
            Enter the information for the new medicine batch. This will create an immutable record on the ledger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Paracetamol 500mg" {...field} />
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
                      <Textarea
                        placeholder="A brief description of the medicine, its uses, and active ingredients."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Unique batch identifier" {...field} />
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
                      <FormLabel>Initial Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                              date < new Date(new Date().setHours(0, 0, 0, 0))
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
              <div className="flex justify-end gap-4">
                 <Link href="/manufacturer/dashboard" passHref>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                 </Link>
                <Button type="submit">
                  <PackagePlus className="mr-2 h-5 w-5" />
                  Add Medicine to Ledger
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
