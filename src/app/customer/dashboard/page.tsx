
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CustomerDashboardPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <User className="h-10 w-10 text-primary" />
            <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Customer Dashboard
            </h1>
            <p className="text-muted-foreground">Your personal medicine overview.</p>
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
          <CardTitle>Welcome, Customer!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your personal dashboard. Here you can view your prescribed medicines, check their authenticity by scanning their QR codes, and see their history on the blockchain.</p>
        </CardContent>
      </Card>
    </div>
  );
}
