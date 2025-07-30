
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PackagePlus, PackageMinus, XCircle, ShieldCheck, Quote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="relative w-full bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-20">
            <div className="z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-headline">
                Bringing Clarity and Trust to Your Pharmacy.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                Our platform provides a transparent and efficient solution to manage your medicine inventory, ensuring safety and reliability.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/medicines" passHref>
                  <Button size="lg" className="font-semibold shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
                    View Pharmacy Inventory
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto flex flex-col justify-center items-start gap-8">
              <div className="bg-background/50 border-l-4 border-primary p-4 rounded-r-lg shadow-lg">
                <Quote className="h-6 w-6 text-primary mb-2" />
                <blockquote className="text-lg italic text-foreground">
                  "He who has health, has hope; and he who has hope, has everything."
                </blockquote>
                <p className="text-right text-muted-foreground mt-2">- Arabian Proverb</p>
              </div>
               <div className="bg-background/50 border-l-4 border-primary p-4 rounded-r-lg shadow-lg ml-8">
                <Quote className="h-6 w-6 text-primary mb-2" />
                <blockquote className="text-lg italic text-foreground">
                  "Transparency, trust, and technology at the heart of your pharmacy."
                </blockquote>
                 <p className="text-right text-muted-foreground mt-2">- Pharma Ledger</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline text-foreground">Key Inventory Challenges</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our platform aims to solve critical issues prevalent in pharmacy management today.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/medicines?status=In+Stock">
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <PackagePlus className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Overstocking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Preventing waste and financial loss from excess inventory.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="/medicines?status=Low+Stock">
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <PackageMinus className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Understocking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ensuring essential medicines are always available for patients.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="/medicines?status=Out+of+Stock">
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <XCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Expired Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Minimizing the risk of dispensing expired or ineffective drugs.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
             <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Counterfeit Drugs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enhancing supply chain security to eliminate fake medicines.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
