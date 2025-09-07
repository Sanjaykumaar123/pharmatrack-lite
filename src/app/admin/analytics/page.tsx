
"use client";

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, LineChart, IndianRupee, Package, ShoppingCart, Loader2 } from 'lucide-react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useOrderStore } from '@/hooks/useOrderStore';
import type { Medicine, OrderItem } from '@/types/medicine';

const stockStatusConfig = {
  'In Stock': { label: 'In Stock', color: 'hsl(var(--chart-2))' },
  'Low Stock': { label: 'Low Stock', color: 'hsl(var(--chart-4))' },
  'Out of Stock': { label: 'Out of Stock', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const supplyChainConfig = {
    'At Manufacturer': { label: 'At Manufacturer', color: 'hsl(var(--chart-1))' },
    'In Transit': { label: 'In Transit', color: 'hsl(var(--chart-3))' },
    'At Pharmacy': { label: 'At Pharmacy', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const AnalyticsPage = () => {
    const { medicines, isInitialized: isMedicinesInitialized } = useMedicineStore();
    const { orders } = useOrderStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const analytics = useMemo(() => {
        if (!isClient || !isMedicinesInitialized) return null;

        const totalMedicines = medicines.length;
        const totalOrders = orders.length;

        const totalRevenue = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);

        const stockStatusData = Object.entries(
            medicines.reduce((acc, med) => {
                acc[med.stockStatus] = (acc[med.stockStatus] || 0) + 1;
                return acc;
            }, {} as Record<Medicine['stockStatus'], number>)
        ).map(([name, value]) => ({ name, value, fill: stockStatusConfig[name as keyof typeof stockStatusConfig].color }));

        const supplyChainData = Object.entries(
             medicines.reduce((acc, med) => {
                acc[med.supplyChainStatus] = (acc[med.supplyChainStatus] || 0) + 1;
                return acc;
            }, {} as Record<Medicine['supplyChainStatus'], number>)
        ).map(([name, value]) => ({ name, value, fill: supplyChainConfig[name as keyof typeof supplyChainConfig].color }));


        const topSellingProducts = orders
            .flatMap(o => o.items)
            .reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
                return acc;
            }, {} as Record<string, number>);

        const sortedTopProducts = Object.entries(topSellingProducts)
            .sort(([,a],[,b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({name, quantity}));

        return { totalMedicines, totalOrders, totalRevenue, stockStatusData, supplyChainData, sortedTopProducts };

    }, [isClient, isMedicinesInitialized, medicines, orders]);
    
    if (!isClient || !analytics) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading Analytics...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline flex items-center gap-3">
                    <LineChart className="h-8 w-8 text-primary"/>
                    System Analytics
                </h1>
                <p className="text-muted-foreground mt-1">An overview of inventory and sales performance.</p>
                </div>
                <Link href="/admin/dashboard" passHref>
                <Button variant="outline">
                    <Home className="mr-2 h-5 w-5" />
                    Admin Dashboard
                </Button>
                </Link>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{analytics.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">From delivered orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                        <Package className="h-5 w-5 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalMedicines}</div>
                         <p className="text-xs text-muted-foreground">Unique batches registered</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Inventory Stock Status</CardTitle>
                        <CardDescription>Distribution of medicines by stock level.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={stockStatusConfig} className="mx-auto aspect-square h-[250px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={analytics.stockStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {analytics.stockStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Supply Chain Overview</CardTitle>
                        <CardDescription>Current location of medicine batches.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={supplyChainConfig} className="h-[250px] w-full">
                            <BarChart data={analytics.supplyChainData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                    {analytics.supplyChainData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                        <CardDescription>The most frequently ordered medicines.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {analytics.sortedTopProducts.map(item => (
                                <li key={item.name} className="flex items-center justify-between">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-muted-foreground">{item.quantity} units sold</span>
                                </li>
                            ))}
                        </ul>
                         {analytics.sortedTopProducts.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No order data available yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default AnalyticsPage;
