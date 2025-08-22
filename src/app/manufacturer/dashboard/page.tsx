
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Factory, Home, PackagePlus, GitBranch, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ManufacturerDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Factory className="h-10 w-10 text-primary" />
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Manufacturer Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your product inventory and supply chain.</p>
            </div>
        </div>
        <Link href="/" passHref>
            <Button variant="outline">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
            </Button>
        </Link>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Welcome, Manufacturer!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is your dashboard for managing medicines you have produced. Here you can add new batches to the blockchain, track their journey through the supply chain, and manage your inventory information.</p>
          </CardContent>
        </Card>
        
        <Card className="h-full bg-muted/40 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Batch</CardTitle>
              <PackagePlus className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                  Register a new batch of medicine, assign it a unique identifier, and add it to the decentralized ledger to begin its supply chain journey.
              </CardDescription>
            </CardContent>
            <CardFooter>
               <Button disabled variant="secondary">Coming Soon</Button>
            </CardFooter>
        </Card>

        <Card className="h-full bg-muted/40 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Track Inventory</CardTitle>
              <GitBranch className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                 View the real-time status and location of your products as they move from your facility to distributors and pharmacies.
              </CardDescription>
            </CardContent>
             <CardFooter>
               <Button disabled variant="secondary">Coming Soon</Button>
            </CardFooter>
        </Card>

        <Card className="h-full bg-muted/40 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>View Analytics</CardTitle>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                  Access analytics on batch distribution, delivery times, and inventory levels across different regions to optimize your supply chain.
              </CardDescription>
            </CardContent>
             <CardFooter>
               <Button disabled variant="secondary">Coming Soon</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
