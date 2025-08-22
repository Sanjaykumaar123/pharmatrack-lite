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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PackagePlus, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useToast } from '@/hooks/use-toast';
import type { NewMedicine } from '@/types/medicine';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  manufacturer: z.string().min(2, { message: 'Manufacturer must be at least 2 characters.' }),
  batchNo: z.string().min(1, { message: 'Batch number is required.' }),
  mfgDate: z.date({ required_error: 'A manufacturing date is required.' }),
  expDate: z.date({ required_error: 'An expiry date is required.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMedicinePage() {
  const router = useRouter();
  const { addMedicine, loading } = useMedicineStore();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      batchNo: '',
      mfgDate: new Date(),
      expDate: new Date(Date.now() + 31536000000), // +1 year
      quantity: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const newMedicine: NewMedicine = {
        ...values,
        mfgDate: format(values.mfgDate, 'yyyy-MM-dd'),
        expDate: format(values.expDate, 'yyyy-MM-dd'),
    };
    
    const created = await addMedicine(newMedicine);

    if(created) {
      toast({
        title: 'Medicine Added to Ledger',
        description: `${created.name} has been successfully submitted to the ledger.`,
      });
      router.push('/admin/stock');
    } else {
        toast({
            variant: "destructive",
            title: 'Failed to Add Medicine',
            description: `There was an error submitting the medicine to the ledger.`,
        });
    }
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
            <p className="text-muted-foreground">Fill out the form below to register a new medicine on the simulated decentralized ledger.</p>
            </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Details</CardTitle>
          <CardDescription>
            Enter the information for the new medicine batch. This will create a record on the ledger.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="batchNo"
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
                    name="quantity"
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
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="mfgDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Manufacturing Date</FormLabel>
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="expDate"
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                     <PackagePlus className="mr-2 h-5 w-5" />
                  )}
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
