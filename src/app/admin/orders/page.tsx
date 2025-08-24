
"use client";

import { useState, useEffect } from 'react';
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
import { Home, MoreHorizontal, Clock, Package, Truck, ThumbsUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Order } from '@/types/medicine';
import { cn } from '@/lib/utils';
import { useOrderStore } from '@/hooks/useOrderStore';

const statusConfig = {
    'Pending': { icon: Clock, color: 'bg-yellow-500/20 text-yellow-600' },
    'Processing': { icon: Package, color: 'bg-blue-500/20 text-blue-600' },
    'Shipped': { icon: Truck, color: 'bg-purple-500/20 text-purple-600' },
    'Delivered': { icon: ThumbsUp, color: 'bg-green-500/20 text-green-600' },
    'Cancelled': { icon: Clock, color: 'bg-red-500/20 text-red-600' },
}

export default function OrderManagementPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Order Management
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all customer orders.</p>
        </div>
        <Link href="/admin/dashboard" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-5 w-5" />
            Admin Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders placed by customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const Icon = config.icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.split('-')[1]}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", config.color)}>
                        <Icon className="h-3 w-3 mr-1.5" />
                        {order.status}
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
                           <DropdownMenuSub>
                             <DropdownMenuSubTrigger>
                                <span>Update Status</span>
                             </DropdownMenuSubTrigger>
                             <DropdownMenuSubContent>
                                {Object.keys(statusConfig).map((status) => (
                                     <DropdownMenuItem key={status} onClick={() => updateOrderStatus(order.id, status as Order['status'])}>
                                        {status}
                                     </DropdownMenuItem>
                                ))}
                             </DropdownMenuSubContent>
                           </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
