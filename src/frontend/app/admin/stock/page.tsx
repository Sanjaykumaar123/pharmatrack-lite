
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/frontend/components/ui/table';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';
import {
  Home,
  PackageCheck,
  AlertTriangle,
  PackageX,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/frontend/components/ui/dropdown-menu';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/frontend/components/ui/chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { Medicine } from '@/frontend/types';
import { cn } from '@/frontend/lib/utils';
import { useToast } from '@/frontend/hooks/use-toast';
import { AddEditMedicineDialog } from '@/frontend/components/AddEditMedicineDialog';
import { useMedicineStore } from '@/frontend/hooks/useMedicineStore';

type StockStatus = Medicine['stock']['status'];
type SortKey = keyof Pick<Medicine, 'name' | 'manufacturer'> | 'quantity' | 'expiryDate';

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
  const { medicines, addMedicine, updateMedicine, deleteMedicine, isInitialized } = useMedicineStore();
  const [filter, setFilter] = useState<StockStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        } else if (sortConfig.key === 'expiryDate') {
          aValue = new Date(a.expiryDate).getTime();
          bValue = new Date(b.expiryDate).getTime();
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

  const handleAddClick = () => {
    setSelectedMedicine(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (medicineId: string) => {
    deleteMedicine(medicineId);
    toast({
        title: "Medicine Deleted",
        description: "The medicine has been removed from the inventory.",
    });
  };

  const handleDialogSave = (medicine: Medicine) => {
    if (selectedMedicine) {
      updateMedicine(medicine.id, medicine);
      toast({
        title: "Medicine Updated",
        description: `${medicine.name} has been successfully updated.`,
      });
    } else {
      addMedicine(medicine);
      toast({
        title: "Medicine Added",
        description: `${medicine.name} has been successfully added to the inventory.`,
      });
    }
  };

  if (!isInitialized) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Loading Inventory...</p>
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
            <p className="text-muted-foreground mt-1">Add, edit, and manage your pharmacy inventory.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddClick}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Medicine
            </Button>
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

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Inventory Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>
                A detailed list of all medicines in the inventory.
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
                      <TableHead>Status</TableHead>
                      <TableHead>
                          <Button variant="ghost" onClick={() => requestSort('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredMedicines.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.manufacturer}</TableCell>
                        <TableCell className="text-right">{med.stock.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[med.stock.status].badge} className={cn(
                              statusConfig[med.stock.status].badge === 'secondary' && statusConfig[med.stock.status].color === 'text-green-500' && 'bg-green-100 text-green-800 border-green-200',
                              statusConfig[med.stock.status].badge === 'secondary' && statusConfig[med.stock.status].color === 'text-yellow-500' && 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}>
                              {med.stock.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(med.expiryDate).toLocaleDateString()}</TableCell>
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
                                <span>Delete</span>
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
          <Card>
            <CardHeader>
              <CardTitle>Stock Analytics</CardTitle>
              <CardDescription>Top 10 most stocked medicines.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} className="text-xs" />
                  <XAxis dataKey="quantity" type="number" hide />
                  <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" layout="vertical" radius={5}>
                      {chartData.map((entry, index) => (
                          <Rectangle key={`cell-${index}`} fill="hsl(var(--primary))" />
                      ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddEditMedicineDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        medicine={selectedMedicine}
      />
    </>
  );
}
