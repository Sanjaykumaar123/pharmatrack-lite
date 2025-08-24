
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import type { Medicine, NewMedicine, UpdateMedicine } from '@/types/medicine';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  manufacturer: z.string().min(2, { message: 'Manufacturer must be at least 2 characters.' }),
  batchNo: z.string().min(1, { message: 'Batch number is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  mfgDate: z.date({ required_error: 'A manufacturing date is required.' }),
  expDate: z.date({ required_error: 'An expiry date is required.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
  supplyChainStatus: z.enum(['At Manufacturer', 'In Transit', 'At Pharmacy']),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

export function AddEditMedicineDialog({ isOpen, onClose, medicine }: AddEditMedicineDialogProps) {
  const { loading, addMedicine, updateMedicine } = useMedicineStore();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (medicine) {
        form.reset({
          name: medicine.name,
          manufacturer: medicine.manufacturer,
          batchNo: medicine.batchNo,
          description: medicine.description,
          mfgDate: parseISO(medicine.mfgDate),
          expDate: parseISO(medicine.expDate),
          quantity: medicine.quantity,
          price: medicine.price,
          supplyChainStatus: medicine.supplyChainStatus,
        });
      } else {
        form.reset({
            name: '',
            manufacturer: '',
            batchNo: '',
            description: '',
            mfgDate: new Date(),
            expDate: new Date(Date.now() + 31536000000), // +1 year
            quantity: 0,
            price: 0,
            supplyChainStatus: 'At Manufacturer'
        });
      }
    }
  }, [medicine, isOpen, form]);

  const onSubmit = async (values: FormValues) => {
    
    if (medicine) {
      // Update existing medicine
      const updatedPayload: UpdateMedicine = {
          ...values,
          mfgDate: format(values.mfgDate, 'yyyy-MM-dd'),
          expDate: format(values.expDate, 'yyyy-MM-dd'),
      };
      const updated = await updateMedicine(medicine.id, updatedPayload);
       if(updated) {
        toast({
          title: 'Medicine Updated',
          description: `${values.name} has been successfully updated.`,
        });
        onClose();
      } else {
          toast({
              variant: "destructive",
              title: 'Failed to Update Medicine',
              description: `There was an error submitting the update.`,
          });
      }
    } else {
      // Add new medicine
      const newPayload: NewMedicine = {
          ...values,
          mfgDate: format(values.mfgDate, 'yyyy-MM-dd'),
          expDate: format(values.expDate, 'yyyy-MM-dd'),
      };
      const created = await addMedicine(newPayload);
      if(created) {
        toast({
          title: 'Medicine Added',
          description: `${created.name} has been successfully added.`,
        });
        onClose();
      } else {
          toast({
              variant: "destructive",
              title: 'Failed to Add Medicine',
              description: `There was an error adding the medicine.`,
          });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
          <DialogDescription>
            {medicine ? 'Update the details for this medicine batch.' : 'Fill out the form to register a new medicine.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Textarea placeholder="A brief description of the medicine and its use case." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g. 45.50" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>

                <div className="grid grid-cols-2 gap-6">
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
                 <FormField
                  control={form.control}
                  name="supplyChainStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Chain Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="At Manufacturer">At Manufacturer</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="At Pharmacy">At Pharmacy</SelectItem>
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {medicine ? 'Save Changes' : 'Add Medicine'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
