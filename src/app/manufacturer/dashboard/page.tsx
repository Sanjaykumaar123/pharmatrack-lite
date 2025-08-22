
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Home } from 'lucide-react';
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
            <p className="text-muted-foreground">Manage your product inventory.</p>
            </div>
        </div>
        <Link href="/" passHref>
            <Button variant="outline">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
            </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Manufacturer!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard for managing medicines you have produced. Here you can add new batches to the blockchain, track their journey through the supply chain, and manage your inventory information.</p>
        </CardContent>
      </Card>
    </div>
  );
}
