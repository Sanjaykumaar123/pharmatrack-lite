
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center h-full text-center relative z-10">
        <div>
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6 ring-4 ring-primary/20">
            <Pill className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300 font-headline">
            PharmaTrack Lite
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Intelligent medicine tracking at your fingertips. Manage inventory, monitor expiry dates, and get AI-powered insights, all in one seamless experience.
          </p>
          <div className="mt-10">
            <Link href="/medicines" passHref>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
                Explore Your Digital Pharmacy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
