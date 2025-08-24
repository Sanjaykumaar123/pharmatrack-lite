
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
  MoreHorizontal,
  Loader2,
  CheckCircle,
  Clock,
  PackageCheck,
  AlertTriangle,
  PackageX,
  Factory,
  Truck,
  Building,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import type { Medicine, SupplyChainStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useMedicineStore } from '@/hooks/useMedicineStore';

type StockStatus = Medicine['stockStatus'];
type SortKey = keyof Pick<Medicine, 'name' | 'manufacturer' | 'expDate' | 'quantity' | 'supplyChainStatus'>;

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

const supplyChainStatusConfig: Record<SupplyChainStatus, { icon: React.ElementType, label: string }> = {
    'At Manufacturer': { icon: Factory, label: 'At Manufacturer' },
    'In Transit': { icon: Truck, label: 'In Transit' },
    'At Pharmacy': { icon: Building, label: 'At Pharmacy' },
}


export default function StockManagementPage() {
  const { medicines, isInitialized } = useMedicineStore();
  
  const [filter, setFilter] = useState<StockStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
   const summary = useMemo(() => {
    return medicines.reduce(
      (acc, med) => {
        acc[med.stockStatus]++;
        acc.Total++;
        return acc;
      },
      { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0, Total: 0 }
    );
  }, [medicines]);

  const sortedAndFilteredMedicines = useMemo(() => {
    let filtered =
      filter === 'All' ? medicines : medicines.filter((med) => med.stockStatus === filter);

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === 'quantity') {
          aValue = a.quantity;
          bValue = b.quantity;
        } else if (sortConfig.key === 'expDate') {
          aValue = new Date(a.expDate).getTime();
          bValue = new Date(b.expDate).getTime();
        } else {
            aValue = a[sortConfig.key as 'name' | 'manufacturer' | 'supplyChainStatus']?.toLowerCase() || '';
            bValue = b[sortConfig.key as 'name' | 'manufacturer' | 'supplyChainStatus']?.toLowerCase() || '';
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
      .filter((med) => med.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10) // Top 10 most stocked items
      .map((med) => ({
        name: med.name,
        quantity: med.quantity,
      }));
  }, [medicines]);


  if (!isInitialized) {
      return (
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Loading Local Inventory...</p>
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
            <p className="text-muted-foreground mt-1">Oversee the entire inventory from the local data file.</p>
          </div>
          <Link href="/admin/dashboard" passHref>
            <Button variant="outline">
              <Home className="mr-2 h-5 w-5" />
              Admin Dashboard
            </Button>
          </Link>
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
                A detailed list of all medicines.
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
                          <Button variant="ghost" onClick={() => requestSort('supplyChainStatus')}>Supply Chain {getSortIcon('supplyChainStatus')}</Button>
                      </TableHead>
                      <TableHead className="text-right">
                          <Button variant="ghost" onClick={() => requestSort('quantity')}>Quantity {getSortIcon('quantity')}</Button>
                      </TableHead>
                      <TableHead>Ledger Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredMedicines.map((med) => {
                       const supplyChainInfo = supplyChainStatusConfig[med.supplyChainStatus];
                       const SupplyChainIcon = supplyChainInfo.icon;
                       return (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2">
                                <SupplyChainIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{supplyChainInfo.label}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{med.quantity}</TableCell>
                        <TableCell>
                           <Badge variant={med.onChain ? "secondary" : "destructive"} className={cn(med.onChain ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200')}>
                            {med.onChain ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {med.onChain ? 'Confirmed' : 'Pending'}
                           </Badge>
                        </TableCell>
                      </TableRow>
                       )
                    })}
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
    </>
  );
}

