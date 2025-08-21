// ===================================================================================
// BACKEND (Server-Side)
// ===================================================================================
// This file is a "Server Action" in Next.js, indicated by the 'use server'
// directive. This means all the code in this file, including the AI logic,
// runs exclusively on the server (backend). It is never sent to the user's browser.
// The frontend calls this action as if it were a simple function, but Next.js
// handles the network request behind the scenes.
// ===================================================================================

'use server';
/**
 * @fileOverview A chatbot AI agent for answering questions about medicines.
 *
 * - chatWithAi - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chatWithAi function.
 * - ChatOutput - The return type for the chatWithAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { allMedicines } from '@/lib/data';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The chat history so far.'),
  medicines: z.string().describe('A JSON string of all available medicines.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithAi(input: Omit<ChatInput, 'medicines'>): Promise<ChatOutput> {
  const medicineInfo = allMedicines.map(med => 
    `- Name: ${med.name}\n` +
    `  - Manufacturer: ${med.manufacturer}\n` +
    `  - Batch Number: ${med.batchNumber}\n` +
    `  - Expiry Date: ${med.expiryDate}\n` +
    `  - Description: ${med.description}\n` +
    `  - Stock: ${med.stock.quantity} units, status is ${med.stock.status}`
  ).join('\n');

  return chatFlow({
    ...input,
    medicines: medicineInfo,
  });
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful and friendly pharmacy assistant chatbot.
Your goal is to answer questions about the user's medicines.
You must ONLY use the information provided in the "Available Medicines" section below.
Do not provide any medical advice or information not present in the provided data.
If the user asks a question you cannot answer with the provided data, politely say that you cannot answer that question.

Available Medicines:
{{{medicines}}}

Chat History:
{{#each history}}
{{role}}: {{content}}
{{/each}}
assistant: `,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
