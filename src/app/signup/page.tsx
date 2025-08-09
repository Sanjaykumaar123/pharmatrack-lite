
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-full bg-background p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
             <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>
            Enter your information to create an account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max" required />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson" required />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
                Create an account
            </Button>
            <Button variant="outline" className="w-full">
                Sign up with Google
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Login
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
