
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, Role } from "@/lib/firebase/auth";
import { useAuthStore } from "@/hooks/useAuthStore";


const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters."}),
    role: z.enum(["customer", "manufacturer", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  const onSubmit = async (values: FormValues) => {
      setIsLoading(true);
      try {
        const user = await signInWithEmail(values.email, values.password, values.role as Role);
        if (user) {
            setUser({
                uid: user.uid,
                email: user.email!,
                role: values.role as Role
            });

            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });

            // Redirect based on role
            if (values.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (values.role === 'manufacturer') {
                router.push('/manufacturer/dashboard');
            } else {
                router.push('/customer/dashboard');
            }
        }
      } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "An unknown error occurred. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <LogIn className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Select your role and enter your credentials to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
               />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

