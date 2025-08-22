
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScanLine, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMedicineStore } from '@/hooks/useMedicineStore';

export default function ScannerPage() {
  const router = useRouter();
  const { medicines, isInitialized, fetchMedicines } = useMedicineStore();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if(!isInitialized) {
      fetchMedicines();
    }
  }, [isInitialized, fetchMedicines])

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      } else {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);


  const handleScan = () => {
    // In a real application, you would integrate a QR code scanning library.
    // For this prototype, we simulate a scan and redirect to a random medicine page.
    if (medicines.length === 0) {
      toast({
        title: "No Medicines Found",
        description: "There are no medicines in the inventory to scan for.",
      });
      router.push('/medicines');
      return;
    }
    const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
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
          <div className="w-full aspect-square bg-background rounded-lg flex items-center justify-center border-2 border-dashed overflow-hidden">
             <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4 text-left">
                  <VideoOff className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                  </AlertDescription>
              </Alert>
            )}
        </div>
        <Button onClick={handleScan} size="lg" className="mt-8 w-full">
          Simulate Successful Scan
        </Button>
      </div>
    </div>
  );
}
