
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function CustomerDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <User className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Customer Dashboard
          </h1>
          <p className="text-muted-foreground">Your personal medicine overview.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Customer!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personal dashboard. Here you can view your prescribed medicines, check their authenticity by scanning their QR codes, and see their history on the blockchain.</p>
        </CardContent>
      </Card>
    </div>
  );
}
