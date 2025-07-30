"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, PackagePlus, PackageMinus, XCircle, ShieldCheck } from 'lucide-react';
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
            <div className="relative h-64 lg:h-auto">
               <Image
                src="https://placehold.co/600x400.png"
                alt="Pharmacist using a modern inventory system"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover w-full h-full"
                data-ai-hint="pharmacist inventory"
              />
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
            <Card className="text-center">
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
            <Card className="text-center">
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
            <Card className="text-center">
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
