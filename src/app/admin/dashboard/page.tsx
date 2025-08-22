
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Home } from 'lucide-react';
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
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the central control panel for the PharmaTrack Lite system. From here, you can manage users, oversee the entire medicine inventory, and view system analytics.</p>
        </CardContent>
      </Card>
    </div>
  );
}
