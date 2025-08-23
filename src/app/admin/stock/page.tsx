
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  PackageCheck,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import type { Medicine } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { AddEditMedicineDialog } from '@/components/AddEditMedicineDialog';

type StockStatus = Medicine['stock']['status'];
type SortKey = keyof Pick<Medicine, 'name' | 'manufacturer' | 'expDate' > | 'quantity';

const chartConfig = {
  quantity: {
    label: 'Quantity',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


const statusConfig: Record<
  StockStatus,
  { icon: React.ElementType; color: string; badge: 'default' | 'secondary' | 'destructive' }
> = {
  'In Stock': { icon: PackageCheck, color: 'text-green-500', badge: 'secondary' },
  'Low Stock': { icon: AlertTriangle, color: 'text-yellow-500', badge: 'secondary' },
  'Out of Stock': { icon: PackageX, color: 'text-red-500', badge: 'destructive' },
};

export default function StockManagementPage() {
  const { medicines, loading, isInitialized, fetchMedicines, deleteMedicine } = useMedicineStore();
  
  useEffect(() => {
    if (!isInitialized) {
      fetchMedicines();
    }
  }, [isInitialized, fetchMedicines]);

  const [filter, setFilter] = useState<StockStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  
  const { toast } = useToast();

   const summary = useMemo(() => {
    return medicines.reduce(
      (acc, med) => {
        acc[med.stock.status]++;
        acc.Total++;
        return acc;
      },
      { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0, Total: 0 }
    );
  }, [medicines]);

  const sortedAndFilteredMedicines = useMemo(() => {
    let filtered =
      filter === 'All' ? medicines : medicines.filter((med) => med.stock.status === filter);

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === 'quantity') {
          aValue = a.stock.quantity;
          bValue = b.stock.quantity;
        } else if (sortConfig.key === 'expDate') {
          aValue = new Date(a.expDate).getTime();
          bValue = new Date(b.expDate).getTime();
        } else {
            aValue = a[sortConfig.key as 'name' | 'manufacturer'].toLowerCase();
            bValue = b[sortConfig.key as 'name' | 'manufacturer'].toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [medicines, filter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const chartData = useMemo(() => {
    return medicines
      .filter((med) => med.stock.quantity > 0)
      .sort((a, b) => b.stock.quantity - a.stock.quantity)
      .slice(0, 10) // Top 10 most stocked items
      .map((med) => ({
        name: med.name,
        quantity: med.stock.quantity,
      }));
  }, [medicines]);

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (medicineId: string) => {
    deleteMedicine(medicineId);
    toast({
        title: "Medicine Removed",
        description: "The medicine has been removed from the local view.",
    });
  };

  if (loading && !isInitialized) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Loading Inventory from Ledger...</p>
          </div>
      )
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
              Stock Management
            </h1>
            <p className="text-muted-foreground mt-1">Oversee the entire inventory from the simulated decentralized ledger.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/manufacturer/add-medicine">
                <Button>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Medicine
                </Button>
            </Link>
            <Link href="/admin/dashboard" passHref>
              <Button variant="outline">
                <Home className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card onClick={() => setFilter('All')} className={cn("cursor-pointer transition-all", filter === 'All' && "ring-2 ring-primary")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Total}</div>
            </CardContent>
          </Card>
          {Object.entries(summary).map(([status, count]) => {
            if (status === 'Total') return null;
            const config = statusConfig[status as StockStatus];
            const Icon = config.icon;
            return (
              <Card key={status} onClick={() => setFilter(status as StockStatus)} className={cn("cursor-pointer transition-all", filter === status && "ring-2 ring-primary")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{status}</CardTitle>
                  <Icon className={cn('h-4 w-4 text-muted-foreground', config.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
           <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>
                A detailed list of all medicines recorded on the ledger.
                {filter !== 'All' && ` (Filtering by: ${filter})`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                          <Button variant="ghost" onClick={() => requestSort('name')}>Name {getSortIcon('name')}</Button>
                      </TableHead>
                      <TableHead>
                          <Button variant="ghost" onClick={() => requestSort('manufacturer')}>Manufacturer {getSortIcon('manufacturer')}</Button>
                      </TableHead>
                      <TableHead className="text-right">
                          <Button variant="ghost" onClick={() => requestSort('quantity')}>Quantity {getSortIcon('quantity')}</Button>
                      </TableHead>
                      <TableHead>
                          <Button variant="ghost" onClick={() => requestSort('expDate')}>Expiry Date {getSortIcon('expDate')}</Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredMedicines.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.manufacturer}</TableCell>
                        <TableCell className="text-right">{med.stock.quantity}</TableCell>
                        <TableCell>{new Date(med.expDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                           <Badge variant={med.onChain ? "secondary" : "destructive"} className={cn(med.onChain ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200')}>
                            {med.onChain ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {med.onChain ? 'On-Chain' : 'Pending'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClick(med)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(med.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete (Local)</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* Stock Analytics Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Stock Analytics</CardTitle>
              <CardDescription>Top 10 most stocked medicines.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100} className="text-xs truncate" interval={0}/>
                  <XAxis dataKey="quantity" type="number" hide />
                  <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" layout="vertical" radius={5} fill="hsl(var(--primary))">
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
       <AddEditMedicineDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        medicine={selectedMedicine}
      />
    </>
  );
}

