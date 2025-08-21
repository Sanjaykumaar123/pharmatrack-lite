
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory } from 'lucide-react';

export default function ManufacturerDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4 mb-8">
        <Factory className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Manufacturer Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
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
