
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/frontend/components/ui/card';
import { User, Home, Pill, ScanLine, Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/button';

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
            <p className="text-muted-foreground">Your personal medicine overview and tools.</p>
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
            <CardTitle>Welcome!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is your personal dashboard. Here you can browse available medicines, verify their authenticity by scanning their QR codes, and get help from our AI assistant. Get started by choosing one of the options below.</p>
          </CardContent>
        </Card>

        <Link href="/medicines" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader>
                <Pill className="h-8 w-8 text-primary mb-2"/>
                <CardTitle>Browse Pharmacy</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>Search and filter through the complete inventory of available medicines. View details, check stock status, and more.</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Go to Pharmacy
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

         <Link href="/scanner" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader>
                <ScanLine className="h-8 w-8 text-primary mb-2"/>
                <CardTitle>Scan a Medicine</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>Use your camera to scan a medicine's QR code to instantly verify its authenticity and view its history on the blockchain.</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Open Scanner
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

         <Link href="/chat" className="group">
          <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all flex flex-col">
            <CardHeader>
                <Bot className="h-8 w-8 text-primary mb-2"/>
                <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>Have questions? Chat with our AI assistant to get information about medicines based on the pharmacy's inventory data.</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                Ask AI
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
