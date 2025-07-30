
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center h-full">
      <div className="text-center">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
          <Pill className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary font-headline">
          Welcome to PharmaTrack Lite
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your simple and smart solution for keeping track of your medicines. Get AI-powered insights, check stock levels, and never miss an expiry date.
        </p>
        <div className="mt-10">
          <Link href="/medicines" passHref>
            <Button size="lg">
              View Your Medicines
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
