
"use client";

import { useState, useMemo } from 'react';
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
  PackageCheck,
  AlertTriangle,
  PackageX,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { allMedicines } from '@/lib/data';
import type { Medicine } from '@/types';
import { cn } from '@/lib/utils';

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
  const [filter, setFilter] = useState<StockStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

  const summary = useMemo(() => {
    return allMedicines.reduce(
      (acc, med) => {
        acc[med.stock.status]++;
        acc.Total++;
        return acc;
      },
      { 'In Stock': 0, 'Low Stock': 0, 'Out of Stock': 0, Total: 0 }
    );
  }, []);

  const sortedAndFilteredMedicines = useMemo(() => {
    let filtered =
      filter === 'All' ? allMedicines : allMedicines.filter((med) => med.stock.status === filter);

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
  }, [filter, sortConfig]);

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
    return allMedicines
      .filter((med) => med.stock.quantity > 0)
      .sort((a, b) => b.stock.quantity - a.stock.quantity)
      .slice(0, 10) // Top 10 most stocked items
      .map((med) => ({
        name: med.name,
        quantity: med.stock.quantity,
      }));
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
          Stock Management
        </h1>
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
  );
}
