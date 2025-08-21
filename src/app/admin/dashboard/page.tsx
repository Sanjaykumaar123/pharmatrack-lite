
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System overview and management tools.</p>
        </div>
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
