"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { chatWithAi } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages: Message[] = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const assistantMessageContent = await chatWithAi({
                history: newMessages,
            });
            const assistantMessage: Message = { role: 'assistant', content: assistantMessageContent.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to get a response from the assistant. Please try again.',
            });
            setMessages(prev => prev.slice(0, prev.length -1)); // Remove the user message if AI fails
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-full flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline mb-8">
                Chat with your Pharmacy Assistant
            </h1>
            <Card className="flex-1 flex flex-col bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="text-primary"/> AI Assistant
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={cn(
                                    "flex items-start gap-3",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}>
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8 bg-primary/20 ring-2 ring-primary/50">
                                            <AvatarFallback className="bg-transparent"><Bot className="text-primary"/></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "p-3 rounded-lg max-w-md",
                                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                    )}>
                                        <p>{message.content}</p>
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex items-start gap-3 justify-start">
                                     <Avatar className="h-8 w-8 bg-primary/20 ring-2 ring-primary/50">
                                            <AvatarFallback className="bg-transparent"><Bot className="text-primary"/></AvatarFallback>
                                     </Avatar>
                                     <div className="p-3 rounded-lg bg-secondary flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        <span>Thinking...</span>
                                     </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t border-border/50">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your medicines..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
