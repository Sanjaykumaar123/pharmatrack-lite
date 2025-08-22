
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Home, Warehouse, ArrowRight, Users, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground">System overview and management tools.</p>
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
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is the central control panel for the PharmaTrack Lite system. From here, you can manage users, oversee the entire medicine inventory, and view system analytics. Use the links below to navigate to the different management sections.</p>
          </CardContent>
        </Card>
        
        <Link href="/admin/stock" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Stock Management</CardTitle>
              <Warehouse className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                  Oversee the entire medicine inventory, add new stock, edit existing items, and view real-time analytics on product availability.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button>
                  Go to Stock Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Card className="h-full bg-muted/40 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                  Manage different user roles (Customers, Manufacturers), view their activities, and control their access permissions.
              </CardDescription>
            </CardContent>
            <CardFooter>
               <Button disabled variant="secondary">Coming Soon</Button>
            </CardFooter>
        </Card>

        <Card className="h-full bg-muted/40 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>System Analytics</CardTitle>
              <LineChart className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                  Access detailed analytics and generate reports on inventory turnover, stock levels, and supply chain efficiency.
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
