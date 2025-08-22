
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Lock, GitBranch, Database, Shield, FileCheck, UserCheck, Bot, ScanLine } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.337 2.012a9.75 9.75 0 0 0-9.325 9.325 9.75 9.75 0 0 0 9.325 9.325 9.75 9.75 0 0 0 9.325-9.325A9.75 9.75 0 0 0 12.337 2.012ZM11.25 8.637a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-3v3a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h3v-3Z"></path>
    </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <section className="relative w-full bg-background overflow-hidden">
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
                    <Bot className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
             <div className="relative h-96 lg:h-auto flex justify-center items-center">
                <div className="absolute w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <PillIcon className="w-72 h-72 text-primary relative z-10 opacity-80" />
            </div>
          </div>
        </div>
      </section>

       <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold font-headline text-foreground">A Secure Foundation for Pharmaceutical Tracking</h2>
            <p className="mt-4 text-muted-foreground text-lg">
             PharmaTrack Lite is built on the principles of a decentralized ledger to solve critical issues in the supply chain, enhancing safety and transparency for everyone.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Decentralized Data</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No single point of failure. Data is distributed, making it highly secure and resilient to tampering.
                </CardDescription>
              </CardContent>
            </Card>
             <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <ScanLine className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Real-Time Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Instantly verify the authenticity and provenance of any medicine with a simple scan, protecting against counterfeits.
                </CardDescription>
              </CardContent>
            </Card>
             <Card className="text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-background/50 border-primary/10">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Patient Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gives patients direct access to their medicine's history, fostering confidence and active participation in their health.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold font-headline text-foreground">Explore PharmaTrack Lite</h2>
            <p className="mt-4 text-muted-foreground text-lg">
             Dive into the digital pharmacy, ask our AI for help, or learn more about the technology that powers it all.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/medicines" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-primary"/>
                    Digital Pharmacy
                  </CardTitle>
                  <CardDescription>
                    Browse the full inventory of medicines. Search, filter, and view details for every item on the ledger.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline">
                      Browse Inventory
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
              </Card>
            </Link>
            <Link href="/chat" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary"/>
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Have questions about your medicine? Our AI-powered assistant can provide information based on the inventory.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline">
                      Chat Now
                       <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
