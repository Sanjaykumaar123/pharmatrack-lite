
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Lock, GitBranch } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.29 8.29l-5.58 5.58c-.39.39-1.02.39-1.41 0l-2.59-2.59c-.39-.39-.39-1.02 0-1.41l5.58-5.58c.39-.39 1.02-.39 1.41 0l2.59 2.59c.39.39.39 1.02 0 1.41z" />
    </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="relative w-full bg-background">
       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-20">
            <div className="z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-headline">
                Bringing Clarity and Trust to Your Pharmacy.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                PharmaTrack Lite provides a transparent, secure, and efficient solution to manage your medicine inventory on a decentralized ledger, ensuring safety and reliability from manufacturer to patient.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/medicines" passHref>
                  <Button size="lg" className="font-semibold shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
                    View Pharmacy Inventory
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                 <Link href="/chat" passHref>
                  <Button size="lg" variant="outline" className="font-semibold transition-transform duration-300 hover:scale-105">
                    Ask AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
             <div className="relative h-96 lg:h-auto flex justify-center items-center">
                <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                <PillIcon className="w-64 h-64 text-primary relative z-10 opacity-80" />
            </div>
          </div>
        </div>
      </section>

       <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold font-headline text-foreground">A Secure Foundation for Pharmaceutical Tracking</h2>
            <p className="mt-4 text-muted-foreground text-lg">
             PharmaTrack Lite is built on the principles of blockchain to solve critical issues in the supply chain.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Immutable Ledger</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Every transaction is permanently recorded, creating an unchangeable and auditable history for each medicine.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                    <GitBranch className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Enhanced Traceability</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                   Track medicines from the manufacturer to the pharmacy, ensuring authenticity and preventing counterfeit drugs.
                  </CardDescription>
                </CardContent>
              </Card>
            <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Increased Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A transparent system that provides confidence to regulators, pharmacists, and patients about medicine integrity.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
