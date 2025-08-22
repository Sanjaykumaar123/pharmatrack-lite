
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Home, Warehouse, ArrowRight } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is the central control panel for the PharmaTrack Lite system. From here, you can manage users, oversee the entire medicine inventory, and view system analytics.</p>
          </CardContent>
        </Card>
        <Link href="/admin/stock" className="group">
        <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock Management</CardTitle>
            <Warehouse className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>
                Oversee the entire medicine inventory, view stock levels, and get analytics on product availability.
            </CardDescription>
          </CardContent>
          <div className="p-6 pt-0">
             <Button>
                Go to Stock Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
        </Link>
      </div>
    </div>
  );
}
