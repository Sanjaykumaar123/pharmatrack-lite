
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill, Stethoscope, HeartPulse, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <section className="relative w-full bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-20">
            <div className="z-10">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                Your Trusted Health Partner
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-headline">
                Intelligent Pharmacy Management
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                Seamlessly track your medicines, monitor inventory, and gain AI-powered insights. We provide a secure, professional, and intuitive platform for modern healthcare management.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/medicines" passHref>
                  <Button size="lg" className="font-semibold shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
                    Go to Digital Pharmacy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                 <Link href="/chat" passHref>
                  <Button size="lg" variant="outline" className="font-semibold shadow-lg shadow-primary/10 transition-transform duration-300 hover:scale-105">
                    Ask AI Assistant
                    <BrainCircuit className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
               <Image
                src="https://placehold.co/600x400.png"
                alt="Professional pharmacist reviewing medication"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover w-full h-full"
                data-ai-hint="pharmacist medication"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline text-foreground">A New Standard in Pharmaceutical Care</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our platform offers robust features designed for safety, efficiency, and intelligence, ensuring you have the best tools at your disposal.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Medicine Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Keep a detailed inventory of all your medicines, including batch numbers and expiry dates, for full traceability.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Stock Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive automatic alerts for low stock and expiring medicines, preventing shortages and waste.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                  <HeartPulse className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leverage our AI assistant to get instant information about side effects and answer your medication questions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
