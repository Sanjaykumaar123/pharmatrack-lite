'use server';

/**
 * @fileOverview An AI agent for providing medicine side effects information.
 *
 * - getMedicineSideEffects - A function that handles the retrieval of medicine side effects.
 * - MedicineSideEffectsInput - The input type for the getMedicineSideEffects function.
 * - MedicineSideEffectsOutput - The return type for the getMedicineSideEffects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicineSideEffectsInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get side effects for.'),
});
export type MedicineSideEffectsInput = z.infer<typeof MedicineSideEffectsInputSchema>;

const MedicineSideEffectsOutputSchema = z.object({
  sideEffects: z.string().describe('A description of the potential side effects of the medicine.'),
});
export type MedicineSideEffectsOutput = z.infer<typeof MedicineSideEffectsOutputSchema>;

export async function getMedicineSideEffects(input: MedicineSideEffectsInput): Promise<MedicineSideEffectsOutput> {
  return medicineSideEffectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicineSideEffectsPrompt',
  input: {schema: MedicineSideEffectsInputSchema},
  output: {schema: MedicineSideEffectsOutputSchema},
  prompt: `You are a helpful AI assistant providing information about medicine side effects.
  Provide a description of the potential side effects for the given medicine.

  Medicine Name: {{{medicineName}}}
  `,
});

const medicineSideEffectsFlow = ai.defineFlow(
  {
    name: 'medicineSideEffectsFlow',
    inputSchema: MedicineSideEffectsInputSchema,
    outputSchema: MedicineSideEffectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
