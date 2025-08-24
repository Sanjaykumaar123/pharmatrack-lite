
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LayoutDashboard, BrainCircuit, LogIn, UserPlus, LogOut, User, Factory, ShieldCheck, Loader2, Moon, Sun, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { Badge } from './ui/badge';
import { useAuthStore } from '@/hooks/useAuthStore';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.337 2.012a9.75 9.75 0 0 0-9.325 9.325 9.75 9.75 0 0 0 9.325 9.325 9.75 9.75 0 0 0 9.325-9.325A9.75 9.75 0 0 0 12.337 2.012ZM11.25 8.637a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-3v3a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h3v-3Z" />
  </svg>
);

const roleConfig = {
    admin: {
        icon: ShieldCheck,
        dashboard: '/admin/dashboard',
        label: 'Admin'
    },
    manufacturer: {
        icon: Factory,
        dashboard: '/manufacturer/dashboard',
        label: 'Manufacturer'
    },
    customer: {
        icon: User,
        dashboard: '/customer/dashboard',
        label: 'Customer'
    }
}

function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';
        setTheme(storedTheme);
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

function CartButton() {
    const { items } = useCartStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    const itemCount = isClient ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">{itemCount}</Badge>
                )}
            </Button>
        </Link>
    )
}


export default function Header() {
  const { user, loading, clearUser } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOutUser();
        clearUser();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out."
        })
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "There was an error logging you out. Please try again."
        })
    }
  };

  const roleKey = user?.role as keyof typeof roleConfig;
  const currentRole = user ? roleConfig[roleKey] : null;
  const RoleIcon = currentRole?.icon;


  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PillIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-headline hidden sm:inline-block">
              PharmaTrack Lite
            </span>
          </Link>

          <div className="flex items-center gap-2">
             <nav className="hidden md:flex items-center gap-2">
              <Link href="/medicines" passHref>
                <Button variant="ghost">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Pharmacy
                </Button>
              </Link>
              <Link href="/chat" passHref>
                <Button variant="ghost">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  AI Assistant
                </Button>
              </Link>
            </nav>
            <div className="w-px h-6 bg-border mx-2 hidden md:block" />
            <div className="flex items-center gap-2">
                {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : user && currentRole && RoleIcon ? (
                     <>
                        <Link href={currentRole.dashboard} passHref>
                            <Button variant="outline">
                                <RoleIcon className="mr-2 h-5 w-5" />
                                {currentRole.label} Dashboard
                            </Button>
                        </Link>
                        <Button onClick={handleLogout}>
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                     </>
                ) : (
                    <>
                        <Link href="/login" passHref>
                            <Button variant="ghost">
                                <LogIn className="mr-2 h-5 w-5" />
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup" passHref>
                            <Button>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
                 <CartButton />
                 <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
