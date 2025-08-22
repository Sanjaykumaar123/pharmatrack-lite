
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
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Medicine } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMedicineStore } from '@/hooks/useMedicineStore';

type SortKey = keyof Pick<Medicine, 'name' | 'manufacturer' | 'quantity' | 'expDate'>;

export default function StockManagementPage() {
  const { medicines, loading, isInitialized, fetchMedicines, deleteMedicine } = useMedicineStore();
  
  useEffect(() => {
    if (!isInitialized) {
      fetchMedicines();
    }
  }, [isInitialized, fetchMedicines]);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);
  
  const { toast } = useToast();

  const sortedMedicines = useMemo(() => {
    if (!medicines) return [];
    let sortableMedicines = [...medicines];
    if (sortConfig !== null) {
      sortableMedicines.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === 'quantity') {
          aValue = a.quantity;
          bValue = b.quantity;
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
    return sortableMedicines;
  }, [medicines, sortConfig]);

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

  const handleDeleteClick = (medicineId: string) => {
    // Note: This is a local delete for the prototype.
    // A real app would send a transaction to the chain to mark as decommissioned.
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

        <Card>
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>
                A detailed list of all medicines recorded on the ledger.
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
                      <TableHead>Batch No.</TableHead>
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
                    {sortedMedicines.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.manufacturer}</TableCell>
                        <TableCell>{med.batchNo}</TableCell>
                        <TableCell className="text-right">{med.quantity}</TableCell>
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
                              <DropdownMenuItem disabled>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit (Not Implemented)</span>
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
      </div>
    </>
  );
}

