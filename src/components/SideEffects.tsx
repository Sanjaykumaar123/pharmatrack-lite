"use client";

import { useState } from 'react';
import { getMedicineSideEffects } from '@/ai/flows/medicine-side-effects';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SideEffectsProps {
  medicineName: string;
}

export default function SideEffects({ medicineName }: SideEffectsProps) {
  const [sideEffects, setSideEffects] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchSideEffects = async () => {
    setIsLoading(true);
    setSideEffects(null);
    try {
      const result = await getMedicineSideEffects({ medicineName });
      setSideEffects(result.sideEffects);
    } catch (error) {
      console.error('Failed to fetch side effects:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load side effect information. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Potential Side Effects</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Click the button below to get AI-generated information about potential side effects. This information is for educational purposes only and is not a substitute for professional medical advice.
        </p>
        <Button onClick={handleFetchSideEffects} disabled={isLoading} variant="outline">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              Show Side Effects
            </>
          )}
        </Button>
        {sideEffects && (
          <div className="mt-6">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-accent hover:no-underline">
                  Side Effects for {medicineName}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  {sideEffects}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
