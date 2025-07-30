"use client";

import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { allMedicines } from "@/lib/data";

export default function ScannerPage() {
  const router = useRouter();

  const handleScan = () => {
    // In a real application, you would integrate a QR code scanning library.
    // For this prototype, we simulate a scan and redirect to a random medicine page.
    const randomMedicine = allMedicines[Math.floor(Math.random() * allMedicines.length)];
    router.push(`/medicine/${randomMedicine.id}`);
  };

  return (
    <div className="container mx-auto flex h-full items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-card p-8 rounded-xl shadow-lg">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-6">
          <ScanLine className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
          Scan Medicine QR Code
        </h1>
        <p className="mt-2 text-muted-foreground">
          Position the QR code within the frame to automatically scan it.
        </p>
        <div className="mt-8">
          {/* Placeholder for camera view */}
          <div className="w-full aspect-square bg-background rounded-lg flex items-center justify-center border-2 border-dashed">
            <p className="text-muted-foreground">Camera view would be here</p>
          </div>
        </div>
        <Button onClick={handleScan} size="lg" className="mt-8 w-full">
          Simulate Successful Scan
        </Button>
      </div>
    </div>
  );
}
