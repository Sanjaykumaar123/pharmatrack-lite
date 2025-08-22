
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { LogIn } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";


export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("customer");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simulated login. In a real app, you'd handle authentication.
    // We'll save the role to session storage to simulate a logged-in state.
    if (typeof window !== "undefined") {
      sessionStorage.setItem('loggedInUserRole', role);
      // We are manually dispatching a storage event to ensure the header updates immediately.
      window.dispatchEvent(new Event("storage"));
    }
    
    // We'll just redirect based on the selected role.
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'manufacturer') {
      router.push('/manufacturer/dashboard');
    } else {
      router.push('/customer/dashboard');
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
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="role">Your Role</Label>
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="test@example.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
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
